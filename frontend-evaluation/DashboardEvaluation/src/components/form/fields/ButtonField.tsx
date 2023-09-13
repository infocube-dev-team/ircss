import {Form, Button} from "antd";
import React, {Component} from "react";
import FieldProps, {FieldState} from "./FieldProps";


export default class ButtonField extends Component<{} & FieldProps, FieldState> {

    constructor(props: FieldProps | Readonly<FieldProps>) {
        super(props);
        this.state = {};
    }

    render() {
        const {field} = this.props;
        return (

            <Form.Item
                name={field.name}
                rules={[
                    {
                        required: field.required,
                        message: field.requiredMessage,
                    },
                ]}
            >
                <Button className="btn-form" htmlType={field.htmlType ?? 'button'} {...field} type={field.buttonType ?? "primary"}>
                    {field.label ?? field.name}
                </Button>
            </Form.Item>
        )
    }
}
