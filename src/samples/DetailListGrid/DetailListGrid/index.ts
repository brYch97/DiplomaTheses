import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IProps, DetailListGridControl } from './DetailListGridComponent'

export class DetailListGrid implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _context: ComponentFramework.Context<IInputs>;
	private _container: HTMLDivElement;
	private _dataSetVersion: number;
	private _props: IProps;

	constructor() {

	}

	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		context.mode.trackContainerResize(true);
		this._container = container;
		this._context = context;
		this._dataSetVersion = 0;
		this._props = {
			pcfContext: this._context,
			dataSetVersion: this._dataSetVersion
		}

		context.parameters.sampleDataSet.paging.setPageSize(5000);
	}
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		const dataSet = context.parameters.sampleDataSet;
		if (dataSet.loading) return;
		this._props.dataSetVersion = this._dataSetVersion++;
		ReactDOM.render(
			React.createElement(DetailListGridControl, this._props),
			this._container);
	}
	public getOutputs(): IOutputs {
		return {};
	}

	public destroy(): void {

	}

}