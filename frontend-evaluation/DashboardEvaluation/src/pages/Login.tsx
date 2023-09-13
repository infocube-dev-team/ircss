import { LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Row } from "antd";
import Title from "antd/lib/typography/Title";
import { Component } from "react";
import EnvironmentManager from "../services/EnvironmentManager";
import { navigate } from "../shared/router";
import { __ } from "../translations/i18n";
import { Header } from "antd/lib/layout/layout";

export default class Login extends Component<{}> {

    goToLoginWithCredentials() {
        navigate('/loginPage');
    }

    goToSsoLogin() {
        if(EnvironmentManager.isSsoLogin()){
            window.location.replace(EnvironmentManager.getSsoLogin())
        } 
    }

    getLogo = () => {
        return EnvironmentManager.getMainLogo();
    }
    
    render() {

        return (
            <div className="App">
                <Row gutter={[24, 24]} justify='center'>
                    <Col span={24}>
                        <header className="login-header">
                            <img src={this.getLogo()} className='App-logo' alt="logo" />
                        </header>
                    </Col>
                    <Col span={10}>
                        <Card style={{ 'textAlign': 'center' }}>
                            <Col span={24} style={{paddingBottom: 30}}>
                                <Title level={4}>{__('loginSSO.label')}</Title>
                            </Col>
                            <Row justify={'center'}>
                                <Col span={16}>
                                    <Button type="ghost" htmlType="submit" onClick={this.goToLoginWithCredentials} block={true} icon={<LoginOutlined />}>
                                        {__('loginSSO.with_credentials')}
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
            
        )
    }
}