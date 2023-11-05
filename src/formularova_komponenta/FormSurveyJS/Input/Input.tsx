import * as React from 'react';
import { ISchema } from '../interfaces/ISchema';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import { inputStyles } from './styles';
import { SurveyManager } from '../services/SurveyManager';
import { LanguageSelector } from './components/LanguageSelector/LanguageSelector';
import { IContextualMenuItem } from '@fluentui/react/lib/components/ContextualMenu';
import { MessageBar } from '@fluentui/react/lib/components/MessageBar/MessageBar';
import { IDocOptions, SurveyPDF } from "survey-pdf";
import { DocController } from "survey-pdf";
import { roboto } from "./fonts";
import { decode } from 'js-base64';

export interface IDictionary {
    [questionName: string]: string;
}

interface ISurveyInputProps {
    schema: ISchema;
    readOnly: boolean;
    populatedFields: IDictionary
    onFieldValueChanged: (data: IDictionary) => void;
    onSurveyCompleted: (data: IDictionary) => void;
}

export const Input: React.FC<ISurveyInputProps> = (props) => {
    const survey = React.useMemo(() => {
        const survey = new Model(JSON.stringify(props.schema));
        survey.data = props.populatedFields;
        survey.onValueChanged.add(() => {
            props.onFieldValueChanged(survey.data);
        });
        survey.onComplete.add(() => {
            props.onSurveyCompleted(survey.data)
        });
        if (props.readOnly) {
            survey.mode = 'display';
        }
        survey.locale = SurveyManager.LocalizationService.currentLocale;
        return survey;
    }, []);
    const availableLanguages: IContextualMenuItem[] = React.useMemo(() => {
        return SurveyManager.LocalizationService.mapLocalesToLanguage(survey.getUsedLocales()).map((locale) => {
            return {
                key: locale.locale,
                text: locale.name
            }
        })
    }, []);

    const createSurveyPdfModel = () => {
        const pdfWidth =
            !!survey && survey.pdfWidth ? survey.pdfWidth : 210;
        const pdfHeight =
            !!survey && survey.pdfHeight ? survey.pdfHeight : 297;
        const options: IDocOptions = {
            fontSize: 14,
            margins: {
                left: 10,
                right: 10,
                top: 10,
                bot: 10
            },
            fontName: 'Roboto',
            useCustomFontInHtml: true,
            textFieldRenderAs: 'multiLine',
            format: [pdfWidth, pdfHeight]
        };
        const surveyPDF = new SurveyPDF(JSON.stringify(props.schema), options);
        surveyPDF.data = survey.data;
        surveyPDF.onRenderQuestion.add((_, options: any) => {
            //TODO: ugly hack for RUIAN control
            try {
                const value = options.bricks[0].bricks[2].value;
                    const address = JSON.parse(decode(value));
                    const streetName = address?.region?.municipality?.street?.streetName ?? address?.region?.municipality?.street?.streetName;
                    const cp = address?.region?.municipality?.street?.place?.placeCp;
                    const municipality = address?.region?.municipality?.municipalityName;
                    if(streetName && cp && municipality) {
                        options.bricks[0].bricks[2].value = `${streetName} ${cp}, ${municipality}`;
                    }
                }
            catch (err) {
                //continue
            }
        });
        return surveyPDF;
    }
    const saveSurveyToPdf = (filename: string) => {
        createSurveyPdfModel().save(filename);
    }

    React.useEffect(() => {
        DocController.addFont("Roboto", roboto.thin, "normal");
        DocController.addFont("Roboto", roboto.medium, "bold");
        DocController.addFont("Roboto", roboto.lightitalic, "italic");
        DocController.addFont("Roboto", roboto.bolditalic, "bolditalic");
        survey.addNavigationItem({
            id: "pdf-export",
            title: "Save as PDF",
            action: () => saveSurveyToPdf('test')
        })
    }, []);

    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(SurveyManager.LocalizationService.currentLocale);
    return (
        <div className={inputStyles.root}>
            {availableLanguages.length > 1 &&
                <LanguageSelector
                    selectedLanguage={selectedLanguage}
                    languages={availableLanguages}
                    onChange={(option) => {
                        survey.locale = option.key as string;
                        setSelectedLanguage(option.key as string);
                    }} />
            }
            {props.readOnly && SurveyManager.IsFullPage &&
                <MessageBar>{SurveyManager.LocalizationService.getString('inputReadOnly')}</MessageBar>
            }
            <Survey model={survey} />
        </div>
    )
}