import { Form } from "antd";
import { PickerDateProps } from "antd/lib/date-picker/generatePicker";
import React, {Component} from "react";
import FieldProps, {FieldState} from "./FieldProps";
import type { Moment } from 'moment';
import { MyDateRangePicker } from "./DatePicker"; // Import the custom DateRangePicker

export default class DateRangeField extends Component<{} & FieldProps, FieldState> {

    constructor(props: FieldProps | Readonly<FieldProps>) {
        super(props);
        this.state = {};
    }

    render() {
        const {field} = this.props;
    
        const {colConf, editTableConf, ...restProps} = field;
    
        return (
            <Form.Item
                label={restProps.label ?? restProps.name}
                name={restProps.name}
                rules={[
                    {
                        required: restProps.required,
                        message: restProps.requiredMessage,
                    },
                ]}
            >
                <MyDateRangePicker {...restProps} />
            </Form.Item>
        );
    }    
}
