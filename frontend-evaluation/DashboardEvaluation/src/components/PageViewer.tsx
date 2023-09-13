import {Affix, Image, Layout} from "antd";
import React, { Component } from "react";
import { withRouter } from "react-router";
import { addFilter, applyFilters } from "../services/HooksManager";
import { navigate } from '../shared/router';
import { capitalize } from "lodash";
import environmentManager from "../services/EnvironmentManager";
import Breadcrumbs from "./Breadcrumbs";
import MenuComponent from "./MenuComponent";
import i18n, { __ } from "../translations/i18n";
import { Select } from 'antd';
import languageManager from "../services/LanguageManager";

interface Props {
    content: JSX.Element[]
    location: any,
    selectedKey: string
}

interface State {
    collapsed: boolean
}

const { Header, Sider } = Layout;

class PageViewer extends Component<{} & Props, State> {

    constructor(props: Props | Readonly<Props>) {
        super(props);
        this.state = {
            collapsed: true
        };

        addFilter('toolbar_menu', this.getUserDataForToolbar);
    }

    setCollapsed(value: any) {
        this.setState({
            collapsed: value
        });
    }

    getToolbar() {
        let toolbar: { key?: string, item: JSX.Element }[] = [];
        toolbar.push(
            {
                item: <img className="header-logo" src={environmentManager.getMainLogo()} alt="logo" />
            },
            {
                key: 'goHome',
                item: <span style={{ cursor: "pointer" }}
                    onClick={() => navigate('/dashboard')}> {environmentManager.getApplicationName()} </span>
            }
        );

        /**
         *  Cattura la toolbar eventualmente modificato dall'estensione
         *  @hook toolbar_menu
         *  @param toolbar: { key: string, item: JSX.Element }[] Array per la struttura della toolbar
         */
        return applyFilters('toolbar_menu', toolbar);
    }

    getUserDataForToolbar(toolbar: { key: string, item: JSX.Element }[]) {

        const userManager = environmentManager.getUserManager()

        let userProfile = {
            key: 'header-user-data',
            item:
                <><span> - {__('common.welcome')} </span><span className="username">{capitalize(userManager?.getSessionUser()?.firstName)} {capitalize(userManager?.getSessionUser()?.lastName)}</span></>
        }

        // check if item is present
        const index = toolbar.findIndex(object => object.key === userProfile.key);
        if (index === -1) {
            toolbar.push(userProfile);
        }

        return toolbar
    }

    getClassName = () => {
        const routeClassName = 'page-' + this.props.location.pathname.replace(/^\/|\/$/g, '').replace("/", '-');
        return routeClassName
    }

    setLanguage(lang: string) {
        languageManager.sendUpdate(lang);
    }

    render() {
        const { content, selectedKey } = this.props
        const currentLang = i18n.language;
        const defaultLang = currentLang.includes('-') ? currentLang.split('-')[0] : currentLang;

        return (
            <React.Fragment>
                <Layout style={{ minHeight: '100vh' }} className={this.getClassName()}>
                    <Layout className="site-layout">
                        <Affix>
                            <Header className={'header-toolbar'}>
                                {this.getToolbar().map((item: {
                                    key?: string;
                                    item: JSX.Element
                                }) =>
                                    item.key ? <div id={item.key} key={item.key}>{item.item}</div> : <React.Fragment key="key">{item.item}</React.Fragment>)
                                }
                            </Header>
                        </Affix>
                        <div id='contentContainer' style={{ marginTop: 10}}>
                            <Breadcrumbs></Breadcrumbs>
                            {content}
                        </div>
                    </Layout>
                    <Sider className='sider' collapsible collapsed={this.state.collapsed}
                        onCollapse={value => this.setCollapsed(value)}>
                        <div className="logo" />
                        <MenuComponent selectedKey={selectedKey} />
                        <Select
                          className="language-select"
                          defaultValue={defaultLang}
                          onChange={this.setLanguage}
                          options={[
                            { label: "🇮🇹 IT", value: "it" },
                            { label: "🇬🇧 EN", value: "en" }
                          ]}
                        />
                    </Sider>
                </Layout>
            </React.Fragment>
        )
    }
}

// @ts-ignore
export default withRouter(PageViewer);
// export default PageViewer
