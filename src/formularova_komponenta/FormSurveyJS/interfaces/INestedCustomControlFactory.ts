/// <reference types="powerapps-component-framework" />

export interface INestedPcfFactory extends ComponentFramework.Factory {
    createComponent(type: string, id: string, properties: IVirtualComponentProps): IComponent;
    unbindDOMComponent(componentId: string): boolean;
    updateComponent(id: string, props: ComponentFramework.Dictionary): void;
    bindDOMElement(virtualComponent: IComponent, DOMNode: Element): void;
    bindDOMComponent(virtualComponent: IComponent, DOMNode: Element): void;
    fireEvent(eventName: string, params: any): void;
}

export interface IComponent {
    getType(): string;
    getProperties(): IVirtualComponentProps;
    getComponentId(): string;
}

export interface IVirtualComponentProps {
    controlstates?: IVirtualComponentControlStates;
    childeventlisteners?: IControlEventHandler[];
    parameters?: IParameterDefinitionMap;
}

export interface IControlEventHandler {
    eventname: string;
    eventhandler: (data: any) => void;
}

interface IVirtualComponentControlStates {
    // This property is not used in portal
    hasFocus?: boolean;
    isControlDisabled?: boolean;
    // This property is not used in portal
    showLabel?: boolean
    // This property is not used in portal
    label?: string;
    // This property is not used in portal
    height?: number;
    // This property is not used in portal
    width?: number;
}

export interface IParameterDefinitionMap {
    // We are not implementing other native types
    [key: string]: ParameterSpecification;
}
interface ParameterSpecification extends ICustomControlParameterDefinition {
    // This property is not used in portal
    Usage?: PropertyUsage; // Defaults to Input
    Value: any;
    Static?: boolean; // Defaults to true
    /**
     * This property is not used in portal
    */
    Primary?: boolean; //Defaults to false
    Callback?: (value: any) => void;
    Attributes?: {
        EntityLogicalName?: string;
        LogicalName?: string;
        /**
         * This property is not used in portal
         * TODO: We should implement required using this property
         */
        RequiredLevel?: number;
    }
}
interface ICustomControlParameterDefinition {
    Type?: string; // Defaults to string
}
const enum PropertyUsage {
    Bound = 0,
    Input = 1
}