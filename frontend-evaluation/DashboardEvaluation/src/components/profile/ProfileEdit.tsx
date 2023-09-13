import { __ } from "../../translations/i18n";
import DynamicForm, { FormRow } from "../form/DynamicForm";
import userManager from "../../services/UserManager";
import { Card, Col, Row } from "antd";
import ObjectUtils from "../../utils/ObjectUtil";
import { ArgsProps } from "antd/lib/notification/interface";
import { toast } from "../../services/NotificationManager";
import userDataProviderImp from "../../providers/implementation/UserDataProviderImp";
import { ProfileData } from "../../models/User";

const ProfileEdit = () => {

    const userData = userManager.getSessionUser()

    const getFields = (): FormRow[] => {

        return [
            {
                fields: [
                    {
                        name: 'login',
                        label: __ ( 'users.fields.email' ),
                        type: 'text',
                        required: true,
                        defaultValue: userData?.login,
                        value: userData?.login,
                        colConf: {
                            span: 24
                        }
                    },
                    {
                        name: 'firstName',
                        label: __ ( 'users.fields.firstName' ),
                        type: 'text',
                        required: true,
                        defaultValue: userData?.firstName,
                        value: userData?.firstName,
                        colConf: {
                            span: 12
                        }
                    },
                    {
                        name: 'lastName',
                        label: __ ( 'users.fields.lastName' ),
                        type: 'text',
                        required: true,
                        defaultValue: userData?.lastName,
                        value: userData?.lastName,
                        colConf: {
                            span: 12
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
                        label: __( 'common.edit' ),
                        type: 'button',
                        htmlType: 'submit',
                        colConf: { span: 3, offset: 9 }
                    }
                ]
            }
        ];
    }

    const EditfieldList: FormRow[] = getFields();

    const sendUpdate = ( dataForm: any ) => {

        // get data from form
        dataForm = ObjectUtils.filterIfValueIsEmpty ( dataForm );

        const updatedMe: ProfileData = {
            login: dataForm.login,
            firstName: dataForm.firstName,
            lastName: dataForm.lastName
        }

        userDataProviderImp.updateMe(
            updatedMe
        ).then(async () => {
            await userManager.reloadLoggedUser();
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

export default ProfileEdit;