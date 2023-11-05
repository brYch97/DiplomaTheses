import { localization } from "survey-creator-react";
import { ILocalizedPropertyValue } from "./components/LocalizationComponent/LocalizationComponent";


export class CustomControlPropertyValue {
    public name: string;
    public default: boolean;
    public value: any;
    public get displayName() {
        if (!this._translation) {
            return this._displayNameKey;
        }
        return this._translation[localization.currentLocale || 'en'] || this._displayNameKey;
    }
    private _displayNameKey: string;
    private _translation: ILocalizedPropertyValue | undefined;

    constructor(valueElement: Element, translation?: ILocalizedPropertyValue) {
        this._translation = translation;
        this._parseValue(valueElement);
    }
    public updateTranslation(translation: ILocalizedPropertyValue | undefined) {
        this._translation = translation;
    }
    private _parseValue(valueElement: Element) {
        this.name = valueElement.getAttribute('name') as string;
        this.default = valueElement.getAttribute("default") === "true" ? true : false;
        this.value = valueElement.innerHTML;
        this._displayNameKey = valueElement.getAttribute("display-name-key") as string;
    }
}