import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from 'react';
import { SliderComponent } from "./SliderComponent";

export class SliderVirtual implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _value: number;
    private _notifyOutputChanged: () => void;
    constructor() {

    }
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary): void {
        this._notifyOutputChanged = notifyOutputChanged;
    }
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const min = context.parameters.min;
        const max = context.parameters.max;
        const step = context.parameters.step;
        const valueColumnAttributes = context.parameters.value.attributes;

        return React.createElement(SliderComponent, {
            value: context.parameters.value.raw as number,
            min: min.raw ?? valueColumnAttributes?.MinValue,
            max: max.raw ?? valueColumnAttributes?.MaxValue,
            step: step.raw as number,
            disabled: context.mode.isControlDisabled,
            onChange: (value) => {
                this._value = value;
                this._notifyOutputChanged();
            }
        });
    }

    public getOutputs(): IOutputs {
        return {
            value: this._value
        };
    }
    public destroy(): void {

    }
}
