import {Component} from "react";
import EnvironmentManager from "../../services/EnvironmentManager";
import {__} from "../../translations/i18n";
import CrudForm from "../CrudForm";
import {FormRow} from "../form/DynamicForm";
import { fetchCapabilitiesByKey } from "../../modules/RoleModule";

interface Props {
    module: string,
    add: (data: any) => any
}

export default class RoleAdd extends Component<Props>{
    moduleManager = EnvironmentManager.getModuleManager();

    provider = EnvironmentManager.getDataProvider ();

    getAddFormFields = (): FormRow[] => {
        return [
            {
              fields: [
                  {
                    name: 'name',
                    label: __('authorities.fields.name'),
                    type: 'text',
                    required: true,
                    requiredMessage: __('authorities.fields.errors.name'),
                    colConf: {span: 24}
                },
                {
                  name: 'capabilities',
                  label: __('authorities.fields.capabilities'),
                  type: 'autocompleteselect',
                  required: true,
                  requiredMessage: __('authorities.fields.errors.capabilities'),
                  mode: 'multiple',
                  fetchOptions: (key: string) => (fetchCapabilitiesByKey(key)),
                  colConf: {span: 24}
                }
              ]
            },
            {
              style: {
                  className: "buttonForm"
              },
              fields: [
                  {
                      label: __( 'common.add' ),
                      type: 'button',
                      htmlType: 'submit',
                      colConf: { span: 3, offset: 9 }
                  }
              ]
            }
        ];
    }

    render(){
        const {module} = this.props
        return (<CrudForm module={module} callback={this.props.add} getFormFields={this.getAddFormFields} cardSize={12} type={"add"} />);
    }
}
