import { DataType } from "../interfaces/Manifest";
import { CustomControlPropertyValue } from "./CustomControlPropertyValue";

/**
 * Represents a custom control property.
 */
export class CustomControlProperty {
    public name: string;
    public nameSurveyJS: string;
    public usage: "input" | "bound";
    public ofType: DataType;
    public values: CustomControlPropertyValue[] | undefined;
    public isBindingProperty: boolean;

    public get displayName() {
        return this._displayNameKey;
    }
    private _displayNameKey: string;

    constructor(propertyElement: Element, isBindingProperty: boolean) {
        this.isBindingProperty = isBindingProperty
        this._parseProperty(propertyElement);
    }
    private _parseProperty(propertyElement: Element) {
        this.name = propertyElement.getAttribute("name") as string;
        this.nameSurveyJS = `pcf${this.name}`
        this.ofType = propertyElement.getAttribute("of-type") as DataType;
        this.usage = propertyElement.getAttribute("usage") as "input" | "bound";
        this._displayNameKey = propertyElement.getAttribute("display-name-key") as string;

        if (this.ofType === DataType.Enum) {
            const valueElements = propertyElement.querySelectorAll("value");
            this.values = [];
            for (const valueElement of valueElements as any) {
                this.values.push(new CustomControlPropertyValue(valueElement))
            }
        }
    }
}