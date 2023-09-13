import { __ } from "../../translations/i18n";
import DynamicForm, { FormRow } from "../form/DynamicForm";
import userManager from "../../services/UserManager";
import { Card, Col, Row } from "antd";
import ObjectUtils from "../../utils/ObjectUtil";
import { ArgsProps } from "antd/lib/notification/interface";
import { toast } from "../../services/NotificationManager";
import userDataProviderImp from "../../providers/implementation/UserDataProviderImp";
import { PasswordData } from "../../models/User";

const PasswordChange = () => {

    const getFields = (): FormRow[] => {

        return [
            {
                fields: [
                    {
                        name: 'currentPassword',
                        label: __ ( 'users.fields.currentPassword' ),
                        type: 'password',
                        required: true,
                        colConf: {
                            span: 24
                        }
                    },
                    {
                        name: 'newPassword',
                        label: __ ( 'users.fields.newPassword' ),
                        type: 'password',
                        required: true,
                        colConf: {
                            span: 24
                        }
                    }
                ]
            },
            {
                style: {
                    className: "buttonForm"
                },
                fields: [
                    {
                        name: 'editUser',
                        label: __( 'menu.profile.changePassword' ),
                        type: 'button',
                        htmlType: 'submit',
                        colConf: { span: 4, offset: 8 }
                    }
                ]
            }
        ];
    }

    const EditfieldList: FormRow[] = getFields();

    const sendUpdate = ( dataForm: any ) => {

        // get data from form
        dataForm = ObjectUtils.filterIfValueIsEmpty ( dataForm );

        const userData = userManager.getSessionUser()

        const passwordData: PasswordData = {
            email: userData!.login,
            currentPassword: dataForm.currentPassword,
            newPassword: dataForm.newPassword
        }

        userDataProviderImp.changePassword(
            passwordData
        ).then(() => {
            successToast(__("common.successfulOperation"));
        }
        )
        
    }

    const successToast = (message: string): any => {
        const config: ArgsProps = {
            message: `${message}`,
            description:``,
            type: 'success',
            placement: 'bottomRight'
        }
        return toast(config);
    }
   
    return (
        <Row gutter={[24, 24]} justify={"center"}>
            <Col span={10}>
                <Card style={{ marginTop: 150 }}>
                    <DynamicForm formFields={EditfieldList} onFilters={sendUpdate} module={"settings"} typeForm={"form"} formConf={{layout: "vertical"}}/>
                </Card>
            </Col>
        </Row>
    );
    
}

export default PasswordChange;