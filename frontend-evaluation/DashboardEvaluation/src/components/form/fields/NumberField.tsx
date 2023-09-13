import { Form, InputNumber } from "antd";
import React, { Component } from "react";
import FieldProps, { FieldState } from "./FieldProps";


export default class NumberField extends Component<{} & FieldProps, FieldState> {

    constructor( props: FieldProps | Readonly<FieldProps> ) {
        super ( props );
        this.state = {};
    }

    render() {
        const { field } = this.props;
        return (
          <Form.Item
            label={field.label ?? field.name}
            name={field.name}
            rules={[
              { required: field.required, message: field.requiredMessage },
            ]}
            initialValue={field?.value}
          >
            <InputNumber
              min={field?.min}
              max={field?.max}
              defaultValue={field?.defaultValue}
              value={field?.value}
              {...field}
            />
          </Form.Item>
        );
    }
}
