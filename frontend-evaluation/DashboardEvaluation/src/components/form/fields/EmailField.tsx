import { Form, Input } from "antd";
import React, { Component } from "react";
import FieldProps, {FieldState} from "./FieldProps";
import { __ } from "../../../translations/i18n";


export default class EmailField extends Component<{} & FieldProps, FieldState> {

    constructor(props: FieldProps | Readonly<FieldProps>) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { field } = this.props;
        
        return (
          <Form.Item
            label={field?.label ?? field?.name}
            name={field?.name}
            rules={[
              { 
                required: field?.required, 
                message: field?.requiredMessage 
              },
              {
                pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: __('common.emailErrorMsg')
              }
            ]}
            initialValue={field?.value}
          >
            <Input
              type="email"
              {...field}
              defaultValue={field?.defaultValue}
              value={field?.value}
              disabled={field?.disabled}
            />
          </Form.Item>
        );
    }
}
