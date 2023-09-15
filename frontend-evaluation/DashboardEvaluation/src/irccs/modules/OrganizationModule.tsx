import {ReactNode} from "react";
import CrudDetails from "../../components/CrudDetails";
import CrudModule from "../../components/CrudModule";
import {MenuNode} from "../../components/MenuComponent";
import PageViewer from "../../components/PageViewer";
import {Caps} from "../../models/Role";
import {addFilter} from "../../services/HooksManager";
import {__i} from "../translations/i18n";
import {EyeOutlined, ReloadOutlined, SearchOutlined, GlobalOutlined} from "@ant-design/icons";
import {navigate} from "../../shared/router";
import {Button} from "antd";
import {__} from "../../translations/i18n";
import {FormLayout} from "antd/es/form/Form";
import {FormRow} from "../../components/form/DynamicForm";
import IrccsCrudModule from "./IrccsCrudModule";
import OrganizationDetail from "../components/OrganizationDetail";

class CustomerModule extends IrccsCrudModule {

    init = () => {
        super.init();

        addFilter('app_menu', this.addMenu);

        addFilter('app_routes', (routes: any) => {
            routes[this.getRoute()] = {
                component: PageViewer,
                props: {content: <CrudModule module={this}/>, selectedKey: this.getRoute()},
                visibility: 'private',
                caps: [/* Caps.CUSTOMER_VIEW, Caps.CUSTOMER_CREATE */]
            };
            routes[this.getRouteDetail()] = {
                component: PageViewer,
                props: {content: <CrudDetails module={this}/>},
                visibility: 'private',
                caps: [/* Caps.CUSTOMER_VIEW, Caps.CUSTOMER_EDIT */]
            };
            return routes;
        });

        addFilter('crud_detail_view_component_' + this.getModuleKey(), this.getDetailsComponent);
    }

    addMenu = (menu: MenuNode[]) => {
        menu.push({
            label: <i>{__i('menu.organizations')}</i>,
            icon: <GlobalOutlined />,
            position: '20',
            key: this.getRoute(),
            caps: [
                /* Caps.CUSTOMER_VIEW */
            ]
        });
        return menu;
    }

    getModuleKey = (): string => {
        return "Organization";
    }

    getDetailsComponent = (component: ReactNode, entity: any) => {
        return (<OrganizationDetail entity={entity}/>);
    }

    __getColumnsTable = () => {
        return [
            {
                title: __i('organizations.fields.id'),
                dataIndex: 'id',
                key: 'id',
                sorter: true
            },
            {
                title: __i('organizations.fields.name'),
                dataIndex: 'name',
                key: 'name',
                sorter: true
            },
            {
                title: __i('organizations.fields.code'),
                dataIndex: 'code',
                key: 'code',
                sorter: true
            },
            {
                title: __i('organizations.fields.city'),
                dataIndex: 'city',
                key: 'city',
                sorter: true
            },
            {
                title: __i('organizations.fields.responsible'),
                dataIndex: 'responsible',
                key: 'responsible',
                sorter: true
            },
            {
                title: __i('organizations.fields.country'),
                dataIndex: 'country',
                key: 'country',
                sorter: true
            },
            {
                title: __('common.details'),
                dataIndex: 'id',
                key: 'id',
                render: (id: string | number) => (
                    <Button onClick={() => navigate(this.getRouteDetail(id))} icon={<EyeOutlined/>}
                            size={"small"} shape={"circle"} type="primary"/>
                )
            }
        ];
    }

    __getFormFields = (): FormRow[] => {
      return [
          {
              fields: [
                  {
                      name: 'id',
                      label: __i('organizations.fields.id'),
                      type: 'text',
                      required: false,
                      requiredMessage: "test",
                      colConf: {span: 6}
                  },
                  {
                      name: 'name',
                      label: __i('organizations.fields.name'),
                      type: 'text',
                      required: false,
                      requiredMessage: "test",
                      colConf: {span: 6}
                  },
                  {
                      name: 'code',
                      label: __i('organizations.fields.code'),
                      type: 'text',
                      required: false,
                      requiredMessage: "test",
                      colConf: {span: 6}
                  },
                  {
                      name: 'city',
                      label: __i('organizations.fields.city'),
                      type: 'text',
                      required: false,
                      requiredMessage: "test",
                      colConf: {span: 6}
                  },
                  {
                      name: 'responsible',
                      label: __i('organizations.fields.responsible'),
                      type: 'text',
                      required: false,
                      requiredMessage: "test",
                      colConf: {span: 6}
                  },
                  {
                      name: 'country',
                      label: __i('organizations.fields.country'),
                      type: 'text',
                      required: false,
                      requiredMessage: "test",
                      colConf: {span: 6}
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

    __getMapData = (row: any): any => {
        return {
            id: row.id,
            name: row.name,
            code: row.identifier?.[0].value,
            city: row.address?.[0]?.city,
            responsible: (row.contact?.[0]?.name?.given?.[0] ?? '') + ' ' + (row.contact?.[0]?.name?.family ?? ''),
            country: row.address?.[0]?.country
        }
    }

}

const customerModule = new CustomerModule();
export default customerModule;