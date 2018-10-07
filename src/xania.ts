import { renderAll, ITemplate } from "./xania/index"
export { tpl } from "./xania/elements/index"
import { DomDriver } from "./xania/binding"

export default { 
    render(dom, template: ITemplate) {
        return renderAll(new DomDriver(dom), template);
    }
}