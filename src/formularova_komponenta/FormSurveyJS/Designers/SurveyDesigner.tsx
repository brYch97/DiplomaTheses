/* eslint-disable no-unused-vars */
import * as React from 'react';
import { SurveyCreatorComponent } from "survey-creator-react";
import { IDesignerProps } from './Designer/Designer';
import { ISchema } from '../interfaces/ISchema';
import { SurveyLocalizationService } from '../services/SurveyLocalizationService';

export const getDefaultSurveySchema = (): ISchema => {
    const schema: ISchema = {
        "logoPosition": "right",
        "title": SurveyLocalizationService.get().getString("newSurveyTitle")
    }
    const currentLocale = SurveyLocalizationService.get().currentLocale;
    schema.locale = currentLocale
    if(currentLocale !== 'en') {
        schema.title = {
            [currentLocale]: SurveyLocalizationService.get().getString("newSurveyTitle")
        }
    }
    return schema;
}
/**
 * Functional component that creates a survey designer for form.
 */
export const SurveyDesigner: React.FC<IDesignerProps> = (props) => {
    const creator = React.useMemo(() => {
        return props.onCreatorInitialization({
            showSurveyTitle: true,
            allowModifyPages: true
        });
    }, []);
    return (
        <div>
            {
                //@ts-ignore - missing typings
                <SurveyCreatorComponent creator={creator} />
            }
        </div>
    )
};