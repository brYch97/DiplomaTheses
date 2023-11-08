import * as React from 'react';
import ThemeDesigner from './ThemeDesigner/ThemeDesigner';
import { PropertyGridComponent } from 'survey-creator-react';
import { CustomPropertyGridComponent } from './PropertyGridComponent/CustomPropertyGridComponent';
import { SurveyManager, SurveyType } from '../../services/SurveyManager';
import { FormUploadDialog } from './FormUploadDialog/FormUploadDialog';

/**
 * @function PropertyGridComponentWrapper
 * @description Functional component that wraps the PropertyGridComponent and conditionally renders the options to show ThemeDesigner and FormUploadDialog components.
 * @param {PropertyGridComponentWrapperProps} props - The properties for the PropertyGridComponentWrapper component.
 * @returns {React.FC} The PropertyGridComponentWrapper component.
 */
export const PropertyGridComponentWrapper: React.FC<{ model: any }> = (props) => {
    return (
        <>
            <PropertyGridComponent model={props.model}></PropertyGridComponent>
            {SurveyManager.SurveyType !== SurveyType.FieldDesigner &&
                <CustomPropertyGridComponent
                    title={SurveyManager.LocalizationService.getString('theme')}
                    onRenderContent={(onDismiss) => <ThemeDesigner onDismiss={onDismiss} />}>
                </CustomPropertyGridComponent>
            }
            {SurveyManager.SurveyType === SurveyType.FormDesigner &&
                <CustomPropertyGridComponent
                    title={SurveyManager.LocalizationService.getString('convertAI')}
                    onRenderContent={(onDismiss) => <FormUploadDialog onDismiss={onDismiss} />} />
            }
        </>
    )
};