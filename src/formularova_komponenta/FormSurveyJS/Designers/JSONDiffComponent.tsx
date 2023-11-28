import * as React from 'react';
import { Differ } from 'json-diff-kit';
import { Viewer } from 'json-diff-kit';
import Dialog, { DialogType } from '@fluentui/react/lib/Dialog';
import 'json-diff-kit/dist/viewer.css';
import { ISchema } from '../interfaces/ISchema';

interface IJSONDiffComponent {
    onDismiss: () => void;
    originalSchema: ISchema;
    currentSchema: ISchema;
}

const viewerProps = {
    indent: 4,
    lineNumbers: true,
    highlightInlineDiff: true,
    inlineDiffOptions: {
        mode: 'word',
        wordSeparator: ' '
    },
};
/**
 * Functional component that creates a viewer for JSON differences in schema.
 */
export const JSONDiffComponent: React.FC<IJSONDiffComponent> = (props) => {
    const diffRef = React.useRef(new Differ({
        detectCircular: true,
        showModifications: true,
        arrayDiffMethod: 'lcs',
        ignoreCase: false,
        ignoreCaseForKey: false,
        recursiveEqual: true,
    }).diff(props.originalSchema, props.currentSchema))
    return (
        <Dialog dialogContentProps={{
            type: DialogType.close,
            title: 'Changes Viewer'
        }} onDismiss={props.onDismiss} maxWidth={'90%'} hidden={false}>
            {
                //@ts-ignore - missing typings
                <Viewer
                    diff={diffRef.current}
                    {...viewerProps}
                />
            }
        </Dialog>
    )
}