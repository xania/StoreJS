import { Binding, ITemplate, Props, IDriver, PureComponent, Primitive, isPrimitive } from '../index.js';
import { IExpression } from '../store.js';

export function tpl(name: string | PureComponent, props: Props, ...children: ITemplate[]): ITemplate {
    if (typeof name === "string") {
        return new TagTemplate(name, children.map(asTemplate).concat(props ? attributes(props) : []))
    } else if (typeof name === "function") {
        return name(props, children);
    }
}

export function attributes(props: Props) {
    return props && Object.keys(props).map(key => new Attribute(key, props[key]))
}

export function asTemplate(item: any): ITemplate {
    if (isTemplate(item))
        return item;
    else if (typeof item  === "function") {
        return functionAsTemplate(item);
    }
    return new TextTemplate(item);
}

function isTemplate(value: any): value is ITemplate {
    return typeof value['render'] === "function"
}

function functionAsTemplate(func: Function): ITemplate {
    return {
        render(driver: IDriver, ...args) {
            const tpl = func(...args);
            return asTemplate(tpl).render(driver);
        }
    }
}

class TagTemplate implements ITemplate {
    constructor(public name: string, public children: ITemplate[]) {
    }

    render(driver: IDriver, index: number) {
        let { name } = this;
        let elt = driver.createElement(name, index);
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

class TextTemplate implements ITemplate {
    constructor(public value: Primitive | IExpression<Primitive>) {
    }

    render(driver: IDriver, idx: number): Binding {
        let { value } = this;

        if (isPrimitive(value)) {
            return driver.createText(value, idx);
        }
        else {
            let expr = value;
            let textElement = driver.createText(expr.value, idx);
            expr.subscribe(textElement);
            return textElement;
        }
    }
}

class Attribute implements ITemplate {
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

