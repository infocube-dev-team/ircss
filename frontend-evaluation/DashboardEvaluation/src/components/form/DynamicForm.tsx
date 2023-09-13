import { Col, Form, Row } from "antd";
import { FormLayout } from "antd/lib/form/Form";
import { Gutter } from "antd/lib/grid/row";
import { Component } from "react";
import { applyActions, applyFilters } from "../../services/HooksManager";
import ObjectUtils from "../../utils/ObjectUtil";
import fieldMap from './fields/fields';

export interface FormField {
    [key: string]: any,
    colConf?: {
        span?: number,
        offset?: number
    },
    editTableConf?: {
        columns?: any[],
        dataSource?: any,
        formFields?: FormRow[]
    }

}

export interface FormRow {
    style?: {
        className: string
    },
    fields: FormField[],
    rowConf?: {
        gutter?: Gutter | [Gutter, Gutter],
        justify?: "start" | "end" | "center" | "space-around" | "space-between" | "space-evenly",
        align?: "top" | "middle" | "bottom" | "stretch"
    }
}

interface Props {
    formFields: FormRow[],
    onFilters: (e: any) => any,
    formConf?: {
        layout?: FormLayout,
        id?: string
    },
    module: string,
    typeForm: "search" | "add" | "edit" | "form"
}

interface RowProps {
    row: FormRow
}

interface State {
}

interface FormState {
    formFields: any
}

class DynamicFormRow extends Component<{} & RowProps, State> {

    constructor(props: RowProps | Readonly<RowProps>) {
        super(props);
        this.state = {};
    }

    render() {
        const { row } = this.props;
        const { fields } = row;
        const rowConf = ObjectUtils.assignDeep({
            gutter: [24,2],
            justify: 'start',
            align: "top"
        }, row?.rowConf);

        return (

            <Row { ...rowConf}>
                {
                    fields.map((field, index) => {

                        if (fieldMap[field.type] === undefined) {
                            throw Error("Field Type \"" + field.type + "\" not handled");
                        }

                        const FieldComponent = fieldMap[field.type];

                        let fieldData = Object.assign({}, field)
                        const noFieldProp = [
                            'colConf',
                            // 'requiredMessage',
                            'buttonType'
                        ]
                        noFieldProp.forEach(function (propToDel:string){
                            delete fieldData[propToDel]
                        })

                        const fieldProps = {
                            'field': fieldData
                        };

                        return (
                            <Col key={'col_' + field.name + '_' + index} {...field?.colConf}>
                                <FieldComponent key={'field_' + field.name + '_' + index} {...fieldProps} />
                            </Col>

                        );
                    })
                }
            </Row>
        )
    }

}

export default class DynamicForm extends Component< {} & Props, FormState> {

    constructor(props: Props | Readonly<Props>)
    {
        super(props);
        this.state = {
            formFields: props.formFields
        };
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    }

    forceUpdateHandler(){
        this.forceUpdate();
      };

    onFinish = (data: any) => {
        /**
         * Ritorna i dati prima di richiamare la callback
         * @hook ${this.props.module}_${this.props.type}_pre_on_filters_callback_data
         * @param data Dati del form
         * @param module:CrudModule Modulo
         */
        data = applyFilters(`${this.props.module}_${this.props.typeForm}_pre_on_filters_callback_data`, data, this.props.module);

        if (data) {
            /**
             * Ritorna la callback da richiamare successivamente
             * @hook ${this.props.module}_${this.props.type}_on_filters_callback
             * @param onFilters:Function Funzione callback 
             * @param module:CrudModule Modulo
             */
            const finish = applyFilters(`${this.props.module}_${this.props.typeForm}_on_filters_callback`, this.props.onFilters, this.props.module);
            const result = finish(data);

            if (result) {
                /**
                 * Esegue un azione in caso di successo della callback
                 * @hook ${this.props.module}_${this.props.type}_on_filters_callback_success
                 * @param data Dati del form
                 */
                applyActions(`${this.props.module}_${this.props.typeForm}_on_filters_callback_success`, data);
            } else {
                /**
                 * Esegue un azione in caso di errore della callback
                 * @hook ${this.props.module}_${this.props.type}_on_filters_callback_error
                 * @param data Dati del form
                 */
                applyActions(`${this.props.module}_${this.props.typeForm}_on_filters_callback_error`, data);
            }
        }
    }

    onReset = (formFields: FormRow[]) => {
        this.onFinish({});
        const updatedFormFields = formFields.map(({ fields, ...row }) => {
          return { ...row, fields: fields.map(({ defaultValue, initialValue, value, ...field }) => field) };
        });
        this.setState({ formFields: updatedFormFields });
    };

    onFieldsChange = (changedFields: any, allFields: any) => {
        
        /**
         * Ritorna i dati prima di renderizzare 
         * @hook ${this.props.module}_${this.props.typeForm}_on_change_state_fields
         * @param data Dati del form
         * @param module:CrudModule Modulo
         */
        const {formFields} = applyFilters(`${this.props.module}_${this.props.typeForm}_on_change_state_fields`, this.state.formFields, changedFields, allFields);

        this.setState({...formFields});
    }

    render()
    {
        const {formFields} = this.state;
        const {formConf} = this.props;

        return (
            <div className='container'>
                <Form onFinish={this.onFinish} onReset={() => this.onReset(formFields)} layout={formConf?.layout ?? "horizontal"} id={formConf?.id} onFieldsChange={this.onFieldsChange}>
                    {
                        (formFields).map((row: any, index: any) => {
                            return (
                                <DynamicFormRow key={'row-' + index} row={row}/>
                            );
                        })
                    }
                </Form>
            </div>
        )
    }
}




