import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from 'react';
import { Slider } from "./Slider";

export class SliderVirtual implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private _value: number;
    private _notifyOutputChanged: () => void;
    constructor() {

    }
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary): void {
        this._notifyOutputChanged = notifyOutputChanged;
    }
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        return React.createElement(Slider, {
            value: context.parameters.value.raw as number,
            min: context.parameters.min.raw ?? context.parameters.value.attributes?.MinValue,
            max: context.parameters.max.raw ?? context.parameters.value.attributes?.MaxValue,
            step: context.parameters.step.raw as number,
            onChange: (value: number) => {
                this._value = value;
                this._notifyOutputChanged();
            }
        })
    }

    public getOutputs(): IOutputs {
        return {
            value: this._value
        };
    }
    public destroy(): void {

    }
}
