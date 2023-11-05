import { localization } from "survey-creator-react";
import { DataType } from "../interfaces/Manifest";
import { ILocalizedProperty } from "./components/LocalizationComponent/LocalizationComponent";
import { CustomControlPropertyValue } from "./CustomControlPropertyValue";

export class CustomControlProperty {
    public name: string;
    public nameSurveyJS: string;
    public usage: "input" | "bound";
    public ofType: DataType;
    public translation: ILocalizedProperty | undefined;
    public values: CustomControlPropertyValue[] | undefined;
    public isBindingProperty: boolean;

    public get displayName() {
        if (!this.translation) {
            return this._displayNameKey;
        }
        return this.translation[localization.currentLocale || 'en'] || this._displayNameKey;
    }
    private _displayNameKey: string;

    constructor(propertyElement: Element, isBindingProperty: boolean, translation?: ILocalizedProperty) {
        this.translation = translation;
        this.isBindingProperty = isBindingProperty
        this._parseProperty(propertyElement);
    }

    public updateTranslation(translation: ILocalizedProperty[]) {
        this.translation = translation.find(translation => translation.propertyName === this.name);
        if(this.values) {
            for (const value of this.values) {
                value.updateTranslation(this.translation?.values.find(x=> x.valueName === value.name))
            }
        }
    }

    public getDisplayNameForLocale(locale: string): string {
        if (!this.translation) {
            return this._displayNameKey;
        }
        return this.translation[locale] as string || this._displayNameKey;
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
                const valueName = valueElement.getAttribute('name');

                const translation = this.translation?.values.find(x => x.valueName === valueName)
                this.values.push(new CustomControlPropertyValue(valueElement, translation))
            }
        }
    }
}