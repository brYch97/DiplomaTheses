/* eslint-disable no-unused-vars */
import * as React from 'react';
import { SurveyCreatorComponent } from "survey-creator-react";
import "survey-core/survey.i18n.js";
import "survey-creator-core/survey-creator-core.i18n.js";
import "survey-core/defaultV2.css";
import "survey-creator-core/survey-creator-core.css";
import { IDesignerProps } from '../Designer/Designer';
import { ISchema } from '../../interfaces/ISchema';
import { SurveyLocalizationService } from '../../services/SurveyLocalizationService';

export const getDefaultTemplateSchema = (): ISchema => {
    const currentLocale = SurveyLocalizationService.get().currentLocale;
    const schema: ISchema = {
        "logoPosition": "right",
        "title":  SurveyLocalizationService.get().getString("newTemplateTitle"),
        "locale": currentLocale
    }
    if(currentLocale !== 'en') {
        schema.title = {
            [currentLocale]: SurveyLocalizationService.get().getString("newTemplateTitle")
        }
    }
    return schema;
}
/**
 * Functional component that creates a survey designer for template.
 */
export const TemplateDesigner: React.FC<IDesignerProps> = (props) => {
    const creator = React.useMemo(() => {
        return props.onCreatorInitialization({
            showSurveyTitle: true,
        })
    }, [])
    return (
        <div>
            {
                //@ts-ignore - missing typings
                <SurveyCreatorComponent creator={creator} />
            }
        </div>
    )
};