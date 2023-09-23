import { ISliderProps, Slider } from '@fluentui/react';
import * as React from 'react';

const useDebounce = (value?: number): number | undefined => {
    const [debouncedValue, setDebouncedValue] = React.useState<number>();
    const currentValueRef = React.useRef<number>();

    React.useEffect(() => {
        currentValueRef.current = value;
        const handler = setTimeout(() => {
            if(value === currentValueRef.current) {
                setDebouncedValue(value);
            }
        }, 300);
        return () => {
            clearTimeout(handler);
        }
    }, [value])
    return debouncedValue;
};
export const SliderComponent: React.FC<ISliderProps> = (props) => {
    const [value, setValue] = React.useState<number | undefined>(props.value);
    const debouncedValue = useDebounce(value);

    React.useEffect(() => {
        if(!debouncedValue) {
            return;
        }
        if(debouncedValue !== props.value) {
           props.onChange!(value!);
        }
    }, [debouncedValue]);

    return <Slider
        {...props}
        value={value}
        onChange={(value) => {
            setValue(value);
        }} />
}