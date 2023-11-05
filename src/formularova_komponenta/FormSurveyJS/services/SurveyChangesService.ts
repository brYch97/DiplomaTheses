import { CustomControlService } from "./CustomControlService";
import { ISchema } from "../interfaces/ISchema";
import * as deepEqual from 'fast-deep-equal';
import { SurveyThemeService } from "./SurveyThemeService";
import { SurveyManager, SurveyType } from "./SurveyManager";
import React = require("react");
import ReactDOM = require("react-dom");
import { ChangeNotificationComponent } from "../Designers/components/ChangeNotification/ChangeNotification";
import { SurveyLocalizationService } from "./SurveyLocalizationService";
import { IExtentedSurveyCreator } from "../Designers/Designer/Designer";


export class SurveyChangesService {
    private _currentSchema: ISchema;
    private _storedSchema: ISchema;
    private _themeService: SurveyThemeService;
    private _customControlService: CustomControlService;
    private _templateSchema: ISchema | undefined;
    private _notificationMesssageContainer: HTMLDivElement;
    private _creator: IExtentedSurveyCreator;
    private _onChangeHandler: (currentSchema: ISchema) => void  = () => {
        throw new Error('No change handler has been specified');
    }

    public constructor(surveySchema: ISchema, themeService: SurveyThemeService, customControlService: CustomControlService, localizationService: SurveyLocalizationService, templateSchema?: ISchema) {
        this._templateSchema = templateSchema;
        this.setStoredSchema(surveySchema);
        this._themeService = themeService;
        this._customControlService = customControlService;
        this._currentSchema = structuredClone(surveySchema);
    }
    public get creator() {
        if(!this._creator) {
            throw new Error('No creator has been set!');
        }
        return this._creator;
    }
    public set creator(creator: IExtentedSurveyCreator) {
        this._creator = creator;
    }
    public setStoredSchema(schema: ISchema) {
        this._storedSchema = schema;
    }
    public notifySchemeChanged(json?: string): void {
        if(json) {
            this._currentSchema = JSON.parse(json);
        }
        switch (SurveyManager.SurveyType) {
            case SurveyType.FieldDesigner: {
                //inject translations for PCF properties
                if (this._currentSchema.pages && this._currentSchema.pages[0].elements) {
                    const controlType = this._currentSchema.pages[0]?.elements[0]?.type;
                    const translations = this._customControlService.registeredControls.find(control => control.surveyjsName === controlType)?.translations;
                    if (translations) {
                       this._currentSchema.pages[0].elements[0].translations = translations;
                    }
                }
                break;
            }
            case SurveyType.FormDesigner: {
                const currentVariables = this._themeService.getCurrentVariables();
                const defaultVariables = this._themeService.getDefaultVariables();
                if(!deepEqual(currentVariables, defaultVariables)) {
                    this._currentSchema.cssVariables = currentVariables;
                }
                if(!this._templateSchema) {
                    break;
                }
                for (const [key, schemaObj] of Object.entries(this._currentSchema)) {
                    //save the content of pages, title and description directly to survey schema
                    if(key === 'pages' || key === 'title' || key === 'description') {
                        continue;
                    }
                    const templateObj = this._templateSchema[key];
                    if(schemaObj && templateObj) {
                        if(deepEqual(schemaObj, templateObj)) {
                            delete this._currentSchema[key];
                        }
                    }
                }
                break;
            }
            case SurveyType.TemplateDesigner: {    
                const currentVariables = this._themeService.getCurrentVariables();
                const defaultVariables = this._themeService.getDefaultVariables();
                this._currentSchema.cssVariables = currentVariables;
                if(deepEqual(currentVariables, defaultVariables)) {
                    delete this._currentSchema.cssVariables;
                }
                break;
            }

        }
        this._onChangeHandler(this._getCurrentSchema())
        this.render();
    }

    public setNotificationMessageContainer(container: HTMLDivElement) {
        this._notificationMesssageContainer = container;
    }

    public setOnChangeHandler(handler: (currentSchema: ISchema) => void) {
        this._onChangeHandler = handler;
    }

    public render() {
        ReactDOM.render(React.createElement(ChangeNotificationComponent, {
            currentSchema: this._getCurrentSchema(),
            storedSchema: this._getStoredSchema(),
        }), this._notificationMesssageContainer);
    }

    public isDirty() {
        return !deepEqual(this._currentSchema, this._storedSchema)
    }
    public getCurrentSchema() {
        return this._getCurrentSchema();
    }

    private  _getStoredSchema() {
        return structuredClone(this._storedSchema)
    }
    private  _getCurrentSchema() {
        return structuredClone(this._currentSchema)
    }

}