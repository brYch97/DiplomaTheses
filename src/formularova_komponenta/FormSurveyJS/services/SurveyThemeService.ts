import React = require("react");
import ReactDOM = require("react-dom");
import { SurveyManager } from "./SurveyManager";
import { ThemeDesignerComponent } from "../Designers/components/ThemeDesigner/ThemeDesigner";
import { SurveyLocalizationService } from "./SurveyLocalizationService";
import { getTheme } from "@fluentui/react/lib/Styling";

export interface IVariable {
    name: string;
    value: string;
}
export class SurveyThemeService {
    private _storedVariables: IVariable[] | undefined;
    private _currentVariables: IVariable[];
    private _container: HTMLDivElement | undefined;
    private _onDismiss: () => void;
    private _localizationService: SurveyLocalizationService;

    public constructor(storedVariables: IVariable[] | undefined, localizationService: SurveyLocalizationService) {
        this._localizationService = localizationService;
        this._storedVariables = storedVariables;
        this._currentVariables = this._storedVariables ? structuredClone(this._storedVariables) : this.getDefaultVariables();
        this._addCurrentVariablesToDOM();
    }
    public setVariable(name: string, value: string) {
        this._currentVariables.find(x => x.name === name)!.value = value;
        this._addCurrentVariablesToDOM();
        this.render();
    }

    public setStoredVariables(storedVariables: IVariable[] | undefined) {
        this._storedVariables = storedVariables;
    }
    public getCurrentVariables(): IVariable[] {
        return structuredClone(this._currentVariables);
    }

    public getStoredVariables(): IVariable[] | undefined {
        return structuredClone(this._storedVariables);
    }

    public setVariablesToDefaultValues() {
        this._currentVariables = this.getDefaultVariables();
        this._addCurrentVariablesToDOM();
        this.render();
    }
    public setVariablesToStoredValues() {
        this._currentVariables = this._storedVariables ? structuredClone(this._storedVariables) : this.getDefaultVariables();
        this._addCurrentVariablesToDOM();
        this.render();
    }
    public clear() {
        const styleElement = document.getElementById('#surveyJS_custom_colors');
        if (styleElement) {
            document.head.removeChild(styleElement!);
        }
        this.dispose();
    }
    public render() {
        if (!this._container) {
            throw new Error("No container has been specified for Theme Designer!")
        }
        ReactDOM.render(React.createElement(ThemeDesignerComponent, {
            variables: structuredClone(this._currentVariables),
            onGetLabelForCSSVariable: (name) => this._localizationService.getLocalizedLabelForCSSVariable(name),
            onGetStoredVariables: this.getStoredVariables.bind(this),
            onSetVariablesToDefaultValues: this.setVariablesToDefaultValues.bind(this),
            onSetVariablesToStoredValues: this.setVariablesToStoredValues.bind(this),
            onSetVariable: this.setVariable.bind(this),
            onDismiss: this.dispose.bind(this),
        }), this._container);
    }
    public dispose(notifySchemeChanged?: boolean) {
        if (notifySchemeChanged) {
            SurveyManager.ChangeService.notifySchemeChanged();
        }
        if(!this._container) {
            return;
        }
        ReactDOM.unmountComponentAtNode(this._container);
        this._onDismiss();
    }
    public setComponentContainer(container: HTMLDivElement, onDismiss: () => void) {
        this._container = container;
        this._onDismiss = onDismiss;
    }
    public getDefaultVariables() {
        return [
            { name: "--primary", value: getComputedStyle(document.body).getPropertyValue('--talxis-main-themePrimary') ||  getTheme().palette.themePrimary},
            { name: "--primary-light", value: getComputedStyle(document.body).getPropertyValue('--talxis-main-themeLight') ||  getTheme().palette.themeLight},
            { name: "--primary-foreground", value: "#fff" },
            { name: "--primary-foreground-disabled", value: "#ffffff40" },
            { name: "--secondary", value: "#ff9814" },
            { name: "--secondary-light", value: "#ff981433" },
            { name: "--background", value: "#fff" },
            { name: "--background-dim", value: "#f3f3f3" },
            { name: "--background-dim-light", value: "#f9f9f9" },
            { name: "--background-semitransparent", value: "#90909080" },
            // { name: "--background-dark", value: "#f8f8f8" },
            // { name: "--background-dim-dark", value: "#f3f3f3" },
            { name: "--editor-background", value: "#f9f9f9" },
            { name: "--question-background", value: "#fff" },
            { name: "--foreground", value: "#161616" },
            { name: "--foreground-light", value: "#909090" },
            { name: "--foreground-dim", value: "#000000e8" },
            { name: "--foreground-dim-light", value: "#00000073" },
            { name: "--border", value: "#d6d6d6" },
            { name: "--border-light", value: "#eaeaea" },
            { name: "--border-inside", value: "#00000029" },
            { name: "--shadow-medium", value: "#0000001a" },
            { name: "--shadow-inner", value: "#00000026" },
            { name: "--red", value: "#e60a3e" },
            { name: "--red-light", value: "#e60a3e1a" },
            { name: "--green", value: "#19b394" },
            { name: "--green-light", value: "#19b3941a" },
            { name: "--blue-light", value: "#437fd91a" },
            { name: "--font-family", value: '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;' },
            { name: "--base-unit", value: "8px" },
        ]
    }
    private _addCurrentVariablesToDOM() {
        let styleElement = document.getElementById('#surveyJS_custom_colors');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.setAttribute('id', '#surveyJS_custom_colors')
        }
        let css = '[class$="FormSurveyJS"] {\n';
        for (const variable of this._currentVariables) {
            css += `  ${variable.name}: ${variable.value};\n`;
        }
        css += '}'
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }
}