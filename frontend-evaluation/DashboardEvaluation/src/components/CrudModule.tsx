import { Card, Tabs } from "antd";
import { Content } from "antd/lib/layout/layout";
import { ColumnsType } from "antd/lib/table";
import { Component, ReactNode } from "react";
import EnvironmentManager from "../services/EnvironmentManager";
import { applyFilters } from "../services/HooksManager";
import Module from "../shared/module/CrudModule";
import { __ } from "../translations/i18n";
import ObjectUtils from "../utils/ObjectUtil";
import DataTable from "./DataTable";
import DynamicForm, { FormRow } from "./form/DynamicForm";

interface State {
    fieldList: FormRow[]
    columns: ColumnsType<any>
    data: any[]
    searchFormData: any
}

interface Prop {
    module: Module
    tabs?: string[]
}

class CrudModule extends Component<Prop, State> {

    state: State = {
        fieldList: [],
        columns: [],
        data: [],
        searchFormData: null
    }


    static timestampToDate = (timestamp: number) => {
        // convert timestamp to date
        let creationDateConverted = new Date(timestamp);
        return `${creationDateConverted.getDay()}/${creationDateConverted.getMonth()}/${creationDateConverted.getFullYear()} ${creationDateConverted.getHours()}:${creationDateConverted.getMinutes()} `;
    }

    handleSearchForm = async (data: any) => {
        data = ObjectUtils.filterIfValueIsEmpty(data);

        /**
         * @hook search_form_data_${moduleKey}
         * @param data:{[key:string]: any} dati dal form di ricerca
         * @param module modulo in uso
         */
        data = applyFilters(`search_form_data_${this.props.module.getModuleKey()}`, data, this.props.module)

        /**
         * @hook search_form_data
         * @param data:{[key:string]: any} dati dal form di ricerca
         * @param module modulo in uso
         */
        data = applyFilters('search_form_data', data, this.props.module)

        this.setState({searchFormData: data});
      
        // Salvataggio parametri di ricerca in Local Storage
        /* const storage = EnvironmentManager.getStorage();
        storage.save(`search_form_data_${this.props.module.getModuleKey()}`, data); */

    }

    getCreateComponent = (): ReactNode => {
        const component = (<></>)

        /**
         * Ritorna il component di create
         * @hook crud_create_component_${moduleKey}
         * @param component:React.Node component
         * @param module modulo in uso
         */
        return applyFilters(`crud_create_component_${this.props.module.getModuleKey()}`, component, this.props.module)

    }

    getUploadComponent = (): ReactNode => {
        const component = (<></>)

        /**
         * Ritorna il component di create
         * @hook crud_upload_component_${moduleKey}
         * @param component:React.Node component
         * @param module modulo in uso
         */
        return applyFilters(`crud_upload_component_${this.props.module.getModuleKey()}`, component, this.props.module)

    }

    getListingComponent = (): ReactNode => {

        const {module} = this.props;
        const provider = EnvironmentManager.getDataProvider();
        const {searchFormData} = this.state;
        provider.setModule(module.getModuleKey());

        const component = (
            <>
                <Content style={{marginBottom: 15}}>
                    <Card>
                        <DynamicForm formFields={module.getFormFields()} onFilters={this.handleSearchForm} formConf={{layout: module.getLayout() ?? "horizontal"}} module={module.getModuleKey()} typeForm={"search"}/>
                    </Card>
                    
                </Content>

                <Content>
                    <DataTable isInfiniteScrollOn={this.isInfiniteScroll} hasMore={this.hasMore} columns={module.getColumnsTable()} provider={provider} onMapData={module.getMapData} showButton={module.getShowExport()} params={searchFormData} module={module}/>
                </Content>
            </>
        )

        /**
         * Ritorna il component di listing
         * @hook crud_listing_component_${moduleKey}
         * @param component:React.Node component
         * @param module modulo in uso
         */
        return applyFilters(`crud_listing_component_${this.props.module.getModuleKey()}`, component, this.props.module)

    }

    isInfiniteScroll = () => {

        /**
         * Ritorna TRUE se è attivo l'infinte scroll
         * @hook crud_listing_infinit_scroll_${moduleKey}
         */
        return applyFilters(`crud_listing_infinite_scroll_${this.props.module.getModuleKey()}`, false, this.props.module)

    }

    hasMore = () => {

        /**
         * Ritorna TRUE se è attivo l'infinte scroll
         * @hook crud_listing_infinite_scroll_more_{moduleKey}
         */
        return applyFilters(`crud_listing_infinite_scroll_more_${this.props.module.getModuleKey()}`, false, this.props.module)

    }


    getPageTitle = () => {

        /**
         * Ritorna il page title del componente crud
         * @hook crud_page_title_${moduleKey}
         * @param title:string titolo
         * @param module modulo in uso
         */
        return applyFilters(`crud_page_title_${this.props.module.getModuleKey()}`, this.props.module.getModuleName(), this.props.module)

    }

    getTabs = () => {

        const {tabs = ["listing", "create"]} = this.props;

        const tabsItems = [];

        if (tabs.includes('listing')) {
            tabsItems.push({
                label: __("module.listing.title", {moduleName: this.props.module.getModuleName()}),
                key: '1',
                children: this.getListingComponent()
            });
        }

        if (tabs.includes('create')) {
            tabsItems.push({
                label: __("module.add.title", {entityName: this.props.module.getEntitySingolarName()}),
                key: '2',
                children: this.getCreateComponent()
            });
        }

        if (tabs.includes('upload')) {
            tabsItems.push({
                label: __("module.upload.title", {entityName: this.props.module.getEntitySingolarName()}),
                key: '3',
                children: this.getUploadComponent()
            });
        }

        /**
         * Ritorna la lista di tabs del componente crud
         * @hook crud_tabs_${moduleKey}
         * @param tabs le tab del CrudComponente
         * @param module modulo in uso
         */
        return applyFilters(`crud_tabs_${this.props.module.getModuleKey()}`, tabsItems, this.props.module)

    }

    render() {
        return (
            <>
                <Tabs defaultActiveKey="1" items={this.getTabs()}/>
            </>
        )
    }

}


export default CrudModule;
