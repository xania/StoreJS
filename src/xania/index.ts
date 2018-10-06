export interface IDriver {
    createElement(name: string): TagElement;
    createText(value: any): TextElement;
    createAttribute(name: string, value: any): TextElement;
}

export interface ITemplate {
    render(driver: IDriver, ...args): Binding;
}

export declare type Props = { [key: string]: any }
export declare type Element = TagElement | TextElement
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


export interface Binding {
    children?: ITemplate[];
    driver?(): IDriver;
    dispose();
}

export declare type PureComponent = (props: Props, children: ITemplate[]) => ITemplate

