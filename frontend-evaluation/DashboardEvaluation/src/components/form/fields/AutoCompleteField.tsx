import {AutoComplete, Form} from "antd";
import React from "react";
import debounce from "lodash";
import FieldProps from "./FieldProps";

interface Prop {
    fetchOptions: Function
    debounceTimeout: number
}

export default function AutoCompleteField(props: FieldProps & {field: Prop}) {

    const {field} = props;
    const fetchOptions = field.fetchOptions
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


    return (

        <Form.Item label={field.label ?? field.name} name={field.name}
                   rules={[{required: field.required, message: field.requiredMessage,},
                   ]}>
            <AutoComplete
                filterOption={false}
                onSearch={debounceFetcher}
                options={options}
                {...field} />
        </Form.Item>

    )

}
