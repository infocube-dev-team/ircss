import {Component} from "react";
import EnvironmentManager from "../../services/EnvironmentManager";
import {__} from "../../translations/i18n";
import CrudForm from "../../components/CrudForm";
import { FormRow } from "../../components/form/DynamicForm";
import environmentManager from "../../services/EnvironmentManager";
import { SelectItem } from "../../models/SelectItem";
import { fetchCountriesByKey } from "../services/CountryService";

interface Props {
    module: string,
    edit: (data: any) => any,
    entity: any
}

export default class OrganizationEdit extends Component<Props>{

    provider = EnvironmentManager.getDataProvider ();

    getEditFormFields = (): FormRow[] => {
        return [
          {
            fields: [
              {
                name: "code",
                label: __("organizations.fields.code"),
                type: "text",
                required: true,
                requiredMessage: __("organizations.fields.errors.code"),
                colConf: { span: 24 },
                defaultValue: this.props.entity.identifier?.[0].value,
                value: this.props.entity.identifier?.[0].value
              },
              {
                name: "name",
                label: __("organizations.fields.name"),
                type: "text",
                required: true,
                requiredMessage: __("organizations.fields.errors.name"),
                colConf: { span: 24 },
                defaultValue: this.props.entity.name,
                value: this.props.entity.name
              },
              {
                name: "address",
                label: __("organizations.fields.address"),
                type: "text",
                required: true,
                requiredMessage: __("organizations.fields.errors.address"),
                colConf: { span: 24 },
                defaultValue: this.props.entity.address?.[0]?.line[0],
                value: this.props.entity.address?.[0]?.line[0]
              },
              {
                name: "postalCode",
                label: __("organizations.fields.postalCode"),
                type: "text",
                required: true,
                requiredMessage: __("organizations.fields.errors.postalCode"),
                colConf: { span: 24 },
              },
              {
                name: "city",
                label: __("organizations.fields.city"),
                type: "text",
                required: true,
                requiredMessage: __("organizations.fields.errors.city"),
                colConf: { span: 24 },
                defaultValue: this.props.entity.address?.[0]?.city,
                value: this.props.entity.address?.[0]?.city
              },
              {
                name: "province",
                label: __("organizations.fields.province"),
                type: "text",
                required: true,
                requiredMessage: __("organizations.fields.errors.province"),
                colConf: { span: 24 },
              },
              {
                name: "telephoneNumber",
                label: __("organizations.fields.telephoneNumber"),
                type: "text",
                required: true,
                requiredMessage: __("organizations.fields.errors.telephoneNumber"),
                colConf: { span: 24 },
              },
              {
                name: "fax",
                label: __("organizations.fields.fax"),
                type: "text",
                required: true,
                requiredMessage: __("organizations.fields.errors.fax"),
                colConf: { span: 24 },
              },{
                name: "referent",
                label: __("organizations.fields.referent"),
                type: "text",
                required: true,
                requiredMessage: __("organizations.fields.errors.referent"),
                colConf: { span: 24 },
              },
              {
                name: "responsible",
                label: __("organizations.fields.responsible"),
                type: "text",
                required: true,
                requiredMessage: __("organizations.fields.errors.responsible"),
                colConf: { span: 24 },
              },
              {
                name: "country",
                label: __("organizations.fields.country"),
                type: "autocompleteselect",
                required: true,
                requiredMessage: __("organizations.fields.errors.country"),
                fetchOptions: (key: string) => fetchCountriesByKey(key),
                initialValue: this.props.entity.address?.[0]?.country,
                colConf: { span: 24 },
              },
              {
                name: "ethicsCommittee",
                label: __("organizations.fields.ethicsCommittee"),
                type: "text",
                required: true,
                requiredMessage: __("organizations.fields.errors.ethicsCommittee"),
                colConf: { span: 24 },
              },
              {
                name: "group",
                label: __("organizations.fields.group"),
                type: "text",
                required: true,
                requiredMessage: __("organizations.fields.errors.group"),
                colConf: { span: 24 },
              },
              {
                name: "osscCode",
                label: __("organizations.fields.osscCode"),
                type: "text",
                required: true,
                requiredMessage: __("organizations.fields.errors.osscCode"),
                colConf: { span: 24 },
              },
              {
                name: "administrativeReferences",
                label: __("organizations.fields.administrativeReferences"),
                type: "text",
                required: true,
                requiredMessage: __("organizations.fields.errors.administrativeReferences"),
                colConf: { span: 24 },
              },
              {
                name: "notes",
                label: __("organizations.fields.notes"),
                type: "textarea",
                required: true,
                requiredMessage: __("organizations.fields.errors.notes"),
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

    render(){
        const {module} = this.props
        return (<CrudForm module={module} callback={this.props.edit} getFormFields={this.getEditFormFields} cardSize={12} type={"edit"} entity={this.props.entity} />);
    }
}
