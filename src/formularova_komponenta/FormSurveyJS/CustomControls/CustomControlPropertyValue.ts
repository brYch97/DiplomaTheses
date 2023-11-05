import { localization } from "survey-creator-react";


export class CustomControlPropertyValue {
    public name: string;
    public default: boolean;
    public value: any;
    public get displayName() {
        return this._displayNameKey;
    }
    private _displayNameKey: string;

    constructor(valueElement: Element) {
        this._parseValue(valueElement);
    }
    private _parseValue(valueElement: Element) {
        this.name = valueElement.getAttribute('name') as string;
        this.default = valueElement.getAttribute("default") === "true" ? true : false;
        this.value = valueElement.innerHTML;
        this._displayNameKey = valueElement.getAttribute("display-name-key") as string;
    }
}