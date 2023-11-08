import * as React from 'react';
import { languageSelectorStyles } from './styles';
import { IContextualMenuItem } from '@fluentui/react/lib/components/ContextualMenu';
import { CommandBarButton } from '@fluentui/react/lib/components/Button';

interface ILanguageSelector {
    languages: IContextualMenuItem[];
    selectedLanguage: string;
    onChange: (option: IContextualMenuItem) => void;
}

/**
 * @function LanguageSelector
 * @description Functional component that creates a dropdown menu for language selection.
 * @param {ILanguageSelector} props - The properties for the LanguageSelector component.
 * @returns {React.FC} The LanguageSelector component.
 */
export const LanguageSelector: React.FC<ILanguageSelector> = (props) => {
    return (
        <CommandBarButton
            className={languageSelectorStyles.root} 
            text={props.languages.find(language => language.key === props.selectedLanguage)?.text}
            iconProps={{
                iconName: 'LocaleLanguage'
            }}
            menuProps={{
                onItemClick(ev, item) {
                    props.onChange(item!);
                },
                items: props.languages
            }} />
    )
}