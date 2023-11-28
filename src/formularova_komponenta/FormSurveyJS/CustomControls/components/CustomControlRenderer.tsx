import React = require("react");
import { INestedPcfFactory, IVirtualComponentProps } from "../../interfaces/INestedCustomControlFactory";
import * as uniqid from 'uniqid';
import { CustomControl } from "../CustomControl";
import { CustomControlProperty } from "../CustomControlProperty";
import { SurveyManager, SurveyType } from "../../services/SurveyManager";

interface ICustomControlRendererProps {
  customControl: CustomControl;
  [key: string]: any;
}

/**
 * Renders a custom control component.
 */
export const CustomControlRenderer: React.FC<ICustomControlRendererProps> = (props) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const factory = props.customControl.parentContext.factory as INestedPcfFactory;
  const customControl = props.customControl;
  const customControlInstanceId = React.useMemo(() => {
    return `${customControl.name}_${uniqid()}`;
  }, []);
  const shouldUpdate = React.useRef<boolean>(false);
  React.useEffect(() => {
    const component = factory.createComponent(customControl.name, customControlInstanceId, getProperties());
    factory.bindDOMElement(component, containerRef.current as Element);
  }, []);

  React.useEffect(() => {
    if(SurveyManager.SurveyType !== SurveyType.FieldDesigner) {
      return;
    }
    if (!shouldUpdate.current) {
      shouldUpdate.current = true;
      return;
    }
    refreshComponent();
  }, [props.customControl]);


  const refreshComponent = () => {
    factory.unbindDOMComponent(customControlInstanceId);
    const component = factory.createComponent(customControl.name, customControlInstanceId, getProperties());
    factory.bindDOMElement(component, containerRef.current as Element);
  }
  //gets the value of both static and bound properties
  const getPropertyValue = (property: CustomControlProperty) => {
    if (property.usage === "input") {
      return props.question[property.nameSurveyJS];

    }
    return props.question.value;
  }

  const getProperties = (): IVirtualComponentProps => {
    const parameters: any = {};
    let bindingPropertyName: string = "";
    for (const property of customControl.properties) {
      if(property.isBindingProperty && !bindingPropertyName) {
        bindingPropertyName = property.name;
      }
      parameters[property.name] = {
        Static: false,
        Primary: false,
        Type: property.ofType,
        Value: getPropertyValue(property),
        Usage: 3,
        //sets the bounded property value as the value of the SurveyJS question
        Callback: (value: string) => {
          if(property.usage === 'input' || !property.isBindingProperty) {
            return;
          }
          props.question.value = value;
        }
      }
    }
    return {
      controlstates: {
        isControlDisabled: props.question.isReadOnly
      },
      parameters
    }
  };

  return (
      <div ref={containerRef} />
  );
};
