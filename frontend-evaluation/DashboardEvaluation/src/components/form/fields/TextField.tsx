import { Form, Input } from "antd";
import React, { Component } from "react";
import FieldProps, {FieldState} from "./FieldProps";


export default class TextField extends Component<{} & FieldProps, FieldState> {

    constructor(props: FieldProps | Readonly<FieldProps>) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { field } = this.props
        
        return (
          <Form.Item
            label={field?.label ?? field?.name}
            name={field?.name}
            rules={[
              { required: field?.required, message: field?.requiredMessage },
              {
                pattern: field.pattern,
                message: field.patternErrorMsg
              }
            ]}
            initialValue={field?.value}
          >
            <Input
              defaultValue={field?.defaultValue}
              type={field?.textType}
              value={field?.value}
              disabled={field?.disabled}
            />
          </Form.Item>
        );
    }
}
