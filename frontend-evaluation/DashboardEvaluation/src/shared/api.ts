import {ApiResponse, ApisauceInstance, create, HEADERS} from 'apisauce'
import {Method} from 'axios'
import qs from 'qs'
import {applyActions, applyFilters} from "../services/HooksManager";
import fileDownload from "js-file-download";
import {EnvironmentManager, IService} from "../services/EnvironmentManager";

export type Params = {
    [key: string]: string
}

export type CallRequestConfig<T> = {
    headers?: HEADERS,
    params?: Params,
    data?: T,
    timeout?: number;
    url?: string;
    method?: Method;
    baseURL?: string;
}

export const paramsSerializer = (params: any) =>
    qs.stringify(params, {
        // TMR API handles multiple values with format ?code=A&code=B, but default serializer
        // uses format ?code[]=A&code[]=B so override with option arrayFormat: repeat
        arrayFormat: 'repeat',
        // TMR API date format is unix timestamp in milliseconds
        // Note: this will not usually be used as date params are converted to timestamp
        // as soon as they're parsed from user input
        serializeDate: (Date) => Date.getTime().toString(),
    })

class Api implements IService{

    environmentManager: EnvironmentManager | undefined = undefined;
    api: ApisauceInstance | undefined

    lastCall: {
        request: any,
        response: any,
        error: any
    } = {
        request: {},
        response: {},
        error: {}
    }

    getServiceKey(): string {
        return 'api'
    }


    /**
     * Init module
     */
    async init(environmentManager: EnvironmentManager) {

        this.environmentManager = environmentManager;

        if (this.api! === undefined) {
            this.api = create({
                baseURL: this.environmentManager?.getBackEndPath(),
                timeout: 30000,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                paramsSerializer,
            })
        }

        this.api.axiosInstance.interceptors.response.use(
            (response) => response,
            // eslint-disable-next-line consistent-return
            (error) => {
                // Traccio lastCall come errore 
                this.lastCall.error = error;
                console.error('error', error);

                /**
                 *  Action per notifica di errore specifico in chiamata HTTP
                 *  La apiKey + costruita con:
                 *  - Http Method lowercase
                 *  - Request Path lowercase con '_' in luogo di '/'
                 *  Es.
                 *  - Method POST
                 *  - Request Path /auth/login
                 *  apiKey = post_auth_login
                 *  @hook api_response_error_${apiKey}
                 *  @param error.request:any richiesta effettuata
                 *  @param error.response:any response error
                 */
                if(error.response) {
                    const url = error.response.config.url.replaceAll('/', '_');
                    const apiKey = `${error.response.config.method}_${url}`;
                    applyActions(`api_response_error_${apiKey}`, error.request, error.response);
                }

                /**
                 *  Notifica evento di errore chiamata HTTP
                 *  @hook api_response_error
                 *  @param error.request:any richiesta effettuata
                 *  @param error.response:any response error
                 */
                applyActions('api_response_error', error);

                return Promise.reject(error);
            }
        )
    }

    getResponse = <T>(res: ApiResponse<T, any>, url: string, method: Method, request?: CallRequestConfig<T>) => {

        this.lastCall.response = res;
        return res.data
    }

    getLastCall = () => {
        return this.lastCall
    }

    /**
     * Questo metodo gestisce in modo centralizzato tutte le chiamate che vengono effettuate
     */
    callApi = async <T>(method: Method, url: string, request?: CallRequestConfig<T>): Promise<T> => {


        if(this.api === undefined) {
            return Promise.reject();
        }

        // Override url by request
        url = request?.url ?? url

        /**
         *  URL api da invocare
         *  @hook api_url
         *  @param url:string url da invocare
         *  @param url:Method HTTP method da utilizzare
         *  @param url:CallRequestConfig ulteriori parametri HTTP request
         */
        url = applyFilters("api_request_url", url, method, request);

        /**
         *  Preparo request api da inviare
         *  @hook api_request
         *  @param url:CallRequestConfig ulteriori parametri HTTP request
         *  @param url:string url da invocare
         *  @param url:Method HTTP method da utilizzare
         */
        request = applyFilters("api_request", request, url, method);

        if (request?.headers) {
            // api.setHeaders(request?.headers);
        }

        this.lastCall.request = {
            request: request,
            method: method,
            url: url
        }
        this.lastCall.response = {}
        this.lastCall.error = false

        //try {
        if (method === "GET") {
            return await this.api.get<T>(url, request?.params, request).then((res: ApiResponse<T, any>) => this.getResponse(res, url, method, request));
        }

        if (method === "POST") {
            return await this.api.post<T>(url, request?.data, request).then((res: ApiResponse<T, any>) => this.getResponse(res, url, method, request));
        }

        if (method === "PUT") {
            return await this.api.put<T>(url, request?.data, request).then((res: ApiResponse<T, any>) => this.getResponse(res, url, method, request));
        }

        if (method === "DELETE") {
            return await this.api.delete<T>(url, request?.params, request).then((res: ApiResponse<T, any>) => this.getResponse(res, url, method, request));
        }

        return Promise.reject();

    }

}

const api = new Api();
export default api

/**
 * Questo metodo gestisce in modo centralizzato tutte le chiamate che vengono effettuate
 */
export const call = async <T>(method: Method, url: string, request?: CallRequestConfig<T>): Promise<T> => {
    return api.callApi(method, url, request)
}

export const download = async <T>(url: string, request?: CallRequestConfig<T>): Promise<T> => {
    await get(url, request);
    const res = api.getLastCall().response;
    // utilizzo content-disposition per recuperare il nome del file
    fileDownload(res.data, res.headers['content-disposition'].split('"')[1]);
    return res
}

export const get = async <T>(url: string, request?: CallRequestConfig<T>): Promise<T> => {
    return call("GET", url, request);
}

export const post = async <T>(url: string, data: T, request?: CallRequestConfig<T>): Promise<T> => {

    // Init request se non passata
    if (request === undefined) {
        request = {
            data: data
        }
    } else {
        request.data = data;
    }

    return call("POST", url, request);
}

export const put = async <T>(url: string, data: T, request?: CallRequestConfig<T>): Promise<T> => {

    // Init request se non passata
    if (request === undefined) {
        request = {
            data: data
        }
    } else {
        request.data = data;
    }

    return call("PUT", url, request);
}

export const deleted = async <T>(url: string, request?: CallRequestConfig<T>): Promise<T> => {
    return call("DELETE", url, request);
}