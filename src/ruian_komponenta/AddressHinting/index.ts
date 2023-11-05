import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { AddressPicker } from "./AddressPicker/AddressPicker";

export class AddressHinting implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _base64: string;
    private _notifyOutputChanged: () => void;
    constructor() {

    }
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement): void {
        if(context.parameters.base64.raw === 'val') {
            context.parameters.base64.raw = null;
        }
        this._container = container;
        this._notifyOutputChanged = notifyOutputChanged;
    }
    public updateView(context: ComponentFramework.Context<IInputs>): void {
       ReactDOM.render(React.createElement(AddressPicker, {
            base64: context.parameters.base64.raw,
            disabled: context.mode.isControlDisabled,
            onAddressSelected: (base64) => {
                this._base64 = base64
                this._notifyOutputChanged();
            }

       }), this._container)
    }

    public getOutputs(): IOutputs {
        return {
            base64: this._base64
        }
    }
    public destroy(): void {

    }
}
