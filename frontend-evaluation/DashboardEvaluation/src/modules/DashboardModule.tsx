import {HomeOutlined} from "@ant-design/icons";
import PageViewer from "../components/PageViewer";
import {__} from "../translations/i18n";
import {addFilter} from "../services/HooksManager";
import Dashboard from "../pages/Dashboard";
import { MenuNode } from "../components/MenuComponent";
import ParentModule from "../shared/module/CrudModule";

class DashboardModule extends ParentModule {

    init = () => {
        addFilter('app_menu', this.addMenu);

        addFilter('app_routes', (routes: any) => {
            routes[this.getRoute()] = {component: PageViewer, props: {content: <Dashboard/>, selectedKey: this.getRoute()}, visibility: 'private'};
            return routes;
        }, -100);
    }

    addMenu = (menu: MenuNode[]) => {

        menu.push({
            label: <i>{__('menu.dashboard')}</i>,
            icon: <HomeOutlined/>,
            position: '100',
            key: this.getRoute()
        });

        return menu;
    }

    getModuleKey = (): string => {
        return "dashboard";
    }

}

const module = new DashboardModule();
export default module;
