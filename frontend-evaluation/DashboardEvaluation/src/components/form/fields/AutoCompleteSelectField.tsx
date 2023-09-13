import {Form, Select, Spin} from "antd";
import React from "react";
import debounce from "lodash";
import FieldProps from "./FieldProps";

interface Prop {
    fetchOptions: Function
    onSelect?: any
    debounceTimeout: number,
    filterOption?: any,
    allowClear?: boolean
}

export default function AutoCompleteSelectField(props: FieldProps & {field: Prop}) {

    const {field} = props;
    const fetchOptions = field.fetchOptions
    const onSelect = field && typeof field.onSelect === 'function' ? field.onSelect : () => null;
    const debounceTimeout  = field.debounceTimeout;
    const [fetching, setFetching] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const fetchRef = React.useRef(0);

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value: string) => {

            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);

            fetchOptions(value).then((newOptions: any) => {

                if (fetchId !== fetchRef.current) {
                    return;
                }

                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce.debounce(loadOptions, debounceTimeout);

    }, [fetchOptions, debounceTimeout]);

    const onFocusFunction =() => {
        debounceFetcher('');
    }


    return (

        <Form.Item label={field.label ?? field.name} name={field.name}
                   rules={[{required: field.required, message: field.requiredMessage,},
                   ]}
                   initialValue={field?.initialValue}>
            <Select
                disabled={field.disabled}
                showSearch
                filterOption={field.filterOption ?? false}
                onSearch={debounceFetcher}
                notFoundContent={fetching ? <Spin size="small" /> : null}
                options={options}
                mode={field.mode ?? ''}
                onFocus={onFocusFunction}
                allowClear={field.allowClear ?? false}
                onSelect={onSelect} />
        </Form.Item>

    )

}
