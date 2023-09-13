import {Component} from "react";
import {fetchRolesByKey} from "../../modules/UserListModule";
import environmentManager from "../../services/EnvironmentManager";
import {__} from "../../translations/i18n";
import CrudForm from "../CrudForm";
import {FormRow} from "../form/DynamicForm";
import { Authority } from "../../models/User";
import { SelectItem } from "../../models/SelectItem";

interface Props {
  entity: any,
  module: string,
  edit: (data: any) => any
}

export default class UserEdit extends Component<Props> {

    provider = environmentManager.getDataProvider ();

    initialAuthorities: SelectItem[] = this.props.entity.authorities.map((auth: Authority) => {return {label: auth.name, value: auth.name}});

    getEditFormFields = (): FormRow[] => {
        return [
          {
            fields: [
              {
                name: "firstName",
                label: __("users.fields.firstName"),
                type: "text",
                required: true,
                requiredMessage: __("users.fields.errors.firstName"),
                colConf: { span: 24 },
                defaultValue: this.props.entity.firstName,
                value: this.props.entity.firstName,
              },
              {
                name: "lastName",
                label: __("users.fields.lastName"),
                type: "text",
                required: true,
                requiredMessage: __("users.fields.errors.lastName"),
                colConf: { span: 24 },
                defaultValue: this.props.entity.lastName,
                value: this.props.entity.lastName,
              },
              {
                name: "authorities",
                label: __("users.fields.role"),
                type: "autocompleteselect",
                required: true,
                requiredMessage: __("users.fields.errors.role"),
                mode: "multiple",
                fetchOptions: (key: string) => fetchRolesByKey(key),
                filterOption: (input: any, option: any) =>
                  (option?.label?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase()),
                initialValue: this.initialAuthorities,
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
                label: __("common.edit"),
                type: "button",
                htmlType: "submit",
                colConf: { span: 3, offset: 9 },
              },
            ],
          },
        ];
    }

    render() {
        const {module} = this.props
        return (<CrudForm module={module} callback={this.props.edit} getFormFields={this.getEditFormFields} cardSize={12} type={"edit"} entity={this.props.entity} />);
    }
}