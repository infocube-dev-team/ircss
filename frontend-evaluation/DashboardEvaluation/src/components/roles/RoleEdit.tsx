import {Component} from "react";
import environmentManager from "../../services/EnvironmentManager";
import {__} from "../../translations/i18n";
import CrudForm from "../CrudForm";
import {FormRow} from "../form/DynamicForm";
import { fetchCapabilitiesByKey } from "../../modules/RoleModule";
import { Capability } from "../../models/Role";

interface Props {
  entity: any,
  module: string,
  edit: (data: any) => any
}

export default class RoleEdit extends Component<Props> {

    provider = environmentManager.getDataProvider ();

    getEditFormFields = (): FormRow[] => {
        return [
            {
              fields: [
                {
                  name: 'name',
                  label: __('authorities.fields.name'),
                  type: 'text',
                  required: true,
                  requiredMessage: __('authorities.fields.errors.name'),
                  colConf: {span: 24},
                  defaultValue: this.props.entity.name, 
                  value: this.props.entity.name
                },
                {
                  name: 'capabilities',
                  label: __('authorities.fields.capabilities'),
                  type: 'autocompleteselect',
                  required: true,
                  requiredMessage: __('authorities.fields.errors.capabilities'),
                  mode: 'multiple',
                  fetchOptions: (key: string) => (fetchCapabilitiesByKey(key)),
                  colConf: {span: 24},
                  initialValue: this.props.entity.capabilities.map((cap: Capability)  => {
                    return {label: cap.name, value: cap.name}
                  }), 
                  value: this.props.entity.capabilities.map((cap: Capability)  => {
                    return cap.name
                  })
                }
              ]
            },
            {
              style: {
                  className: "buttonForm"
              },
              fields: [
                  {
                      label: __( 'common.edit' ),
                      type: 'button',
                      htmlType: 'submit',
                      colConf: { span: 3, offset: 9 }
                  }
              ]
            }
        ];
    }

    render() {
        const {module} = this.props
        return (<CrudForm module={module} callback={this.props.edit} getFormFields={this.getEditFormFields} cardSize={12} type={"edit"} entity={this.props.entity} />);
    }
}