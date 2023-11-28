/* eslint-disable no-unused-vars */
import * as React from 'react';
import { SurveyCreatorComponent } from "survey-creator-react";
import { ISchema, QuestionType } from '../../interfaces/ISchema';
import { fieldDesignerStyles } from './styles';
import { IDesignerProps } from '../Designer/Designer';
import { SurveyLocalizationService } from '../../services/SurveyLocalizationService';

export const getDefaultCustomFieldSchema = (): ISchema => {
    return {
        logoPosition: "right",
        "pages": [
            {
                "name": "page1",
                "elements": [
                    {
                        "title": SurveyLocalizationService.get().getString("newCustomFieldTitle"),
                        "type": QuestionType.Text,
                        "name":  SurveyLocalizationService.get().getString("customField")
                    }
                ]
            }
        ]
    }
}

/**
 * Functional component that creates a survey designer for custom fields.
 */
export const FieldDesigner: React.FC<IDesignerProps> = (props) => {
    const styles = React.useMemo(() => fieldDesignerStyles, [])
    const creator = React.useMemo(() => {
        const creator = props.onCreatorInitialization({
            showSurveyTitle: false,
            allowModifyPages: false,
        })
        //@ts-ignore
        creator.onShowingProperty.add((_, options) => {
            const type = options.obj.getType();
            if (type === 'survey' || type === 'page') {
                options.canShow = false;
            }
        });
        return creator;
    }, []);
    return (
        <div className={styles.root}>
            {
                //@ts-ignore - missing typings
                <SurveyCreatorComponent creator={creator} />
            }
        </div>
    )
};
