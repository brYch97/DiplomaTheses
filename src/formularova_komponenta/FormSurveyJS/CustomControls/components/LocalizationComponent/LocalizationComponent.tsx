//WIP - currently not being used
import * as React from 'react';
import { ActionButton, IconButton, PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogFooter, DialogType } from '@fluentui/react/lib/Dialog';
import { DetailsList, DetailsListLayoutMode, IColumn, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { localization } from "survey-creator-core";
import { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { Text } from '@fluentui/react/lib/Text';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { DataType} from '../../../interfaces/Manifest';
import { TextField } from '@fluentui/react/lib/TextField';
import { produce } from 'immer';
import { useTheme } from '@fluentui/react/lib/Theme';
import { CustomControlProperty } from '../../CustomControlProperty';
import * as deepEqual from 'fast-deep-equal';
import { localizationStyles } from './styles';
import { ILanguage } from '../../../services/SurveyLocalizationService';

export interface ILocalizedProperty {
    propertyName: string;
    [locale: string]: string | object
    values: ILocalizedPropertyValue[]
}

export interface ILocalizedPropertyValue {
    valueName: string;
    [locale: string]: string | undefined;
}

interface ILocalizationComponentProps {
    properties: CustomControlProperty[];
    onSave: (items: any) => void;
    onDismiss: () => void;
}

const mapLocalesToLanguage = (): ILanguage[] => {
    const localeLanguageInEnglish = new Intl.DisplayNames(['en'], { type: 'language' });
    const results: ILanguage[] = [];
    for (const locale of localization.getLocales()) {
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
    results.unshift({
        locale: 'en',
        name: 'English'
    })
    return results;
}

const getTranslatedLanguages = (availableLanguages: ILanguage[], propertyTranslations?: ILocalizedProperty[]): ILanguage[] => {
    if (!propertyTranslations || propertyTranslations.length === 0) {
        return [
            {
                locale: 'en',
                name: 'English'
            }
        ]
    }
    const translatedLocales = Object.keys(propertyTranslations[0]).filter(key => key !== 'values' && key !== 'propertyName');
    return availableLanguages.filter(language => translatedLocales.includes(language.locale));
}

export const LocalizationComponent: React.FC<ILocalizationComponentProps> = (props) => {
    const propertyTranslationsRef = React.useRef<ILocalizedProperty[]>(props.properties.filter(x => x.translation !== undefined).map(x => x.translation) as ILocalizedProperty[])
    const theme = useTheme();
    const availableLanguages = React.useMemo(() => {
        return mapLocalesToLanguage();
    }, []);
    const [translatedLanguages, setTranslatedLanguages] = React.useState<ILanguage[]>(() => getTranslatedLanguages(availableLanguages, propertyTranslationsRef.current));
    const [columns, setColumns] = React.useState<IColumn[]>([]);
    const [items, setItems] = React.useState<ILocalizedProperty[]>(propertyTranslationsRef.current ?? []);

    React.useEffect(() => {
        setColumns(createColumns());
    }, [translatedLanguages]);

    React.useEffect(() => {
        if (columns.length === 0) {
            return;
        }
        setItems(createItems())
    }, [columns]);

    const createItems = (): ILocalizedProperty[] => {
        const nextItems = produce(items, draft => {
            for (const property of props.properties) {
                const item = draft.find(x => x.propertyName === property.name) as ILocalizedProperty ?? {};
                const locales = Object.keys(item).filter(key => key !== 'propertyName' && key !== 'propertyLanguage');
                const droppedLocale = locales.find(locale => !translatedLanguages.map(language => language.locale).includes(locale));
                if (droppedLocale && Object.keys(droppedLocale).length > 0) {
                    delete item[droppedLocale];
                    if (item.values) {
                        for (const value of item.values) {
                            delete value[droppedLocale]
                        }
                    }
                }
                if (Object.keys(item).length === 0) {
                    draft.push(item);
                }
                for (let i = 0; i < columns.length; i++) {
                    const column = columns[i];
                    if (column.fieldName === 'propertyName') {
                        item[column.fieldName] = property.name;
                        continue;
                    }
                    if (column.fieldName === 'addLanguage') {
                        continue;
                    }
                    if (column.fieldName === 'en' && !item[column.fieldName]) {
                        item[column.fieldName] = property.displayName;
                    }
                    else {
                        item[column.fieldName!] = item[column.fieldName!] ?? "";
                    }
                    if (property.ofType === DataType.Enum) {
                        if (item.values) {
                            continue;
                        }
                        item.values = [];
                        for (const value of property.values!) {
                            item.values.push({
                                valueName: value.name,
                                [column.fieldName!]: column.fieldName === 'en' ? value.displayName : ''
                            })
                        }
                    }
                }
            }

        });
        if (propertyTranslationsRef.current.length === 0) {
            propertyTranslationsRef.current = nextItems;
        }
        return nextItems;
    };

    const addTranslatedLanguage = (language: ILanguage) => {
        const translatedLanguagesCopy = [...translatedLanguages]
        translatedLanguagesCopy.push(language);
        setTranslatedLanguages(translatedLanguagesCopy);
    };

    const removeTranslatedLanguage = (language: ILanguage) => {
        setTranslatedLanguages(translatedLanguages.filter(x => x.locale !== language.locale));

    };

    const mapLanguagesToMenuItems = (): IContextualMenuItem[] => {
        const menuItems: IContextualMenuItem[] = [];
        for (const language of availableLanguages) {
            if (!translatedLanguages.find(trasnlatedLanguage => trasnlatedLanguage.locale === language.locale)) {
                menuItems.push({
                    key: language.locale,
                    text: language.name,
                    onClick: () => addTranslatedLanguage(language)
                })
            }
        }
        return menuItems;
    }

    const createColumns = (): IColumn[] => {
        const _columns: IColumn[] = translatedLanguages.map((language, index) => {
            return {
                key: language.locale,
                name: language.name,
                fieldName: language.locale,
                minWidth: 200,
                isResizable: true,
                headerClassName: localizationStyles.columnHeader,
                onRenderHeader: () => <div title={language.name} className={localizationStyles.columnHeaderCustom}>
                    <Text variant='small'>{language.name}</Text>
                    {language.locale !== 'en' &&
                        <IconButton onClick={() => removeTranslatedLanguage(language)} iconProps={{
                            iconName: 'Delete'
                        }} />
                    }
                </div>
            }
        });
        _columns.push({
            key: 'add_language',
            name: 'addLanuage',
            fieldName: 'addLanguage',
            minWidth: 5,
            maxWidth: 5,
            headerClassName: mergeStyles({
                '.ms-DetailsHeader-cellName': {
                    overflow: 'visible'
                }
            }),
            onRenderHeader: () => <IconButton
                iconProps={{ iconName: 'Add' }} className={localizationStyles.columnHeaderAddIcon} menuProps={{
                    items: mapLanguagesToMenuItems()
                }} />
        });
        _columns.unshift({
            key: 'property',
            minWidth: 100,
            name: 'Parameter',
            fieldName: 'propertyName'
        });
        return _columns;
    }

    const onRenderItemColumnHandler = (item: ILocalizedProperty, index?: number, column?: IColumn): React.ReactNode => {
        const property = item[column!.fieldName!];
        if (column?.fieldName === 'propertyName' || column?.fieldName === 'addLanguage') {
            return property;
        }
        return (<>
            <TextField placeholder='---' onChange={(e, newValue) => {
                const nextItems = produce(items, draft => {
                    const editedItem = draft.find(x => x.propertyName === item.propertyName);
                    editedItem![column?.fieldName!] = newValue!;
                });
                setItems(nextItems);
            }} value={item[column?.fieldName!] as string} />
            {item.values && <ActionButton className={mergeStyles({
                '[data-icon-name="ChevronDown"]': {
                    display: 'none'
                }
            })} iconProps={{ iconName: 'LocaleLanguage' }} text='Localize values' menuProps={{
                isBeakVisible: true,
                calloutProps: {
                    calloutMinWidth: 250,
                },
                className: mergeStyles({
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 15,
                    'li': {
                        borderBottom: `1px solid ${theme.semanticColors.menuDivider}`,
                    }
                }),
                items: item.values.map(value => {
                    return {
                        key: value.valueName,
                        text: value.valueName,
                        onRender: () => <div className={localizationStyles.value}>
                            <Text className={mergeStyles({
                                color: theme.palette.themePrimary,
                            })} block>{value.valueName}</Text>
                            <TextField value={value[column?.fieldName!]} onChange={(e, newValue) => {
                                const nextItems = produce(items, draft => {
                                    const editedValue = draft.find(x => x.propertyName === item.propertyName)?.values.find(x => x.valueName === value.valueName);
                                    editedValue![column?.fieldName!] = newValue
                                });
                                setItems(nextItems);
                            }} placeholder='---' />
                        </div>
                    }
                })
            }} />}
        </>
        )
    }

    const onSaveHandler = () => {
        props.onSave(items);
    };
    const onDismissHandler = async () => {
        /*         if (isDirty()) {
                    //@ts-ignore
                    const result = await window.Xrm.Navigation.openConfirmDialog({ title: 'Unsaved changes', text: 'You have unsaved translations. Do you wish to save them?' });
                    console.log(result);
                    if (result.confirmed) {
                        return props.onSave(items);
                    }
                } */
        props.onDismiss();

    }
    const isDirty = (): boolean => {
        return !deepEqual(propertyTranslationsRef.current, items);
    }

    return (
        <Dialog
            maxWidth={'90%'}
            hidden={false}
            dialogContentProps={{
                type: DialogType.close,
                title: 'Property Localization'
            }}
            modalProps={{
                className: `${localizationStyles.dialog} ${mergeStyles({
                    '.ms-Dialog-actions': {
                        borderTop: `1px solid ${theme.semanticColors.bodyDivider}`,
                    }
                })}`
            }}
            onDismiss={props.onDismiss}>
            <DetailsList
                selectionMode={SelectionMode.single}
                layoutMode={DetailsListLayoutMode.fixedColumns}
                className={localizationStyles.detailsList}
                columns={columns}
                items={items}
                onRenderItemColumn={onRenderItemColumnHandler}
            />
            <DialogFooter>
                <PrimaryButton disabled={!isDirty()} onClick={onSaveHandler} text="Save" />
                <DefaultButton onClick={onDismissHandler} text="Close" />
            </DialogFooter>
        </Dialog>
    );
};

