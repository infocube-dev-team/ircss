import { ProfileOutlined } from "@ant-design/icons";
import { MenuNode } from "../components/MenuComponent";
import PageViewer from "../components/PageViewer";
import { addFilter, applyFilters } from "../services/HooksManager";
import { __ } from "../translations/i18n";
import ProfileEdit from "../components/profile/ProfileEdit";
import ParentModule from "../shared/module/CrudModule";

class ProfileModule extends ParentModule {

    init = () => {
        addFilter ( 'app_menu', this.addMenu );
    }

    state: { collapsed: boolean; };

    constructor() {
        super();
        this.state = {
            collapsed: false
        };
    }

    setCollapsed() {
        this?.setState({
            collapsed: !this.state.collapsed
        });
    }

    setState(arg0: { collapsed: boolean; }) {
        throw new Error("Method not implemented.");
    }

    addMenu = ( menu: MenuNode[] ) => {
        let children = applyFilters('profile_sub_menu', []);
        menu.push ( {
            label: <i onClick={this.setCollapsed}>{ __( 'menu.profile.title' ) }</i>,
            icon: <ProfileOutlined onClick={this.setCollapsed}/>,
            position: '32',
            children: children,
            key: this.getModuleKey()
        } );

        return menu;
    }

    getModuleKey = (): string => {
        return "profile";
    }

}

const profileModule = new ProfileModule ();
export default profileModule;
