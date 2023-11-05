import { DataType } from "../interfaces/Manifest";
import { Serializer, Question, ElementFactory, SvgRegistry } from "survey-core";
import { Serializer as SerializerPDF } from 'survey-pdf/node_modules/survey-core';
import * as React from 'react';
import { CustomControlRenderer } from "./components/CustomControlRenderer";
import { ISchema, ISchemaElement } from "../interfaces/ISchema";
import { IInputs } from "../generated/ManifestTypes";
import { ILocalizedProperty } from "./components/LocalizationComponent/LocalizationComponent";
import { CustomControlProperty } from "./CustomControlProperty";
import { localization } from "survey-creator-react";
import { ReactQuestionFactory } from "survey-react-ui";
import { SurveyManager, SurveyType } from "../services/SurveyManager";
import { FlatRepository } from "survey-pdf";


export class CustomControl {
    public name: string;
    public surveyjsName: string;
    public displayName: string | undefined;
    public properties: CustomControlProperty[] = [];
    public parentContext: ComponentFramework.Context<IInputs>;
    public translations: ILocalizedProperty[] | undefined;
    private _schemeElement: ISchemaElement | undefined;
    private _displayNameKey: string;

    constructor(name: string, manifestXmlString: string, parentContext: ComponentFramework.Context<IInputs>, scheme?: ISchema) {
        this.parentContext = parentContext;
        this.name = name;
        this._schemeElement = scheme?.pages![0].elements![0];
        this.translations = this._getTranslations();
        this._parseManifest(manifestXmlString);
        this.displayName = this._getDisplayName();
        this._register();
    }
    public updateTranslations(value: ILocalizedProperty[] | undefined) {
        this.translations = value;
        for (const property of this.properties) {
            property.updateTranslation(this.translations!);
        }
    }
    private _getTranslations(): ILocalizedProperty[] | undefined {
        const translations = this._schemeElement?.translations;
        if (translations && translations.length > 0) {
            return translations
        }
        return undefined;
    }
    private _getDisplayName(): string {
        if (SurveyManager.SurveyType === SurveyType.FieldDesigner) {
            return this._displayNameKey
        }
        if (!this._schemeElement) {
            return this.name;
        }
        if (this._schemeElement.title === undefined) {
            return this._schemeElement.name;
        }
        if (typeof this._schemeElement.title === 'string') {
            return this._schemeElement.title;
        }
        return this._schemeElement.title.default ?? "";
    }
    private _register() {
        //@ts-ignore - replaceAll not part of typings
        const CustomControlModel = this._createModelClass(this.surveyjsName);
        const classObj = {
            name: this.surveyjsName,
            props: this._createProperties(),
            creator: function () {
                return new CustomControlModel("");
            },
            parentName: 'question'
        }
        Serializer.addClass(
            classObj.name,
            classObj.props,
            classObj.creator,
            classObj.parentName
        );
        if (SurveyManager.SurveyType === SurveyType.ClientInput) {
            SerializerPDF.addClass(
                classObj.name,
                classObj.props,
                classObj.creator,
                classObj.parentName
            );
        }
        ElementFactory.Instance.registerElement(this.surveyjsName, (name) => {
            return new CustomControlModel(this.surveyjsName);
        });
        ReactQuestionFactory.Instance.registerQuestion(this.surveyjsName, (props: any) => {
            return React.createElement(CustomControlRenderer, {
                ...props,
                //need to use spread operator here on some props to trigger updateView useEffect
                customControl: { ...this },
            });
        });
        FlatRepository.register(
            this.surveyjsName,
            FlatRepository.getRenderer("text")
        );
        SvgRegistry.registerIconFromSvg(this.surveyjsName,
            '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 21.4201C23.9387 22.1566 23.5894 22.8394 23.0278 23.3202C22.4662 23.8011 21.7376 24.0413 21 23.9888C20.2624 24.0413 19.5338 23.8011 18.9722 23.3202C18.4106 22.8394 18.0613 22.1566 18 21.4201C18 18.8513 21 16.2826 21 14.9932C21 16.2826 24 18.8513 24 21.4201ZM22 12.9942L11 1.99951L8.71 4.2884L10.12 5.70771L11 4.82814L18.17 11.9946L5.64 15.8028L2.83 12.9942L7.71 8.11653L9.29 9.70576C9.38296 9.79944 9.49356 9.8738 9.61542 9.92455C9.73728 9.97529 9.86799 10.0014 10 10.0014C10.132 10.0014 10.2627 9.97529 10.3846 9.92455C10.5064 9.8738 10.617 9.79944 10.71 9.70576C10.8037 9.61284 10.8781 9.5023 10.9289 9.3805C10.9797 9.2587 11.0058 9.12805 11.0058 8.99611C11.0058 8.86416 10.9797 8.73352 10.9289 8.61172C10.8781 8.48992 10.8037 8.37937 10.71 8.28645L3.71 1.28986C3.5217 1.10165 3.2663 0.995911 3 0.995911C2.7337 0.995911 2.4783 1.10165 2.29 1.28986C2.1017 1.47807 1.99591 1.73334 1.99591 1.99951C1.99591 2.26569 2.1017 2.52096 2.29 2.70917L6.29 6.70722L0 12.9942L10 22.9893L18 14.9932L22 12.9942Z" /></svg>'
        )
        const locale = localization.getLocale("");
        locale.qt[this.surveyjsName] = this.displayName;
    }
    private _createProperties(): any[] {
        const properties = this.properties.filter(property => property.usage === "input").map(property => {
            const result: any = {
                name: property.nameSurveyJS,
                displayName: property.displayName,
                category: "general",
            }
            if (property.ofType === DataType.Enum) {
                result.choices = property.values?.map(value => {
                    return {
                        value: value.value,
                        text: value.displayName
                    }
                })
                result.default = property.values?.find(value => value.default)?.value;
            }
            return result;
        });
        return properties;
    }

    private _createModelClass = (surveyjsName: string) => {
        class CustomControlModel extends Question {
            getType(): string {
                return surveyjsName;
            }
        }
        for (const property of this.properties) {
            if (property.usage === "bound") {
                continue;
            }
            Object.defineProperty(CustomControlModel.prototype, property.nameSurveyJS, {
                get() {
                    return this.getPropertyValue(property.nameSurveyJS);
                },
                set(value) {
                    this.setPropertyValue(property.nameSurveyJS, value);
                }
            });
        }
        return CustomControlModel;
    }
    private _parseManifest(manifestXmlString: string) {
        const xmlDoc = new DOMParser().parseFromString(manifestXmlString, "text/xml");
        const controlElement = xmlDoc.querySelector("control");
        const propertyElements = controlElement?.querySelectorAll("control > property");
        //@ts-ignore - replaceAll not part of typings
        this.surveyjsName = `pcf_${this.name.replaceAll('.', '_').toLowerCase()}`;
        this._displayNameKey = controlElement?.getAttribute('display-name-key') as string;
        let bindingPropertyFound = false;
        let isBindingProperty = false;
        for (const propertyElement of propertyElements as any) {
            if (!bindingPropertyFound && propertyElement.getAttribute('usage') === 'bound') {
                isBindingProperty = true;
                bindingPropertyFound = true;
            }
            this.properties.push(new CustomControlProperty(propertyElement, isBindingProperty, this.translations?.find(translation => translation.propertyName === propertyElement.getAttribute('name'))))
            isBindingProperty = false;
        }
    }
}