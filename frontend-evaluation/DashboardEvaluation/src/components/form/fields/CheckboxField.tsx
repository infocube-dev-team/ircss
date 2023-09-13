import { Checkbox, Form, Table } from "antd";
import React, {Component} from "react";
import FieldProps, {FieldState} from "./FieldProps";

export default class CheckboxField extends Component<{} & FieldProps, FieldState> {

    constructor(props: FieldProps | Readonly<FieldProps>) {
        super(props);
        this.state = {};
    }
    

    render() {
        const {field} = this.props;
        return (
            

            <Form.Item
                initialValue={field?.value}
                label={field?.label ?? field?.name}
                valuePropName="checked"
                name={field?.name}
                rules={[
                    {
                        required: field?.required,
                        message: field?.requiredMessage,
                    },
                ]}
            >
                <Checkbox checked={field?.defaultValue} value={field?.value} {...field} />
            </Form.Item>
        )
    }
}