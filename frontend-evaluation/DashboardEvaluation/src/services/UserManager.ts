import {User} from '../models/User';
import UserDataProvider from "../providers/UserDataProvider";
import {addFilter, applyActions, applyFilters} from "../services/HooksManager";
import {CallRequestConfig} from "../shared/api";
import ObjectUtils from "../utils/ObjectUtil";
import {EnvironmentManager, IService} from "./EnvironmentManager";

interface Token {
    id_token: string;
}

class UserManager implements IService {

    environmentManager: EnvironmentManager | undefined = undefined;
    userDataProvider: UserDataProvider | undefined;

    authToken: Token | undefined = undefined;
    loggedUser: User | undefined = undefined;
    expiryDate: Date | undefined = undefined;

    ENABLED = 'enabled';
    DENIED = 'denied';
    AUTHTOKEN = `authToken`;
    USER = `user`;
    EXPIRATIONDATE = `expiryDate`;

    getServiceKey(): string {
        return 'userManager'
    }

    /**
     * Init
     */
    init = async (environmentManager: EnvironmentManager) => {
        this.environmentManager = environmentManager
        this.userDataProvider = this.environmentManager.getUserDataProvider()

        // Carico dati utente da local Storage
        await this.loadUser()

        addFilter('api_request', this.addToken);

        await this.verifyLoginUser()
    }

    addToken = (request: CallRequestConfig<any>) => {
        if (this.authToken) {
            request = ObjectUtils.assignDeep({}, request, {
                headers: {
                    'Authorization': `Bearer ${this.authToken.id_token}`
                }
            })
        }

        return request;
    }

    /**
     * Esegue il logou e notifica l'esito
     * @param username:string
     * @param password:string
     * @param remindMe:boolean
     */
    async doLogout() {
        await this.cleanUser()

        /**
         *  Notifica evento di logout completato con successo
         *  @hook logout_success
         */
        applyActions('logout_success')

    }

    /**
     * Esegue la login e notifica l'esito
     * @param username:string
     * @param password:string
     * @param remindMe:boolean
     */
    async doLogin(username: string, password: string, remindMe: boolean) {

        try {

            // Catturo token
            const token = await this.userDataProvider?.getToken(username, password, remindMe);

            if (token) {

                // Token valido
                this.authToken = token;
                const expire = remindMe ? 14 : 1
                return this.completeLogin(token, expire);
            }

        } catch (err) {

            // Log errore
            console.error(err);
        }

        // Successo qualcosa durante il login
        // Forzo logout per sicurezza
        await this.doLogout()

        /**
         *  Notifica evento di login fallito
         *  @hook login_failed
         *  @param erro Messaggio del server
         */
        applyActions('login_failed', username, password)

        return false;
    }

    async completeLogin(token: any, expire: any) {
        const user = await this.getLoggedUser();

        if (user) {

            // User valido
            this.loggedUser = user;

            // Salvo dati su local storage per futuro utilizzo
            await this.storeUser(user, token, expire);

            /**
             *  Notifica evento di login completato con successo
             *  @hook login_success
             *  @param user Utente loggato
             */
            applyActions('login_success', user)

            return true;
        }
    }

    /**
     * Salvo dati utente
     * @param token
     * @param expire
     */
    private async storeUser(user: User, token: Token, expire = 0) {

        const storage = this.environmentManager?.getStorage()

        // Calcolo scadenza token
        let date = new Date();
        date.setDate(date.getDate() + expire);


        this.authToken = token
        this.loggedUser = user

        await storage.save(this.__authorizationToken(), token)
        await storage.save(this.__userFilter(), user)
        await storage.save(this.__expirationDate(), date);
    }

    /**
     * Elimino dati utente
     */
    private async cleanUser() {

        const storage = this.environmentManager?.getStorage();

        await storage.remove(this.__authorizationToken());
        await storage.remove(this.__userFilter());
        await storage.remove(this.__expirationDate());

        this.authToken = undefined;
        this.loggedUser = undefined;
        this.expiryDate = undefined;

    }

    hasCap(cap: string, user?: User) {
        this.hasCaps([cap], true);
    }

    /**
     * Metodo per la verifica di Capability
     */
    hasCaps(capabilities: any [], strict = true, user?: User) {

        let hasCap = true
        if(!strict) {
            hasCap = false;
        }

        // Di default, uso utente sessione
        if (user === undefined) {
            user = this.getSessionUser();
        }

        // Se capability richieste
        if (capabilities && capabilities.length > 0) {

            // Utente con caps
            if (user?.capabilities && user?.capabilities.length > 0) {
                capabilities.forEach(cap => {

                    // @ts-ignore
                    const hasThisCap = Array.isArray(cap) ? this.hasCaps(cap, ! strict, user) : (user.capabilities.indexOf(cap) >= 0);

                    // Se strict - deve avere tutte le caps per essere vero
                    // Altrimenti - basta una cap per essere vero
                    (strict) ? hasCap = hasCap && hasThisCap : hasCap = hasCap || hasThisCap;

                });

            } else {

                // Utente non ha alcuna capability
                hasCap = false;
            }
        }

        /**
         * hasCap = boolen FALSE se utente non ha caps, altrimenti TRUE
         * user = utente in sessione
         * caps = lista di capability
         */
        return applyFilters('user_has_capability', hasCap, user, capabilities, strict);
    }

    /**
     * Carico dati utente
     */
    private async loadUser() {

        const storage = this.environmentManager?.getStorage()
        this.authToken = await storage.load(this.__authorizationToken(), undefined)
        this.loggedUser = await storage.load(this.__userFilter(), undefined)
        this.expiryDate = await storage.load(this.__expirationDate(), undefined)
    }

    private __authorizationToken() {
        return applyFilters('authorization_token_filter', this.AUTHTOKEN);
    }

    private __userFilter() {
        return applyFilters('user_filter', this.USER);
    }

    private __expirationDate() {
        return applyFilters('expiration_date_filter', this.EXPIRATIONDATE);
    }

    /**
     * Chiamata per accedere dopo aver salvato il token nello Storage
     */
    async getLoggedUser(): Promise<User | undefined> {

        const user = await this.userDataProvider?.getLoggedUser();
        return user;
    }

    /**
     * Ritorna stato loggato/non loggato
     */
    isLoggedUser = (): boolean => {
        const storage = this.environmentManager?.getStorage();
        const expiryDate = storage?.getItem('app::expiryDate');
        if (expiryDate && (new Date(expiryDate).getTime() > new Date().getTime()) && this.loggedUser) {
            return true;
        } else if (!expiryDate) {
            return !!this.loggedUser;
        }
        return !!this.loggedUser;
    }

    verifyLoginUser = async () => {
        const storage = this.environmentManager?.getStorage();
        const token = await storage.load('authToken', undefined);
        if (token) {
            const user = await storage.load('user', undefined);
            if (!user) {
                const res = await this.completeLogin(token, 2)
                return res;
            }
        }
    }

    getExpiryDate = async () => {
        const storage = this.environmentManager?.getStorage();
        this.expiryDate = await storage.load(this.EXPIRATIONDATE, undefined);
        return this.expiryDate;
    }

    /**
     * Ritorna utente loggato
     */
    getSessionUser() {
        return this.loggedUser;
    }

    /**
     * Metodo per ricaricare l'utente attualmente loggato
     */
    reloadLoggedUser = async () => {
        const storage = this.environmentManager?.getStorage();
        const authToken = await storage.load(this.__authorizationToken(), undefined);
        const expiryDate = await storage.load(this.__expirationDate(), undefined);
        if (authToken) {
            await userManager.completeLogin(authToken, expiryDate);
        }
    }
}

const userManager = new UserManager();
export default userManager;
