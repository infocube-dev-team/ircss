import Module from "../shared/module/CrudModule";
import {useParams} from "react-router-dom";
import {applyFilters} from "../services/HooksManager";
import {__} from "../translations/i18n";
import {Tabs} from "antd";
import {useEffect, useState} from "react";
import ObjectUtils from "../utils/ObjectUtil";
import EnvironmentManager from "../services/EnvironmentManager";
import { TabContext } from "./TabContext";

interface Prop {
    module: Module
    tabs?: string[]
}

const CrudDetails = (props: Prop) => {

    const getDetailsComponent = (entity: any) => {

        const component = (
            <>DETAILS
            {/* <Button onClick={() => {onKeyChange('edit')}}>PIPPO</Button> */}
            </>
            
        )

        /**
         * Ritorna il Component per visualizzare i dati di dettaglio dell'entity
         * @hook crud_detail_page_title_${moduleKey}
         * @param component:ReactNode componente per la presentazione dei dettagli entity
         * @param entity:any dati da mostrare
         * @param module modulo in uso
         */
        return applyFilters(`crud_detail_view_component_${props.module.getModuleKey()}`, component, entity, props.module)

    }

    const getEditComponent = (entity: any) => {

        const component = (
            <>EDIT</>
        )

        /**
         * Ritorna il Component per visualizzare i dati di dettaglio dell'entity
         * @hook crud_detail_edit_component_${moduleKey}
         * @param component:ReactNode componente per la presentazione dei dettagli entity
         * @param entity:any dati da mostrare
         * @param module modulo in uso
         */
        return applyFilters(`crud_detail_edit_component_${props.module.getModuleKey()}`, component, entity, props.module)

    }

    const getPageTitle = () => {

        /**
         * Ritorna il page title del componente details
         * @hook crud_detail_page_title_${moduleKey}
         * @param title:string titolo
         * @param module modulo in uso
         */
        return applyFilters(`crud_detail_page_title_${props.module.getModuleKey()}`, props.module.getModuleName(), props.module)

    }

    const getTabs = (entity: any):any => {

        const {tabs = ["details", "edit"]} = props;

        const tabsItems:any[] = [];

        if (!ObjectUtils.isObject(entity)) {
            return tabsItems
        }

        if (tabs.includes('details')) {
            tabsItems.push({
                label: __("module.details.title", {entityName: props.module.getEntitySingolarName()}),
                key: 'details',
                children: getDetailsComponent(entity)
            });
        }

        if (tabs.includes('edit')) {
            tabsItems.push({
                label: __("module.edit.title", {entityName: props.module.getEntitySingolarName()}),
                key: 'edit',
                children: getEditComponent(entity)
            });
        }

        /**
         * Ritorna la lista di tabs del componente details
         * @hook crud_details_tabs_${moduleKey}
         * @param tabs le tab del CrudComponente
         * @param module modulo in uso
         */
        return applyFilters(`crud_details_tabs_${props.module.getModuleKey()}`, tabsItems, props.module, onKeyChange);

    }

    const [entity, setEntity] = useState([])
    const [tabs, setTabs] = useState([])
    const [activeKey, setActiveKey] = useState("details");

    const onKeyChange = (key: any) => setActiveKey(key);

    const {id} = useParams<{ id: string }>();
    const {module} = props;
    const navManager = EnvironmentManager.getNavigationManager();
    
    // Parte automatico, senza dipendenze
    useEffect(() => {
        module.getEntity(id).then(entity => {
            setEntity(entity);
        })
    }, [])

    // Parte quando entity pronta
    useEffect(() => {
        const tabs = getTabs(entity);
        navManager.addBreadcrumb({key: `${module.getModuleKey()}_details`, route: module.getRouteDetailWithBaseName(id), label: <span>{module.getEntityName(entity)}</span>});
        navManager.reloadBreadcrumbs();
        EnvironmentManager.reload();
        setTabs(tabs)
    }, [entity])

    return (
        <>
            <TabContext.Provider value={{activeKey, setActiveKey}}>
                <Tabs defaultActiveKey="details" items={tabs} activeKey={activeKey} onChange={onKeyChange}/>
            </TabContext.Provider>
        </>
    )

}
export default CrudDetails;