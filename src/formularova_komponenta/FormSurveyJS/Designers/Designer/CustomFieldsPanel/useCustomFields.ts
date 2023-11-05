import { useEffect, useRef, useState } from "react";
import { SurveyManager } from "../../../services/SurveyManager";
import * as deepEqual from 'fast-deep-equal';
import { IAutoCompleteItemProps } from "@talxis/react-components/dist/components/Autocomplete";

interface ICustomField {
    id: string;
    title: string;
}


export const useCustomFields = (
    onGetTemplateCustomFields: () => Promise<ComponentFramework.WebApi.RetrieveMultipleResponse>,
    onReinitializeSurvey: () => void
): [
        ICustomField[],
        boolean,
        boolean,
        () => void,
        (id: string) => void,
        (query?: string) => Promise<IAutoCompleteItemProps[]>,
        () => Promise<void>
    ] => {
    const initialCustomFieldsRef = useRef<ICustomField[]>([]);
    const [customFields, setCustomFields] = useState<ICustomField[]>([]);
    const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const webAPI = SurveyManager.PcfContext.webAPI;

    const addField = (item?: string | IAutoCompleteItemProps) => {
        if (!item || typeof item === 'string') {
            return;
        }
        setCustomFields([...customFields, {
            id: item.key,
            title: item.text!
        }])
    }

    const removeField = (id: string) => {
        setCustomFields(customFields.filter(x => x.id !== id))
    }
    const search = async (query?: string): Promise<IAutoCompleteItemProps[]> => {
        let filter = `${customFields.map(x => `${SurveyManager.customFieldPrimaryIdAttribute} ne ${x.id}`).join(' and ')}`;
        if(filter) {
            filter = `(${filter}) and `;
        }
        //http://localhost:3000/br_CitizenPortal/control/form?data={%22entityName%22:%22br_response%22,%22extraqs%22:%22br_form={aacbf963-e170-ee11-8179-0022489ba2a7}%22}
        if (query) {
            filter+=`contains(br_name, '${query}') and `
        }
        filter = `&$filter=${filter}statecode eq 0`;
        //TODO: should come from survey manager
        const result = await webAPI.retrieveMultipleRecords(SurveyManager.fieldEntityName, `?$select=br_name, ${SurveyManager.schemaAttributeName}${filter}`);
        return result.entities.map(entity => {
            return {
                key: entity[SurveyManager.customFieldPrimaryIdAttribute],
                text: entity['br_name']
            }
        })
    }
    const save = async () => {
        setIsSaving(true);
        const associatePromise = associate();
        const disassociatePromises = diassociate();
        await Promise.all([...disassociatePromises, associatePromise]);
        onReinitializeSurvey();
    }

    const diassociate = (): PromiseLike<any>[] => {
        const customFieldsToDiassociate = initialCustomFieldsRef.current.filter(x => !customFields.find(y => x.id === y.id));
        if (customFieldsToDiassociate.length === 0) {
            return [];
        }
        const promises: PromiseLike<any>[] = [];
        for (const customField of customFieldsToDiassociate) {
            const request = {
                target: {
                    entityType: SurveyManager.templateEntityName,
                    //@ts-ignore - entityId missing in typings
                    id: window.Xrm.Utility.getPageContext().input.entityId
                },
                relatedEntityId: customField.id,
                relationship: SurveyManager.templateCustomFieldRelationshipName,
                getMetadata: () => {
                    return {
                        boundParameter: null,
                        parameterTypes: {},
                        operationType: 2,
                        operationName: 'Disassociate'
                    }
                }
            }
            promises.push(window.Xrm.WebApi.online.execute(request))
        }
        return promises;
    }
    const associate = (): PromiseLike<any> | null => {
        const customFieldsToAssociate = customFields.filter(x => !initialCustomFieldsRef.current.find(y => x.id === y.id));
        if (customFieldsToAssociate.length === 0) {
            return null
        }
        const manyToManyAssociateRequest = {
            getMetadata: () => ({
                boundParameter: null,
                parameterTypes: {},
                operationType: 2,
                operationName: "Associate"
            }),

            relationship: SurveyManager.templateCustomFieldRelationshipName,
            target: {
                entityType: SurveyManager.templateEntityName,
                //@ts-ignore - entityId missing in typings
                id: window.Xrm.Utility.getPageContext().input.entityId
            },
            relatedEntities: customFieldsToAssociate.map(field => {
                return {
                    entityType: SurveyManager.fieldEntityName,
                    id: field.id
                }
            })
        }
        return window.Xrm.WebApi.online.execute(manyToManyAssociateRequest);
    }

    useEffect(() => {
        (async () => {
            const result = await onGetTemplateCustomFields();
            initialCustomFieldsRef.current = result.entities.map((entity => {
                return {
                    id: entity[SurveyManager.customFieldPrimaryIdAttribute],
                    title: entity['br_name']
                };
            }))
            setCustomFields([...initialCustomFieldsRef.current]);
        })();
    }, []);

    useEffect(() => {
        setUnsavedChanges(!deepEqual(customFields, initialCustomFieldsRef.current))
    }, [customFields]);

    return [customFields, unsavedChanges, isSaving, addField, removeField, search, save]
};