import { useState } from "react";
import * as React from 'react';
import { ISchema } from "../../../interfaces/ISchema";
import { SurveyManager } from "../../../services/SurveyManager";
import { FormLayoutConvertor } from "./utils/FormLayoutConvertor";
import { SurveyLocalizationService } from "../../../services/SurveyLocalizationService";

/**
 * @function useFormUploadDialog
 * @description Custom hook that manages the state and behavior of the form upload dialog.
 * @param {function} onDismiss - The function to be called when the dialog is dismissed.
 * @returns {Array} An array containing the state and behavior of the form upload dialog.
 */

export const useFormUploadDialog = (onDismiss: () => void): [
    File | null,
    string | null,
    ISchema | null,
    boolean,
    string | null,
    React.Dispatch<React.SetStateAction<File | null>>,
    () => Promise<void>,
    () => void
] => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
    const [formLayoutSchema, setFormLayoutSchema] = useState<ISchema | null>(null);
    const [isCreatingFormStructure, setIsCreatingFormStructure] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const createFormLayoutSchema = async () => {
        setIsCreatingFormStructure(true);
        setErrorMessage(null);
        const response = await fetch('https://prod-110.westeurope.logic.azure.com:443/workflows/0b145e5fdbd44cbdb0290af0bb3fe202/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=5T5l_sSr4UBPWDkCWagk1k9F6wXVzxdTVwIPaPjRUdQ', {
            method: 'POST',
            body: uploadedFile
        })
        if(!response.ok) {
            setErrorMessage(SurveyLocalizationService.get().getString('conversionFail'));
            setIsCreatingFormStructure(false);
            return;
        }
        const result = await response.json();
        setFormLayoutSchema(FormLayoutConvertor.toSchema(result));
        setIsCreatingFormStructure(false);
    };

    const closeDialog = () => {
        if (!formLayoutSchema) {
            onDismiss();
            return;
        }
        const confirmationResult = confirm(SurveyLocalizationService.get().getString('conversionWarning'));
        if (!confirmationResult) {
            return;
        }
        const currentSchema = JSON.parse(SurveyManager.ChangeService.creator.text) as ISchema;
        if (formLayoutSchema.title) {
            currentSchema.title = formLayoutSchema.title;
        }
        currentSchema.pages = formLayoutSchema.pages;
        SurveyManager.ChangeService.creator.text = JSON.stringify(currentSchema);
        SurveyManager.ChangeService.notifySchemeChanged(SurveyManager.ChangeService.creator.text);
        onDismiss();
    };

    React.useEffect(() => {
        if (!uploadedFile) {
            setFilePreviewUrl(null);
            setFormLayoutSchema(null);
            setErrorMessage(null);
            return;
        }
        const previewBlobUrl = URL.createObjectURL(uploadedFile);
        setFilePreviewUrl(`${previewBlobUrl}#toolbar=0`);
    }, [uploadedFile]);
    return [
        uploadedFile,
        filePreviewUrl,
        formLayoutSchema,
        isCreatingFormStructure,
        errorMessage,
        setUploadedFile,
        createFormLayoutSchema,
        closeDialog
    ]
};