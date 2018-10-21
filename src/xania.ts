import { renderAll, ITemplate } from "./xania/index.js"
export { tpl } from "./xania/elements/index.js"
import { DomDriver } from "./xania/binding.js"

export function renderer(target: HTMLElement) {
    return (value: XaniaViewResult) => {
        return value.render({ target });
    }
}

export default function (template: ITemplate): XaniaViewResult {
    return {
        render({ target }) {
            return renderAll(new DomDriver(target), template);
        }
    } as XaniaViewResult
}

interface XaniaViewResult {
    render(context: { target: HTMLElement }): { dispose(); }
};
