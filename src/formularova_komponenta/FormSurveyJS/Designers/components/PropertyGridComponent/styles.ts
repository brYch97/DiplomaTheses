import { mergeStyleSets } from "@fluentui/react/lib/Styling";

export const propertyGridComponentStyles = mergeStyleSets({
    root: {
        padding: 'calc(2 * var(--base-unit, 8px))',
        boxSizing: 'border-box',
        width: '100%',
        borderRight: '1px solid var(--border, #fff)',
        outline: 'none',
        color: 'var(--foreground-light, #909090)',
        cursor: 'pointer',
        textAlign: 'left',
        backgroundColor: 'var(--background, #fff)',
        boxShadow: 'inset 0px -1px 0px var(--border, #d6d6d6)',
        fontFamily: 'var(--font-family)',
        fontSize: 'calc(2 * var(--base-unit, 8px))',
        fontWeight: 400,
        margin: 0,
        ':hover': {
            backgroundColor: 'var(--background-dim, #f3f3f3)'
        }
    }
});