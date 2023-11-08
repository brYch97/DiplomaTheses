import { ISchema } from "../interfaces/ISchema";
import * as deepEqual from 'fast-deep-equal';
import { SurveyThemeService } from "./SurveyThemeService";
import { SurveyManager, SurveyType } from "./SurveyManager";
import React = require("react");
import ReactDOM = require("react-dom");
import { ChangeNotificationComponent } from "../Designers/components/ChangeNotification/ChangeNotification";
import { IExtentedSurveyCreator } from "../Designers/Designer/Designer";

/**
 * Service that notifies the developer about changes in the survey schema.
 */
export class SurveyChangesService {
    /**
 * The current schema.
 * @private
 */
    private _currentSchema: ISchema;

    /**
     * The stored (saved) schema.
     * @private
     */
    private _storedSchema: ISchema;

    /**
     * The theme service.
     * @private
     */
    private _themeService: SurveyThemeService;

    /**
     * The template schema.
     * @private
     */
    private _templateSchema: ISchema | undefined;

    /**
     * The notification message container.
     * @private
     */
    private _notificationMesssageContainer: HTMLDivElement;

    /**
     * The creator.
     * @private
     */
    private _creator: IExtentedSurveyCreator;
    private _onChangeHandler: (currentSchema: ISchema) => void = () => {
        throw new Error('No change handler has been specified');
    }
    /**
 * Constructs a new instance of the SurveyChangesService.
 * @param {ISchema} surveySchema - The survey schema.
 * @param {SurveyThemeService} themeService - The theme service.
 * @param {ISchema} [templateSchema] - The template schema.
 */
    public constructor(surveySchema: ISchema, themeService: SurveyThemeService, templateSchema?: ISchema) {
        this._templateSchema = templateSchema;
        this.setStoredSchema(surveySchema);
        this._themeService = themeService;
        this._currentSchema = structuredClone(surveySchema);
    }
    /**
 * Gets the creator.
 * @throws {Error} If no creator has been set.
 * @returns {IExtentedSurveyCreator} The creator.
 */
    public get creator() {
        if (!this._creator) {
            throw new Error('No creator has been set!');
        }
        return this._creator;
    }
        /**
     * Sets the creator.
     * @param {IExtentedSurveyCreator} creator - The creator.
     */
    public set creator(creator: IExtentedSurveyCreator) {
        this._creator = creator;
    }
        /**
     * Sets the stored schema.
     * @param {ISchema} schema - The schema.
     */
    public setStoredSchema(schema: ISchema) {
        this._storedSchema = schema;
    }
    /**
 * Notifies that the scheme has changed.
 * @param {string} [json] - The JSON representation of the schema.
 */
    public notifySchemeChanged(json?: string): void {
        if (json) {
            this._currentSchema = JSON.parse(json);
        }
        switch (SurveyManager.SurveyType) {
            case SurveyType.FieldDesigner: {
                break;
            }
            case SurveyType.FormDesigner: {
                const currentVariables = this._themeService.getCurrentVariables();
                const defaultVariables = this._themeService.getDefaultVariables();
                if (!deepEqual(currentVariables, defaultVariables)) {
                    this._currentSchema.cssVariables = currentVariables;
                }
                if (!this._templateSchema) {
                    break;
                }
                for (const [key, schemaObj] of Object.entries(this._currentSchema)) {
                    //save the content of pages, title and description directly to survey schema
                    if (key === 'pages' || key === 'title' || key === 'description') {
                        continue;
                    }
                    const templateObj = this._templateSchema[key];
                    if (schemaObj && templateObj) {
                        if (deepEqual(schemaObj, templateObj)) {
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
                if (deepEqual(currentVariables, defaultVariables)) {
                    delete this._currentSchema.cssVariables;
                }
                break;
            }

        }
        this._onChangeHandler(this._getCurrentSchema())
        this.render();
    }
     /**
     * Sets the notification message container.
     * @param {HTMLDivElement} container - The container.
     */
    public setNotificationMessageContainer(container: HTMLDivElement) {
        this._notificationMesssageContainer = container;
    }
    /**
     * Sets the change handler.
     * @param {(currentSchema: ISchema) => void} handler - The handler.
     */
    public setOnChangeHandler(handler: (currentSchema: ISchema) => void) {
        this._onChangeHandler = handler;
    }
    /**
     * Renders the change notification message.
     */
    public render() {
        ReactDOM.render(React.createElement(ChangeNotificationComponent, {
            currentSchema: this._getCurrentSchema(),
            storedSchema: this._getStoredSchema(),
        }), this._notificationMesssageContainer);
    }
    /**
     * Checks if the current schema is different from the stored schema.
     * @returns {boolean} True if the current schema is different from the stored schema, false otherwise.
     */
    public isDirty() {
        return !deepEqual(this._currentSchema, this._storedSchema)
    }
    /**
    * Gets the current schema.
    * @returns {ISchema} The current schema.
    */
    public getCurrentSchema() {
        return this._getCurrentSchema();
    }
    /**
 * Gets the stored schema.
 * @private
 * @returns {ISchema} The stored schema.
 */
    private _getStoredSchema() {
        return structuredClone(this._storedSchema)
    }

    /**
     * Gets the current schema.
     * @private
     * @returns {ISchema} The current schema.
     */
    private _getCurrentSchema() {
        return structuredClone(this._currentSchema)
    }

}