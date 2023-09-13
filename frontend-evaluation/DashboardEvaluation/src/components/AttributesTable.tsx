import type { InputRef } from 'antd';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { __ } from '../translations/i18n';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    value: string;
}

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();

    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};



interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

export type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
    key: React.Key;
    value: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const AttributesTable: React.FC<{column?: any, dataSourceProps?: any}> = (columnConf) => {

    const [dataSource, setDataSource] = useState<any>([]);
    const [columnsTable, setColumnsTable] = useState<any>([]);

    const deleteColumn = {
        title: 'Operation',
        dataIndex: 'operation',
        //@ts-ignore//
        render: (_,record: { key: string }) =>
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                    <a>{__('common.delete')}</a>
                </Popconfirm>
    };

    useEffect(() => {
       
        if (!!columnConf.column) {

            if (!columnConf.column.includes(deleteColumn)) {
                columnConf.column.push(deleteColumn);
            }

            let mapColumn = columnConf.column?.map( (col: any) => {
                if (!col.editable) {
                    return col;
                }
        
                return {
                    ...col,
                    onCell: (record: any) => ({
                        record,
                        editable: col.editable,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        handleSave,
                    }),
                };
            }) 

            setColumnsTable(mapColumn);
        } else {
            let mapColumn = defaultColumns.map(col => {
                if (!col.editable) {
                    return col;
                }
                return {
                    ...col,
                    onCell: (record: DataType) => ({
                        record,
                        editable: col.editable,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        handleSave,
                    }),
                };
            });
            setColumnsTable(mapColumn);
        }

        if (!!columnConf?.dataSourceProps) {
            setDataSource(columnConf?.dataSourceProps);
        }

    }, [])

    const [count, setCount] = useState(2);

    const handleDelete = (key: string) => {
        console.log('key', key);
        // console.log(dataSource.indexOf({idTable}));
        // const indexOfObject = dataSource.findIndex((object: any) => {
        //     return object.idTable === idTable;
        // });
        // console.log(indexOfObject);
        const newData = dataSource.filter( (item: any) => item.key !== key);
        setDataSource(newData);
    };

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: 'Key',
            dataIndex: 'key',
            editable: true,
        },
        {
            title: 'Value',
            dataIndex: 'value',
            editable: true,
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            //@ts-ignore//
            render: (_,record: { key: string }) =>
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                        <a>{__('common.delete')}</a>
                    </Popconfirm>
        },
    ];

    const handleAdd = async () => {
        if (!!columnsTable) {
            // let newData: any = {};
            // columnsTable.forEach( (col: any) => {
            //     if (col.dataIndex !== 'operation') {
            //         let keyObj = {
            //             [col.dataIndex]: `${__('common.table.changeMe')} ${count}`
            //         }
            //         newData = {...newData, ...keyObj}
            //     }
            // });

            // const newData = columnsTable.map( (col: any) => {
            //     console.log(col);
            //     if (col.dataIndex !== 'operation') {
            //         let keyObj = {
            //             [col.dataIndex]: `${__('common.table.changeMe')} ${count}`
            //         }
            //         return {...keyObj}
            //     }
            // });

            const newData = await columnsTable.reduce((o: any, key: any) => ({ ...o, [key.dataIndex]: `${__('common.table.changeMe')} ${key.title} ${count}`}), {});

            // const newData = {
            //     key: `NEW KEY ${count}`,
            //     value: `NEW VALUE ${count}`
            // }
            setDataSource([...dataSource, newData]);
            console.log(dataSource);
            setCount(count + 1);
        }
    };

    const handleSave = (row: any) => {
        console.log('save');
        const newData = [...dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        console.log(newData);
        setDataSource(newData);
    };

    const handleChange = (data: any) => {
        console.log(data)
    }

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    return (
        <div>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={[...dataSource]}
                columns={columnsTable as ColumnTypes}
                onChange={handleChange}
            />
            <br />
            <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>{__('common.addRow')}</Button>
            {/* <Button onClick={() => console.log(dataSource)} type="primary" style={{ marginBottom: 16 }}>Prova</Button> */}
        </div>
    );
};

export default AttributesTable;