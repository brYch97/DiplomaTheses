import * as React from 'react';
import { MessageBar } from '@fluentui/react/lib/MessageBar';
import { Slider as SliderBase, ISliderProps } from '@fluentui/react/lib/Slider';

export const Slider: React.FC<ISliderProps> = (props) => {
    return (
        <>
        <MessageBar>Sample slider component</MessageBar>
        <SliderBase {...props} />
        </>
    )
}