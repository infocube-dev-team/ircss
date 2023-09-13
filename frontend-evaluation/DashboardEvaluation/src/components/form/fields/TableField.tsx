import { Table, Button } from "antd";
import { Component } from "react";
import FieldProps, { FieldState } from "./FieldProps";
import {PlusOutlined} from "@ant-design/icons";

export default class TableField extends Component<{} & FieldProps, FieldState> {

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
                {
                    field.addRow && 
                    <Button icon={<PlusOutlined/>} onClick={field.addRow} style={{ marginBottom: 16 }}>{field.addRowLabel || ''}</Button>
                }
                <Table 
                    style={field.styles}
                    pagination={field.pagination}
                    columns={field.columns}
                    dataSource={dataSource}
                />
            </>
        )
    }
}
