import { LockOutlined } from "@ant-design/icons";
import { MenuNode } from "../components/MenuComponent";
import PageViewer from "../components/PageViewer";
import { addFilter } from "../services/HooksManager";
import { __ } from "../translations/i18n";
import ParentModule from "../shared/module/CrudModule";
import PasswordChange from "../components/profile/PasswordChange";

class PasswordChangeModule extends ParentModule {

    init = () => {
        super.init();
        addFilter ( 'profile_sub_menu', this.addMenu );

        addFilter ( 'app_routes', ( routes: any ) => {
            routes[this.getRoute()] = {
                component: PageViewer,
                props: { content: <PasswordChange />, selectedKey: this.getRoute() },
                visibility: 'private'
            };
            return routes;
        } );

    }

    addMenu = ( menu: MenuNode[] ) => {
        menu.push ( {
            label: <i>{ __( 'menu.profile.changePassword' ) }</i>,
            icon: <LockOutlined />,
            position: '34',
            key: this.getRoute()
        } );

        return menu;
    }

    getModuleKey = (): string => {
        return "me/change-password";
    }

}

const passwordChangeModule = new PasswordChangeModule ();
export default passwordChangeModule;
