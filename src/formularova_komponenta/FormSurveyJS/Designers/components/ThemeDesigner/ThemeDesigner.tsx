import * as React from 'react';
import { Panel } from '@fluentui/react/lib/Panel';
import { IVariable } from '../../../services/SurveyThemeService';
import { Label } from '@fluentui/react/lib/Label';
import { TextField } from '@fluentui/react/lib/TextField';
import { themeDesignerStyles } from './styles';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { useTheme } from '@fluentui/react/lib/Theme';
import { SketchPicker } from 'react-color'
import { Callout } from '@fluentui/react/lib/Callout';
import * as deepEqual from 'fast-deep-equal';
import { SurveyManager } from '../../../services/SurveyManager';
import { ICustomPropertyGridComponentChild } from '../PropertyGridComponent/CustomPropertyGridComponent';

interface IThemeDesignerProps extends ICustomPropertyGridComponentChild {
    variables: IVariable[];
    onGetLabelForCSSVariable: (name: string) => string;
    onGetStoredVariables: () => IVariable[] | undefined;
    onSetVariable: (name: string, value: string) => void;
    onSetVariablesToDefaultValues: () => void;
    onSetVariablesToStoredValues: () => void;
}

const ThemeDesigner: React.FC<ICustomPropertyGridComponentChild> = (props) => {
    const containerRef = React.createRef<HTMLDivElement>();
    React.useEffect(() => {
        if (containerRef.current) {
            SurveyManager.ThemeService.setComponentContainer(containerRef.current!, props.onDismiss);
            SurveyManager.ThemeService.render();
        }
    }, []);
    return (
        <div ref={containerRef} />
    )
};
export default ThemeDesigner;

export const ThemeDesignerComponent: React.FC<IThemeDesignerProps> = (props) => {
    const theme = useTheme();
    const styles = React.useMemo(() => themeDesignerStyles, []);
    const variables = props.variables;
    const [currentVariableBeingEdited, setCurrentVariableBeingEdited] = React.useState<string>();

    const renderInput = (variable: IVariable) => {
        if (variable.name === '--font-family' || variable.name === '--base-unit') {
            return <TextField value={variable.value} onChange={(e, value) => {
                props.onSetVariable(variable.name, value!)
            }} />
        }
        return (
            <div
                id={`preview_${variable.name}`}
                onClick={() => setCurrentVariableBeingEdited(variable.name)}
                className={`${styles.colorPreview} ${mergeStyles({
                    border: `1px solid ${theme.semanticColors.inputBorder}`,
                    ' > div': {
                        backgroundColor: variable.value,
                    }
                })}`}><div /></div>
        )
    }
    return (
        <Panel
            isOpen={true}
            overlayProps={{
                className: styles.overlay
            }}
            onDismiss={props.onDismiss}
            isFooterAtBottom
            onMouseLeave={() => setCurrentVariableBeingEdited(undefined)}
            headerText={SurveyManager.LocalizationService.getString('theme')}
            className={mergeStyles({
                '.ms-Panel-footerInner': {
                    backgroundColor: theme.semanticColors.bodyBackground,
                    borderTop: `1px solid ${theme.semanticColors.bodyDivider}`
                }
            })}
            onRenderFooterContent={() => <div className={styles.panelFooterButtons}>
                <PrimaryButton onClick={() => {
                    props.onSetVariablesToDefaultValues();
                }}>{SurveyManager.LocalizationService.getString('themeSetToDefault')}</PrimaryButton>
                {
                    !deepEqual(variables, props.onGetStoredVariables()) &&
                    <DefaultButton onClick={() => {
                        props.onSetVariablesToStoredValues();
                    }}>{SurveyManager.LocalizationService.getString('themeSetToStored')}</DefaultButton>
                }
            </div>}
        >
            {variables.map(variable => {
                return (
                    <div key={variable.name} className={styles.colorPicker}>
                        <Label>{props.onGetLabelForCSSVariable(variable.name)}</Label>
                        {renderInput(variable)}
                    </div>
                );
            })}
            {currentVariableBeingEdited &&
                <Callout
                    onDismiss={() => setCurrentVariableBeingEdited(undefined)}
                    alignTargetEdge
                    target={`#preview_${currentVariableBeingEdited}`}>
                    <SketchPicker
                        color={variables.find(variable => variable.name === currentVariableBeingEdited)?.value}
                        onChangeComplete={(color) => {
                            props.onSetVariable(currentVariableBeingEdited, color.hex);
                        }} />
                </Callout>
            }
        </Panel>
    )
};