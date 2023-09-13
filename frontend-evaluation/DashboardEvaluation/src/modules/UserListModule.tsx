import {MenuNode} from "../components/MenuComponent";
import ParentModule from "../shared/module/CrudModule";
import {
    DeleteOutlined,
    EyeOutlined,
    ReloadOutlined,
    SearchOutlined,
    UserOutlined
} from "@ant-design/icons";
import {__} from "../translations/i18n";
import {addFilter, applyFilters} from "../services/HooksManager";
import PageViewer from "../components/PageViewer";
import CrudModule from "../components/CrudModule";
import CrudDetails from "../components/CrudDetails";
import {ReactNode} from "react";
import {Button, Popconfirm} from "antd";
import {navigate, reloadApp} from "../shared/router";
import {FormRow} from "../components/form/DynamicForm";
import {FormLayout} from "antd/es/form/Form";
import {Authority, User, UserData} from "../models/User";
import DateUtils from "../utils/DateUtils";
import UserAdd from "../components/users/UserAdd";
import environmentManager from "../services/EnvironmentManager";
import {SelectItem} from "../models/SelectItem";
import {Role, Caps} from "../models/Role";
import UserEdit from "../components/users/UserEdit";
import UserDetails from "../components/users/UserDetail";
import ErrorUtils from "../utils/ErrorUtils";

class UserListModule extends ParentModule {

    init = () => {
        super.init();
        addFilter('user_sub_menu', this.addMenu);

        addFilter('app_routes', (routes: any) => {
            routes[this.getRoute()] = {
                component: PageViewer,
                props: {content: <CrudModule module={this}/>, selectedKey: this.getRoute()},
                visibility: 'private',
                caps: [Caps.USER_VIEW, Caps.USER_EDIT]
            };
            routes[this.getRouteDetail()] = {
                component: PageViewer,
                props: {content: <CrudDetails module={this}/>},
                visibility: 'private',
                caps: [Caps.USER_VIEW, Caps.USER_EDIT]
            };
            return routes;
        });

        addFilter('crud_detail_view_component_' + this.getModuleKey(), this.getDetailsComponent);
        addFilter('crud_detail_edit_component_' + this.getModuleKey(), this.getEditComponent);
        addFilter('crud_create_component_' + this.getModuleKey(), this.getAddComponent);
    }

    getEntityName (entity: any) {
        return entity.firstName + ' ' + entity.lastName;
    }

    addMenu = (menu: MenuNode[]) => {
        menu.push({
            label: <i>{__('menu.users')}</i>,
            icon: <UserOutlined/>,
            position: '21',
            key: this.getRoute(),
            caps: [
                Caps.USER_VIEW,
                Caps.USER_EDIT,
            ]
        });
        return menu;
    }

    getModuleKey = (): string => {
        return "users";
    }

    getDetailsComponent = (component: ReactNode, entity: any) => {
        return (<UserDetails entity={entity}/>);
    }

    getAddComponent = () => {
        return <UserAdd module={this.getModuleKey()} add={(data) => this.add(data)}/>;
    }

    add = async (data: UserData) => {
        const provider = environmentManager.getDataProvider();
        
        // Il payload prevede "authorities" come array
        if (typeof data.authorities === 'string') {
            data.authorities = [data.authorities];
        }

        /**
         * Ritorna il payload da usare nella chiamata di modifica utente, permette la modifica da aprte di una verticalizzazione
         * @hook users_edit_payload
         * @param data : dati del payload
         */
        const payload = await applyFilters('users_add_payload', data);

        const req = {
            data: Object.assign({}, payload),
        };

        ErrorUtils.catchError(provider.addOne(req, 'users'), __('common.successfulOperation'), reloadApp);
    }

    getEditComponent = (component: ReactNode, entity: any) => {
        return (<UserEdit entity={entity} module={this.getModuleKey()}
                          edit={(data) => this.edit(data, entity)}/>);
    }

    edit = async (data: UserData, entity: User) => {

        console.log(data.authorities);

        // Il payload prevede "authorities" come array
        if (typeof data.authorities === 'string') {
            data.authorities = [data.authorities];
        } else if (Array.isArray(data.authorities) && typeof data.authorities[0] !== 'string') {
            data.authorities = data.authorities.map(aut => 
                (typeof aut === 'object' && 'value' in aut) ? aut.value : aut
            );
        }

        /**
         * Ritorna il payload da usare nella chiamata di modifica utente, permette la modifica da aprte di una verticalizzazione
         * @hook users_edit_payload
         * @param data : dati del payload
         */
        const payload = await applyFilters('users_edit_payload', data);
        const goBack = () => navigate(this.getRoute());
        ErrorUtils.catchError(environmentManager.getUserDataProvider().update(entity.id, payload), __('common.successfulOperation'), goBack);
    }

    delete = async (userId: string | number) => {
        ErrorUtils.catchError(environmentManager.getUserDataProvider().delete(userId), __('common.successfulOperation'), reloadApp);
    }

    __getColumnsTable = () => {
        return [
            {
                title: __('users.fields.email'),
                dataIndex: 'login',
                key: 'login',
                sorter: true
            },
            {
                title: __('users.fields.firstName'),
                dataIndex: 'firstName',
                key: 'firstName',
                sorter: true
            },
            {
                title: __('users.fields.lastName'),
                dataIndex: 'lastName',
                key: 'lastName',
                sorter: true
            },
            {
                title: __('users.fields.createdBy'),
                dataIndex: 'createdBy',
                key: 'createdBy',
                sorter: true
            },
            {
                title: __('users.fields.createdDate'),
                dataIndex: 'createdDate',
                key: 'createdDate',
                sorter: true
            },
            {
                title: __('users.fields.lastModifiedBy'),
                dataIndex: 'lastModifiedBy',
                key: 'lastModifiedBy',
                sorter: true
            },
            {
                title: __('users.fields.lastModifiedDate'),
                dataIndex: 'lastModifiedDate',
                key: 'lastModifiedDate',
                sorter: true
            },
            {
                title: __('users.fields.role'),
                dataIndex: 'authorities',
                key: 'authorities',
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
            },
            {
                title: __('common.delete'),
                dataIndex: 'id',
                key: 'id',
                render: (id: string | number) => (
                    <Popconfirm title={__('common.delete_confirm')} cancelText={__('common.cancel')}
                                onConfirm={() => this.delete(id)}>
                        <Button icon={<DeleteOutlined/>} size={"small"} shape={"circle"}
                                type="primary"/>
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
                        name: 'login.contains',
                        label: __('users.fields.email'),
                        type: 'text',
                        required: false,
                        requiredMessage: "test",
                        colConf: {span: 6}
                    },
                    {
                        name: 'firstName.contains',
                        label: __('users.fields.firstName'),
                        type: 'text',
                        required: false,
                        requiredMessage: "test",
                        colConf: {span: 6}
                    },
                    {
                        name: 'lastName.contains',
                        label: __('users.fields.lastName'),
                        type: 'text',
                        required: false,
                        requiredMessage: "test",
                        colConf: {span: 6}
                    },
                    {
                        name: 'authorityId.equals',
                        label: __('users.fields.role'),
                        type: 'autocompleteselect',
                        required: false,
                        allowClear: true,
                        fetchOptions: (key: string) => (fetchRolesByKey(key, true)),
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

    __getMapData = (row: any): User => {
        return {
            id: row.id,
            login: row.login,
            firstName: row.firstName,
            lastName: row.lastName,
            createdBy: row.createdBy,
            createdDate: DateUtils.formatDate(row.createdDate),
            lastModifiedBy: row.lastModifiedBy,
            lastModifiedDate: DateUtils.formatDate(row.lastModifiedDate),
            authorities: row.authorities.map((auth: Authority) => auth.name).join(', '),
            capabilities: row.capabilities
        }
    }

}

export const fetchRolesByKey = async (key: string, isFilter = false) => {
    const provider = environmentManager.getDataProvider();
    let rolesArray: SelectItem[] = []
    const roleValueKey = isFilter ? 'id' : 'name';

    await provider.getList(0, 0, {
        params: {
            'name.contains': key
        }
    }, 'authorities')
        .then((response: Role[]) => {
            if (response?.length > 0) {
                response.forEach((element: Role) => {
                    rolesArray.push({label: element.name, value: element[roleValueKey]})
                });
            }
        });
    return rolesArray
}


const userListModule = new UserListModule();
export default userListModule;