
import { useFormUploadDialog } from './useFormUploadDialog'
import { Dialog, DialogFooter } from '@fluentui/react/lib/Dialog';
import * as React from 'react';
import { ICustomPropertyGridComponentChild } from '../PropertyGridComponent/CustomPropertyGridComponent';
import { DefaultButton, IconButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { formUploadDialogStyles } from './styles';
import { useId } from '@fluentui/react-hooks';
import { Icon } from '@fluentui/react/lib/components/Icon';
import { Text } from '@fluentui/react/lib/Text';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { SurveyLocalizationService } from '../../../services/SurveyLocalizationService';


/**
 * @description Functional component that handles machine conversion of PDF documents.
 */

export const FormUploadDialog: React.FC<ICustomPropertyGridComponentChild> = (props, ref) => {
    const fileUploadId = useId();
    const [
        uploadedFile,
        filePreviewUrl,
        formLayoutStructure,
        isCreatingFormStructure,
        errorMessage,
        setUploadedFile,
        createFormLayoutSchema,
        closeDialog
    ] = useFormUploadDialog(props.onDismiss);

    return (
        <Dialog
            hidden={false}
            modalProps={{
                className: formUploadDialogStyles.root,
            }}

            dialogContentProps={{
                title: SurveyLocalizationService.get().getString('convertAI'),
                showCloseButton: true,
            }}
            onDismiss={closeDialog}>
            {isCreatingFormStructure &&
                <MessageBar>
                    {SurveyLocalizationService.get().getString('uploadPending')}
                </MessageBar>
            }
            {formLayoutStructure && 
                <MessageBar messageBarType={MessageBarType.success}>
                    {SurveyLocalizationService.get().getString('conversionSuccess')}
                </MessageBar>
            }
            {errorMessage && 
                <MessageBar messageBarType={MessageBarType.error}>
                    {errorMessage}
                </MessageBar>
            }
            {filePreviewUrl && uploadedFile &&
                <div data-is-loading-structure={isCreatingFormStructure} className={formUploadDialogStyles.iframeWrapper}>
                    <iframe src={filePreviewUrl} />
                </div>
            }
            {!uploadedFile ?
                <>
                    <label htmlFor={fileUploadId} className={formUploadDialogStyles.uploadLabel}>
                        <Icon iconName='Upload' /> <Text>{SurveyLocalizationService.get().getString('uploadPDF')}</Text>
                    </label>
                    <input
                        id={fileUploadId}
                        type='file'
                        accept='application/pdf'
                        onChange={(e) => setUploadedFile(e.target.files ? e.target.files[0] : null)} />
                </>
                :
                <div className={formUploadDialogStyles.deleteFile}>
                    <Text title={uploadedFile.name}>{uploadedFile.name}</Text>
                    <IconButton
                        disabled={isCreatingFormStructure}
                        iconProps={{ iconName: 'Delete' }}
                        onClick={() => setUploadedFile(null)} />
                </div>
            }

            <DialogFooter>
                <PrimaryButton
                    disabled={!uploadedFile || isCreatingFormStructure || formLayoutStructure !== null}
                    onClick={createFormLayoutSchema}
                    text='OK' />
                <DefaultButton
                    text={SurveyLocalizationService.get().getString('cancel')}
                    onClick={closeDialog} />
            </DialogFooter>
        </Dialog>
    );
};