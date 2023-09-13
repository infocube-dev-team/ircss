import { MenuNode } from "../components/MenuComponent";
import ParentModule from "../shared/module/CrudModule";
import {UserOutlined, ReloadOutlined, SearchOutlined, EyeOutlined, DeleteOutlined} from "@ant-design/icons";
import { __ } from "../translations/i18n";
import { addFilter } from "../services/HooksManager";
import PageViewer from "../components/PageViewer";
import CrudModule from "../components/CrudModule";
import CrudDetails from "../components/CrudDetails";
import { ReactNode } from "react";
import { Button, Popconfirm } from "antd";
import { navigate, reloadApp } from "../shared/router";
import { FormRow } from "../components/form/DynamicForm";
import { FormLayout } from "antd/es/form/Form";
import environmentManager from "../services/EnvironmentManager";
import { errorToast, successToast } from "../services/NotificationManager";
import { SelectItem } from "../models/SelectItem";
import {Capability, Caps, Role} from "../models/Role";
import StingUtils from "../utils/StringUtils";
import RoleAdd from "../components/roles/RoleAdd";
import RoleDetails from "../components/roles/RoleDetail";
import RoleEdit from "../components/roles/RoleEdit";
import ErrorUtils from "../utils/ErrorUtils";

class RoleModule extends ParentModule {

  init = () => {
    super.init();
    addFilter('user_sub_menu', this.addMenu);

    addFilter('app_routes', (routes: any) => {
        routes[this.getRoute()] = {
            component: PageViewer,
            props: {content: <CrudModule module={this}/>, selectedKey: this.getRoute()},
            visibility: 'private',
            caps: [Caps.ROLE_VIEW, Caps.ROLE_EDIT]
        };
        routes[this.getRouteDetail()] = {
            component: PageViewer,
            props: {content: <CrudDetails module={this}/>},
            visibility: 'private',
            caps: [Caps.ROLE_VIEW, Caps.ROLE_EDIT]
        };
        return routes;
    });

    addFilter('crud_detail_view_component_' + this.getModuleKey(), this.getDetailsComponent);
    addFilter('crud_detail_edit_component_' + this.getModuleKey(), this.getEditComponent);
    addFilter('crud_create_component_' + this.getModuleKey(), this.getAddComponent);
  }

  addMenu = (menu: MenuNode[]) => {
    menu.push({
        label: <i>{__('menu.roles')}</i>,
        icon: <UserOutlined/>,
        position: '22',
        key: this.getRoute(),
        caps: [
            Caps.ROLE_VIEW,
            Caps.ROLE_EDIT,
        ]
    });
    return menu;
  }

  getModuleKey = (): string => {
    return "authorities";
  }

  getDetailsComponent = (component: ReactNode, entity: any) => {
      return (<RoleDetails entity={entity}/>);
  }

  getAddComponent = () => {
      return <RoleAdd module={this.getModuleKey()} add={(data) => this.add(data)}/>;
  }

  add = async (data: Role) => {
    const provider = environmentManager.getDataProvider();

    // Il payload prevede "capabilities" come array di stringhe
    if (typeof data.capabilities === 'string') {
      data.capabilities = [data.capabilities];
    } else if (Array.isArray(data.capabilities) && typeof data.capabilities[0] !== 'string') {
        data.capabilities = data.capabilities.map(cap => 
            (typeof cap === 'object' && 'value' in cap) ? cap.value : cap
        );
    }

    const req = {data};

    ErrorUtils.catchError(provider.addOne(req, 'authorities'), __('common.successfulOperation'), reloadApp);  
  }

  getEditComponent = (component: ReactNode, entity: any) => {
    return (<RoleEdit entity={entity} module={this.getModuleKey()} edit={(data) => this.edit(data, entity)}/>);
  }

  edit = async (data: Role, entity: Role) => {
    const provider = environmentManager.getDataProvider();
    
    // Il payload prevede "capabilities" come array di stringhe
    if (typeof data.capabilities === 'string') {
      data.capabilities = [data.capabilities];
    } else if (Array.isArray(data.capabilities) && typeof data.capabilities[0] !== 'string') {
        data.capabilities = data.capabilities.map(cap => 
            (typeof cap === 'object' && 'value' in cap) ? cap.value : cap
        );
    }

    // Object.assign(data, {id: entity.id})
    
    const req = {data};

    const goBack = () => navigate(this.getRoute());
    ErrorUtils.catchError(provider.editOne(req, `authorities/${entity.id}`), __('common.successfulOperation'), goBack);
  }

  delete = async (roleId: string | number) => {
    const provider = environmentManager.getDataProvider();
    ErrorUtils.catchError(provider.deleteOne('', roleId), __('roles.delete.success'), reloadApp);
  } 

  __getColumnsTable = () => {
    return [
        {
            title: __('authorities.fields.name'),
            dataIndex: 'name',
            key: 'name',
            sorter: true
        },
        {
          title: __('authorities.fields.capabilities'),
          dataIndex: 'capabilities',
          key: 'capabilities',
          sorter: true,
          render: (capabilities: {id: number, name: string}[]) => {
            return capabilities.map(cap => StingUtils.capitalizeEachWord(cap.name.replace('_', ' '))).join(', ')
          }
        },
        {
            title: __('common.details'),
            dataIndex: 'id',
            key: 'id',
            render: (id: string | number) => (
                <Button onClick={() => navigate(this.getRouteDetail(id))} icon={<EyeOutlined/>} size={"small"} shape={"circle"} type="primary"/>
            )
        },
        {
          title: __('common.delete'),
          dataIndex: 'id',
          key: 'id',
          render: (id: string | number) => (
            <Popconfirm title={__('common.delete_confirm')} cancelText={__('common.cancel')} onConfirm={() => this.delete(id)}>
              <Button icon={<DeleteOutlined/>} size={"small"} shape={"circle"} type="primary"/>
            </Popconfirm>
          )
        }
    ];
  }

  __getFormFields = (): FormRow[] => {
    return [
      {
        fields: [
            {
                name: 'name.contains',
                label: __('authorities.fields.name'),
                type: 'text',
                required: false,
                requiredMessage: "test",
                colConf: {span: 6}
            },
            {
              name: 'capabilityId.equals',
              label: __('authorities.fields.capabilities'),
              type: 'autocompleteselect',
              required: false,
              mode: 'multiple',
              fetchOptions: (key: string) => (fetchCapabilitiesByKey(key, true)),
              colConf: { span: 6 }
            }
        ]
    },
    {
        style: {
            className: "buttonForm"
        },
        fields: [
            {
                name: __('common.reset'),
                type: 'button',
                htmlType: 'reset',
                block: 'true',
                buttonType: "default",
                icon: <ReloadOutlined/>,
                colConf: {span: 2, offset: 10}
            },
            {
                name: __('common.search'),
                type: 'button',
                htmlType: 'submit',
                block: 'true',
                icon: <SearchOutlined/>,
                colConf: {span: 2}
            }
        ]
      }
    ]
  }

  __getLayout = (): FormLayout => {
    return "vertical";
  }

  __getMapData = (row: any): Role => {
    return {
      id: row.id,
      name: row.name,
      capabilities: row.capabilities
    }
  }

}

export const fetchCapabilitiesByKey = async (key: string, isFilter = false) => {
  const provider = environmentManager.getDataProvider();
  let capsArray: SelectItem[] = []
  const roleValueKey = isFilter ? 'id' : 'name';

  await provider.getList(0, 0, {
      params: {
        'name.contains': key
      }
  }, 'capabilities')
      .then((response: Capability[]) => {
          if (response?.length > 0) {
            response.forEach((element: Capability) => {
                capsArray.push({label: element.name, value: element[roleValueKey]})
            });
          }
      });
  return capsArray
}

const roleModule = new RoleModule();
export default roleModule;