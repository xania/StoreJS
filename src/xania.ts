import { renderAll, ITemplate } from "./xania/index.js"
export { tpl } from "./xania/elements/index.js"
import { DomDriver } from "./xania/binding.js"

export default { 
    render(dom, template: ITemplate) {
        return renderAll(new DomDriver(dom), template);
    }
}