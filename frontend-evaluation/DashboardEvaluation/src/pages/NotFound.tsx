import { Layout } from 'antd';
import React from 'react';
import EnvironmentManager from "../services/EnvironmentManager";
import {__} from "../translations/i18n";

const { Content } = Layout;

const NotFound: React.FC = () => {

    return (
        <Content className='not-found'>
            <h1>{__('common.not_found')}</h1>
        </Content>
    );
}

export default NotFound;
