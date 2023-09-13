import {Component} from "react";
import EnvironmentManager from "../../services/EnvironmentManager";
import {__} from "../../translations/i18n";
import CrudForm from "../CrudForm";
import {FormRow} from "../form/DynamicForm";
import { fetchRolesByKey } from "../../modules/UserListModule";

interface Props {
    module: string,
    add: (data: any) => any
}

export default class UserAdd extends Component<Props>{
    moduleManager = EnvironmentManager.getModuleManager();

    provider = EnvironmentManager.getDataProvider ();

    getAddFormFields = (): FormRow[] => {
        return [
          {
            fields: [
              {
                name: "login",
                label: __("users.fields.email"),
                type: "email",
                required: true,
                requiredMessage: __("users.fields.errors.login"),
                colConf: { span: 24 },
              },
              {
                name: "firstName",
                label: __("users.fields.firstName"),
                type: "text",
                required: true,
                requiredMessage: __("users.fields.errors.firstName"),
                colConf: { span: 24 },
              },
              {
                name: "lastName",
                label: __("users.fields.lastName"),
                type: "text",
                required: true,
                requiredMessage: __("users.fields.errors.lastName"),
                colConf: { span: 24 },
              },
              {
                name: "authorities",
                label: __("users.fields.role"),
                type: "autocompleteselect",
                required: true,
                requiredMessage: __("users.fields.errors.role"),
                mode: "multiple",
                fetchOptions: (key: string) => fetchRolesByKey(key),
                colConf: { span: 24 },
              },
            ],
          },
          {
            style: {
              className: "buttonForm",
            },
            fields: [
              {
                label: __("common.add"),
                type: "button",
                htmlType: "submit",
                colConf: { span: 3, offset: 9 },
              },
            ],
          },
        ];
    }

    render(){
        const {module} = this.props
        return (<CrudForm module={module} callback={this.props.add} getFormFields={this.getAddFormFields} cardSize={12} type={"add"} />);
    }
}
