import {Button, Card, Checkbox, Col, Form, Input, Modal, Row} from "antd";
import React, {Component} from "react";
import userManager from "../services/UserManager";
import {__} from "../translations/i18n";
import environmentManager from "../services/EnvironmentManager";
import Link from "antd/lib/typography/Link";
import type {FormInstance} from "antd/es/form";
import {errorToast, infoModal, successToast} from "../services/NotificationManager";
import {
    InfoCircleTwoTone,
    LockOutlined,
    LoginOutlined,
    SendOutlined,
    SettingTwoTone,
    UserOutlined
} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import {getQueryParams, navigate} from "../shared/router";
import {applyActions, applyFilters} from "../services/HooksManager";
import {Header} from "antd/lib/layout/layout";
import ErrorUtils from "../utils/ErrorUtils";

interface IProps { }

interface IState {
    username: string;
    password: string;
    remindMe: boolean;
    credentialError: boolean;
    openRecoverModal: boolean;
    openActivationModal: boolean;
    showNewPswForm: boolean;
}

class LoginPage extends Component<IProps, IState> {
    formRef = React.createRef<FormInstance>();
    activationToken: string = '';
    usernameQueryParams = null;

    activationTokenParamName = 'activation_token';
    usernameParamName = 'username';

    __activationTokenParamNameFilter() {
        return applyFilters('activation_token_param_name_filter', this.activationTokenParamName);
    }

    __usernameParamNameFilter() {
        return applyFilters('username_param_name_filter', this.usernameParamName);
    }
    recoverPassword: boolean = true

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: "",
            password: "",
            remindMe: false,
            credentialError: false,
            openRecoverModal: false,
            openActivationModal: false,
            showNewPswForm: false
        };

        // addFilter('activation_user_modal_filter', this.activationUserModal);
        // addFilter('recover_user_password_modal_filter', this.recoverUserPasswordModal);
        const queryParams = getQueryParams();
        this.activationToken = queryParams[this.__activationTokenParamNameFilter()];
        this.usernameQueryParams = queryParams[this.__usernameParamNameFilter()];
    }

    async componentDidMount() {
        if (this.activationToken) {
            this.setState({openActivationModal: true});
        }
    }

    onChangeUsername(value: string) {
        this.setState({ username: value });
    }

    onChangePassword(value: string) {
        this.setState({ password: value });
    }

    onChangeRemindMe(value: boolean) {
        this.setState({ remindMe: value });
    }

    __getRecoverPassword() {
        return applyFilters('login_recover_password_visible', this.recoverPassword);
    }

    onReset = () => {
        this.formRef.current!.resetFields();
    };

    sendLogin() {
        if (this.state.username && this.state.password) {
            userManager
                .doLogin(this.state.username, this.state.password, this.state.remindMe)
                .then((login) => {
                    if (login) {

                        /**
                         * Applica un azione dopo aver effetuato Login e prima del Reload dell'App
                         * @hook action_after_login_pre_reload
                         */
                        applyActions('action_after_login_pre_reload');

                        // effettua reload dell'app
                        environmentManager.reload();

                        /**
                         * Applica azione dopo aver effettuato Login e dopo Reload dell'App
                         * @hook action_after_login_post_reload
                         */
                        applyActions('action_after_login_post_reload');
                    } else {
                        this.onReset();
                        errorToast(__("error.unauthorized"), __("login.failed"));
                    }
                });
        }
    }

    getLogo = () => {
        return environmentManager.getMainLogo();
    };

    sendRecoverPassword = async (data: any) => {
        const provider  = environmentManager.getUserDataProvider();
        const goToFinish = () => this.setState({ showNewPswForm: true});
        ErrorUtils.catchError(provider.recoverPassword(data.email), __('login.recover_init_success'), goToFinish);
    }

    recoverPswFinish = async (data: any) => {
        const provider  = environmentManager.getUserDataProvider();
        const goBack = () => this.setState({ openRecoverModal: false, showNewPswForm: false});
        ErrorUtils.catchError(provider.recoverPasswordFinish(data.key, data.newPassword), __('login.recover_finish_success'), goBack);
    }

    showModal() {
        infoModal({
            title: environmentManager.getApplicationName(),
            content: (<div>{environmentManager.getVersion()}<p> {__('menu.modal.copyright')} </p></div>)
        })
    };

    async activateUser(data: any, activationToken: any, username: any) {
        if (data.password !== data.confirmPassword) {
            errorToast(__('error.error'), __('users.add.errorPasswordMatch'));
        } else {
            const provider = environmentManager.getDataProvider();
            const request = {
                username: username,
                password: data.password,
                token: activationToken
            }
            const res = await provider.addOne({
                params: request,  headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }}, 'users/activate');

            if (res) {
                this.setState({ username: data.username, password: data.password});
                this.sendLogin();
            }
        }

    }

    closeActivationModal() {
        this.setState({ openActivationModal: false});
        navigate('/login');
    }


    getHeaderLogo = () => {
        return environmentManager.getHeaderLogo();
    }

    render() {
        const { openRecoverModal, openActivationModal, showNewPswForm } = this.state;

        return (
            <div className="App">
                {/* <Header>
                  <img className="header-logo" src={this.getHeaderLogo()} alt="logo" />
                </Header> */}
                <div className="login-header">
                    <img src={this.getLogo()} alt="logo" />
                </div>
                <Row gutter={[24, 24]} justify={"center"} style={{ marginTop: 20 }}>
                    <Col span={10}>
                        <Card>
                            <Form
                                ref={this.formRef}
                                name="basic"
                                autoComplete="off"
                                layout="vertical"
                            >
                                <Col span={24}>
                                    <Form.Item
                                        label={__("login.username")}
                                        name="username"
                                        rules={[
                                            {
                                                required: true,
                                                message: __("login.mandatory_username"),
                                            },
                                        ]}
                                    >
                                        <Input
                                            onChange={(event) =>
                                                this.onChangeUsername(event.target.value)
                                            }
                                            prefix={<UserOutlined className="site-form-item-icon" />}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        label={__("login.password")}
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: __("login.mandatory_password"),
                                            },
                                        ]}
                                    >
                                        <Input.Password
                                            onChange={(event) =>
                                                this.onChangePassword(event.target.value)
                                            }
                                            prefix={<LockOutlined className="site-form-item-icon" />}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    {this.__getRecoverPassword() && <div style={{ marginBottom: 10 }}>
                                        <Link onClick={() => this.setState({ openRecoverModal: true })}>{__("login.forgot_password")}</Link>
                                    </div>}

                                    <Form.Item name="remember" valuePropName="checked">
                                        <Checkbox
                                            onChange={(event) =>
                                                this.onChangeRemindMe(event.target.checked)
                                            }
                                        >
                                            {__("login.remember_me")}
                                        </Checkbox>
                                    </Form.Item>
                                </Col>

                                <Row gutter={[24, 24]} justify="center">
                                    <Col>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                disabled={openActivationModal}
                                                onClick={() => this.sendLogin()}
                                                icon={<LoginOutlined />}
                                                block
                                            >
                                                {__("login.sign_in")}
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    </Col>
                </Row>

                <Modal open={openRecoverModal} onCancel={() => this.setState({ openRecoverModal: false, showNewPswForm: false })} width={850} centered footer={false}>
                    {
                        !showNewPswForm 
                        ?     
                            <React.Fragment>
                                <Row gutter={[24, 24]} justify={"center"}>
                                    <Col span={20} style={{ textAlign: "center" }}>
                                        <Title level={3}>{__('login.recover_password_title')}</Title>
                                        <Title level={5} italic style={{ color: "grey" }}>{__('login.recover_password_subtitle')}</Title>
                                    </Col>
                                </Row>

                                <Row gutter={[24, 24]} justify={"center"} style={{ marginTop: 20}}>
                                    <Col span={18}>
                                        <Form layout="vertical" onFinish={this.sendRecoverPassword}>

                                            <Form.Item rules={[{ required: true, message: __("login.mandatory_email") }]} label={__('login.fields.email')} name={'email'}>
                                                <Input type="email" />
                                            </Form.Item>

                                            <Form.Item style={{textAlign: 'center'}}>
                                                <Button type="primary" htmlType="submit" block icon={<SendOutlined />}>{__('login.fields.send')}</Button>
                                            </Form.Item>

                                        </Form>
                                    </Col>
                                </Row>
                            </React.Fragment>
                        :
                            <React.Fragment>
                                <Row gutter={[24, 24]} justify={"center"}>
                                    <Col span={20} style={{ textAlign: "center" }}>
                                        <Title level={3}>{__('login.new_password_form_title')}</Title>
                                    </Col>
                                </Row>
                                <Row gutter={[24, 24]} justify={"center"} style={{ marginTop: 20}}>
                                        <Col span={18}>
                                            <Form layout="vertical" onFinish={this.recoverPswFinish}>

                                                <Form.Item rules={[{ required: true, message: __("login.mandatory_key") }]} label={__('login.fields.key')} name={'key'}>
                                                    <Input type="text" />
                                                </Form.Item>

                                                <Form.Item rules={[{ required: true, message: __("login.mandatory_password") }]} label={__('users.fields.newPassword')} name={'newPassword'}>
                                                    <Input type="password" />
                                                </Form.Item>

                                                <Form.Item style={{textAlign: 'center'}}>
                                                    <Button type="primary" htmlType="submit" block icon={<SendOutlined />}>{__('login.fields.send')}</Button>
                                                </Form.Item>

                                            </Form>
                                        </Col>
                                    </Row>
                            </React.Fragment>
                    }
                </Modal>

                {/*{openRecoverModal && applyFilters('recover_user_password_modal_filter', <></>)}*/}
                {/*{openActivationModal && applyFilters('activation_user_modal_filter', <></>)}*/}
                <Modal open={openActivationModal} onCancel={() => this.closeActivationModal()} width={700} centered footer={false}>
                    <Row gutter={[24, 24]} justify={"center"}>
                        <Col span={20} style={{ textAlign: "center" }}>
                            <Title level={3}>{__('login.activation_user_title')}</Title>
                        </Col>
                        <Col span={20} style={{ textAlign: "center" }}>
                            <Title level={5} italic style={{ color: "grey" }}>{__('login.activation_user_subtitle')}</Title>
                        </Col>
                    </Row>

                    <Row gutter={[24, 24]} justify={"center"} style={{ marginTop: 20}}>
                        <Col span={18}>
                            <Form layout="vertical" onFinish={(data: any) => this.activateUser(data, this.activationToken, this.usernameQueryParams)}>
                                <Form.Item rules={[{ required: true, message: __("login.mandatory_password") }]} label={__('login.password')} name={'password'}>
                                    <Input.Password
                                        placeholder={__("login.placeholder.input_password")}
                                    />
                                </Form.Item>

                                <Form.Item rules={[{ required: true, message: __("login.mandatory_confirm_password") }]} label={__('login.confirm_password')} name={'confirmPassword'}>
                                    <Input.Password
                                        placeholder={__("login.placeholder.input_confirm_password")}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block icon={<SendOutlined />}>{__('login.fields.send')}</Button>
                                </Form.Item>

                            </Form>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default LoginPage;
