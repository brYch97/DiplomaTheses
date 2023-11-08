import { ComponentCollection, Question, ExpressionValidator, NumericValidator, TextValidator, EmailValidator, AnswerCountValidator, RegexValidator, SurveyValidator } from "survey-core";
import { ISchema, ISchemaElement } from "../interfaces/ISchema";
import { localization } from "survey-creator-react";
import { SurveyManager, SurveyType } from "./SurveyManager";
import { ComponentCollection as ComponentCollectionPDF } from 'survey-pdf/node_modules/survey-core';

type IValidators = ISchemaElement['validators'];

/**
 * Service for handling custom survey questions.
 */
export class SurveyCustomQuestionService {
  /**
   * Constructs a new instance of the SurveyCustomQuestionService.
   */
  public constructor() {
    if (SurveyManager.SurveyType !== SurveyType.TemplateDesigner && SurveyManager.SurveyType !== SurveyType.FormDesigner) {
      return;
    }
    //dummy needs to be here in order for the custom field option to show up in the designer
    ComponentCollection.Instance.add({
      name: "dummy",
      questionJSON: {
        "type": "dropdown",
      },
      //@ts-ignore - prop has wrong name in types #smh,
      iconName: 'icon-dummy',
      category: 'Custom',
    });
  }
 /**
   * Registers the provided questions.
   * @param {Array<{ guid: string, schema: ISchema }>} questions - The questions to register.
   */
  public registerQuestions(questions: { guid: string, schema: ISchema }[]) {
    for (const question of questions) {
      const element = question.schema!.pages![0].elements![0];
      const questionJSON = structuredClone(element);

      if (element.validators) {
        delete questionJSON.validators;
      }
      const component = {
        questionJSON: questionJSON,
        name: question.guid,
        onCreated: (instance: Question) => {
          this._setQuestionInstanceValidators(instance, element.validators, instance.name);

          if (questionJSON.boundedTo) {
            instance.setPropertyValue('boundedTo', questionJSON.boundedTo);
          }
        },
        onPropertyChanged: (instance: Question, propertyName: string, newValue: any) => {
          if (propertyName === 'boundedTo' && questionJSON.boundedTo?.length > 0) {
            //do not allow change of binding if it was already set up in the field
            instance.setPropertyValue('boundedTo', questionJSON.boundedTo)
          }
          else if (propertyName === 'name') {
            this._setQuestionInstanceValidators(instance, element.validators, newValue)
          }
        },
        //@ts-ignore - category not part of typings
        category: 'Custom',
        title: this._getCustomQuestionTitle(question.schema)
      }
      ComponentCollection.Instance.add(component);
      if (SurveyManager.SurveyType === SurveyType.ClientInput) {
        //@ts-ignore
        ComponentCollectionPDF.Instance.add(component);
      }
    }
  }
  /**
   * Gets the custom questions.
   * @returns {Array<{ guid: string, schema: ISchema }>} The custom questions.
   */
  public getCustomQuestions() {
    return ComponentCollection.Instance.items;
  }
  /**
   * Clears the component collections.
   */
  public clear() {
    ComponentCollection.Instance.clear();
    ComponentCollectionPDF.Instance.clear();
  }
    /**
   * Gets the title of the custom question.
   * @private
   * @param {ISchema} schema - The schema of the custom question.
   * @returns {string} The title of the custom question.
   */
  private _getCustomQuestionTitle(schema: ISchema): string {
    const title = schema.pages![0].elements![0].title;
    if (!title) {
      return schema.pages![0].elements![0].name;
    }
    if (typeof title === 'string') {
      return title;
    }
    return title[localization.currentLocale] ?? title.default ?? "";
  }
  /**
   * Sets the validators for the question instance.
   * @private
   * @param {Question} questionInstance - The question instance.
   * @param {IValidators} validators - The validators.
   * @param {string} [newQuestionName] - The new name for the question.
   */
  private _setQuestionInstanceValidators(questionInstance: Question, validators: IValidators, newQuestionName?: string) {
    if (!validators) {
      return;
    }
    questionInstance.validators = [];
    for (const validator of validators) {
      let validatorInstance;
      switch (validator.type) {
        case 'numeric': {
          validatorInstance = new NumericValidator(validator.minValue, validator.maxValue);
          break;
        }
        case 'text': {
          validatorInstance = new TextValidator();
          validatorInstance.minLength = validator.minLength ?? 0
          validatorInstance.maxLength = validator.maxLength ?? 0;
          break;
        }
        case 'email': {
          validatorInstance = new EmailValidator();
          break;
        }
        case 'expression': {
          let expression = validator.expression;
          if (newQuestionName) {
            expression = expression?.replace(/{.*}/g, `{${newQuestionName}}`);
          }
          validatorInstance = new ExpressionValidator(expression);
          break;
        }
        case 'answercount': {
          validatorInstance = new AnswerCountValidator(validator.minCount, validator.maxCount);
          break;
        }
        case 'regex': {
          validatorInstance = new RegexValidator(validator.regex)
          break;
        }
        default: {
          validatorInstance = new SurveyValidator();
        }
      }
      if (!validatorInstance) {
        return;
      }
      validatorInstance.text = validator.text ?? '';
      questionInstance.validators.push(validatorInstance);
    }

  }
}