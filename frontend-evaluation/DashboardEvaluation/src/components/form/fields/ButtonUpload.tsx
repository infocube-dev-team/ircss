import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Upload } from "antd";
import { Component } from "react";
import EnvironmentManager from "../../../services/EnvironmentManager";
import { errorModal, successToast } from "../../../services/NotificationManager";
import { __ } from "../../../translations/i18n";
import UploadUtils from "../../../utils/UploadUtils";
import FieldProps, { FieldState } from "./FieldProps";


export default class ButtonUpload extends Component<{} & FieldProps, FieldState> {

    constructor( props: FieldProps | Readonly<FieldProps> ) {
        super ( props );
        this.state = {};
    }


    showModal(error:[]) {
        errorModal({
            title: EnvironmentManager.getApplicationName(),
            content: (<div dangerouslySetInnerHTML={{__html: error.join('</br>')}}></div>)
        })
    };

    render() {

        const { field } = this.props;

        const props = Object.assign({
            multiple: false,
            name: 'file',

            onChange: (info: any) => {

                const {status} = info.file;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    successToast(__('common.success'),`${ info.file.name } ${__('common.import_success')}.`);
                } else if (status === 'error') {
                    this.showModal(info.fileList[0]?.response ?? [] )
                }
            }
        }, UploadUtils.getUploadRequest(field.action));


        return (

            <Form.Item
                name={ field.name }
                rules={ [
                    {
                        required: field.required,
                        message: field.requiredMessage,
                    },
                ] }
            >
                <Upload { ...props }>
                    <Button icon={ <UploadOutlined/> }>{field.name}</Button>
                </Upload>
            </Form.Item>
        )
    }
}
