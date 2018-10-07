import { ITemplate, Props, IDriver } from "../index"
import { asTemplate } from "./index"

export function Fragment(props: Props, children?: any[]): ITemplate {
    return new FragmentTemplate(children.map(asTemplate));
}

class FragmentTemplate implements ITemplate {
    constructor(public children?: ITemplate[]) {
    }

    render(driver: IDriver) {
        return {
            children: this.children,
            driver() {
                return driver;
            },
            dispose() {
                throw new Error("unsubscribe(): Not yet implemented");
            }
        }
    }
}

