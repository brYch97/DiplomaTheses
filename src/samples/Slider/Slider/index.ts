import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Slider as SliderComponent } from '@fluentui/react/lib/Slider';

export class Slider implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _value: number;
    private _notifyOutputChanged: () => void;
    constructor() {

    }
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._container = container;
        this._notifyOutputChanged = notifyOutputChanged;
    }
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        ReactDOM.render(React.createElement(SliderComponent, {
            value: context.parameters.value.raw as number,
            min: context.parameters.min.raw ?? context.parameters.value.attributes?.MinValue,
            max: context.parameters.max.raw ?? context.parameters.value.attributes?.MaxValue,
            step: context.parameters.step.raw as number,
            disabled: context.mode.isControlDisabled,
            onChange: (value) => {
                this._value = value;
                this._notifyOutputChanged();
            }
        }), this._container);
    }

    public getOutputs(): IOutputs {
        return {
            value: this._value
        };
    }
    public destroy(): void {

    }
}
