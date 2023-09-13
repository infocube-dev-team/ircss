import { CallRequestConfig } from "../shared/api";
import {IService} from "../services/EnvironmentManager";

interface DataProvider extends IService {

    /**
     * Metodo generalizzato per recuperare una lista di elementi.
     * È possibile impostare limit e offset per paginare i risultati
     * limit e offset sono opzionali ma devono essere valorizzati entrambi per utilizzarli
     *
     * @param limit opzionale, indica il numero massimo di risultati
     * @param offset opzionale, indica il numero di righe da saltare
     * @param parameters CallRequestConfig<any> ulteriori specifiche della request
     * @param overrideModule:string opzionale, per modificare il base path
     */
    getList(limit?: number, offset?: number, parameters?: CallRequestConfig<any>, overrideModule?: string, mapRes?: boolean): Promise<any>;

    /**
     * Metodo generalizzato per recuperare il numero si elementi.
     * Usato per poter gestire la paginazione dei moduli Listing
     *
     * @param limit opzionale, indica il numero massimo di risultati
     * @param offset opzionale, indica il numero di righe da saltare
     * @param parameters CallRequestConfig<any> ulteriori specifiche della request
     * @param overrideModule:string opzionale, per modificare il base path
     */
    getCount(limit?: number, offset?: number, parameters?: CallRequestConfig<any>, overrideModule?: string): Promise<any>;

    /**
     * Metodo per accesso a dati di un singolo record
     *
     * @param id:number|string identificativo
     * @param parameters CallRequestConfig<any> ulteriori specifiche della request
     * @param overrideModule:string opzionale, per modificare il base path
     */
    getOne(id: number | string, parameters?: CallRequestConfig<any>, overrideModule?: string): Promise<any>;

    /**
     * Metodo generalizzato che effettua il download dei valori della tabella
     *
     * @param parameters CallRequestConfig<any> ulteriori specifiche della request
     * @param overrideModule:string opzionale, per modificare il base path
     */
    export(parameters?: CallRequestConfig<any>, overrideModule?: string): Promise<any>;

    /**
     * Metodo per definire il prefisso del path da utilizzare
     */
    setModule(module: string): void

    /**
     * Metodo POST per aggiungere un item 
     * 
     * @param parameters CallRequestConfig<any> ulteriori specifiche della request
     * @param overrideModule:string opzionale, per modificare il base path
     */
     addOne(parameters?: CallRequestConfig<any>, overrideModule?: string): Promise<any>;

    /**
     * Metodo PUT per modificare un item
     *
     * @param parameters CallRequestConfig<any> ulteriori specifiche della request
     * @param overrideModule:string opzionale, per modificare il base path
     */
     editOne(parameters?: CallRequestConfig<any>, overrideModule?: string): Promise<any>;
     
    /**
     * Metodo per eliminare un item
     *
     * @param id:string identificativo
     * @param pkey:string chiave campo id
     * @param parameters? CallRequestConfig<any> ulteriori specifiche della request
     * @param overrideModule?:string opzionale, per modificare il base path
     */
    deleteOne( entity:string, id:string | number, parameters?: CallRequestConfig<any>, overrideModule?: string): Promise<any>;

}

export default DataProvider;
