
import { PasswordData, User, ProfileData } from "../../models/User";
import { EnvironmentManager } from "../../services/EnvironmentManager";
import userManager from "../../services/UserManager";
import { call, CallRequestConfig } from "../../shared/api";
import UserDataProvider from "../UserDataProvider";

class UserDataProviderImp implements UserDataProvider {

    environmentManager: EnvironmentManager | undefined = undefined;

    pathLogin = '/session';
    pathUser = '/users';
    pathMe = '/Organization';
    pathChangePsw = '/change-password';
    pathOne = '/';

    pathResetPasswordInit = this.pathMe + '/reset-password/init'
    pathResetPasswordFinish = this.pathMe + '/reset-password/finish'

    getServiceKey(): string {
        return 'userDataProvider';
    }

    init = async (environmentManager: EnvironmentManager) => {
        this.environmentManager = environmentManager
    }

    getOne(idUser: number): User {
        throw new Error("Method not implemented.");
    }

    getList(): User[] {
        throw new Error("Method not implemented.");
    }

    create(user: User): User {
        throw new Error("Method not implemented.");
    }

    async update( id: string | number, user: User ): Promise<any> {

        // const token = await AppStore.loadAuthToken ();

        const request: CallRequestConfig<any> = {
            // headers: {
            //     'Accept': 'application/json, text/plain, */*',
            //     'Content-Type': 'application/json;charset=UTF-8',
            //     // 'x-tmr-token': token ?? ''
            // },
            data: user
        }
        return await call<string> ( "PUT", this.pathUser + this.pathOne + `${ id }`, request );
    }

    /**
     * Aggiorna Profilo Utente Loggato
     * @param user 
     * @returns 
     */
    async updateMe( user: ProfileData ): Promise<any> {

        const request: CallRequestConfig<any> = {
            data: user
        }
        return await call<string> ( "PUT", this.pathMe, request );
    }

    /**
     * Cambia la Password
     * @param passwordData 
     * @returns 
     */
    async changePassword( passwordData: PasswordData ): Promise<any> {

        const request: CallRequestConfig<any> = {
            data: passwordData
        }
        return await call<string> ( "POST", this.pathMe + this.pathChangePsw, request );
    }

    async delete(idUser: number | string): Promise<any> {
        return await call<string> ( "DELETE",  this.pathUser + this.pathOne + `${ idUser }` );
    }

    async getToken(username: string, password: string, rememberMe: boolean): Promise<any> {

        const request: CallRequestConfig<any> = {
            data: {username, password, rememberMe}
        }

        const tok = await call<string>("POST", this.pathLogin, request);
        if (tok) {
            return tok;
        }
        return false;
    }

    async getLoggedUser(): Promise<User> {
        const res = await call<User>("GET", this.pathMe);
        return res;
    }

    async recoverPassword(email: string): Promise<any> {
        const request: CallRequestConfig<any> = {
            headers: {
                Accept: 'text/plain',
                'Content-Type': 'text/plain'
            },
            data: email
        }
        const res = await call("POST", this.pathResetPasswordInit, request);
        return res;
    }

    async recoverPasswordFinish(key: string, newPassword: string): Promise<any> {
        const request: CallRequestConfig<any> = {
            data: {key, newPassword}
        }
        const res = await call("POST", this.pathResetPasswordFinish, request);
        return res;
    }

    logout() {
        throw new Error("Method not implemented.");
    }


}

const userDataProviderImp = new UserDataProviderImp();
export default userDataProviderImp;
