/*global Xrm */
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as ReactDOM from "react-dom";
import { Designer } from "./Designers/Designer/Designer";
import * as React from 'react';
import { merge } from 'merge-anything'
import { ISchema, ISchemaElement } from "./interfaces/ISchema";
import { SurveyManager, SurveyType } from "./services/SurveyManager";
import { ProgressIndicator } from '@fluentui/react/lib/ProgressIndicator';
import { getDefaultTemplateSchema } from "./Designers/TemplateDesigner/TemplateDesigner";
import { getDefaultSurveySchema } from "./Designers/SurveyDesigner";
import { filterDeep } from 'deepdash-es/standalone';
import { IDictionary, Input } from "./Input/Input";
import { SurveyLocalizationService } from "./services/SurveyLocalizationService";
import { getDefaultCustomFieldSchema } from "./Designers/FieldDesigner/FieldDesigner";

export class FormSurveyJS implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _notifyOutputChanged: () => void;
    private _fieldEntityName: string = SurveyManager.fieldEntityName;
    private _templateEntityName: string = SurveyManager.templateEntityName;
    private _surveyEntityName: string = SurveyManager.surveyEntityName;
    private _schemaAttributeName = SurveyManager.schemaAttributeName;
    private _templatePrimaryIdAttribute = SurveyManager.templatePrimaryIdAttribute;
    private _customFieldPrimaryIdAttribute = SurveyManager.customFieldPrimaryIdAttribute;
    private _templateCustomFieldIntersectionTable = SurveyManager.templateCustomFieldIntersectionTable
    private _populatedFields: IDictionary;
    private _surveyResults: string;
    private _readOnly = false;
    private _context: ComponentFramework.Context<IInputs>;
    private _container: HTMLDivElement;
    private _surveyLoaded: boolean = false;
    private _surveyInitialized: boolean = false;
    private _currentTemplateLookup: ComponentFramework.LookupValue | undefined;
    private _surveyLookup: ComponentFramework.LookupValue[] | undefined;
    private _schema: ISchema;
    private _templateSchema: ISchema | undefined;
    private _entityName: string;
    private _entityId: string;

    constructor() {

    }
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._container = container;
        this._readOnly = context.mode.isControlDisabled;
        this._notifyOutputChanged = notifyOutputChanged;
        this._surveyLookup = context.parameters.survey.raw;
        this._context = context;
    }
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._context = context;
        const pageContext = window.Xrm.Utility.getPageContext();
        this._entityName = pageContext.input.entityName;
        if (!this._entityId) {
            //@ts-ignore - entityId missing in typings
            this._entityId = pageContext.input.entityId;
        }
        //@ts-ignore - isPropertyLoading is internal prop for fields that are fetched asynchronously because of their size
        if (!this._surveyInitialized && !context.parameters.schemaJSON.isPropertyLoading) {
            this.initializeSurvey();
        }
        if (!this._surveyLoaded) {
            ReactDOM.render(React.createElement(ProgressIndicator, {
                //label: this._context.resources.getString('loading')
            }), this._container);
            return;
        }
        if (context.updatedProperties.includes('template')) {
            const template = context.parameters.template.raw?.length > 0 ? context.parameters.template.raw[0] : undefined;
            if (template?.id !== this._currentTemplateLookup?.id) {
                (async () => {
                    this._currentTemplateLookup = template;
                    this._surveyLoaded = false;
                    this.destroy();
                    this.initializeSurvey();
                })();
            }
        }
        //input mode
        if (!context.parameters.mode.raw || context.parameters.mode.raw === SurveyType.ClientInput) {
            ReactDOM.render(React.createElement(Input, {
                schema: this._templateSchema ? merge(this._templateSchema, this._schema) : this._schema,
                populatedFields: this._populatedFields,
                readOnly: this._readOnly,
                onFieldValueChanged: (data) => {
                    this._surveyResults = JSON.stringify(data);
                    this._context.webAPI.updateRecord(this._entityName, this._entityId, {
                        [SurveyManager.dataAttributeName]: this._surveyResults,
                    });
                },
                onSurveyCompleted: async (data) => {
                    this._surveyResults = JSON.stringify(data);
                    this._context.webAPI.updateRecord(
                        this._entityName,
                        this._entityId,
                        {
                            [SurveyManager.dataAttributeName]: this._surveyResults,
                            statecode: 1
                        });
                }
            }), this._container);
            return;
        }
        //designer mode
        else {
            ReactDOM.render(React.createElement(Designer, {
                schema: this._templateSchema ? merge(this._templateSchema, this._schema) : this._schema,
                readOnly: this._context.mode.isControlDisabled,
                onChange: this._updateSchemaJSON.bind(this),
                onGetTemplateCustomFields: () => {
                    return this._getQuestionsForTemplate(this._entityName, this._entityId)
                },
                onReinitializeSurvey: () => {
                    this.destroy();
                    this.initializeSurvey();
                }
            }), this._container);
        }
    }

    public getOutputs(): IOutputs {
        return {
            schemaJSON: JSON.stringify(this._schema),
            template: this._currentTemplateLookup ? [this._currentTemplateLookup] : [],
            title: SurveyManager.LocalizationService.getLocalizedSurveyPropertyTitle(this._schema, 'title'),
            description: SurveyManager.LocalizationService.getLocalizedSurveyPropertyTitle(this._schema, 'description'),
        };
    }
    public destroy(): void {
        SurveyManager.clear();
        ReactDOM.unmountComponentAtNode(this._container);
    }
    private _updateSchemaJSON(currentSchema: ISchema): void {
        this._schema = currentSchema;
        this._notifyOutputChanged();
    }

    /**
     * Retrieves the questions for a template.
     * 
     * @param entityName - The name of the entity.
     * @param entityId - The ID of the entity.
     * @returns A promise that resolves to the response containing the questions.
     */
    private async _getQuestionsForTemplate(entityName: string, entityId: string): Promise<ComponentFramework.WebApi.RetrieveMultipleResponse> {
        const fetchXml = `<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>
        <entity name='${this._fieldEntityName}'>
        <attribute name='${this._customFieldPrimaryIdAttribute}' />
        <attribute name='br_name' />
        <attribute name='${this._schemaAttributeName}' />
            <link-entity name='${this._templateCustomFieldIntersectionTable}' from='${this._customFieldPrimaryIdAttribute}' to='${this._customFieldPrimaryIdAttribute}' visible='false' intersect='true'>
                <link-entity name='${entityName}' from='${this._templatePrimaryIdAttribute}' to='${this._templatePrimaryIdAttribute}' alias='ab'>
                    <filter type='and'>
                        <condition attribute='${this._templatePrimaryIdAttribute}' operator='eq' value='${entityId}' />
                    </filter>
                </link-entity>
            </link-entity>
        </entity>
        </fetch>`;
        return await this._context.webAPI.retrieveMultipleRecords(this._fieldEntityName, `?fetchXml=${encodeURIComponent(fetchXml)}`);
    }

    /**
     * Retrieves multiple records from the web API based on the schema and returns the response.
     * @returns A promise that resolves to a RetrieveMultipleResponse object or undefined.
     */
    private async _getQuestionsForInput(): Promise<ComponentFramework.WebApi.RetrieveMultipleResponse | undefined> {
        const questionIds: string[] = [];
        filterDeep(this._schema, (value, key) => {
            if (key === 'type' && value.startsWith('field-')) {
                if (!questionIds.includes(value)) {
                    questionIds.push(value);
                }
            }
        });
        if (questionIds.length === 0) {
            return undefined;
        }
        return await this._context.webAPI.retrieveMultipleRecords(this._fieldEntityName, `?$select=${this._schemaAttributeName}&$filter=${questionIds.map(id => `${this._customFieldPrimaryIdAttribute} eq ${id.split('field-')[1]}`).join(' or ')}`);
    }

    /**
     * Retrieves the survey schema based on the provided binded schema and the current mode.
     * @param bindedSchema The binded schema, if available.
     * @returns A promise that resolves to an array containing the survey schema and an optional template schema.
     */
    private async _getSurveySchema(bindedSchema: ISchema | null): Promise<[ISchema, ISchema?]> {
        switch (this._context.parameters.mode.raw) {
            case SurveyType.FieldDesigner: {
                return bindedSchema ? [bindedSchema] : [getDefaultCustomFieldSchema()];
            }
            case SurveyType.TemplateDesigner: {
                return bindedSchema ? [bindedSchema] : [getDefaultTemplateSchema()];
            }
            case SurveyType.FormDesigner: {
                const templateEntityId = this._context.parameters.template?.raw?.length > 0 && this._context.parameters.template.raw[0].id;
                if (!templateEntityId) {
                    return bindedSchema ? [bindedSchema] : [getDefaultSurveySchema()];
                }
                const template = await this._context.webAPI.retrieveRecord(this._templateEntityName, templateEntityId as string, `?$select=${this._schemaAttributeName}`);
                const templateSchema: ISchema = JSON.parse(template[this._schemaAttributeName]);
                const surveySchema: ISchema = bindedSchema ? bindedSchema : getDefaultSurveySchema();
                //propagate the template pages into survey schema => they will be stored in the survey scheme
                if (!surveySchema.pages && templateSchema.pages) {
                    surveySchema.pages = templateSchema.pages
                }
                return [surveySchema, templateSchema]
            }
            default: {
                const surveyId = this._context.parameters.survey.raw[0].id;
                const survey = await this._context.webAPI.retrieveRecord(this._surveyEntityName, surveyId, `?$select=${this._schemaAttributeName}, _${this._templateEntityName}_value`);
                const surveySchema: ISchema = JSON.parse(survey[this._schemaAttributeName]);
                if (!this._context.parameters.mode.raw) {
                    //TODO: fetching of correct title
                    //document.title = `Survey | TALXIS Portal`
                }
                const templateEntityId = survey[`_${this._templateEntityName}_value`];
                if (!templateEntityId) {
                    return [surveySchema];
                }
                const template = await this._context.webAPI.retrieveRecord(this._templateEntityName, templateEntityId, `?$select=${this._schemaAttributeName}`);
                const templateSchema: ISchema = JSON.parse(template[this._schemaAttributeName]);
                return [surveySchema, templateSchema];
            }
        }
    }

    /**
     * Initializes the survey.
     * @returns {Promise<void>} A promise that resolves once the survey is initialized.
     */
    private async initializeSurvey() {
        this._surveyInitialized = true;
        SurveyLocalizationService.init(this._context.userSettings, this._context.resources);
        const [schema, templateSchema] = await this._getSurveySchema(this._context.parameters.schemaJSON.raw ? JSON.parse(this._context.parameters.schemaJSON.raw) : null);
        this._schema = schema;
        this._templateSchema = templateSchema;
        SurveyManager.init(structuredClone(this._schema), this._context, this._templateSchema);
        switch (SurveyManager.SurveyType) {
            case SurveyType.FieldDesigner: {
                await SurveyManager.CustomControlService.registerControls(this._schema ? [this._schema] : undefined);
                break;
            }
            case SurveyType.TemplateDesigner: {
                if (!this._entityId) {
                    break;
                }
                const questions = await this._getQuestionsForTemplate(this._entityName ?? "", this._entityId ?? "");
                await SurveyManager.CustomControlService.registerControls(questions.entities.map(entity => JSON.parse(entity[this._schemaAttributeName])));
                SurveyManager.CustomQuestionService.registerQuestions(questions.entities.map(entity => {
                    return {
                        guid: `field-${entity[this._customFieldPrimaryIdAttribute]}`,
                        schema: JSON.parse(entity[this._schemaAttributeName])
                    }
                }));
                break;
            }
            case SurveyType.FormDesigner: {
                const templateEntityName = this._context.parameters.template?.raw?.length > 0 ? this._context.parameters?.template?.getTargetEntityType() : "";
                this._currentTemplateLookup = this._context.parameters.template.raw?.length > 0 ? this._context.parameters.template.raw[0] : undefined
                const templateEntityId = this._currentTemplateLookup?.id;
                if (!templateEntityId) {
                    break;
                }
                const questions = await this._getQuestionsForTemplate(templateEntityName, templateEntityId);
                await SurveyManager.CustomControlService.registerControls(questions.entities.map(entity => JSON.parse(entity[this._schemaAttributeName])));
                SurveyManager.CustomQuestionService.registerQuestions(questions.entities.map(entity => {
                    return {
                        guid: `field-${entity[this._customFieldPrimaryIdAttribute]}`,
                        schema: JSON.parse(entity[this._schemaAttributeName])
                    }
                }));
                break;
            }
            case SurveyType.ClientInput: {
                //prefill the fields
                if (this._context.parameters.schemaJSON.raw) {
                    this._populatedFields = JSON.parse(this._context.parameters.schemaJSON.raw);
                }
                else {
                    this._populatedFields = await this._getPrefilledFields(this._templateSchema ? merge(this._templateSchema, this._schema) : this._schema)
                    const result = await this._context.webAPI.createRecord(this._entityName, {
                        'br_data': JSON.stringify(this._populatedFields),
                        'br_name': SurveyManager.LocalizationService.getLocalizedSurveyPropertyTitle(this._schema, 'title'),
                        'br_Form@odata.bind': `/br_forms(${this._surveyLookup![0].id})`,
                        'br_Contact@odata.bind': `/contacts(${this._context.userSettings.userId})`
                    });
                    this._entityId = result.id;
                }
                const questions = await this._getQuestionsForInput();
                if (!questions) {
                    break;
                }
                await SurveyManager.CustomControlService.registerControls(questions.entities.map(entity => JSON.parse(entity[this._schemaAttributeName])));
                SurveyManager.CustomQuestionService.registerQuestions(questions.entities.map(entity => {
                    return {
                        guid: `field-${entity[this._customFieldPrimaryIdAttribute]}`,
                        schema: JSON.parse(entity[this._schemaAttributeName])
                    }
                }));
                break;
            }
        }
        this._surveyLoaded = true;
        this.updateView(this._context);
    }
    /**
     * Retrieves pre-filled fields based on the provided schema.
     * @param schema - The schema object used to determine the fields to pre-fill.
     * @returns A promise that resolves to an object containing the pre-filled fields.
     */
    private async _getPrefilledFields(schema: ISchema): Promise<IDictionary> {
        const getUserDataProp = (propName: string) => {
            for (const [key, value] of Object.entries(userData)) {
                if (key.toLowerCase().endsWith(propName.toLowerCase())) {
                    return value;
                }
            }
        }
        const fillBoundedToFields = (object: ISchemaElement) => {
            if (object.boundedTo) {
                result[object.name] = getUserDataProp(object.boundedTo);
            }

            for (var i = 0; i < Object.keys(object).length; i++) {
                if (typeof object[Object.keys(object)[i]] == "object") {
                    fillBoundedToFields(object[Object.keys(object)[i]]);
                }
            }
        };
        const result: any = {};
        const response = await this._context.webAPI.retrieveRecord(
            'contact', this._context.userSettings.userId, `?$select=br_identityclaim`
        );
        const userData = JSON.parse(response['br_identityclaim']);
        fillBoundedToFields(schema as any);
        return result;
    }
}
