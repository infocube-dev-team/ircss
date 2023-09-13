
import { Form, Switch } from "antd";
import React, {Component} from "react";
import FieldProps, {FieldState} from "./FieldProps";


export default class SwitchField extends Component<{} & FieldProps, FieldState> {

    constructor(props: FieldProps | Readonly<FieldProps>) {
        super(props);
        this.state = {};
    }

    render() {
        const {field} = this.props;
        return (
            <Form.Item label={field?.label ?? field?.name} name={field?.name} rules={[{ required: field?.required, message: field?.requiredMessage},]} initialValue={field?.value}>
                <Switch disabled={field.disabled ?? false} onChange={field.onChange()} {...field} />
            </Form.Item>
        )
    }
}