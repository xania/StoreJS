import { Binding, ITemplate, Props, IDriver, PureComponent, Primitive, isPrimitive } from '../index';
import { IExpression } from '../store';

export function attributes(props: Props) {
    return props && Object.keys(props).map(key => new Attribute(key, props[key]))
}

class TagTemplate implements ITemplate {
    constructor(public name: string, public children: ITemplate[]) {
    }

    render(driver: IDriver) {
        let { name } = this;
        let elt = driver.createElement(name);
        return {
            children: this.children,
            driver() {
                return elt.driver()
            },
            dispose() {
                elt.dispose()
            }
        };
    }
}

export class Attribute implements ITemplate {
    constructor(public name: string, public value: Primitive | IExpression<Primitive>) {
    }

    render(driver: IDriver) {
        let { name, value } = this;

        if (isPrimitive(value)) {
            return driver.createAttribute(name, value);
        }
        else {
            let expr = value;
            let attrElement = driver.createAttribute(name, expr.value);
            expr.subscribe(attrElement);
            return attrElement;
        }
    }
}

export function tpl(name: string | PureComponent, props: Props, ...children: ITemplate[]): ITemplate {
    let childTemplates = children.map(asTemplate).concat(props ? attributes(props) : []);
    if (typeof name === "string") {
        return new TagTemplate(name, childTemplates)
    } else if (typeof name === "function") {
        return name(props, childTemplates);
    }
}

function isTemplate(value: any): value is ITemplate {
    return typeof value['render'] === "function"
}

function asTemplate(item: any): ITemplate {
    if (isTemplate(item))
        return item;
    else if (typeof item  === "function") {
        return functionAsTemplate(item);
    }
    return new TextTemplate(item);
}

class TextTemplate implements ITemplate {
    constructor(public value: Primitive | IExpression<Primitive>) {
    }

    render(driver: IDriver): Binding {
        let { value } = this;

        if (isPrimitive(value)) {
            return driver.createText(value);
        }
        else {
            let expr = value;
            let textElement = driver.createText(expr.value);
            expr.subscribe(textElement);
            return textElement;
        }
    }
}

function functionAsTemplate(func: Function): ITemplate {
    return {
        render(driver: IDriver, ...args) {
            const tpl = func(...args);
            return asTemplate(tpl).render(driver);
        }
    }
}

// function compile<T>(driver: IDriver, fn: (input: T) => ITemplate) {
//     return (input: T) => {
//         const rootTpl = fn(input);
//         let rootBinding = rootTpl.render(driver);
//         const stack = [{ binding: rootBinding, tpl: rootTpl }];

//         while (stack.length) {
//             const { tpl, binding } = stack.pop();

//             if (!binding.driver)
//                 continue;

//             const { children, attributes } = tpl;
//             const driver = binding.driver();
//             if (children) {
//                 for (let i = 0; i < children.length; i++) {
//                     let child = children[i];
//                     let childBinding = child.render(driver);
//                     stack.push({ tpl: child, binding: childBinding });
//                 }
//             }
//             if (attributes) {
//                 for (let i = 0; i < attributes.length; i++) {
//                     attributes[i].render(driver);
//                 }
//             }
//         }

//         return {
//             unsubscribe() {
//                 return rootBinding;
//             }
//         }
//     }
// }
