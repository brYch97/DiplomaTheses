import { mergeStyleSets } from "@fluentui/react/lib/Styling";

export const localizationStyles = mergeStyleSets({
    columnHeader: {
        '.ms-DetailsHeader-cellName': {
            flexGrow: 1
        }
    },
    columnHeaderCustom: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        '> span': {
            fontWeight: 600,
            flexGrow: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        '.ms-Button': {
            display: 'none',
        },
        ':hover': {
            '.ms-Button': {
                display: 'block'
            }
        }
    },
    columnHeaderAddIcon: {
        position: 'relative',
        left: -15,
        backgroundColor: 'transparent',
        ':hover, :active': {
            backgroundColor: 'transparent',
        },
        '[data-icon-name="ChevronDown"]': {
            display: 'none',
        }
    },
    dialog: {
        '.ms-Dialog-inner': {
            display: 'flex',
            flexDirection: 'column'
        },
        '.ms-Dialog-content': {
            overflow: 'auto',
            maxHeight: 600
        },
        '.ms-Dialog-actions': {
            flex: 0,
            marginTop: 0,
            paddingTop: 24
        }
    },
    detailsList: {
        '.ms-DetailsRow-cell:first-child': {
            display: 'flex',
            alignItems: 'center'
        }
    },
    value: {
        padding: 15,
        '> span': {
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 5
        }
    }
});