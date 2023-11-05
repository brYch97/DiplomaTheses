import { mergeStyleSets } from "@fluentui/react/lib/Styling";

export const designerStyles = mergeStyleSets({
    root: {
        '.svc-tab-designer_content, .sd-body, .svc-creator__content-wrapper': {
            minHeight: 600
         },
         '&.survey-predefined-fields .svc-toolbox__container': {
            display: 'flex',
            flexDirection: 'column',
            '.svc-toolbox__category': {
                order: 2,
                ':last-child': {
                    order: 1,
                    '>div:nth-child(2)': {
                        display: 'none'
                    }
                }
            }
         },
         '.sv-title-actions .sv-title-actions__title': {
            flex: 'inherit'
         }
    },

    notificationContainer: {
        float: "right",
    },
    predefinedFieldsToolboxTitle: {
        '::after': {
            content: "'⚙️'",
            marginLeft: 10,
            fontSize: 15,
            cursor: 'pointer',
            position: 'relative',
            top: 1,
            display: "inline-block",
            width: 20,
            height: 20,
            textAlign: 'center',
        },
    },
})