import DataProvider from "../providers/DataProvider";
import UserDataProvider from "../providers/UserDataProvider";
import dataProviderImp from "../providers/implementation/DataProviderImp";
import userDataProviderImp from "../providers/implementation/UserDataProviderImp";
import api from "../shared/api";
import i18n, {__} from "../translations/i18n";
import ObjectUtils from "../utils/ObjectUtil";
import {addFilter, applyActions, applyFilters} from "./HooksManager";
import languageManager from "./LanguageManager";
import modulesManager, {ModuleList} from "./ModulesManager";
import navigationManager from "./NavigationManager";
import notificationManager from "./NotificationManager";
import storage from "./Storage";
import userManager from "./UserManager";
import dashboardModule from "../modules/DashboardModule";
import header_logo from "../assets/images/logo.png"
import main_logo from "../assets/images/logo.png"
import {IRoute} from "../pages";
import config from "../config/config";
import loginModule from "../modules/LoginModule";
import customExt from "../ext";
import profileModule from "../modules/ProfileModule";
import profileEditModule from "../modules/ProfileEditModule";
import passwordChangeModule from "../modules/PasswordChangeModule";
import userModule from "../modules/UserModule";
import roleModule from "../modules/RoleModule";
import userListModule from "../modules/UserListModule";
import notFoundModule from "../modules/NotFoundModule";

export class EnvironmentManager {
  
  services!: { [key: string]: any; };
    env!: { [key: string]: any; };

    constructor() {
        addFilter('app_modules', this.addModules);

        // Detect Language and Set Traslations
        this.detectLanguage();

        // Global filters
        this.addGlobalFilters()
    }

    init = async () => {

        this.env = {}
        this.services = {}

        await this.addService(storage);
        await this.addService(api);

        await this.addService(dataProviderImp);
        await this.addService(userDataProviderImp);

        await this.addService(customExt);

        await this.addService(userManager);
        await this.addService(modulesManager);
        await this.addService(languageManager);
        await this.addService(notificationManager);
        await this.addService(navigationManager);

        /**
         *  Notifica evento di inizializzazione degli environment conclusa
         *  @hook init_completed
         */
        applyActions('app_init')

    }

    detectLanguage = () => {
        const language = navigator.language;

        /**
         * Cambia lingua per le traduzione dell'applicazione
         * @hook app_init_detect_language
         * @param language lingua da cambiare
         */
        applyFilters('app_init_detect_language', language);
        i18n.changeLanguage(language);
    }

    addGlobalFilters = () => {

        // Rimozione dati vuoti da form ricerca
        addFilter('search_form_data', ObjectUtils.filterIfValueIsEmpty)

    }

    getLanguageManager = () => {
        return this.getService(languageManager.getServiceKey());
    }

    getModuleManager = () => {
        return this.getService(modulesManager.getServiceKey());
    }

    getUserManager = () => {
        return this.getService(userManager.getServiceKey());
    }

    getUserDataProvider = (): UserDataProvider => {
        return this.getService(userDataProviderImp.getServiceKey());
    }

    getDataProvider = (): DataProvider => {
        return this.getService(dataProviderImp.getServiceKey());
    }

    getStorage = () => {
        return this.getService(storage.getServiceKey());
    }

    getNavigationManager = () => {
        return this.getService(navigationManager.getServiceKey());
    }

    setEnv = (key: string, data: any) => {

        /**
         * Aggiunge variabile in environment
         * @hook set_env
         * @param data:any Variable in environment
         * @param key:string Nome variabile
         */
        this.env[key] = applyFilters('set_env', data, key);
    }

    getEnv = (key: string) => {

        let env = undefined;
        if (this.env[key] !== undefined) {
            env = this.env[key];
        }

        /**
         * Ritorna dato da environment
         * @hook get_env
         * @param env:any Variabile in environment
         * @param key:string Nome variabile
         */
        return applyFilters('get_env', env, key);
    }

    addService = async (service: IService) => {
        if (!this.getService(service.getServiceKey())) {
            await this.setService(service);
        }
    }

    setService = async (service: IService) => {

        /**
         * Prepara service da aggiungere ad environment
         * @hook set_service
         * @param service:IService Service in environment
         * @param key:string Nome variabile
         */
        service = applyFilters('set_service', service, service.getServiceKey());

        service.init(this);
        this.services[service.getServiceKey()] = service;
    }

    getService = (key: string) => {

        let service = undefined;
        if (this?.services && this.services[key] !== undefined) {
            service = this.services[key];
        }

        /**
         * Ritorna dato da environment
         * @hook get_service
         * @param service:IService Service in environment
         * @param key:string Nome variabile
         */
        return applyFilters('get_service', service, key);
    }

    addModules = (modules: ModuleList) => {
        modules[notFoundModule.getModuleKey()] = notFoundModule;
        modules[loginModule.getModuleKey()] = loginModule;
        modules[dashboardModule.getModuleKey()] = dashboardModule;
        modules[profileModule.getModuleKey()] = profileModule;
        modules[profileEditModule.getModuleKey()] = profileEditModule;
        modules[passwordChangeModule.getModuleKey()] = passwordChangeModule;
        modules[userModule.getModuleKey()] = userModule;
        modules[userListModule.getModuleKey()] = userListModule;
        modules[roleModule.getModuleKey()] = roleModule;
        return modules;
    }

    getHeaderLogo() {

        /**
         * Ritorna il logo principale dell'applicazione
         * @hook app_header_logo
         * @param header_logo:string logo
         */
        return applyFilters('app_header_logo', header_logo);
    }


    getMainLogo() {

        /**
         * Ritorna il logo principale dell'applicazione
         * @hook app_main_logo
         * @param main_logo:string logo
         */
        return applyFilters('app_main_logo', main_logo);
    }



    getApplicationName() {

        /**
         * Ritorna il nome dell'applicazione
         * @hook app_name
         * @param name:string nome
         */
        return applyFilters('app_name', __('app.name'));
    }

    getVersion() {

        /**
         * Ritorna la versione dell'applicazione
         * @hook app_version
         * @param name:string version
         */
        return applyFilters('app_version', __('app.version'));
    }

    getDefaultRoute() {
        const defaultRoute = this.getUserManager()?.isLoggedUser() ? '/dashboard' : '/login';

        /**
         * Ritorna la rotta di default
         * @hook app_name
         * @param name:string nome
         */
        return applyFilters('app_default_route', defaultRoute);
    }


    getRoutes = (): { [key: string]: IRoute } => {

        if (this.env['routes'] === undefined) {

            /**
             *  Costruisce la lista di rotte gestite dall'applicazione
             *  @hook app_routes
             *  @param routes:{ [key:string]: IRoute } Mappa delle rotte
             */
            this.env['routes'] = applyFilters('app_routes', {});

        }

        const authenticated = this.getUserManager()?.isLoggedUser()

        const routes = Object.keys(this.env['routes'])
            .filter((key: string) => {
                const visibilities = authenticated ? ['private', 'both'] : ['public', 'both']
                return visibilities.includes(this.env['routes'][key].visibility);
            })
            .filter((key: string) => {
                const route = this.env['routes'][key];
                return (!route.caps) || userManager.hasCaps(route.caps);
            })
            .reduce((obj: { [key: string]: IRoute }, key) => {
                obj[key] = this.env['routes'][key];
                return obj;
            }, {});
        
        return routes;
    }

    isSsoLogin (): boolean {
        if (this.getSsoLogin() === 'false') {
            return false;
        } else {
            return true;
        }
    }

    getStoragePath() {
        return config.STORAGE_API;
    }

    getBackEndPath() {
        return config.BACKEND_API;
    }

    getBasename() {
        return config.BASENAME;
    }

    getSsoLogin(){
        return config.SSO_LOGIN;
    }

    getNotFoundImg(){
        return `${ this.getStoragePath () }assets/images/big/product_not_found_big.jpg`;
    }

    // Utiliy
    reload = () => {
        const reload = this.getEnv('reload')
        reload.call()
    }
}

const environmentManager = new EnvironmentManager();
export default environmentManager;

export interface IService {

    /**
     * Init module
     */
    init(environmentManager: EnvironmentManager): void;

    /**
     * Ritorna identificativa del modulo
     */
    getServiceKey(): string;
}