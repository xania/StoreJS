import { ITemplate, IDriver, renderAll } from "../index.js"
import { IExpression } from "../store.js"

type ListProps<T> = { source: IExpression<T> }
export function List<T>(props: ListProps<T>, children: any[]): ITemplate {
    return new ListTemplate<T>(props.source, children);
}

class ListTemplate<T> implements ITemplate {
    constructor(public source: IExpression<T>, public children: any[]) {
    }

    render(driver: IDriver) {
        const iterator = this.source.iterator();
        const { children } = this;
        const childrenLength = children.length;

        const scope = driver.createScope("-- List Boundary --");
        const scopeDriver = scope.driver();

        const subscription = iterator.map( (item, idx) => {
            for(let i=0 ; i<childrenLength ; i++) {
                let child = children[i];
                let binding = renderAll(scopeDriver, typeof child === "function" ? child(item) : child);
            }

            return {
                unsubscribe() {
                    throw new Error("List Template unsubscribe(): Not yet implemented");
                }
            }
        })

        return scope;
    }
}
