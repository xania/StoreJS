import { ITemplate, Props, IDriver } from "../index"

export function Fragment(props: Props, children?: ITemplate[]): ITemplate {
    return new FragmentTemplate(children);
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

