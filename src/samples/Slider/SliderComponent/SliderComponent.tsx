import * as React from 'react';
import { Slider as SliderBase, ISliderProps } from '@fluentui/react/lib/Slider';

export const SliderComponent: React.FC<ISliderProps> = (props) => {
    return (
        <SliderBase {...props} />
    )
}