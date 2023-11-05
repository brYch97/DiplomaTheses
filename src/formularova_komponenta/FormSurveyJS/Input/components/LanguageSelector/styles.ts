import { mergeStyleSets } from "@fluentui/react/lib/Styling";

export const languageSelectorStyles = mergeStyleSets({
    root: {
        height: 32,
        '[data-icon-name="ChevronDown"]': {
            display: 'none'
        }
    }
})