
export class Value implements ComponentFramework.PropertyTypes.Property {
    attributes?: ComponentFramework.PropertyHelper.FieldPropertyMetadata.Metadata | undefined = new Attributes();
    error: boolean;
    errorMessage: string;
    formatted?: string | undefined;
    raw: any;
    security?: ComponentFramework.PropertyHelper.SecurityValues | undefined = new SecurityValues();
    type: string;
}

export class Attributes implements ComponentFramework.PropertyHelper.FieldPropertyMetadata.Metadata {
    Description: string;
    DisplayName: string;
    IsSecured: boolean;
    LogicalName: string;
    RequiredLevel: ComponentFramework.PropertyHelper.Types.RequiredLevel = 1;
    SourceType: number;
}

export class SecurityValues implements ComponentFramework.PropertyHelper.SecurityValues {
    editable: boolean;
    readable: boolean;
    secured: boolean;
}