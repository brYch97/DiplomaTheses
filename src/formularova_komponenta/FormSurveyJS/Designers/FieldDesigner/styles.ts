import { mergeStyleSets } from "@fluentui/react/lib/Styling";

export const fieldDesignerStyles = mergeStyleSets({
    root: {
        ".svc-page__add-new-question, .sd-page__description, .sd-body__page .sd-page__title, .sd-element__num, .svc-question__drag-area, .svc-creator-tab > .svc-flex-column:first-child, .svc-question__content .sv-action:not(:first-child)": {
            display: 'none'
        },
        ".svc-question__content-actions": {
            display: 'block'
        },
        '.svc-question__content-actions .sv-action-bar': {
            justifyContent: 'flex-start'
        },
        '.spg-body--empty': {
            display: 'none'
        }
    }
})