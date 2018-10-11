export interface IDriver {
    createElement(name: string, index: number): TagElement;
    createText(value: any, index: number): TextElement;
    createAttribute(name: string, value: any): TextElement;
    createScope(name: string): ScopeElement;
}

export interface ITemplate {
    render(driver: IDriver, ...args): Binding;
}

export declare type Props = { [key: string]: any }
export declare type Element = TagElement | TextElement | ScopeElement
export type Primitive = string | number | boolean

export function isPrimitive(value: any): value is Primitive {
    return typeof value === "number" || typeof value === "string" || typeof value === "boolean"
}

export interface TagElement {
    driver(): IDriver;
    dispose();
}

export interface TextElement {
    next(value: Primitive);
    dispose();
}

export interface ScopeElement {
    driver(): IDriver;
    dispose();
}

export interface Binding {
    children?: ITemplate[];
    driver?(): IDriver;
    dispose();
}

export declare type PureComponent = (props: Props, children: ITemplate[]) => ITemplate

export function renderAll(driver: IDriver, rootTpl: ITemplate, idx: number = 0) {
    const rootBinding = rootTpl.render(driver, idx);
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
    }

    return rootBinding;
}
