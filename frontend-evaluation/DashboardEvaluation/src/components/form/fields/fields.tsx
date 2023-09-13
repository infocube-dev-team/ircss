import {applyFilters} from "../../../services/HooksManager";
import {ComponentClass} from "react";
import TextField from "./TextField"
import DateField from "./DateField";
import SelectField from "./SelectField";
import ButtonField from "./ButtonField";
import NumberField from "./NumberField";
import CheckboxField from "./CheckboxField";
import AutoCompleteField from "./AutoCompleteField";
import AutoCompleteSelectField from "./AutoCompleteSelectField";
import ButtonUpload from "./ButtonUpload";
import SwitchField from "./SwitchField";
import PasswordField from "./PasswordField";
import EmailField from "./EmailField";
import DateRangeField from "./DateRangeField";
import TextAreaField from "./TextAreaField";
import TableSelectField from "./TableSelectField";
import TableField from "./TableField";

const fieldMap:{[key: string]: ComponentClass} = applyFilters('form_field_compnents', {
    'text': TextField,
    'date': DateField,
    'dateRange': DateRangeField,
    'select': SelectField,
    'button': ButtonField,
    'buttonUpload': ButtonUpload,
    'number': NumberField,
    'table': TableField,
    'tableselect':TableSelectField,
    'checkbox':CheckboxField,
    'autocomplete': AutoCompleteField,
    'autocompleteselect': AutoCompleteSelectField,
    'switch': SwitchField,
    'password': PasswordField,
    'email': EmailField,
    'textarea': TextAreaField
});

export default fieldMap;
