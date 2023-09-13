import { Form, Table } from "antd";
import React, { Component } from "react";
import FieldProps, { FieldState } from "./FieldProps";

export default class TableSelectField extends Component<{} & FieldProps, FieldState> {

    constructor(props: FieldProps | Readonly<FieldProps>) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { field } = this.props;
        const dataSource = field.getData() || [];

        return (
            <>
                <Table 
                    style={field.styles}
                    pagination={field.pagination}
                    rowSelection={{...field.rowSelection}}
                    rowKey={(record) => record[field.rowKey]}
                    columns={field.columns}
                    dataSource={dataSource}
                />
            </>
        )
    }
}
