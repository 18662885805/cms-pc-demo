import FormCreator, { FormCreatorContext } from "./form-creator";
import Picker from "./picker";
import Render from "./render";
import Configurator from "./configurator";
import Debugger from "./debugger";

import "./define-antd-widgets";

FormCreator.Context = FormCreatorContext;
FormCreator.Picker = Picker;
FormCreator.Render = Render;
FormCreator.Configurator = Configurator;
FormCreator.Debugger = Debugger;

export default FormCreator;
