import { ITemplate, IDriver } from "../index"
import { IExpression, ItemOf } from "../store"

type ListProps<T> = { source: IExpression<T> }
export function List<T>(props: ListProps<T>, children: ITemplate[]): ITemplate {
    return new ListTemplate<T>(props, children);
}

class ListTemplate<T> implements ITemplate {
    constructor(public props: ListProps<T>, public children: ITemplate[]) {
    }

    render(driver: IDriver) {
        this.props.source.iterator().map(compile(driver, this.children))
        return {
            dispose() {
                throw new Error("dispose(): Not yet implemented");
            }
        }
    }
}

function compile<T>(driver: IDriver, children: ITemplate[]) {
    return (input: T) => {
        for(let n = 0 ; n<children.length ; n++) {
            const rootTpl = children[n];
            const rootBinding = rootTpl.render(driver, input);
            const stack = [{ binding: rootBinding, tpl: rootTpl }];

            while (stack.length) {
                const { tpl, binding } = stack.pop();

                if (!binding.driver)
                    continue;

                const driver = binding.driver();
                if (binding.children) {
                    for (let i = 0; i < binding.children.length; i++) {
                        let child = binding.children[i];
                        let childBinding = child.render(driver);
                        stack.push({ tpl: child, binding: childBinding });
                    }
                }
                // if (tpl.attributes) {
                //     for (let i = 0; i < tpl.attributes.length; i++) {
                //         tpl.attributes[i].render(driver);
                //     }
                // }
            }
        }

        return {
            unsubscribe() {
                // return rootBinding;
            }
        }
    }
}
