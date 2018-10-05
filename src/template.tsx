import { IExpression, IProperty } from "./xania/store"
import { Binding, DomDriver, IDriver, Element, isPrimitive } from './xania/binding';

interface ITemplate {
    render<T>(driver: IDriver): Binding;
    children?: ITemplate[]
}

function isTemplate(value: any): value is ITemplate {
    return typeof value['render'] === "function"
}

type Primitive = number | string | boolean;

function asTemplate(item: ITemplate | Primitive | IExpression<Primitive>): ITemplate {
    if (isTemplate(item))
        return item;
    else
        return new TextTemplate(item);
}

function tpl(name: string, attributes: any[], ...children: ITemplate[]): ITemplate {
    console.log(children);

    return new TagTemplate(name, null, children.map(asTemplate))
}

export function compile<T>(fn: (input: T) => ITemplate): (input: T) => Binding {
    return (input: T) => {
        const rootTpl = fn(input);
        let rootBinding = rootTpl.render<Element>(new DomDriver(document.body));
        const stack = [ { binding: rootBinding, tpl: rootTpl }];

        while(stack.length) {
            const { tpl, binding } = stack.pop();

            if (tpl.children) {
                let childDriver = binding.driver();
                for(let i=0 ;i<tpl.children.length ; i++) {
                    let child = tpl.children[i];
                    let childBinding = child.render(childDriver);
                    if (child.children) {
                        stack.push( { tpl: child, binding: childBinding } );
                    }
                }
            }
        }

        return rootBinding;
    }
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

class TagTemplate implements ITemplate {
    constructor(public name: string, attrs, public children: ITemplate[]) {
    }

    render(driver:IDriver) {
        return driver.createElement(this.name);
    }
}

export class Address {
    public street?: string;
}

export class Organisation {
    public count: number = 1;
    public people: Person[] = [];
}

export class Person {
    public id: number;
    public firstName: string;
    public address?: Address = {};
}

export function personTemplate(person: IExpression<Person>): ITemplate {
    return (
        <div>
            {person.property("id")} 
            ::
            <div class="firstName">
                {person.property("firstName")}
            </div>
        </div>
    )
}

export function organisationTemplate(): ITemplate {
    return (
        <div>
            organisation
        </div>
    )
}

// export function personTemplate(person: IExpression<Person>) {
//     return Xania.createElement("div", null, 
//         Xania.createElement("span", null,
//             person.property("id"),
//             " :: ",
//             person.property("firstName")
//         )
//     )
// }

