import { UserOutlined } from "@ant-design/icons";
import { MenuNode } from "../components/MenuComponent";
import PageViewer from "../components/PageViewer";
import { addFilter } from "../services/HooksManager";
import { __ } from "../translations/i18n";
import ProfileEdit from "../components/profile/ProfileEdit";
import ParentModule from "../shared/module/CrudModule";
import {Caps} from "../models/Role";

class ProfileEditModule extends ParentModule {

    init = () => {
        super.init();
        addFilter ( 'profile_sub_menu', this.addMenu );

        addFilter ( 'app_routes', ( routes: any ) => {
            routes[this.getRoute()] = {
                component: PageViewer,
                props: { content: <ProfileEdit />, selectedKey: this.getRoute() },
                visibility: 'private',
                caps: [Caps.ME_VIEW]
            };
            return routes;
        } );

    }

    addMenu = ( menu: MenuNode[] ) => {
        menu.push ( {
            label: <i>{ __( 'menu.profile.editProfile' ) }</i>,
            icon: <UserOutlined />,
            position: '33',
            key: this.getRoute()
        } );

        return menu;
    }

    getModuleKey = (): string => {
        return "account";
    }

}

const profileEditModule = new ProfileEditModule ();
export default profileEditModule;
