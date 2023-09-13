import { Layout } from 'antd';
import React from 'react';
import EnvironmentManager from "../services/EnvironmentManager";

const { Content } = Layout;

const Dashboard: React.FC = () => {

    return (
        <Content className='dashboard'>
            <div className='dashboard__bg'></div>
            <h1>WELCOME</h1>
        </Content>
    );
}

export default Dashboard;
