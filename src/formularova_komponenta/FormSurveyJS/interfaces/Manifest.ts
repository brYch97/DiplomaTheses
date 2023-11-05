export enum DataType {
    MultiSelectOptionSet = "MultiSelectOptionSet",
    SingleLineText = "SingleLine.Text",
    TwoOptions = "TwoOptions",
    DateAndTimeDateOnly = "DateAndTime.DateOnly",
    DateAndTimeDateAndTime = "DateAndTime.DateAndTime",
    OptionSet = "OptionSet",
    LookupCustomer = "Lookup.Customer",
    LookupSimple = "Lookup.Simple",
    LookupRegarding = "Lookup.Regarding",
    LookupOwner = "Lookup.Owner",
    Currency = "Currency",
    Decimal = "Decimal",
    FP = "FP",
    WholeNone = "Whole.None",
    WholeDuration = "Whole.Duration",
    Enum = "Enum"
}
export namespace Manifest {
    export interface Control {
        displayName: string;
        name: string;
        namespace: string;
        constructor: string;
        properties: Property[];
        translations?: any;
    }
    export interface Property {
        name: string;
        ["display-name-key"]: string;
        ofType: DataType;
        usage: "input" | "bound";
        value?: Value[]
    }
    export interface Value {
        name: string;
        value: string;
        ["display-name-key"]: string;
        default: boolean;
    }
}