import * as lcid from 'lcid';
import { localization } from 'survey-creator-react';
import { ISchema } from '../interfaces/ISchema';
import { SurveyManager, SurveyType } from './SurveyManager';


export interface ILanguage {
  locale: string;
  name: string;
}


/**
 * Service for handling localization in surveys.
 */
export class SurveyLocalizationService {
  private static _instance: SurveyLocalizationService
  public currentLocale: string;
  private _userSettings: ComponentFramework.UserSettings | undefined;
  private _resources: ComponentFramework.Resources;
  
  constructor(userSettings: ComponentFramework.UserSettings, resources: ComponentFramework.Resources) {
    this._userSettings = userSettings;
    this._resources = resources;
    const userLocale = this._getUserLocale();
    localization.currentLocale = userLocale;
    this.currentLocale = userLocale;
    //TODO: Remove after the translations get merged to survey-creator repo
    if (this.currentLocale === 'cs') {
      this.setCzechTranslations()
    }

  }
  public static get() {
    return this._instance;
  }
  public static init(userSettings: ComponentFramework.UserSettings, resources: ComponentFramework.Resources) {
    SurveyLocalizationService._instance = new SurveyLocalizationService(userSettings, resources);
  }
  public getLocalizedLabelForCSSVariable(name: string) {
    return CSS_VARIABLES_LABELS[name][this.currentLocale] ?? CSS_VARIABLES_LABELS[name]['en']
  }
  public getString(name: string) {
    return this._resources.getString(name);
  }
  public getLocalizedLableForToolboxCategory(name: string) {
    if (name === 'Custom') {
      return this.getString('toolboxCategoryPredefined');
    }
    return name;
  }
  public mapLocalesToLanguage(locales: string[]): ILanguage[] {
    const localeLanguageInEnglish = new Intl.DisplayNames([this.currentLocale], { type: 'language' });
    const results: ILanguage[] = [];
    for (const locale of locales) {
      if (locale.length > 0) {
        const languageName = localeLanguageInEnglish.of(locale);
        if (languageName) {
          results.push({
            locale: locale,
            name: languageName
          });
        }
      }
    }
    return results;
  }

  public getLocalizedSurveyPropertyTitle(schema: ISchema, propertyName: "title" | "description"): string {
    let property;
    if (SurveyManager.SurveyType === SurveyType.FieldDesigner) {
      property = schema.pages![0].elements![0][propertyName]
    }
    else {
      property = schema[propertyName];
    }
    if (!property) {
      return ""
    }
    if (typeof property === 'string') {
      return property;
    }
    return property[this.currentLocale] ?? property['default'] ?? ""
  }
  private _getUserLocale = (): string => {
    let locale;
    if (this._userSettings) {
      locale = lcid.from(this._userSettings.languageId)?.split('_')[0];
      if (locale && this._isSupportedLocale(locale)) {
        return locale;
      }
    }
    locale = window.navigator.language.split('_')[0];
    if (this._isSupportedLocale(locale)) {
      return locale;
    }
    return 'en';
  }
  private _isSupportedLocale = (locale: string): boolean => {
    if (localization.getLocales().includes(locale) || locale === 'en') {
      return true;
    }
    return false;
  }
  private setCzechTranslations() {
    //@ts-ignore
    localization.locales['cs'] = CZ_TRANSLATIONS;
  }
}

const CSS_VARIABLES_LABELS: {
  [key: string]: {
    [key: string]: string
  }
} = {
  "--primary": {
    en: "Primary color",
    cs: "Hlavní barva"
  },
  "--primary-light": {
    en: "Lighter shade of primary color",
    cs: "Světlejší odstín hlavní barvy"
  },
  "--primary-foreground": {
    en: "Primary foreground color",
    cs: "Hlavní barva popředí"
  },
  "--primary-foreground-disabled": {
    en: "Disabled text color",
    cs: "Barva neaktivního textu"
  },
  "--secondary": {
    en: "Secondary color",
    cs: "Vedlejší barva"
  },
  "--secondary-light": {
    en: "Lighter shade of secondary color",
    cs: "Světlejší odstín vedlejší barvy"
  },
  "--background": {
    en: "Background color",
    cs: "Barva pozadí"
  },
  "--background-dim": {
    en: "Dimmed background color",
    cs: "Tlumená barva pozadí"
  },
  "--background-dim-light": {
    en: "Lighter shade of dimmed background color",
    cs: "Světlejší odstín tlumené barvy pozadí"
  },
  "--background-semitransparent": {
    en: "Semitransparent background color",
    cs: "Poloprůhledná barva pozadí"
  },
  "--editor-background": {
    en: "Editor background color",
    cs: "Barva pozadí editoru"
  },
  "--question-background": {
    en: "Question background color",
    cs: "Barva pozadí otázky"
  },
  "--foreground": {
    en: "Foreground color",
    cs: "Popředí barva"
  },
  "--foreground-light": {
    en: "Lighter shade of foreground color",
    cs: "Světlejší odstín popředí barvy"
  },
  "--foreground-dim": {
    en: "Dimmed foreground color",
    cs: "Ztlumená popředí barva"
  },
  "--foreground-dim-light": {
    en: "Lighter shade of dimmed foreground color",
    cs: "Světlejší odstín ztlumené popředí barvy"
  },
  "--border": {
    en: "Border color",
    cs: "Barva okraje"
  },
  "--border-light": {
    en: "Lighter shade of border color",
    cs: "Světlejší odstín barvy okraje"
  },
  "--border-inside": {
    en: "Inside border color",
    cs: "Barva vnitřního okraje"
  },
  "--shadow-medium": {
    en: "Medium shadow color",
    cs: "Střední stínová barva"
  },
  "--shadow-inner": {
    en: "Inner shadow color",
    cs: "Barva vnitřního stínu"
  },
  "--red": {
    en: "Red color",
    cs: "Červená barva"
  },
  "--red-light": {
    en: "Lighter shade of red color",
    cs: "Světlejší červená barva"
  },
  "--green": {
    en: "Lighter shade of green color",
    cs: "Světlejší odstín zelené barvy"
  },
  "--green-light": {
    en: "Lighter shade of green color",
    cs: "Světlejší odstnín zelené barvy"
  }, "--blue-light": {
    en: "Lighter shade of blue color",
    cs: "Světlejší odstín modré barvy"
  },
  "--font-family": {
    en: "Font family",
    cs: "Font"
  },
  "--base-unit": {
    en: "Base unit",
    cs: "Základní jednotka"
  }
}
//TODO: Remove after the translations get merged to survey-creator repo

const CZ_TRANSLATIONS = {
  "survey": {
    "edit": "Upravit",
    "externalHelpLink": "Podívejte se a naučte se vytvářet formuláře",
    "externalHelpLinkUrl": "https://www.youtube.com/channel/UCH2ru9okIcooNZfpIbyq4qQ?view_as=subscriber",
    "dropQuestion": "Sem napište otázku ze sady nástrojů.",
    "addLogicItem": "Vytvořte pravidlo pro přizpůsobení průběhu formuláře.",
    "copy": "Kopírovat",
    "duplicate": "Duplikovat",
    "addToToolbox": "Přidat do sady nástrojů",
    "deletePanel": "Odstranit panel",
    "deleteQuestion": "Odstranit otázku",
    "convertTo": "Převést na",
    "drag": "Přetáhnout prvek",
    "license": "PRO VYUŽÍTÍ NÁVRHHÁŘE PRŮZKUMŮ VE VAŠÍ APLIKACI JE NUTNÉ ZAKOUPIT LICENCI"
  },
  "qt": {
    "default": "Výchozí",
    "checkbox": "Zaškrtávací pole",
    "comment": "Komentář",
    "imagepicker": "Nástroj pro výběr obrázku",
    "ranking": "Pořadí",
    "image": "Obrázek",
    "dropdown": "Rozbalovací nabídka",
    "tagbox": "Vícevýběrová rozbalovací nabídka",
    "file": "Soubor",
    "html": "HTML",
    "matrix": "Matice (jedna volba)",
    "matrixdropdown": "Matice (výběr z více možností)",
    "matrixdynamic": "Matice (dynamické řádky)",
    "multipletext": "Více textů",
    "panel": "Panel",
    "paneldynamic": "Panel (dynamické panely)",
    "radiogroup": "Přepínač",
    "rating": "Hodnocení",
    "text": "Jeden vstup",
    "boolean": "Přepínač (Ano/Ne)",
    "expression": "Výraz (pouze pro čtení)",
    "signaturepad": "Podpisová podložka",
    "buttongroup": "Skupina tlačítek"
  },
  "ed": {
    "defaultLocale": "Výchozí ({0})",
    "survey": "Formulář",
    "settings": "Nastavení formuláře",
    "settingsTooltip": "Otevřít nastavení formuláře",
    "surveySettings": "Nastavení formuláře",
    "surveySettingsTooltip": "Otevřít nastavení formuláře",
    "showPanel": "Zobrazit panel",
    "hidePanel": "Skrýt panel",
    "prevSelected": "Vybrat předchozí",
    "nextSelected": "Vybrat další",
    "surveyTypeName": "Formulář",
    "pageTypeName": "Stránka",
    "panelTypeName": "Panel",
    "questionTypeName": "Otázka",
    "columnTypeName": "Sloupec",
    "addNewPage": "Přidat novou stránku",
    "moveRight": "Přejděte doprava",
    "moveLeft": "Přejděte doleva",
    "deletePage": "Smazat stránku",
    "editPage": "Upravit stránku",
    "edit": "Upravit",
    "newPageName": "stránka",
    "newQuestionName": "otázka",
    "newPanelName": "panel",
    "newTextItemName": "text",
    "testSurvey": "Test vyplnění",
    "themeSurvey": "Motivy",
    "defaultV2Theme": "Výchozí",
    "modernTheme": "Moderní",
    "defaultTheme": "Výchozí (původní)",
    "testSurveyAgain": "Znovu otestovat formulář",
    "testSurveyWidth": "Šířka formuláře: ",
    "navigateToMsg": "Museli jste přejít na:",
    "logic": "Logika formuláře",
    "embedSurvey": "Vložit formulář",
    "translation": "Překlad",
    "saveSurvey": "Uložit formulář",
    "saveSurveyTooltip": "Uložit formulář",
    "designer": "Návrhář",
    "jsonEditor": "Editor JSON",
    "jsonHideErrors": "Skrýt chyby",
    "jsonShowErrors": "Zobrazit chyby",
    "undo": "Zrušit",
    "redo": "Opětovně vrátit",
    "undoTooltip": "Vrátit poslední změnu",
    "redoTooltip": "Znovu provést změnu",
    "showMoreChoices": "Zobrazit více",
    "showLessChoices": "Zobrazit méně",
    "copy": "Kopírovat",
    "cut": "Vyjmout",
    "paste": "Vložit",
    "copyTooltip": "Zkopírovat výběr do schránky",
    "cutTooltip": "Vyjmout výběr do schránky",
    "pasteTooltip": "Vložit ze schránky",
    "options": "Možnosti",
    "generateValidJSON": "Generovat platný JSON",
    "generateReadableJSON": "Generovat čitelný JSON",
    "toolbox": "Sada nástrojů",
    "property-grid": "Vlastnosti",
    "propertyGridFilteredTextPlaceholder": "Zadejte hledaný text...",
    "toolboxGeneralCategory": "Obecné",
    "toolboxChoiceCategory": "Výběrové otázky",
    "toolboxTextCategory": "Textové otázky",
    "toolboxContainersCategory": "Kontejnery",
    "toolboxMatrixCategory": "Maticové otázky",
    "toolboxMiscCategory": "Ostatní",
    "correctJSON": "Opravte JSON.",
    "surveyResults": "Výsledek formuláře: ",
    "surveyResultsTable": "Jako tabulka",
    "surveyResultsJson": "Jako JSON",
    "resultsTitle": "Nadpis otázky",
    "resultsName": "Název otázky",
    "resultsValue": "Hodnota odpovědi",
    "resultsDisplayValue": "Hodnota zobrazení",
    "modified": "Upraveno",
    "saving": "Ukládání",
    "saved": "Uloženo",
    "propertyEditorError": "Chyba:",
    "saveError": "Chyba! Obsah editoru není uložen.",
    "translationPropertyGridTitle": "Nastavení jazyka",
    "previewPropertyGridTitle": "Nastavení motivu",
    "translationLanguages": "Jazyky",
    "translationAddLanguage": "Vyberte jazyk pro překlad",
    "translationShowAllStrings": "Zobrazit všechny řetězce",
    "translationShowUsedStringsOnly": "Pouze použité řetězce",
    "translationShowAllPages": "Zobrazit všechny stránky",
    "translationNoStrings": "Žádné řetězce k překladu. Změňte filtr.",
    "translationExportToSCVButton": "Export do CSV",
    "translationImportFromSCVButton": "Import z CSV",
    "translationMergeLocaleWithDefault": "Sloučit {0} s výchozím lokálem",
    "translationPlaceHolder": "Překlad...",
    "bold": "Tučně",
    "italic": "Kurzíva",
    "underline": "Podtržení",
    "addNewQuestion": "Přidat otázku",
    "selectPage": "Vyberte stránku...",
    "htmlPlaceHolder": "Zde bude HTML obsah.",
    "panelPlaceHolder": "Sem přetáhněte otázku z panelu nástrojů.",
    "surveyPlaceHolder": "Formulář je prázdný. Přetáhněte prvek z panelu nástrojů nebo klikněte na tlačítko níže.",
    "imagePlaceHolder": "Obrázek můžete vložit jeho přetažením na toto místo nebo kliknutím na tlačítko níže",
    "imageChooseImage": "Vybrat obrázek",
    "addNewTypeQuestion": "Přidat {0}",
    "chooseLogoPlaceholder": "[LOGO]",
    "auto": "automaticky",
    "choices_Item": "Položka ",
    "lg": {
      "addNewItem": "Přidat nové pravidlo",
      "empty_tab": "Vytvořte pravidlo pro přizpůsobení průběhu formuláře.",
      "page_visibilityName": "Viditelnost stránky",
      "page_enableName": "Zapnutí (vypnutí) stránky",
      "panel_visibilityName": "Viditelnost panelu",
      "panel_enableName": "Zapnutí/vypnutí panelu",
      "question_visibilityName": "Viditelnost otázky",
      "question_enableName": "Zapnutí/vypnutí otázky",
      "question_requireName": "Povinné vyplnění otázky",
      "column_visibilityName": "Zobrazit (skrýt) sloupec",
      "column_enableName": "Zapnout (vypnout) sloupec",
      "column_requireName": "Povinný sloupec",
      "trigger_completeName": "Dokončení formuláře",
      "trigger_setvalueName": "Nastavení hodnoty otázky",
      "trigger_copyvalueName": "Kopírovat hodnotu otázky",
      "trigger_skipName": "Přeskočit na otázku",
      "trigger_runExpressionName": "Spuštění vlastního výrazu",
      "completedHtmlOnConditionName": "Vlastní text stránky s poděkováním",
      "page_visibilityDescription": "Zobrazení stránky, když se logický výraz vrátí jako true. V opačném případě zůstane neviditelná.",
      "panel_visibilityDescription": "Zobrazení panel, když se logický výraz vrátí jako true. V opačném případě zůstane neviditelný.",
      "panel_enableDescription": "Panel a všechny prvky v něm se aktivují, když logický výraz vrátí hodnotu true. V opačném případě je nechte vypnuté.",
      "question_visibilityDescription": "Zobrazit otázku, když logický výraz vrátí hodnotu true. V opačném případě zůstane neviditelná.",
      "question_enableDescription": "Povolit otázku, když logický výraz vrátí hodnotu true. V opačném případě zůstane neviditelná.",
      "question_requireDescription": "Otázka se stává povinnou, když logický výraz vrátí hodnotu true.",
      "trigger_completeDescription": "Když logický výraz vrátí hodnotu true, formulář je dokončen a koncovému uživateli se zobrazí stránka s poděkováním.",
      "trigger_setvalueDescription": "Pokud se změní hodnoty otázek, které jsou použity v logickém výrazu, a logický výraz vrátí hodnotu true, nastaví se hodnota na vybranou otázku.",
      "trigger_copyvalueDescription": "Pokud se změní hodnoty otázek, které jsou použity v logickém výrazu, a logický výraz vrátí hodnotu true, pak se hodnota jedné vybrané otázky zkopíruje do jiné vybrané otázky.",
      "trigger_skipDescription": "Pokud logický výraz vrátí hodnotu true, formulář přejde na vybranou otázku/zaměří se na ni.",
      "trigger_runExpressionDescription": "Pokud logický výraz vrátí hodnotu true, provede se vlastní výraz. Výsledek tohoto výrazu můžete volitelně nastavit do vybrané otázky.",
      "completedHtmlOnConditionDescription": "Pokud logický výraz vrátí hodnotu true, změní se výchozí text stránky s poděkováním na zadaný text.",
      "itemExpressionText": "Pokud výraz „{0}“ vrátí hodnotu true:",
      "itemEmptyExpressionText": "Nové pravidlo",
      "page_visibilityText": "Zobrazit stránku {0}",
      "panel_visibilityText": "Zobrazit panel {0}",
      "panel_enableText": "Povolit panel {0}",
      "question_visibilityText": "Zobrazit otázku {0}",
      "question_enableText": "Povolit otázku {0}",
      "question_requireText": "Otázka {0} je povinná",
      "column_visibilityText": "zviditelnit sloupec {0} úlohy {1}",
      "column_enableText": "povolit sloupec {0} otázky {1}",
      "column_requireText": "povinný sloupec {0} otázky {1}",
      "trigger_completeText": "Formulář se stává dokončeným",
      "trigger_setvalueText": "Zpochybnit: {0} hodnota {1}",
      "trigger_copyvalueText": "Kopírovat do otázky: {0} hodnota z otázky {1}",
      "trigger_skipText": "Formulář přeskočí na otázku {0}",
      "trigger_runExpressionText1": "Spustit výraz: „{0}“",
      "trigger_runExpressionText2": " a zpochybnit jeho výsledek: {0}",
      "completedHtmlOnConditionText": "Zobrazit vlastní text pro stránku s poděkováním.",
      "showAllQuestions": "Všechny otázky",
      "showAllActionTypes": "Všechny typy akcí",
      "conditions": "Podmínky",
      "actions": "Akce",
      "expressionEditorTitle": "Definovat podmínky",
      "actionsEditorTitle": "Definovat akce",
      "deleteAction": "Smazat akci",
      "addNewAction": "Přidat novou akci",
      "selectedActionCaption": "Vyberte akci, kterou chcete přidat...",
      "expressionInvalid": "Logický výraz je prázdný nebo neplatný. Opravte jej.",
      "noActionError": "Přidejte alespoň jednu akci.",
      "actionInvalid": "Opravte prosím problémy v akcích.",
      "uncompletedRule_title": "Opustit záložku?",
      "uncompletedRule_text": "Jedno nebo více logických pravidel není dokončeno. Opuštěním záložky dojde ke ztrátě všech neaplikovatelných změn. Jste si jisti, že chcete odejít?",
      "uncompletedRule_apply": "Ano",
      "uncompletedRule_cancel": "Ne, chci pravidla dokončit",
      "expressionSetup": "",
      "actionsSetup": ""
    }
  },
  "pe": {
    "apply": "Použít",
    "ok": "OK",
    "save": "Uložit",
    "clear": "Vymazat",
    "saveTooltip": "Uložit",
    "cancel": "Zrušit",
    "set": "Nastavit",
    "reset": "Resetovat",
    "change": "Změnit",
    "refresh": "Obnovit",
    "close": "Zavřít",
    "delete": "Smazat",
    "add": "Přidat",
    "addNew": "Přidat novou",
    "addItem": "Kliknutím přidáte položku...",
    "removeItem": "Kliknutím odstraníte položku...",
    "dragItem": "Přetáhněte položku",
    "addOther": "Ostatní",
    "addSelectAll": "Vybrat vše",
    "addNone": "Žádné",
    "removeAll": "Odstranit vše",
    "edit": "Upravit",
    "back": "Návrat bez uložení",
    "backTooltip": "Návrat bez uložení",
    "saveAndBack": "Uložit a vrátit",
    "saveAndBackTooltip": "Uložit a vrátit",
    "doneEditing": "Hotovo",
    "editChoices": "Upravit volby",
    "showChoices": "Zobrazit volby",
    "move": "Přesunout",
    "empty": "<prázdné>",
    "emptyValue": "Hodnota je prázdná",
    "fastEntry": "Rychlý vstup",
    "fastEntryNonUniqueError": "Hodnota '{0}' není unikátní",
    "fastEntryChoicesCountError": "Prosím, omezte počet položek od {0} do {1}",
    "fastEntryPlaceholder": "Data můžete nastavit v následujícím formátu:\nhodnota1|text\nhodnota2",
    "formEntry": "Vstupní formulář",
    "testService": "Testování služby",
    "itemSelectorEmpty": "Vyberte prvek",
    "conditionActionEmpty": "Vyberte akci",
    "conditionSelectQuestion": "Vyberte otázku...",
    "conditionSelectPage": "Vyberte stránku...",
    "conditionSelectPanel": "Vyberte panel...",
    "conditionValueQuestionTitle": "Zadejte/vyberte hodnotu",
    "expressionHelp": "Pro přístup k hodnotám otázek můžete použít složené závorky: {otázka1} + {otázka2}, ({cena}*{množství}) * (100 - {sleva}). Můžete použít funkce jako: iif(), today(), age(), min(), max(), count(), avg() a další.",
    "aceEditorHelp": "Stisknutím kláves ctrl+mezerník získáte nápovědu k dokončení výrazu",
    "aceEditorRowTitle": "Aktuální řádek",
    "aceEditorPanelTitle": "Aktuální panel",
    "showMore": "Další podrobnosti naleznete v dokumentaci",
    "assistantTitle": "Dostupné otázky:",
    "cellsEmptyRowsColumns": "Měl by existovat alespoň jeden sloupec nebo řádek.",
    "showPreviewBeforeComplete": "Zobrazit náhled odpovědí před odesláním formuláře",
    "propertyIsEmpty": "Zadejte hodnotu",
    "propertyIsNoUnique": "Zadejte jedinečnou hodnotu",
    "propertyNameIsNotUnique": "Zadejte jedinečný název",
    "propertyNameIsIncorrect": "Nepoužívejte vyhrazená slova: \"položka\", \"volba\", \"panel\", \"řádek\".",
    "listIsEmpty": "Přidat novou položku",
    "listIsEmpty@choices": "Zatím nebyly přidány žádné volby",
    "addNew@choices": "Přidat volbu",
    "expressionIsEmpty": "Výraz je prázdný",
    "value": "Hodnota",
    "text": "Text",
    "rowid": "ID řady",
    "imageLink": "Odkaz na obrázek",
    "columnEdit": "Upravit sloupec: {0}",
    "itemEdit": "Upravit položku: {0}",
    "url": "URL",
    "path": "Cesta",
    "valueName": "Název hodnoty",
    "choicesbyurl": {
      "valueName": "Získat hodnoty z následujícího JSON pole"
    },
    "titleName": "Získat texty z následujícího JSON pole",
    "imageLinkName": "Získat URL obrázku z následujícího JSON pole",
    "allowEmptyResponse": "Povolit prázdnou odpověď",
    "titlePlaceholder": "Sem zadejte název",
    "surveyTitlePlaceholder": "Sem zadejte název formuláře",
    "pageTitlePlaceholder": "Sem zadejte název stránky",
    "descriptionPlaceholder": "Zadejte popis",
    "surveyDescriptionPlaceholder": "Zadejte popis formuláře",
    "pageDescriptionPlaceholder": "Zadejte popis stránky",
    "showOtherItem": "Má jinou položku",
    "otherText": "Další text položky",
    "showNoneItem": "Nemá žádnou položku",
    "noneText": "Žádný text položky",
    "showSelectAllItem": "Vybral/a všechny položky",
    "selectAllText": "Vyberte veškerý text položky",
    "choicesMin": "Minimální hodnota pro automaticky generované položky",
    "choicesMax": "Maximální hodnota pro automaticky generované položky",
    "choicesStep": "Rozdíl mezi automaticky generovanými položkami",
    "name": "Název",
    "title": "Nadpis",
    "cellType": "Typ buňky",
    "colCount": "Počet sloupců",
    "choicesOrder": "Vyberte pořadí voleb",
    "visible": "Viditelná?",
    "isRequired": "Povinná?",
    "isAllRowRequired": "Povinná odpověď pro všechny řádky",
    "requiredErrorText": "Text chyby pro povinnou otázku",
    "startWithNewLine": "Začátek s novým řádkem?",
    "rows": "Počet řádků",
    "cols": "Počet sloupců",
    "placeholder": "Vstupní zástupný text",
    "showPreview": "Zobrazit oblast náhledu",
    "storeDataAsText": "Uložit obsah souboru ve výsledku JSON jako text",
    "maxSize": "Maximální velikost souboru v bajtech",
    "imageHeight": "Výška obrázku",
    "imageWidth": "Šířka obrázku",
    "rowCount": "Počet řádků",
    "columnLayout": "Rozložení sloupců",
    "addRowLocation": "Přidat umístění tlačítka řádku",
    "addRowText": "Přidat text tlačítka řádku",
    "removeRowText": "Odebrat text tlačítka řádku",
    "rateMin": "Minimální frekvence",
    "rateMax": "Maximální frekvence",
    "rateStep": "Krok frekvence",
    "minRateDescription": "Popis minimální frekvence",
    "maxRateDescription": "Popis maximální sazby",
    "inputType": "Typ vstupu",
    "optionsCaption": "Popisek možností",
    "defaultValue": "Výchozí hodnota",
    "cellsDefaultRow": "Výchozí texty buněk",
    "surveyEditorTitle": "Upravit nastavení formuláře",
    "qEditorTitle": "Upravit: {0}",
    "maxLength": "Maximální délka",
    "buildExpression": "Vytvořit",
    "editExpression": "Upravit",
    "and": "a zároveň",
    "or": "nebo",
    "remove": "Odebrat",
    "addCondition": "Přidat podmínku",
    "emptyLogicPopupMessage": "Pro zahájení konfigurace podmínek vyberte otázku.",
    "if": "Pokud",
    "then": "pak",
    "setToName": "Cílová otázka",
    "fromName": "Otázka, ze které bude zkopírována odpověď",
    "gotoName": "Přeskočit na otázku",
    "ruleIsNotSet": "Pravidlo je chybné",
    "includeIntoResult": "Zahrnout do výsledků formuláře",
    "showTitle": "Zobrazit/skrýt název",
    "expandCollapseTitle": "Rozbalit/sbalit název",
    "locale": "Výchozí jazyk",
    "simulator": "Vybrat zařízení",
    "landscapeOrientation": "Na šířku",
    "portraitOrientation": "Přepnout orientaci na výšku",
    "mode": "Režim (pouze pro úpravy/čtení)",
    "clearInvisibleValues": "Vymazat neviditelné hodnoty",
    "cookieName": "Název souboru cookie (pro zakázání dvojího lokálního spuštění formuláře)",
    "sendResultOnPageNext": "Odeslání výsledků formuláře na další straně",
    "storeOthersAsComment": "Uložení hodnoty „others“ do samostatného pole",
    "showPageTitles": "Zobrazit názvy stránek",
    "showPageNumbers": "Zobrazit čísla stránek",
    "pagePrevText": "Text tlačítka předchozí stránky",
    "pageNextText": "Text tlačítka další stránky",
    "completeText": "Úplný text tlačítka",
    "previewText": "Text tlačítka náhledu",
    "editText": "Text tlačítka úpravy",
    "startSurveyText": "Text tlačítka zahájení",
    "showNavigationButtons": "Zobrazit navigační tlačítka (výchozí navigace)",
    "showPrevButton": "Zobrazit předchozí tlačítko (uživatel se může vrátit na předchozí stránku)",
    "firstPageIsStarted": "První stránka formuláře je úvodní stránka.",
    "showCompletedPage": "Zobrazení dokončené stránky na konci (completedHtml)",
    "goNextPageAutomatic": "Po zodpovězení všech otázek automaticky přejít na další stránku",
    "showProgressBar": "Zobrazit ukazatel průběhu",
    "questionTitleLocation": "Umístění názvu otázky",
    "requiredText": "Povinné symboly otázky",
    "questionStartIndex": "Index začátku otázky (1, 2 nebo A, a)",
    "showQuestionNumbers": "Zobrazit čísla otázek",
    "questionTitleTemplate": "Šablona názvu otázky, výchozí je: „{no}. {require} {title}“",
    "questionErrorLocation": "Umístění chyby v otázce",
    "focusFirstQuestionAutomatic": "Zaměřte se na první otázku týkající se změny stránky",
    "questionsOrder": "Pořadí prvků na stránce",
    "maxTimeToFinish": "Maximální doba pro dokončení formuláře",
    "maxTimeToFinishPage": "Maximální doba pro dokončení stránky v formuláře",
    "image": {
      "imageHeight": "Výška obrázku (v hodnotách akceptovaných CSS)",
      "imageWidth": "Výška obrázku (v hodnotách akceptovaných CSS)"
    },
    "page": {
      "maxTimeToFinish": "Časový limit pro dokončení stránky (v sekundách)"
    },
    "question": {
      "page": "Nadřazená stránka"
    },
    "showTimerPanel": "Zobrazit panel časovače",
    "showTimerPanelMode": "Zobrazit režim panelu časovače",
    "renderMode": "Režim vykreslování",
    "allowAddPanel": "Povolit přidání panelu",
    "allowRemovePanel": "Povolit odstranění panelu",
    "noEntriesText": "Text prázdných položek",
    "panelAddText": "Přidávání textu na panel",
    "panelRemoveText": "Odstraňování textu panelu",
    "isSinglePage": "Zobrazit všechny prvky na jedné stránce",
    "html": "HTML",
    "expression": "Výraz",
    "setValue": "Odpověď",
    "dataFormat": "Formát obrázku",
    "allowAddRows": "Povolit přidání řádků",
    "allowRemoveRows": "Povolit odstranění řádků",
    "allowRowsDragAndDrop": "Povolit přetahování řádků",
    "responsiveImageSizeHelp": "Nepoužije se, pokud specifikujete přesnou šířku nebo výšku obrázku.",
    "minImageWidth": "Minimální šířka obrázku",
    "maxImageWidth": "Maximální šířka obrázku",
    "minImageHeight": "Minimální výška obrázku",
    "maxImageHeight": "Maximální výška obrázku",
    "minValue": "Minimální hodnota",
    "maxValue": "Maximální hodnota",
    "minLength": "Minimální délka",
    "allowDigits": "Povolit číslice",
    "minCount": "Minimální počet",
    "maxCount": "Maximální počet",
    "regex": "Pravidelný výraz",
    "surveyvalidator": {
      "text": "Chybová zpráva",
      "expression": "Ověřovací výraz"
    },
    "totalText": "Celkový text",
    "totalType": "Celkový typ",
    "totalExpression": "Celkový výraz",
    "totalDisplayStyle": "Celkový styl zobrazení",
    "totalCurrency": "Celková měna",
    "totalFormat": "Celkový formát",
    "logo": "Logo (URL nebo base64-kódovaný řetězec)",
    "questionsOnPageMode": "Struktura formuláře",
    "maxTextLength": "Maximální délka odpovědi (v počtu znaků)",
    "maxOthersLength": "Maximální délka komentáře (v počtu znaků)",
    "autoGrowComment": "V případě potřeby automaticky rozbalit komentář",
    "allowResizeComment": "Povolit uživatelům změnit velikost textových polí",
    "textUpdateMode": "Aktualizovat hodnotu textové otázky",
    "focusOnFirstError": "Zvýraznit první neplatnou odpověď",
    "checkErrorsMode": "Spustit ověření",
    "navigateToUrl": "Přejít na URL",
    "navigateToUrlOnCondition": "Dynamická URL",
    "completedBeforeHtml": "Text, který se uživateli zobrazí v případě, kdy má již formulář vyplněný",
    "completedHtml": "Text, který se uživateli zobrazí po vyplnění formuláře",
    "completedHtmlOnCondition": "Dynamický text, který se uživateli zobrazí po vyplnění formuláře",
    "loadingHtml": "Text, který se zobrazí během načítání formuláře",
    "commentText": "Text komentáře",
    "autocomplete": "Typ automatického vyplňování",
    "labelTrue": "Popisek \"pravdivé\" hodnoty",
    "labelFalse": "Popisek \"nepravdivé\" hodnoty",
    "allowClear": "Zobrazit popisek možností",
    "displayStyle": "Styl zobrazení hodnoty",
    "format": "Formátovaný řetězec",
    "maximumFractionDigits": "Maximální počet desetinných míst",
    "minimumFractionDigits": "Minimální počet desetinných míst",
    "useGrouping": "Zobrazit oddělovač tisíců",
    "allowMultiple": "Povolit více souborů",
    "allowImagesPreview": "Náhled obrázků",
    "acceptedTypes": "Povolené typy souborů",
    "waitForUpload": "Počkejte na dokončení nahrávání",
    "needConfirmRemoveFile": "Potvrdit smazání souboru",
    "detailPanelMode": "Umístění detailního panelu",
    "minRowCount": "Minimální počet řádků",
    "maxRowCount": "Maximální počet řádků",
    "confirmDelete": "Potvrdit smazání řádku",
    "confirmDeleteText": "Potvrzovací zpráva",
    "paneldynamic": {
      "confirmDelete": "Potvrdit smazání panelu"
    },
    "panelCount": "Počáteční počet panelů",
    "minPanelCount": "Minimální počet panelů",
    "maxPanelCount": "Maximální počet panelů",
    "panelsState": "Stav rozbalení vnitřního panelu",
    "templateDescription": "Šablona pro popis",
    "templateTitle": "Šablona pro nadpis",
    "panelPrevText": "Nápověda pro tlačítko \"Předchozí panel\"",
    "panelNextText": "Nápověda pro tlačítko \"Další panel\"",
    "showRangeInProgress": "Zobrazit ukazatel postupu",
    "templateTitleLocation": "Umístění nadpisu otázky",
    "panelRemoveButtonLocation": "Umístění tlačítka \"Odstranit panel\"",
    "hideIfRowsEmpty": "Skrýt otázku, pokud neexistují žádné řádky",
    "hideColumnsIfEmpty": "Skrýt sloupce, pokud neexistují žádné řádky",
    "rateValues": "Vlastní hodnoty kurzu",
    "rateCount": "Počet kurzů",
    "rateDisplayMode": "Režim zobrazení kurzu",
    "autoGenerate": "Jak určit hodnoty kurzu?",
    "hideIfChoicesEmpty": "Skrýt otázku, pokud neobsahuje žádné volby",
    "hideNumber": "Skrýt číslo otázky",
    "minWidth": "Minimální šířka (v hodnotách akceptovaných CSS)",
    "maxWidth": "Maximální šířka (v hodnotách akceptovaných CSS)",
    "width": "Šířka (v hodnotách akceptovaných CSS)",
    "showHeader": "Zobrazit záhlaví sloupce",
    "horizontalScroll": "Zobrazit horizontální posuvník",
    "columnMinWidth": "Minimální šířka sloupce (v hodnotách akceptovaných CSS)",
    "rowTitleWidth": "Šířka záhlaví řádku (v hodnotách akceptovaných CSS)",
    "valueTrue": "\"Pravdivá\" hodnota",
    "valueFalse": "\"Nepravdivá\" hodnota",
    "minErrorText": "Zpráva pro chybu \"Hodnota je nižší než minimální\"",
    "maxErrorText": "Zpráva pro chybu \"Hodnota překračuje maximum\"",
    "otherErrorText": "Zpráva pro chybu \"Prázdný komentář\"",
    "keyDuplicationError": "Zpráva pro chybu \"Klíč není unikátní\"",
    "signaturePlaceHolder": "Podpis",
    "fileDragAreaPlaceholder": "Soubor můžete nahrát jeho přetažením na tuto plochu nebo klinutím na tlačítko níže",
    "maxSelectedChoices": "Maximální počet vybraných možností",
    "showClearButton": "Zobrazit tlačítko \"Vymazat\"",
    "showNumber": "Zobrazit číslo panelu",
    "logoWidth": "Šířka loga (v hodnotách akceptovaných CSS)",
    "logoHeight": "Výška loga (v hodnotách akceptovaných CSS)",
    "readOnly": "Pouze pro čtení",
    "enableIf": "Upravitelná pokud",
    "emptyRowsText": "Zpráva \"Žádné řádky\"",
    "size": "Velikost vstupu (v počtu znaků)",
    "separateSpecialChoices": "Oddělit speciální volby (žádná, ostatní, vybrat vše)",
    "choicesFromQuestion": "Kopírovat volby z následující otázky",
    "choicesFromQuestionMode": "Které volby zkopírovat?",
    "showCommentArea": "Zobrazit komentář",
    "commentPlaceholder": "Zástupný text komentáře",
    "displayRateDescriptionsAsExtremeItems": "Zobrazit popisy kurzů jako extrémní hodnoty",
    "rowsOrder": "Pořadí řádků",
    "columnsLayout": "Rozložení sloupce",
    "columnColCount": "Počet vnořených sloupců",
    "state": "Stav rozbalení panelu",
    "correctAnswer": "Správná odpověď",
    "defaultPanelValue": "Výchozí hodnoty",
    "cells": "Texty buněk",
    "keyName": "Klíčový sloupec",
    "itemvalue": {
      "text": "Alternativní text"
    },
    "logoPosition": "Pozice loga",
    "addLogo": "Přidat logo...",
    "changeLogo": "Změnit logo...",
    "logoPositions": {
      "none": "Odstranit logo",
      "left": "Vlevo",
      "right": "Vpravo",
      "top": "Nahoře",
      "bottom": "Dole"
    },
    "tabs": {
      "general": "Obecné",
      "fileOptions": "Možnosti",
      "html": "Editor HTML",
      "columns": "Sloupce",
      "rows": "Řádky",
      "choices": "Volby",
      "items": "Položky",
      "visibleIf": "Viditelná, pokud",
      "enableIf": "Povolená, pokud",
      "requiredIf": "Povinná, pokud",
      "rateValues": "Hodnoty sazeb",
      "choicesByUrl": "Volby z webu",
      "matrixChoices": "Výchozí volby",
      "multipleTextItems": "Textové vstupy",
      "numbering": "Číslování",
      "validators": "Validátory",
      "navigation": "Navigace",
      "question": "Otázka",
      "pages": "Stránky",
      "timer": "Časovač/kvíz",
      "calculatedValues": "Vypočítané hodnoty",
      "triggers": "Spouštěče",
      "templateTitle": "Název šablony",
      "totals": "Součty",
      "logic": "Logika",
      "layout": "Rozložení",
      "data": "Data",
      "validation": "Ověřování",
      "cells": "Buňky",
      "showOnCompleted": "Zobrazit na stránce Dokončeno",
      "logo": "Logo v názvu formuláře",
      "slider": "Posuvník",
      "expression": "Výraz",
      "others": "Ostatní"
    },
    "editProperty": "Upravit vlastnost „{0}“",
    "items": "[ Položky: {0} ]",
    "choicesVisibleIf": "Volby jsou viditelné, pokud",
    "choicesEnableIf": "Volby jsou volitelné, pokud",
    "columnsEnableIf": "Sloupce jsou viditelné, pokud",
    "rowsEnableIf": "Řádky jsou viditelné, pokud",
    "indent": "Přidat odsazení",
    "panel": {
      "indent": "Přidat vnější odsazení"
    },
    "innerIndent": "Přidat vnitřní odsazení",
    "defaultValueFromLastRow": "Vzít výchozí hodnoty z posledního řádku",
    "defaultValueFromLastPanel": "Vzít výchozí hodnoty z posledního panelu",
    "enterNewValue": "Zadejte hodnotu.",
    "noquestions": "V formuláře není žádná otázka.",
    "createtrigger": "Vytvořte spouštěč",
    "titleKeyboardAdornerTip": "Zadejte tlačítko k úpravě",
    "keyboardAdornerTip": "Stisknutím klávesy enter upravíte položku, stisknutím klávesy delete položku odstraníte, stisknutím klávesy alt plus šipky nahoru nebo šipky dolů položku přesunete.",
    "triggerOn": "Zapnout ",
    "triggerMakePagesVisible": "Zobrazit stránky:",
    "triggerMakeQuestionsVisible": "Zobrazit prvky:",
    "triggerCompleteText": "Vyplňte formulář, pokud se vám to podaří.",
    "triggerNotSet": "Spouštěč není nastaven",
    "triggerRunIf": "Spustit, pokud",
    "triggerSetToName": "Změnit hodnotu: ",
    "triggerFromName": "Zkopírovat hodnotu z: ",
    "triggerRunExpression": "Spustit tento výraz:",
    "triggerSetValue": "do: ",
    "triggerGotoName": "Přejít na otázku:",
    "triggerIsVariable": "Nevkládejte proměnnou do výsledku formuláře.",
    "triggerRunExpressionEmpty": "Zadejte platný výraz",
    "emptyExpressionPlaceHolder": "Zde napište výraz...",
    "noFile": "Nebyl vybrán žádný soubor",
    "clearIfInvisible": "Vymazat hodnotu, pokud se otázka skryje",
    "valuePropertyName": "Název hodnotové vlastnosti",
    "searchEnabled": "Povolit vyhledávání",
    "hideSelectedItems": "Skrýt vybrané položky",
    "closeOnSelect": "Po výběru zavřít rozbalovací nabídku",
    "signatureWidth": "Šířka podpisu",
    "signatureHeight": "Výška podpisu",
    "verticalAlign": "Vertikální zarovnání",
    "alternateRows": "Alternativní řádky",
    "columnsVisibleIf": "Sloupce jsou viditelné, pokud",
    "rowsVisibleIf": "Řádky jsou viditelné, pokud",
    "otherPlaceholder": "Zástupný text komentáře"
  },
  "pv": {
    "true": "pravda",
    "false": "nepravda",
    "inherit": "zdědit",
    "show": "zobrazit",
    "hide": "skrýt",
    "default": "výchozí",
    "initial": "úvodní",
    "random": "náhodný",
    "collapsed": "sbalený",
    "expanded": "rozbalený",
    "none": "žádný",
    "asc": "vzestupný",
    "desc": "sestupný",
    "indeterminate": "neurčitý",
    "decimal": "desetinné číslo",
    "currency": "měna",
    "percent": "procento",
    "firstExpanded": "firstExpanded",
    "off": "vypnout",
    "onpanel": "Spustit na každém panelu",
    "onPanel": "onPanel",
    "onSurvey": "onSurvey",
    "list": "seznam",
    "progressTop": "progressTop",
    "progressBottom": "progressBottom",
    "progressTopBottom": "progressTopBottom",
    "tab": "Záložky",
    "horizontal": "horizontální",
    "vertical": "vertikální",
    "top": "nahoře",
    "bottom": "dole",
    "topBottom": "nahoře a dole",
    "both": "obě",
    "left": "vlevo",
    "right": "Pravá",
    "color": "barva",
    "date": "datum",
    "datetime": "datum a čas",
    "datetime-local": "datum a čas - lokální",
    "email": "email",
    "month": "měsíc",
    "number": "číslo",
    "password": "heslo",
    "range": "rozsah",
    "tel": "tel",
    "text": "text",
    "time": "čas",
    "url": "url",
    "week": "týden",
    "hidden": "skrytý",
    "on": "zapnout",
    "onPage": "onPage",
    "edit": "upravit",
    "display": "zobrazit",
    "onComplete": "onComplete",
    "onHidden": "onHidden",
    "onHiddenContainer": "Když se otázka nebo její panel/stránka skryje",
    "clearInvisibleValues": {
      "none": "Nikdy"
    },
    "inputType": {
      "color": "Barva",
      "date": "Datum",
      "datetime-local": "Datum a čas",
      "email": "Email",
      "month": "Měsíc",
      "number": "Číslo",
      "password": "Heslo",
      "range": "Rozsah",
      "tel": "Telefon",
      "text": "Text",
      "time": "Čas",
      "url": "URL",
      "week": "Týden"
    },
    "all": "vše",
    "page": "stránka",
    "survey": "formulář",
    "onNextPage": "onNextPage",
    "onValueChanged": "onValueChanged",
    "onValueChanging": "onValueChanging",
    "standard": "standardní",
    "singlePage": "jedna stránka",
    "questionPerPage": "otázka na stránku",
    "noPreview": "bez náhledu",
    "showAllQuestions": "zobrazit náhled se všemi otázkami",
    "showAnsweredQuestions": "zobrazit náhled se zodpovězenými otázkami",
    "pages": "stránky",
    "questions": "otázky",
    "requiredQuestions": "Odpovězené povinné otázky",
    "correctQuestions": "správné otázky",
    "buttons": "tlačítka",
    "underInput": "pod vstupem",
    "underTitle": "pod nadpisem",
    "onBlur": "Při ztrátě zvýraznění",
    "onTyping": "Během psaní",
    "underRow": "Pod řádkem",
    "underRowSingle": "Pod řádkem, pouze jeden panel je viditelný",
    "showNavigationButtons": {
      "none": "Skrytý"
    },
    "showProgressBar": {
      "off": "Skrytý"
    },
    "showTimerPanel": {
      "none": "Skrytý"
    },
    "showTimerPanelMode": {
      "all": "Obě"
    },
    "detailPanelMode": {
      "none": "Skrytý"
    },
    "addRowLocation": {
      "default": "Závisí na rozložení matice"
    },
    "panelsState": {
      "default": "Uživatelé nemohou rozbalit nebo sbalit panely",
      "collapsed": "Všechny panely jsou sbaleny",
      "expanded": "Všechny panely jsou rozbaleny"
    },
    "widthMode": {
      "auto": "Auto",
      "static": "Statický",
      "responsive": "Responzivní"
    },
    "imageFit": {
      "none": "Žádný",
      "contain": "Obsahuje",
      "cover": "Pokrýt",
      "fill": "Vyplnit"
    },
    "contentMode": {
      "auto": "Auto",
      "image": "Obrázek",
      "video": "Video",
      "youtube": "YouTube"
    },
    "displayMode": {
      "auto": "Auto",
      "buttons": "Tlačítka",
      "dropdown": "Rozbalovací nabídka"
    },
    "rateColorMode": {
      "default": "Výchozí"
    },
    "autoGenerate": {
      "true": "Generovat",
      "false": "Vložit ručně"
    },
    "rateType": {
      "labels": "Popisky",
      "stars": "Hvězdy",
      "smileys": "Smajlíci"
    }
  },
  "op": {
    "empty": "je prázdný",
    "notempty": "není prázdný",
    "equal": "se rovná",
    "notequal": "se nerovná",
    "contains": "obsahuje",
    "notcontains": "neobsahuje",
    "anyof": "žádný z",
    "allof": "všechny",
    "greater": "větší",
    "less": "nižší",
    "greaterorequal": "větší nebo se rovná",
    "lessorequal": "nižší nebo se rovná",
    "and": "a zároveň",
    "or": "nebo"
  },
  "ew": {
    "angular": "Použít verzi Angular",
    "jquery": "Použít verzi jQuery",
    "knockout": "Použít verzi Knockout",
    "react": "Použít verzi React",
    "vue": "Použít verzi Vue",
    "bootstrap": "Pro framework bootstrap",
    "modern": "Moderní motiv",
    "default": "Výchozí motiv",
    "orange": "Oranžový motiv",
    "darkblue": "Tmavěmodrý motiv",
    "darkrose": "Tmavěrůžový motiv",
    "stone": "Kamenný motiv",
    "winter": "Zimní motiv",
    "winterstone": "Téma zima-kámen",
    "showOnPage": "Zobrazit formulář na stránce",
    "showInWindow": "Zobrazit formulář v okně",
    "loadFromServer": "Načíst formulář JSON ze serveru",
    "titleScript": "Skripty a styly",
    "titleHtml": "HTML",
    "titleJavaScript": "JavaScript"
  },
  "ts": {
    "selectPage": "Vyberte stránku a otestujte ji:",
    "showInvisibleElements": "Zobrazit neviditelné prvky",
    "hideInvisibleElements": "Skrýt neviditelné prvky"
  },
  "validators": {
    "answercountvalidator": "počet odpovědí",
    "emailvalidator": "e-mail",
    "expressionvalidator": "výraz",
    "numericvalidator": "Číslo",
    "regexvalidator": "regex",
    "textvalidator": "text"
  },
  "triggers": {
    "completetrigger": "dokončit formulář",
    "setvaluetrigger": "nastavit hodnotu",
    "copyvaluetrigger": "zkopírovat hodnotu",
    "skiptrigger": "přeskočit na otázku",
    "runexpressiontrigger": "spustit výraz",
    "visibletrigger": "změnit viditelnost (zastaralé)"
  },
  "pehelp": {
    "cookieName": "Cookies brání uživatelům vyplnit formulář vícekrát.",
    "format": "Použít {0} jako zástupný text pro skutečnou hodnotu.",
    "totalText": "Viditelné pouze v případě, že alespoň jeden sloupec je typu suma nebo obsahuje sumarizační výraz.",
    "acceptedTypes": "Pro více informací viz [accept](https://www.w3schools.com/tags/att_input_accept.asp).",
    "columnColCount": "Vztahuje se pouze na typy přepínač a zaškrtávací políčka.",
    "autocomplete": "Pro více informací viz [autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete).",
    "valueName": "Pokud tuto vlastnost nenastavíte, odpověď bude uložena v poli specifikovaném názvem otázky.",
    "choicesbyurl": {
      "valueName": " "
    },
    "keyName": "Pokud zadaný sloupec obsahuje totožné hodnoty, formulář vyhodí chybu „Klíč není unikátní“."
  },
  "p": {
    "title": {
      "name": "nadpis",
      "title": "Nechte pole prázdné, pokud je stejné jako „Název”"
    },
    "multiSelect": "Povolit výběr více položek",
    "showLabel": "Zobrazit popisky obrázku",
    "value": "Hodnota",
    "tabAlign": "Zarovnání záložek",
    "description": "Popis",
    "logoFit": "Přizpůsobit logo",
    "pages": "Stránky",
    "questions": "Otázky",
    "triggers": "Spouštěče",
    "calculatedValues": "Vypočítané hodnoty",
    "surveyId": "Id formuláře",
    "surveyPostId": "Id příspěvku formuláře",
    "surveyShowDataSaving": "Zobrazit hlášku pro ukládání dat",
    "questionDescriptionLocation": "Umístění popisu otázky",
    "progressBarType": "Typ ukazatele postupu",
    "showTOC": "Zobrazit TOC",
    "tocLocation": "Umístění Toc",
    "questionTitlePattern": "Vzor pro nadpis otázky",
    "widthMode": "Režim šířky",
    "showBrandInfo": "Zobrazit informace o značce",
    "useDisplayValuesInDynamicTexts": "Použít hodnoty zobrazení v dynamických textech",
    "visibleIf": "Viditelná, pokud",
    "titleLocation": "Umístění nadpisu",
    "descriptionLocation": "Umístění popisku",
    "defaultValueExpression": "Výraz pro výchozí hodnotu",
    "requiredIf": "Povinná, pokud",
    "validators": "Validátory",
    "bindings": "Vazby",
    "renderAs": "Vykreslit jako",
    "attachOriginalItems": "Připojit původní položky",
    "choices": "Volby",
    "choicesByUrl": "Volby podle Url",
    "currency": "Měna",
    "cellHint": "Nápověda buňky",
    "isUnique": "Je unikátní",
    "showInMultipleColumns": "Zobrazit ve více sloupcích",
    "totalMaximumFractionDigits": "Maximální počet desetinných míst",
    "totalMinimumFractionDigits": "Minimální počet desetinných míst",
    "columns": "Sloupce",
    "detailElements": "Podrobné prvky",
    "allowAdaptiveActions": "Povolit adaptivní akce",
    "defaultRowValue": "Výchozí hodnota řádku",
    "detailPanelShowOnAdding": "Detailní zobrazení panelu při přidání",
    "choicesLazyLoadEnabled": "Povolit lazy loading voleb",
    "choicesLazyLoadPageSize": "Počet voleb na jednu stránku",
    "inputFieldComponent": "Komponenta vstupního pole",
    "itemComponent": "Komponenty položky",
    "min": "Min",
    "max": "Max",
    "minValueExpression": "Minimální hodnota výrazu",
    "maxValueExpression": "Maximální hodnota výrazu",
    "step": "Krok",
    "dataList": "Datový list",
    "itemSize": "Velikost položky",
    "elements": "Prvky",
    "content": "Obsah",
    "navigationButtonsVisibility": "Viditelnost navigačních tlačítek",
    "navigationTitle": "Napids navigace",
    "navigationDescription": "Popis navigace",
    "longTap": "Dlouhé poklepání",
    "autoGrow": "Automatický růst",
    "allowResize": "Povolit změnu velikosti",
    "acceptCarriageReturn": "Povolit znak pro \"návrat vozíku\"",
    "displayMode": "Režim zobrazení",
    "rateType": "Typ kurzu",
    "label": "Popisek",
    "contentMode": "Režim obsahu",
    "imageFit": "Přizpůsobení obrázku",
    "altText": "Alternativní text",
    "height": "Výška",
    "penColor": "Barva pera",
    "backgroundColor": "Barva pozadí",
    "templateElements": "Prvky šablony",
    "operator": "Operátor",
    "isVariable": "Je proměnná",
    "runExpression": "Spustit výraz",
    "showCaption": "Zobrazit popis",
    "iconName": "Název ikony",
    "iconSize": "Velikost ikony"
  },
  "theme": {
    "--background": "Barva pozadí",
    "--background-dim-light": "Světlejší odstín tlumené barvy pozadí",
    "--primary-foreground": "Hlavní barva popředí",
    "--foreground": "Barva popředí",
    "--base-unit": "Základní jednotka",
    "groupGeneral": "Obecné",
    "groupAdvanced": "Pokročilé",
    "themeName": "Motivy",
    "themeMode": "Režimy",
    "themeModePanels": "Panely",
    "themeModeLightweight": "Lehký",
    "themePaletteLight": "Světlý",
    "themePaletteDark": "Tmavý",
    "primaryColor": "Barva zvýraznění",
    "primaryDefaultColor": "Výchozí",
    "primaryDarkColor": "Hover",
    "primaryLightColor": "Vybraný",
    "backgroundDimColor": "Barva pozadí",
    "backgroundImage": "Obrázek na pozadí",
    "backgroundImageFitAuto": "Auto",
    "backgroundImageFitCover": "Pokrýt",
    "backgroundImageFitContain": "Obsahuje",
    "backgroundOpacity": "Průhlednost",
    "panelBackgroundTransparency": "Průhlednost pozadí panelu",
    "questionBackgroundTransparency": "Průhlednost pozadí otázek",
    "questionPanel": "Panel otázek",
    "questionTitle": "Font nadpisu otázky",
    "questionDescription": "Font popisu otázky",
    "editorPanel": "Editor",
    "editorFont": "Font editoru",
    "backcolor": "Výchozí pozadí",
    "hovercolor": "Pozadí při přejetí myší",
    "borderDecoration": "Dekorace hran",
    "accentBackground": "Pozadí zvýraznění",
    "accentForeground": "Zvýraznění popředí",
    "primaryForecolor": "Výchozí barva",
    "primaryForecolorLight": "Barva vypnutého pole",
    "linesColors": "Linky",
    "borderDefault": "Hlavní",
    "borderLight": "Vedlejší",
    "fontFamily": "Font",
    "fontSize": "Velikost fontu",
    "color": "Barva",
    "size": "Velikost",
    "fontWeightRegular": "Běžný",
    "fontWeightHeavy": "Těžký",
    "fontWeightSemiBold": "Semi-Bold",
    "fontWeightBold": "Bold",
    "scale": "Škála",
    "cornerRadius": "Poloměr rohu",
    "surveyTitle": "Font nadpisu formuláře",
    "pageTitle": "Font nadpisu stránky",
    "pageDescription": "Font popisu stránky",
    "boxShadowX": "X",
    "boxShadowY": "Y",
    "opacity": "Průhlednost",
    "boxShadowBlur": "Blur",
    "boxShadowSpread": "Rozšíření",
    "questionShadow": "Hrany / stíny panelu",
    "editorShadow": "Hrany / stíny editoru"
  }
}