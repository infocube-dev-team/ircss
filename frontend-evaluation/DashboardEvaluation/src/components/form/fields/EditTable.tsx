import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { Component } from "react";
import { __ } from "../../../translations/i18n";
import DynamicForm, { FormRow } from "../DynamicForm";

interface State {
    dataSource: any[],
    defaultFormField: FormRow[],
    defaultColumns: any[],
    counter: number,
    tableData?: any
}

interface Props {
    formFields: any,
    columnsTable: any,
    dataSource?: any,
    getAttributes: (data: any) => any
}

export default class EditTable extends Component<{} & Props, State> {

    state: State = {
        dataSource: [],
        defaultFormField: [
            {
                fields:[
                    { name: "key", label: __('common.table.key'), type: 'text', required: true, requiredMessage: __('common.fieldRequired'), colConf: {span: 12} },
                    { name: 'value', label: __('common.table.value'), type: 'text', required: true, requiredMessage: __('common.fieldRequired'), colConf: {span: 12} },
                ]
            },
            { style: { className: "buttonForm" }, fields: [{ name: 'addRow', label:__('common.table.addRow'), type: 'button', htmlType: 'submit', icon: <PlusCircleOutlined /> , colConf: { span: 2, offset: 22 }}]}
        ],
        defaultColumns: [
            {
                title: __('common.table.key'),
                dataIndex: 'key',
                key: 'key'
            },
            {
                title: __('common.table.value'),
                dataIndex: 'value',
                key: 'value'
            },
            {
                title: 'Operation',
                dataIndex: 'operation',
                key: 'operation',
                width: "10%",
                //@ts-ignore//
                render: (_,record: any) =>
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteRow(record)}>
                            <Button icon={ <DeleteOutlined /> } size={ "small" } shape={ "circle" }></Button>
                        </Popconfirm>
            }
        ],
        counter: 0
    }

    componentDidMount(): void {
        this.getDataSource();
    }

    /**
     * Metoto che carica i dati dalla proprietà dataSource se presente
     */
    getDataSource = () => {
        if (this.props.dataSource)
        this.setState({dataSource: this.props.dataSource})
    }

    /**
     * Metodo per ottenere la configurazione del form
     * @returns ritorna la configurazione del form
     */
    getFormFields = (): FormRow[] => {
        if (this.props.formFields) {
            return this.addFieldsAddRow(this.props.formFields);
        }
        return this.state.defaultFormField;
    }

    /**
     * Metodo per ottenere la configurazione della tabella
     * @returns ritorna la configurazione della tabella
     */
    getColumnsTable = ():  ColumnsType<any> => {
        if (this.props.columnsTable) {
            return this.addColumnsDelete(this.props.columnsTable);
        }
        return this.state.defaultColumns;
    }

    /**
    * Metodo che aggiunge la configurazione della colonna Operation alla configurazione passata nelle props
    * @param fieldsConf:ColumnsType<any> Configurazione colonne tabella 
    * @returns ritorna la configurazione con la colonna Operation
    */
    addColumnsDelete = (columnsConf: ColumnsType<any>) => {
        const deleteButton = {
            title: 'Operation',
            dataIndex: 'operation',
            key: 'operation',
            width: "10%",
            //@ts-ignore//
            render: (_,record: any) =>
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteRow(record)}>
                        <Button icon={ <DeleteOutlined /> } size={ "small" } shape={ "circle" }></Button>
                    </Popconfirm>
        }
        
        const indexCol = columnsConf.findIndex(c => c.key === 'operation');
        if (indexCol === -1) {
            columnsConf.push(deleteButton);
        }
       
        return columnsConf;
    }

    /**
     * Metodo che aggiunge la configurazione del bottone Aggiungi riga alla configurazione passata nelle props
     * @param fieldsConf:FormRow[] Configurazione campo form 
     * @returns ritorna la configurazione con il bottone Aggiungi riga
     */
    addFieldsAddRow = (fieldsConf: FormRow[]): FormRow[] => {
        const buttonAddRow = {
            style: {
                className: "buttonForm"
            },
            fields: [
                { name: 'addRow', label:__('common.table.addRow'), type: 'button', htmlType: 'submit', icon: <PlusCircleOutlined /> }
            ]
        };
        const findButton = fieldsConf.findIndex(r => r.style?.className === 'buttonForm');
        if (findButton === -1) {
            fieldsConf.push(buttonAddRow);
        }

        return fieldsConf;
    }

    /**
     * Metodo per l'eliminazione di una riga dalla tabella
     * @param row Riga da eliminare 
     */
    deleteRow = async (row: any) => {
        this.setState({dataSource: this.state.dataSource.filter(r => r !== row)});
        await this.getTableData(row);
    }

    /**
     * Metodo per l'aggiunta di una riga alla tabella
     * @param data Riga da aggiungere alla tabella
     */
    addRow(data: any): any {
        if (data.key) {
            delete data.addRow;
            const findRow = this.state.dataSource.findIndex(r => r.key === data.key);
            if (findRow === -1) {
                this.state.dataSource?.push(data);
                this.getTableData();
            } else {
                message.error(__('error.duplicateKey'));
            }
        } else {
            const counter = this.state.counter;
            data.index = counter +1;
            this.setState({counter: counter +1});
            delete data.addRow;
            this.state.dataSource?.push(data);
            this.getTableData();
        }
    }

    /**
     * Metodo per ottenere dati caricati in Tabella
     * @param row Opzionale, se presente carica i dati della tabella meno la riga passata 
     */
    getTableData = async (row?: any) => {
        // metodo che costruisce l'oggetto da ritornare nella callback
        if (row) {
            const dataSource = [...this.state.dataSource.filter(r => r !== row)];
            this.createObject(dataSource);
        } else {
            const dataSource = [...this.state.dataSource];
            this.createObject(dataSource);
        }
        
    }

    /**
     * Metodo per la creazione dell'oggetto da ritornare nella callback
     * @param dataSource Il dataSource da cui prendere i dati
     */
    createObject = async (dataSource: any) => {
        let attributes = {};
        dataSource.forEach( (r: any) => {
            delete r.index;
            if (r.key) {
                const singleAttribute = {[r.key]:r }
                attributes = {...attributes, ...singleAttribute};
            } else {
                attributes = {...attributes, ...r};
            }
        });
        await this.props.getAttributes(attributes);
    }

    

    render() {
        const {dataSource} = this.state;

        return (
            <>
                <Table dataSource={[...dataSource]} columns={this.getColumnsTable()} style={{marginBottom: 50}} />
                <DynamicForm formFields={this.getFormFields()} onFilters={(data) => this.addRow(data)} formConf={{layout: "vertical", id: "editTable"}} module={"editTable"} typeForm={"edit"}/>
            </>
        )
    }
}