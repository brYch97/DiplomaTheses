import { ILocalizedProperty } from "../CustomControls/components/LocalizationComponent/LocalizationComponent";
import { IVariable } from "../services/SurveyThemeService";

export interface ILocalizedString {
    default?: string;
    [locale: string]: string | undefined,
}

export interface ISchema {
    title?: string | ILocalizedString;
    description?: string | ILocalizedString;
    locale?: string;
    logoPosition?: string;
    boundedTo?: string;
    pages?: [
        {
            name: string;
            elements?: ISchemaElement[]
        }
    ],
    cssVariables?: IVariable[];
    [key: string]: any;
}
export interface ISchemaElement {
    type: QuestionType,
    name: string,
    inputType?: InputType;
    description?: string;
    title?: string | ILocalizedString,
    cellType?: string,
    rowCount?: number,
    columns?: {
        name: string;
    }[]
    validators?: {
        type: string,
        text?: string,
        expression?: string,
        regex?: string,
        minValue?: number,
        maxValue?: number,
        minLength?: number,
        maxLength?: number,
        minCount?: number,
        maxCount?: number
    }[],
    translations?: ILocalizedProperty[];
    [key: string]: any;
}
export enum QuestionType {
    Boolean = "boolean",
    Checkbox = "checkbox",
    Comment = "comment",
    Dropdown = "dropdown",
    Tagbox = "tagbox",
    Expression = "expression",
    File = "file",
    HTML = "html",
    Image = "image",
    ImagePicker = "imagepicker",
    Matrix = "matrix",
    MatrixDropdown = "matrixdropdown",
    MatrixDynamic = "matrixdynamic",
    MultipleText = "multipletext",
    Panel = "panel",
    PanelDynamic = "paneldynamic",
    RadioGroup = "radiogroup",
    Rating = "rating",
    Ranking = "ranking",
    SignaturePad = "signaturepad",
    Text = "text",
  }

  export enum InputType {
    Date = "date",
    Email = "email",
    Tel = "tel",
  }