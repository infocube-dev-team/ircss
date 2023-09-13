import { Form } from "antd";
import { PickerDateProps } from "antd/lib/date-picker/generatePicker";
import React, {Component} from "react";
import FieldProps, {FieldState} from "./FieldProps";
import type { Moment } from 'moment';
import {MyDatePicker as DatePicker} from "./DatePicker";

export default class DateField extends Component<{} & FieldProps, FieldState> {

    constructor(props: FieldProps | Readonly<FieldProps>) {
        super(props);
        this.state = {};
    }

    render() {
        const {field} = this.props;
        let datapicker = Object.assign({}, field);

        delete datapicker.colConf

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
            >
                {<DatePicker {...datapicker as PickerDateProps<Moment>} {...field} />}
            </Form.Item>
        )
    }
}
