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

        const subscription = iterator.map(insertAt, moveTo);

        return scope;

        function insertAt(item, idx) {

            let offset = idx * childrenLength;
            const bindings = [];

            for(let i=0 ; i<childrenLength ; i++, offset++) {
                let child = children[i];
                let binding = renderAll(scopeDriver, typeof child === "function" ? child(item) : child, offset);
                bindings.push(binding);
            }

            return {
                unsubscribe() {
                    for(let n=0 ; n<bindings.length ; n++) {
                        bindings[n].dispose();
                    }
                }
            }
        }

        function moveTo(fromIndex: number, toIndex: number) {
            console.log({ fromIndex, toIndex });
        }
    }
}
