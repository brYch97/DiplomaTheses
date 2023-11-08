import { IPanelProps, Panel } from '@fluentui/react/lib/Panel';
import { DefaultButton } from '@fluentui/react/lib/components/Button/DefaultButton/DefaultButton';
import { PrimaryButton } from '@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton';
import * as React from 'react';
import { customFieldsPanelStyles as styles } from './styles';
import { useCustomFields } from './useCustomFields';
import { IconButton } from '@fluentui/react/lib/Button';
import { Text } from '@fluentui/react/lib/Text';
import { Autocomplete } from '@talxis/react-components/dist/components/Autocomplete';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { useTheme } from '@fluentui/react/lib/Theme';
import { SurveyManager } from '../../../services/SurveyManager';

interface ICustomFieldsPanelProps extends IPanelProps {
    onGetTemplateCustomFields: () => Promise<ComponentFramework.WebApi.RetrieveMultipleResponse>;
    onReinitializeSurvey: () => void;
}

/**
 * @function CustomFieldsPanel
 * @description Functional component that creates a panel for managing custom fields.
 * @param {ICustomFieldsPanelProps} props - The properties for the CustomFieldsPanel component.
 * @returns {React.FC} The CustomFieldsPanel component.
 */

export const CustomFieldsPanel: React.FC<ICustomFieldsPanelProps> = (props) => {
    const [
        customFields,
        hasUnsavedChanges,
        isSaving,
        addField,
        removeField,
        search,
        save
    ] = useCustomFields(props.onGetTemplateCustomFields, props.onReinitializeSurvey);
    const theme = useTheme();
    return (
        <Panel
            {...props}
            isOpen={true}
            headerText={'Předpřipravená pole'}
            className={styles.root}
            isFooterAtBottom
            hasCloseButton={false}
            style={{
                '--field-background': !isSaving ? theme.semanticColors.buttonBackgroundPressed : theme.semanticColors.buttonBackgroundDisabled,
                '--field-opacity': !isSaving ? 1 : 0.5
            } as React.CSSProperties}
            onRenderFooterContent={() =>
                <div className={styles.footer}>
                    <PrimaryButton
                        onClick={save}
                        onRenderIcon={isSaving ? () => <Spinner size={SpinnerSize.small} /> : undefined}
                        disabled={!hasUnsavedChanges || isSaving}
                        text={isSaving ? 'Ukládání' : 'Uložit'}
                        >
                    </PrimaryButton>
                    <DefaultButton
                        disabled={isSaving} 
                        onClick={() => props.onDismiss!()}>
                        {SurveyManager.LocalizationService.getString('cancel')}
                    </DefaultButton>
                </div>
            }
        >

            <Autocomplete
                clearInputOnSelection
                disabled={isSaving}
                label='Přidat pole'
                suggestionsProps={{
                    suggestionRowHeight: 36
                }} 
                onResolveSuggestions={search}
                onChange={addField}
                deleteButtonProps={{
                    key: 'deleteButton',
                    iconProps: {
                        iconName: 'ChromeClose',
                        styles: {
                            root: {
                                fontSize: 12
                            }
                        }
                    },
                }}
                searchButtonProps={{
                    key: 'searchButton',
                    iconProps: {
                        iconName: 'Search',
                    },
                }}
                 />
            <div className={styles.fields}>
                {customFields.map((customField) =>
                    <div className={styles.field}>
                        <Text title={customField.title} variant='medium'>{customField.title}</Text>
                        <IconButton
                            disabled={isSaving}
                            iconProps={{ iconName: 'Delete' }}
                            onClick={() => removeField(customField.id)} />
                    </div>
                )}
            </div>
        </Panel>
    );
}