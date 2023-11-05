import * as React from 'react';
import { languageSelectorStyles } from './styles';
import { IContextualMenuItem } from '@fluentui/react/lib/components/ContextualMenu';
import { CommandBarButton } from '@fluentui/react/lib/components/Button';

interface ILanguageSelector {
    languages: IContextualMenuItem[];
    selectedLanguage: string;
    onChange: (option: IContextualMenuItem) => void;
}

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