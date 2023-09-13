import { MenuNode } from "../components/MenuComponent";
import ParentModule from "../shared/module/CrudModule";
import {UserOutlined, ReloadOutlined, SearchOutlined, EyeOutlined, DeleteOutlined} from "@ant-design/icons";
import { __ } from "../translations/i18n";
import { addFilter, applyFilters } from "../services/HooksManager";
import {Caps} from "../models/Role";

class UserModule extends ParentModule {

  init = () => {
    addFilter('app_menu', this.addMenu);
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

  addMenu = (menu: MenuNode[]) => {
    let children = applyFilters('user_sub_menu', []);
    menu.push({
        label: <i onClick={this.setCollapsed}>{__('menu.users')}</i>,
        icon: <UserOutlined onClick={this.setCollapsed}/>,
        position: '20',
        children: children,
        key: this.getModuleKey(),
        caps: [
          [ Caps.USER_VIEW, Caps.USER_EDIT ]
        ]
    });
    return menu;
  }

  getModuleKey = (): string => {
    return "user";
  }

}


const userModule = new UserModule();
export default userModule;