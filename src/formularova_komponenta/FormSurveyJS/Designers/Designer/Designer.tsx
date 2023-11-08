
/*global Xrm */
import * as React from 'react';
import { ICreatorOptions } from "survey-creator-core";
import { FieldDesigner } from '../FieldDesigner/FieldDesigner';
import { TemplateDesigner } from '../TemplateDesigner/TemplateDesigner';
import { SurveyDesigner } from '../SurveyDesigner';
import { SurveyCreator } from 'survey-creator-react';
import { ISurveyCreator } from 'survey-react-ui';
import { ISchema } from '../../interfaces/ISchema';

import "survey-core/survey.i18n.js";
import "survey-creator-core/survey-creator-core.i18n.js";
import "survey-core/defaultV2.css";
import "survey-creator-core/survey-creator-core.css";
import { SurveyManager, SurveyType } from '../../services/SurveyManager';
import { designerStyles } from './styles';
import { CustomFieldsPanel } from './CustomFieldsPanel/CustomFieldsPanel';

//needed since typings for the creator are incomplete for some reason #smh
export interface IExtentedSurveyCreator extends ISurveyCreator {
    text: string;
    readOnly: boolean;
    saveSurveyFunc: () => void;
    onActiveTabChanged: {
        add: (callback: () => void) => void;
    }
    dispose: () => void;
    toolbox: {
        allowExpandMultipleCategories: boolean;
        forceCompact: boolean;
        showCategoryTitles: boolean;
        keepAllCategoriesExpanded: boolean;
        items: {
            category: string;
        }[];
        categories: {
            name: string;
            items: {
                category: string;
            }[]
        }[]
        removeItem: (name: string) => void;
    },
    survey: {
        title: string;
        description: string;
    }
}

export interface IDesignerWrapper {
    schema: ISchema;
    readOnly: boolean;
    onChange: (currentSchema: ISchema) => void;
    onReinitializeSurvey: () => void;
    onGetTemplateCustomFields: () => Promise<ComponentFramework.WebApi.RetrieveMultipleResponse>;
}

export interface IDesignerProps {
    onCreatorInitialization: (options: ICreatorOptions) => void;
}

const DEFAULT_CREATOR_OPTIONS: ICreatorOptions = {
    isAutoSave: true,
    haveCommercialLicense: false,
    showJSONEditorTab: false,
    showTranslationTab: true,
}

export const Designer: React.FC<IDesignerWrapper> = (props) => {
    const creatorRef = React.useRef<IExtentedSurveyCreator>();
    const creatorContainerRef = React.useRef<HTMLDivElement>(null);
    const notificationContainerRef = React.useRef<HTMLDivElement>(null);
    const hasPredefinedFields = SurveyManager.CustomQuestionService.getCustomQuestions().some(field => field.json.showInToolbox !== false) ? true : false;
    const [customFieldsPanelOpen, setCustomFieldsPanelOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        SurveyManager.ChangeService.setNotificationMessageContainer(notificationContainerRef.current!);
        SurveyManager.ChangeService.setOnChangeHandler(props.onChange);
        SurveyManager.ChangeService.render();
    }, []);
    React.useEffect(() => {
        if(SurveyManager.SurveyType !== SurveyType.TemplateDesigner || props.readOnly) {
            return;
        }
        injectAddFieldBtn();
        return () => {
            creatorRef.current?.dispose();
        }
    }, []);
    React.useEffect(() => {
        if (!creatorRef.current) {
            return;
        }
        creatorRef.current.readOnly = props.readOnly;
    }, [props.readOnly]);

    const initializeCreator = (options: ICreatorOptions) => {
        const creator: IExtentedSurveyCreator = new SurveyCreator({
            ...DEFAULT_CREATOR_OPTIONS,
            ...options
        }) as any;
        SurveyManager.ChangeService.creator = creator;
        creator.saveSurveyFunc = () => {
            SurveyManager.ChangeService.notifySchemeChanged(creator.text);
        }
        creator.toolbox.forceCompact = false;
        creator.text = JSON.stringify(props.schema);
        switch (SurveyManager.SurveyType) {
            case SurveyType.FormDesigner:
            case SurveyType.TemplateDesigner: {
                creator.toolbox.allowExpandMultipleCategories = true;
                creator.toolbox.showCategoryTitles = true;
                creator.toolbox.keepAllCategoriesExpanded = true;
                creator.toolbox.categories.map(category => {
                    category.name = SurveyManager.LocalizationService.getLocalizedLableForToolboxCategory(category.name);
                    category.items.map(item => {
                        item.category = category.name;
                    });
                })
                SurveyManager.CustomControlService.registeredControls.map(control => {
                    creator.toolbox.removeItem(control.surveyjsName);
                });
            }
        }
        creatorRef.current = creator;
        return creator;
    };
    const injectAddFieldBtn = () => {
        const predefinedToolboxTitle = creatorContainerRef.current?.querySelector('.svc-toolbox__container > div:last-child .svc-toolbox__category-title');
        predefinedToolboxTitle?.classList.add(designerStyles.predefinedFieldsToolboxTitle);
        predefinedToolboxTitle?.addEventListener("click", async () => {
            //@ts-ignore - not part of types
            if (!window.Xrm.Utility.getPageContext().input.entityId) {
                window.Xrm.Navigation.openErrorDialog({
                    message: SurveyManager.PcfContext.resources.getString('saveFirst')
                });
                return false;
            }
            setCustomFieldsPanelOpen(true);
        })
    }
    return (
        <div ref={creatorContainerRef}
            className={`${designerStyles.root}${hasPredefinedFields && SurveyManager.SurveyType ? ' survey-predefined-fields' : ''}`}>
            <div className={designerStyles.notificationContainer} ref={notificationContainerRef} />
            {SurveyManager.SurveyType === SurveyType.FieldDesigner &&
                <FieldDesigner onCreatorInitialization={initializeCreator} />
            }
            {SurveyManager.SurveyType === SurveyType.TemplateDesigner &&
                <TemplateDesigner onCreatorInitialization={initializeCreator} />
            }
            {SurveyManager.SurveyType === SurveyType.FormDesigner &&
                <SurveyDesigner onCreatorInitialization={initializeCreator} />
            }
            {customFieldsPanelOpen &&
            <CustomFieldsPanel
                onGetTemplateCustomFields={props.onGetTemplateCustomFields}
                onReinitializeSurvey={props.onReinitializeSurvey}
                onDismiss={() => setCustomFieldsPanelOpen(false)} />
            }
        </div>
    )
}