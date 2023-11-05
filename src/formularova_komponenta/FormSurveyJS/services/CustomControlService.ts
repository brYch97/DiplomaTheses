import { IInputs } from "../generated/ManifestTypes";
import { ISchema } from "../interfaces/ISchema";
import { CustomControl } from "../CustomControls/CustomControl";
import { ElementFactory } from "survey-core";
import { SurveyManager, SurveyType } from "./SurveyManager";

export class CustomControlService {
    public DomParser: DOMParser = new DOMParser();
    public registeredControls: CustomControl[] = [];
    private _context: ComponentFramework.Context<IInputs>;
    //filtering out native PCF's
    private _pcfPublisherWhitelist = ['brych'];

    public constructor(context: ComponentFramework.Context<IInputs>) {
        this._context = context;
    }

    /**
 * Registers custom controls so they are available as a question type in SurveyJS.
 * @param {string[]} names - An array of control schemes to be registered, if empty, all custom controls that are available in the environment will be registered.
 */
    public async registerControls(schemes?: ISchema[]): Promise<void> {
        const customControlFields: {
            name: string;
            scheme: ISchema;
        }[] = [];
        if (schemes) {
            for (const scheme of schemes) {
                //@ts-ignore - replace to format that can be passed to retrieveMultipleRecords
                const type = scheme.pages[0].elements[0].type
                if (!type.startsWith('pcf')) {
                    continue;
                }
                //do not add if PCF of this type is already present
                if(customControlFields.find(field => field.name === type)) {
                    continue;
                }
                customControlFields.push({
                    //remove the pcf_ prefix
                    name: type.substring(4),
                    scheme: scheme
                })
            }
        }
        //do not register any PCF's if schemes were not provided and we are not in FieldDesigner mode
        if(customControlFields.length === 0 && SurveyManager.SurveyType !== SurveyType.FieldDesigner) {
            return;
        }
        //https://devbox-1378.crm4.dynamics.com/api/data/v9.1/customcontrols?$filter=(startswith(name, 'talxis') or startswith(name, 'brych') )
        let filter = '&$filter='
        if(SurveyManager.SurveyType === SurveyType.FieldDesigner) {
            filter += `(${this._pcfPublisherWhitelist.map(x => `startswith(name, '${x}')`).join(' or ')})`
        }
        else {
            filter += `${customControlFields.map(field => `endswith(name, '${this._normalizeCustomControlName(field.name, "Xrm")}')`).join(' or ')}`
        }
        let result;
        //@ts-ignore - Portal internals
        if(window.TALXIS?.Portal) {
            //@ts-ignore - Portal internals
            result = await window.TALXIS.Portal.Utility.Metadata.retrieveMultipleRecords(`v9.1/customcontrols?$select=name,manifest${filter}`)
        }
        else {
            result = await this._context.webAPI.retrieveMultipleRecords('customcontrol', `?$select=name,manifest${filter}`);
        }

        for (const entity of result.entities) {
            const scheme = customControlFields.find(field => field.name === this._normalizeCustomControlName(entity.name, "SurveyJS") )?.scheme;
            this.registeredControls.push(new CustomControl(entity.name, entity.manifest, this._context, scheme))
        }
    }

    public clear() {
        for(const registeredControl of this.registeredControls) {
            ElementFactory.Instance.unregisterElement(registeredControl.surveyjsName, true)
        }
    }

    private _normalizeCustomControlName(name: string, normalizeFor: "Xrm" | "SurveyJS") {
        for (const publisher of this._pcfPublisherWhitelist) {
            if (name.startsWith(publisher + '_')) {
                name = name.substring(publisher.length + 1);
                break; // Exit the loop once a match is found
            }
        }
    
        if (normalizeFor === 'Xrm') {
            //@ts-ignore - replaceAll not part of types
            return name.replaceAll('_', '.').toLowerCase();
        }
        //@ts-ignore - replaceAll not part of types
        return name.replaceAll('.', '_').toLowerCase();
    }

/*     private _normalizeCustomControlName(name: string, normalizeFor: "Xrm" | "SurveyJS") {
        //TODO: this should get handled better
        //ugly hack to remove talxis_ prefix
        //consider using wildcard characters - https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/query-data-web-api
        if (name.startsWith('talxis_talxis_')) {
            name = name.substring(7)
        }
        else if(name.startsWith('talxis_')) {
            name = name.split('talxis_')[1];
        }
        if(normalizeFor === 'Xrm') {
            //@ts-ignore - replaceAll not part of types
            return name.replaceAll('_', '.').toLowerCase();
        }
        //@ts-ignore - replaceAll not part of types
        return name.replaceAll('.', '_').toLowerCase();
    } */
}