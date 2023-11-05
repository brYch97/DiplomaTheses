import { mergeStyleSets } from "@fluentui/react/lib/Styling";

export const inputStyles = mergeStyleSets(({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        backgroundColor: 'white',
        '.sd-root-modern': {
            minHeight: 600
        },
    }
}));