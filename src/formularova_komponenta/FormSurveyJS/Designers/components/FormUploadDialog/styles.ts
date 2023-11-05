import { getTheme, mergeStyleSets } from "@fluentui/react/lib/Styling";

const theme = getTheme();
export const formUploadDialogStyles = mergeStyleSets({
    root: {
        '.ms-Dialog-main': {
            width: 600,
            maxWidth: 'calc(100% - 32px)',
            height: 600

        },
        '.ms-Modal-scrollableContent, .ms-Modal-scrollableContent>div, .ms-Dialog-inner, .ms-Dialog-content': {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minHeight: 0
        },
        '.ms-Dialog-content': {
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10
        },
        'input[type="file"]': {
            display: 'none'
        },
        'iframe': {
            width: '100%',
            flex: 1,
            overflow: 'auto',
            border: `1px solid ${theme.semanticColors.bodyDivider}`,
        }
    },
    uploadLabel: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        width: 'max-content',
        cursor: 'pointer',
        padding: 8,
        '>span': {
            fontWeight: 600
        },
        '>i': {
            fontSize: 50,
            backgroundColor: theme.semanticColors.primaryButtonBackground,
            color: theme.semanticColors.primaryButtonText,
            padding: 8,
            borderRadius: 10

        },
        ':hover': {
            backgroundColor: theme.semanticColors.buttonBackgroundHovered,
            color: theme.semanticColors.actionLinkHovered
        },
        ':active': {
            backgroundColor: theme.semanticColors.buttonBackgroundPressed,
            color: theme.semanticColors.actionLinkHovered
        }
    },
    deleteFile: {
        alignSelf: 'flex-start',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        width: '100%',
        '>span': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: 600
        }
    },
    iframeWrapper: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        minHeight: 0,
        width: '100%',
        position: 'relative',
        '&[data-is-loading-structure="true"]::before': {
            content: "''",
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: 5,
            background: theme.palette.themePrimary,
            boxShadow: `0 0 70px 20px ${theme.palette.themePrimary}`,
            clipPath: 'inset(0)',
            animation: `FormDesignerUploadFormDialogX 1.5s ease-in-out infinite alternate, FormDesignerUploadFormDialogY 3s ease-in-out infinite;`
        }
    }
});