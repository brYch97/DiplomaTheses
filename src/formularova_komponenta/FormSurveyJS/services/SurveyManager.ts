import { CustomControlService } from "./CustomControlService";
import { ISchema } from "../interfaces/ISchema";
import { SurveyChangesService } from "./SurveyChangesService";
import { SurveyCustomQuestionService } from "./SurveyCustomQuestionService";
import { SurveyThemeService } from "./SurveyThemeService";
import { IInputs } from "../generated/ManifestTypes";
import { SurveyLocalizationService } from "./SurveyLocalizationService";
import { ReactElementFactory } from "survey-react-ui";
import * as React from 'react';
import { PropertyGridComponentWrapper } from "../Designers/components/PropertyGridComponentWrapper";
import { Serializer } from "survey-core";

export enum SurveyType {
    FieldDesigner = "0",
    TemplateDesigner = "1",
    FormDesigner = "2",
    ClientInput = "3"
}
/**
* Managing class that holds instances of all services and provides other global information.
*/
export class SurveyManager {
    public static fieldEntityName = 'br_customfield';
    public static templateEntityName = 'br_template';
    public static surveyEntityName = 'br_form';
    public static schemaAttributeName = 'br_schema';
    public static dataAttributeName = 'br_data';
    public static templatePrimaryIdAttribute = 'br_templateid';
    public static customFieldPrimaryIdAttribute = 'br_customfieldid';
    public static templateCustomFieldIntersectionTable = 'br_template_br_customfield';
    public static templateCustomFieldRelationshipName = 'br_Template_br_CustomField_br_CustomField';
    public static customFieldPrimaryNameAttribute: 'br_name';
    public static userDataFieldName: 'br_identityclaim';
    private static _instance: SurveyManager;
    private _surveyThemeService: SurveyThemeService;
    private _surveyChangesService: SurveyChangesService;
    private _surveyCustomQuestionService: SurveyCustomQuestionService;
    private _surveyCustomControlService: CustomControlService;
    private _localizationService: SurveyLocalizationService;
    private _surveyType: SurveyType;
    private _isFullPageControl: boolean;
    private _pcfContext: ComponentFramework.Context<IInputs>
    /**
 * Gets the theme service.
 * @returns {SurveyThemeService} The theme service.
 */
    /**
     * Gets the theme service.
     * @returns {SurveyThemeService} The theme service.
     */
    public static get ThemeService() {
        return SurveyManager._instance?._surveyThemeService;
    }
    /**
     * Gets the change service.
     * @returns {SurveyChangesService} The change service.
     */
    public static get ChangeService() {
        return SurveyManager._instance?._surveyChangesService
    }
    /**
 * Gets the custom question service.
 * @returns {SurveyCustomQuestionService} The custom question service.
 */
    public static get CustomQuestionService() {
        return SurveyManager._instance?._surveyCustomQuestionService;
    }
    /**
* Gets the custom control service.
* @returns {CustomControlService} The custom control service.
*/
    public static get CustomControlService() {
        return SurveyManager._instance?._surveyCustomControlService;
    }
    /**
* Gets the localization service.
* @returns {SurveyLocalizationService} The localization service.
*/
    public static get LocalizationService() {
        return SurveyManager._instance?._localizationService
    }
    /**
 * Gets the current mode of the PCF.
 * @returns {SurveyType} The survey type.
 */
    public static get SurveyType() {
        return SurveyManager._instance?._surveyType;
    }
    /**
 * Checks if the PCF is a full page.
 * @returns {boolean} True if the survey is a full page, false otherwise.
 */
    public static get IsFullPage() {
        return SurveyManager._instance?._isFullPageControl;
    }
    /**
 * Gets the PCF context.
 * @returns {ComponentFramework.Context<IInputs>} The PCF context.
 */
    public static get PcfContext() {
        return SurveyManager._instance?._pcfContext
    }
    /**
     * Constructs a new instance of the SurveyManager.
     * @param {ComponentFramework.Context<IInputs>} context - The PCF context.
     */
    private constructor(context: ComponentFramework.Context<IInputs>) {
        this._surveyType = context.parameters.mode.raw as any ?? SurveyType.ClientInput;
        //!context.parameters.mode.raw is null in case of full page control
        this._isFullPageControl = context.parameters.mode.raw ? false : true;
        this._pcfContext = context;
    }
    /**
  * Initializes the SurveyManager.
  * @param {ISchema} surveySchema - The survey schema.
  * @param {ComponentFramework.Context<IInputs>} context - The PCF context.
  * @param {ISchema} [templateSchema] - The template schema.
  */
    public static init(surveySchema: ISchema, context: ComponentFramework.Context<IInputs>, templateSchema?: ISchema) {
        if (this._instance) {
            throw new Error('Another Survey has previously been initialized. Please clear it first with SurveyService.clear()');
        }
        SurveyManager._instance = new SurveyManager(context);
        SurveyManager._instance._localizationService = SurveyLocalizationService.get();
        SurveyManager._instance._surveyCustomControlService = new CustomControlService(context);
        SurveyManager._instance._surveyCustomQuestionService = new SurveyCustomQuestionService();
        SurveyManager._instance._surveyThemeService = new SurveyThemeService(surveySchema.cssVariables ?? templateSchema?.cssVariables, SurveyManager._instance._localizationService);
        SurveyManager._instance._surveyChangesService = new SurveyChangesService(surveySchema, SurveyManager._instance._surveyThemeService, templateSchema);
        if (SurveyManager._instance._surveyType !== SurveyType.FieldDesigner) {
            ReactElementFactory.Instance.registerElement("svc-property-grid", (props) => {
                return React.createElement(PropertyGridComponentWrapper, props);
            });
        }
        Serializer.addProperty("question", {
            name: "boundedTo",
            type: "text",
            displayName: SurveyManager.LocalizationService.getString('boundedTo'),
            category: "general",
            visibleIndex: 0,
        });

    }
    /**
  * Clears all services so no data gets left in the memory.
  */
    public static clear() {
        this._instance?._surveyThemeService.clear();
        this._instance?._surveyCustomQuestionService.clear();
        this._instance?._surveyCustomControlService.clear();
        //@ts-ignore - is only null until the survey is reinitialized => will always be set during survey runtime
        this._instance = null;
    }
    /**
 * Sets the stored schema.
 * @param {ISchema} surveySchema - The survey schema.
 * @param {ISchema} [templateSchema] - The template schema.
 */
    public static setStoredSchema(surveySchema: ISchema, templateSchema?: ISchema) {
        const service = SurveyManager._instance;
        if (!service) {
            throw new Error('No Survey has been inicialized. Please initialize it first with SurveyService.init(...args)');
        }
        service._surveyThemeService.setStoredVariables(templateSchema?.cssVariables ?? surveySchema.cssVariables);
        service._surveyChangesService.setStoredSchema(surveySchema);
    }
}