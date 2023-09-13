import { Form, Input } from "antd";
import React, { Component } from "react";
import FieldProps, {FieldState} from "./FieldProps";


export default class PasswordField extends Component<{} & FieldProps, FieldState> {

    constructor(props: FieldProps | Readonly<FieldProps>) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { field } = this.props;
        
        return (
       
            <Form.Item label={field?.label ?? field?.name} name={field?.name} rules={[{ required: field?.required, message: field?.requiredMessage},]} initialValue={field?.value}>
                <Input.Password   {...field} defaultValue= {field?.defaultValue} value={field?.value} disabled={field?.disabled} />
            </Form.Item>

        )
    }
}
