import api, {call, CallRequestConfig, download} from "../../shared/api";
import DataProvider from "../DataProvider";
import {applyFilters} from "../../services/HooksManager";
import {Method} from "axios";
import ObjectUtils from "../../utils/ObjectUtil";
import {EnvironmentManager} from "../../services/EnvironmentManager";

class DataProviderImp implements DataProvider {

    environmentManager: EnvironmentManager | undefined = undefined;

    endpoint = '';
    pathCount = '/count';
    pathOne = '/';
    pathAdmin = '/admin';
    pathDelete = this.pathAdmin + '/delete';

    getServiceKey(): string {
        return 'dataProvider'
    }

    init = async (environmentManager: EnvironmentManager) => {
        this.environmentManager = environmentManager
    }

    private __getEndpoint(overrideModule?: string) {
        return overrideModule ?? this.endpoint;
    }

    private __getExportEndpoint(overrideModule?: string) {
        return overrideModule ?? this.endpoint + '/export';
    }

    applyPreRequestFilter = (call: string, method: Method, path: string, request: CallRequestConfig<any>): {
        method: Method,
        path: string,
        request: CallRequestConfig<any>
    } => {

        /**
         * Prepara la richiesta per il methdo ${call} del Data Provider
         * @hook data_pre_${call}
         * @param {method:Method, path: string, request: CallRequestConfig<any>} dati della richiesta
         */
        return applyFilters(`data_pre_${call}`, {
            method: method,
            path: path,
            request: request
        });
    }

    applyPostRequestFilter = (data: any, call: string, method: Method, path: string, request: CallRequestConfig<any>): {
        method: Method,
        path: string,
        request: CallRequestConfig<any>
    } => {

        /**
         * Prepara la richiesta per il methdo ${call} del Data Provider
         * @hook data_post_{call}
         * @param data: any dati restituiti dal server
         * @param {method:Method, path: string, request: CallRequestConfig<any>} dati della richiesta
         * @param {request: any, response: any, error: any} last call
         */
        return applyFilters(`data_post_${call}`, data, {
            method: method,
            path: path,
            request: request
        }, api.getLastCall());
    }

    private static __initRequest(parameters: CallRequestConfig<any> | undefined, request: any) {
        return ObjectUtils.assignDeep(ObjectUtils.filterIfValueIsEmpty(parameters as any), ObjectUtils.filterIfValueIsEmpty(request));
    }

    async getList(limit?: number, offset?: number, parameters?: CallRequestConfig<any>, overrideModule?: string, mapRes: boolean = true): Promise<any> {
        let req = DataProviderImp.__initRequest(parameters, {
            /* params: {
                limit: limit,
                offset: offset
            } */
        });
        const {method, path, request} = this.applyPreRequestFilter('get_list', 'GET', this.__getEndpoint(overrideModule), req);
        const res = this.applyPostRequestFilter(
            await call<any[]>(method, path, request),
            'get_list',
            'GET',
            this.__getEndpoint(overrideModule),
            req
        )
        if (mapRes) {
            return this.__mapDataList(res, this.__getEndpoint(overrideModule));
        }
        
        return res;
    }

    async __mapDataList(res: any, endpoint: string) {
        return await applyFilters(endpoint + '_get_list_map', res);
    }

    async getCount(limit?: number, offset?: number, parameters?: CallRequestConfig<any>, overrideModule?: string): Promise<any> {
        let res = DataProviderImp.__initRequest(parameters, {
            params: {
                limit: limit,
                offset: offset
            }
        });
        const {method, path, request} = this.applyPreRequestFilter('get_count', 'GET', this.__getEndpoint(overrideModule) + this.pathCount, res);
        return this.applyPostRequestFilter(
            await call<any[]>(method, path, request),
            'get_count',
            'GET',
            this.__getEndpoint(overrideModule) + this.pathCount,
            res
        )
    }

    async getOne(id: number | string, parameters?: CallRequestConfig<any>, overrideModule?: string): Promise<any> {
        let res = DataProviderImp.__initRequest(parameters, {});
        const {method, path, request} = this.applyPreRequestFilter('get_one', 'GET', this.__getEndpoint(overrideModule) + this.pathOne + id, res);
        return this.applyPostRequestFilter(
            await call<any[]>(method, path, request),
            'get_one',
            'GET',
            this.__getEndpoint(overrideModule) + this.pathOne + id,
            res
        )
    }

    async export(parameters?: CallRequestConfig<any>, overrideModule?: string): Promise<any> {
        let res = DataProviderImp.__initRequest(parameters, {});
        const {path, request} = this.applyPreRequestFilter('export_get_list', 'GET', this.__getExportEndpoint(overrideModule), res);
        return this.applyPostRequestFilter(
            await download<any[]>(path, request),
            'export_get_list',
            'GET',
            this.__getExportEndpoint(overrideModule),
            res
        )
    }

    setModule(module: string) {
        this.endpoint = module;
    }

    async addOne(parameters?: CallRequestConfig<any>, overrideModule?: string){
        let res = DataProviderImp.__initRequest(parameters, {});
        const {method, path, request} = this.applyPreRequestFilter('add_one', 'POST', this.__getEndpoint(overrideModule), res);
        return this.applyPostRequestFilter(
            await call<any>(method, path, request),
            'add_one',
            'POST',
            this.__getEndpoint(overrideModule),
            res
        )
    }

    async editOne(parameters?: CallRequestConfig<any>, overrideModule?: string){
        let res = DataProviderImp.__initRequest(parameters, {});
        const {method, path, request} = this.applyPreRequestFilter('edit_one', 'PUT', this.__getEndpoint(overrideModule), res);

        return this.applyPostRequestFilter(
            await call<any>(method, path, request),
            'edit_one',
            'PUT',
            this.__getEndpoint(overrideModule),
            res
        )
    }

    async deleteOne( entity:string, id:string | number, parameters?: CallRequestConfig<any>, overrideModule?: string ): Promise<any>{
        let url = entity + this.pathOne + id
        let res = DataProviderImp.__initRequest(parameters, {});
        const {method, path, request} = this.applyPreRequestFilter('delete_one', 'DELETE', this.__getEndpoint(overrideModule) + url, res);

        return this.applyPostRequestFilter(
            await call<any[]>(method, path, request),
            'delete_one',
            'DELETE',
            this.__getEndpoint(overrideModule) + url,
            res
        )
    }


}

const dataProviderImp = new DataProviderImp();
export default dataProviderImp;
