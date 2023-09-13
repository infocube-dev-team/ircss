import {LogoutOutlined} from "@ant-design/icons";
import {__} from "../translations/i18n";
import {addFilter} from "../services/HooksManager";
import LoginPage from "../pages/LoginPage";
import environmentManager from "../services/EnvironmentManager";
import { MenuNode } from "../components/MenuComponent";
import ParentModule from "../shared/module/CrudModule";
import Login from "../pages/Login";

class LoginModule extends ParentModule {

    init = () => {
        addFilter('app_menu', this.addMenu);

        addFilter('app_routes', (routes: any) => {
            if(environmentManager.isSsoLogin()){
                routes[this.getRoute()] = {component: Login, public: true, visibility: 'public'};
                routes['/loginPage'] = {component: LoginPage, public: true, visibility: 'public'};
            } 
            else {
                routes[this.getRoute()] = {component: LoginPage, public: true, visibility: 'public'};
            }
            return routes;
        }, 10);
    }

    addMenu = (menu: MenuNode[]) => {

        menu.push({
            label: __('menu.logout'),
            icon: <LogoutOutlined />,
            position: '999',
            key: 'logout'
        });

        return menu;
    }

    getModuleKey = (): string => {
        return "login";
    }

}

const module = new LoginModule();
export default module;
