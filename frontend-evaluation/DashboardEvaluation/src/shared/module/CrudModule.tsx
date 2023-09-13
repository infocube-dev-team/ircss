import { FormLayout } from "antd/lib/form/Form";
import { ColumnsType } from "antd/lib/table";
import { FormField, FormRow } from "../../components/form/DynamicForm";
import EnvironmentManager from "../../services/EnvironmentManager";
import { addAction, applyFilters } from "../../services/HooksManager";
import { IModule } from "../../services/ModulesManager";
import { __ } from "../../translations/i18n";
import moment from "moment";

class CrudModule implements IModule {

    init(): any {
        addAction('nav_route_change', this.onRouteChange);
    }

    getModuleKey = ():string => {
        throw new Error("Abstract method!");
    }

    getModuleName = ():string => {
        return __(this.getModuleKey() + ".module_name");
    }

    getEntitySingolarName = ():string => {
        return __(this.getModuleKey() + ".entity.singular_name");
    }

    getEntityPluralName = ():string => {
        return __(this.getModuleKey() + ".entity.plural_name");
    }

    __getFormFields = ():FormRow[] =>{
        throw new Error("Abstract method!");
    }

    getFormFields = ():FormRow[] => {
        /**
         * Ritorna la lista di campi per il search form
         * @hook ${this.getModuleKey()}_table_search_form
         * @param fieldList:FormRow[] Lista dei campi
         * @param module:CrudModule Modulo
         */
        const formData = applyFilters(`${this.getModuleKey()}_table_search_form`, this.__getFormFields(), this);
        // Popolamento campi con dati salvati in local storage
        /* const storage = EnvironmentManager.getStorage();
        const storedData = localStorage.getItem(`${storage.prefix}search_form_data_${this.getModuleKey()}`);
        if (storedData && storedData !== '{}') {
            const storedDataObj = JSON.parse(storedData);
            for (const key in storedDataObj) {
                this.updateFields(formData, key, storedDataObj[key]);
            }
        } */
        return formData;
    }

    /**
     * Popolamento campi con dati salvati in local storage
     * @param formData 
     * @param storedFieldName 
     * @param storedFieldValue 
     */
    /* updateFields = (formData: FormRow[], storedFieldName: string, storedFieldValue: any) => {
        formData[0].fields = formData[0].fields.map((field: FormField) => {
            if (field.name === storedFieldName) {
                if (field.type === 'date') {
                    field.defaultValue = moment(storedFieldValue, 'YYYY-MM-DD');
                } else if (field.type === 'autocompleteselect' || field.type === 'autocomplete') {
                    field.initialValue = storedFieldValue;
                    field.defaultValue = storedFieldValue;
                    field.value = storedFieldValue;
                } else {
                    field.defaultValue = storedFieldValue;
                    field.value = storedFieldValue;
                }
            }
            return field;
        });
    } */

    __getAddFormFields = ():FormRow[] =>{
        throw new Error("Abstract method!");
    }

    getAddFormFields = ():FormRow[] => {
        /**
         * Ritorna la lista di campi per il form di add
         * @hook ${this.getModuleKey()}_add_form
         * @param fieldList:FormRow[] Lista dei campi
         * @param module:CrudModule Modulo
         */
        return applyFilters(`${this.getModuleKey()}_add_form`, this.__getAddFormFields(), this);
    }

    __getLayout = (): FormLayout => {
        throw new Error("Abstract method!");
    }

    getLayout = (): FormLayout => {
        /**
         * Ritorna il tipo di layout per il search Form
         * @hook ${this.getModuleKey()}_table_search_layout_form
         * @param layout:FormLayout Tipo di Layout
         * @param module:CrudModule Modulo
         */
        return applyFilters(`${this.getModuleKey()}_table_search_layout_form`, this.__getLayout(), this);
    }

    __getRoute = (): string => {
        return `/${this.getModuleKey()}`;
    }

    getRoute = (): string => {
        /**
         * Ritorna la route del modulo
         * @hook ${this.getModuleKey()}_route_module
         * @param route:string Route del modulo
         * @param module:CrudModule Modulo
         */
         return applyFilters(`${this.getModuleKey()}_route_module`, this.__getRoute(), this);
    }

    __getRouteWithBasename = (): string => {
        const basename = EnvironmentManager.getBasename();
        return `${basename}/${this.getModuleKey()}`;
    }

    getRouteWithBasename = (): string => {
        /**
         * Ritorna la route del modulo
         * @hook ${this.getModuleKey()}_route_module
         * @param route:string Route del modulo
         * @param module:CrudModule Modulo
         */
         return applyFilters(`${this.getModuleKey()}_route_module`, this.__getRouteWithBasename(), this);
    }

    __getRouteDetail = (id: string | number | undefined): string => {
        return `${this.getRoute()}/${id ?? ':id'}`;
    }

    getRouteDetail = (id: string | number | undefined = undefined): string => {
        /**
         * Ritorna la route del modulo
         * @hook ${this.getModuleKey()}_route_module
         * @param route:string Route del modulo
         * @param module:CrudModule Modulo
         */
         return applyFilters(`${this.getModuleKey()}_route_module`, this.__getRouteDetail(id), this);
    }

    __getRouteDetailWithBaseName = (id: string | number | undefined): string => {
        const basename = EnvironmentManager.getBasename();
        return `${basename}${this.getModuleKey()}/${id ?? ':id'}`;
    }

    getRouteDetailWithBaseName = (id: string | number | undefined = undefined): string => {
        /**
         * Ritorna la route del modulo
         * @hook ${this.getModuleKey()}_route_module
         * @param route:string Route del modulo
         * @param module:CrudModule Modulo
         */
         return applyFilters(`${this.getModuleKey()}_route_module`, this.__getRouteDetailWithBaseName(id), this);
    }

    onRouteChange = (location: any, navManager: any) => {
        const route = this.getRoute();
        const routeWithBaseName = this.getRouteWithBasename();
        if (location.pathname.indexOf(route) === 0) {
            navManager.addBreadcrumb({key: this.getModuleKey(), route: routeWithBaseName, label: <span>{this.getModuleName()}</span>})
        }
    }


    __getColumnsTable = (): any => {
        throw new Error("Abstract method!");
    }


    getShowExport = () => {
     /**
     *
     * @returns default false se non fa override
     */
        return false;
    }

    getColumnsTable = () => {

        /**
         * Ritorna le colonne per il listing del modulo
         * @hook ${this.getModuleKey()}_table_columns
         * @param columns:ColumnsType<any> Mapping delle colonne della tabella
         * @param module:CrudModule Modulo
         */
        return applyFilters(`${this.getModuleKey()}_table_columns`, this.__getColumnsTable(), this);
    }

    __getMapData = (row: any): any => {
        throw new Error("Abstract method!");
    }

    getMapData = async (data: any) => {
        const map: any[] = [];
        if (data?.length > 0) {
            data.forEach((res: any, i: number) => {
    
                /**
                * Ritorna le colonne per il listing del modulo
                * @hook ${this.getModuleKey()}_table_data_row
                * @param obj Riga della tabella
                * @param res Response da mappare
                * @param i indice Riga tabella
                * @param columns Mapping delle colonne della tabella
                * @param module Modulo
                */
                const mappedObj = applyFilters(`${this.getModuleKey()}_table_data_row`, this.__getMapData(res), res, i, this.getColumnsTable(), this);
                map.push(mappedObj);
            });
        }

        return map;
    }

    private applyEntityFilter = (entity: any) => {
        return applyFilters(`${this.getModuleKey()}_get_entity`, entity)
    }

    getEntity = async (id:string|number): Promise<any> => {
        const provider = EnvironmentManager.getDataProvider();
        return provider.getOne(id, {}, this.getModuleKey()).then(res => {
            if (res) {
                return this.applyEntityFilter(res)
            }
        })
    }

    getEntityName (entity: any) {

        if (!!entity.description) {
            return entity.description;
        }

        if (!!entity.name) {
            return entity.name;
        }

        if (!!entity.id) {
            return entity.id;
        }

        return '';
    }

    getEntityByField = async (field:string, val:any): Promise<any> => {

        const provider = EnvironmentManager.getDataProvider();
        let params:{[key: string]: any} = {}
        params[field] = val
        return provider.getList(1, 0, {params: params}, this.getModuleKey()).then(res => {
            if (res && res.length > 0) {
                return this.applyEntityFilter(res[0])
            }
        })
    }
}


export default CrudModule;
