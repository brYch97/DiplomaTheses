import * as React from 'react';
import { propertyGridComponentStyles } from './styles';
import { useCustomPropertyGridComponent } from './useCustomPropertyGridComponent';

export interface ICustomPropertyGridComponent {
    title: string;
    onRenderContent: (onDismiss: () => void) => React.ReactNode;
}

export interface ICustomPropertyGridComponentChild {
    onDismiss: () => void;
}

/**
 * Functional component that renders the content of custom property grid item.
 */
export const CustomPropertyGridComponent: React.FC<ICustomPropertyGridComponent> = (props) => {
    const [
        childMounted,
        setIsChildMounted
    ] = useCustomPropertyGridComponent();

    const onClickHandler = () => {
        setIsChildMounted(true);
    };
    return (
        <div className={propertyGridComponentStyles.root} onClick={onClickHandler}>
            <span>{props.title}</span>
            {childMounted &&
               props.onRenderContent(() => setIsChildMounted(false))
            }
        </div>
    )
};