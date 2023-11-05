import * as React from 'react';
import { ActionButton } from '@fluentui/react/lib/Button';
import { JSONDiffComponent } from '../../JSONDiffComponent';
import { ISchema } from '../../../interfaces/ISchema';

interface IChangeNotificationProps {
    currentSchema: ISchema;
    storedSchema: ISchema;
}

//Uncomment to debug schema changes
export const ChangeNotificationComponent: React.FC<IChangeNotificationProps> = (props) => {
    const [diffComponentVisible, setDiffComponentVisible] = React.useState<boolean>(false);
    return (
        <>
         {/*  <ActionButton 
                text='See raw changes'
                iconProps={{
                    iconName: 'FieldChanged'
                }} 
                onClick={() => setDiffComponentVisible(true)} />
            {diffComponentVisible &&
                <JSONDiffComponent
                    originalSchema={props.storedSchema}
                    currentSchema={props.currentSchema}
                    onDismiss={() => setDiffComponentVisible(false)}  />
            } */}
        </>
    )
};