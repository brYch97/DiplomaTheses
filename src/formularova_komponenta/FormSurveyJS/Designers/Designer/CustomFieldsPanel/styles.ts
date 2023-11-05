import { mergeStyleSets } from "@fluentui/react/lib/Styling";

export const customFieldsPanelStyles = mergeStyleSets({
    root: {
        '.ms-Panel-content': {
            display: 'flex',
            flexDirection: 'column',
            gap: 10
        }
    },
    footer: {
        display: 'flex',
        gap: 8,
        '.ms-Spinner-circle': {
            marginRight: 4
        }
    },
    fields: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5
    },
    field: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: 2,
        borderRadius: 5,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: 'var(--field-background)',
        '>span': {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            minWidth: 0,
            textOverflow: 'ellipsis',
            fontWeight: 600,
            flexGrow: 1,
            opacity: 'var(--field-opacity)'
        }
    }
});