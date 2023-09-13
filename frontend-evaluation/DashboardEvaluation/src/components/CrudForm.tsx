import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, message, Row } from "antd";
import { ColumnsType } from "antd/lib/table";
import { Component } from "react";
import { addFilter, applyActions, applyFilters } from "../services/HooksManager";
import { IModule } from "../services/ModulesManager";
import { __ } from "../translations/i18n";
import DynamicForm, { FormRow } from "./form/DynamicForm";
import EditTable from "./form/fields/EditTable";

interface Props {
    module: any,
    callback: (data: any) => any;
    getFormFields: () => any,
    cardSize?: number,
    type: "edit" | "add",
    entity?: any,
    editTable?: {
        formFields?: any,
        columnsTable?: ColumnsType<any>,
        getAttributes: (data: any) => any,
        dataSource?: any,
        label: string,
        required: boolean,
        labelButton: string,
        icon?: any
    }
}


export default class CrudForm extends Component<Props, {}> implements IModule {

    dataEditTable: any;

    init(): void {
    }

    componentDidMount(): void {
        addFilter(`${this.props.module}_${this.props.type}_on_filters_callback`, this.requiredEditTable);
    }

    getModuleKey(): string {
        return this.props.module;
    }

    requiredEditTable = (func: any) => {
        if (this.props.editTable?.required && !this.dataEditTable) {
            return message.error(__('error.requiredRowEditTable'));
        } else {
            return func;
        }
    }

    getFormFields = (): FormRow[] => {
        /**
         * Ritorna la lista di campi per il form di edit
         * @hook ${this.getModuleKey()}_details_edit_form
         * @param fieldList:FormRow[] Lista dei campi
         * @param module:CrudModule Modulo
         */
        return applyFilters(`${this.props.module}_${this.props.type}_form`, this.props.getFormFields(), this.props, this);
    }

    callback = async (data: any): Promise<any> => {
        /**
         * Ritorna i dati del Form
         * @hook ${this.props.module}_pre_${this.props.type}_data
         * @param data Dati del form
         * @param module:CrudModule modulo
         */
        data = applyFilters(`${this.props.module}_pre_${this.props.type}_data`, data, this.props.module);

        if (data){
            /**
             * Ritorna la callback passata in proprietà
             * @hook ${this.props.module}_${this.props.type}_method
             * @param callback:Function Funzione di callback da richiamare
             * @param data Dati del form
             */
            const callback = applyFilters(`${this.props.module}_${this.props.type}_method`, this.props.callback, data);

            const result = await callback(data);

            if(result) {
                /**
                 * Esegue un action in caso di successo
                 * @hook ${this.props.module}_${this.props.type}_success
                 * @param data Dati del form
                 */
                applyActions(`${this.props.module}_${this.props.type}_success`, data);
            } else {
                /**
                 * Esegue un action in caso di errore
                 * @hook ${this.props.module}_${this.props.type}_error
                 * @param data Dati del form
                 */
                applyActions(`${this.props.module}_${this.props.type}_error`, data);
            }
        }
    }


    getColumnsTable(): ColumnsType<any> {
        /**
         * Ritorna la lista di colonne per la tabella di attributi
         * @hook ${this.getModuleKey()}_tab_add_edit_table_columns
         * @param columnsTable:ColumnsType Lista delle colonne
         * @param module:CrudModule Modulo
         */
        return applyFilters(`${this.props.module}_${this.props.type}_edit_table_columns`, this.props.editTable?.columnsTable, this);
    }

    getTableFormFields(): FormRow[] {
        /**
         * Ritorna la lista di campi per il form della tabella attributi
         * @hook ${this.getModuleKey()}_tab_add_edit_table_form_field
         * @param formFields:FormRow[] Lista dei campi
         * @param module:CrudModule Modulo
         */
        return applyFilters(`${this.props.module}_${this.props.type}_edit_table_form_field`, this.props.editTable?.formFields, this);
    }

    getAttributesFromTable = async (data: any): Promise<any> => {
        /**
         * Ritorna i dati della Edit Table
         * @hook ${this.props.module}_${this.props.type}_edit_table_data
         * @param data Dati della tabella
         * @param module:CrudModule Modulo
         */
        data = applyFilters( `${this.props.module}_${this.props.type}_edit_table_data`, data, this.props.module);

        if (data) {
            /**
             * Ritorna la callback passata come proprietà
             * @hook ${this.props.module}_${this.props.type}_edit_table_get_attributes
             * @param getAttributes:Function Funzione callback
             * @param module:CrudModule Modulo
             */
            const attributesData = applyFilters( `${this.props.module}_${this.props.type}_edit_table_get_attributes`, this.props.editTable?.getAttributes, this.props.module);

            const result = await attributesData(data);

            if(result) {
                /**
                 * Esegue un action in caso di successo
                 * @hook ${this.props.module}_${this.props.type}_edit_table_success
                 * @param data Dati della tabella
                 */
                applyActions(`${this.props.module}_${this.props.type}_edit_table_success`, data);
            } else {
                /**
                 * Esegue un action in caso di errore
                 * @hook ${this.props.module}_${this.props.type}_edit_table_error
                 * @param data Dati della tabella
                 */
                applyActions(`${this.props.module}_${this.props.type}_edit_table_error`, data);
            }
        }
    }

    getDataSource = () => {
        /**
         * Ritorna i dati da pre-caricare nella edit table
         * @hook ${this.props.module}_${this.props.type}_data_source
         * @param dataSource Dati da precaricare in tabella
         * @param module:CrudModule Modulo
         */
        return applyFilters(`${this.props.module}_${this.props.type}_data_source`, this.props.editTable?.dataSource, this.props.module);
    }

    render() {
        const {cardSize, editTable, module, type} = this.props;
        applyFilters(`${this.props.module}_${this.props.type}_form_entity`, this.props.entity);

        return (
            <div className="site-card-wrapper">
            <Row gutter={[24, 24]} justify="center">
                <Col span={cardSize ?? 24}>
                    <Card bordered={false} style={{marginBottom: 50}} >
                        <DynamicForm formFields={this.getFormFields()} onFilters={this.callback} formConf={{layout: "vertical", id: "dynamicForm"}} module={module} typeForm={type}/>
                        {editTable && (
                            <>
                                <Form.Item label={editTable.label} required={this.props.editTable?.required} colon={false} />
                                <EditTable columnsTable={this.getColumnsTable()} formFields={this.getTableFormFields()} getAttributes={(data: any) => this.getAttributesFromTable(data)} dataSource={this.getDataSource()}/>
                                <Row gutter={[24, 24]} justify="center">
                                    <Button form="dynamicForm" htmlType="submit" type="primary" icon={type === 'edit' ? <EditOutlined /> : <SaveOutlined />}>{editTable.labelButton}</Button>
                                </Row>
                            </>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
        )
    }


}
