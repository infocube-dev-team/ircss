import {Form, Select} from "antd";
import React, {Component} from "react";
import FieldProps, {FieldState} from "./FieldProps";


export default class SelectField extends Component<{} & FieldProps, FieldState> {

    constructor(props: FieldProps | Readonly<FieldProps>) {
        super(props);
        this.state = {};
    }

    render() {
        const {field} = this.props;
        return (

            <Form.Item
                label={field.label ?? field.name}
                name={field.name}
                rules={[
                    {
                        required: field.required,
                        message: field.requiredMessage,
                    },
                ]}
                initialValue={field?.initialValue}
            >
                <Select mode={field?.mode}  dropdownStyle={{visibility:field?.visibility}} defaultValue={field?.defaultValue} {...field} >
                    {field.selectValue?.map((el: any, index: any) => <Select.Option
                        key={'select_' + field.name + '_option_' + index} {...el}>{el.label}</Select.Option>)}
                </Select>
            </Form.Item>

        )
    }
}
