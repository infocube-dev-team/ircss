import React, {Component} from 'react';
import {Router, Switch, Route, Redirect} from 'react-router-dom'
import {Helmet, HelmetProvider} from 'react-helmet-async';
import environmentManager from "../services/EnvironmentManager";
import {history} from '../shared/router'
import { Spin } from 'antd';

interface Props {
    children?: React.ReactNode | JSX.Element | React.ReactNode[] | JSX.Element[]
}

interface State {
    initialized: boolean
    reload: number
}

class DBApp extends Component<Props, State> {

    constructor(props: Readonly<Props> | Props) {
        super(props);
        this.state = {
            initialized: false,
            reload: 0
        }

    }

    reload = () => {
        this.setState(Object.assign(this.state, {reload: this.state.reload + 1}))
    }

    async componentDidMount(): Promise<void> {

        await environmentManager.init();

        // Condivido reload
        environmentManager.setEnv('reload', this.reload)

        this.setState(Object.assign(this.state, {initialized: true}));
    }

    render() {

        const helmetContext = {}

        if(this.state.initialized) {

            return (
                <React.Fragment>
                    <HelmetProvider context={helmetContext}>
                        <Helmet>
                            <title>{environmentManager.getApplicationName()}</title>
                            <meta name="description" content={environmentManager.getApplicationName()}/>
                        </Helmet>
                    </HelmetProvider>
                    <Router history={history}>
                        <Switch>
                            {Object.entries(environmentManager.getRoutes())
                                .map(([path, route]) => {
                                    const RouteComponent = route.component
                                    return <Route path={path} key={path} exact>
                                        <RouteComponent {...route?.props}/>
                                    </Route>
                                })}
                            <Redirect to={environmentManager.getDefaultRoute()}/>
                        </Switch>
                    </Router>
                </React.Fragment>
            );

        } else {
            return <div id={"loader-container"} className="loader-container" style={{display: "flex", justifyContent: "center", alignItems: "center", height: "80vh"}}><Spin /></div>
        }
    }
}

export default DBApp;
