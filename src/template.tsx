import { IExpression } from "./xania/store"
import { ITemplate, Binding } from './xania/index';
import { tpl } from "./xania"
import { Fragment } from "./xania/elements/fragment"
import { List } from "./xania/elements/list"

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

export function personTemplate(className: string) {
    return (person: IExpression<Person>) => (
        <div class={ className }>
            {person.property("id")}
            ::
            {fullName(person)}
        </div>
    )
}

function fullName(person: IExpression<Person>): ITemplate {
    return (
        <Fragment>
            <span class="firstName">
                {person.property("firstName")}
            </span>
            &nbsp;
            <span class="lastName">
                Ben Salah
            </span>
        </Fragment>
    )
}

export function organisationTemplate(organisation: IExpression<Organisation>): ITemplate {
    return (
        <Fragment>
            <List source={organisation.property("people")}>
                { personTemplate("green") }
            </List>
        </Fragment>
    );
}

// var counter = 3;
// function view(people: Person[]) {

//     function onChange(p: Person, value: string) {
//         p.firstName = value;
//     }

//     return (
//         <div>
//             <h1>header ({people.length})</h1>
//             {
//                 people.map((p, idx) => (
//                     <div key={p.id}>
//                         <input type="text" defaultValue={p.firstName} onChange={evt => onChange(p, evt.target.value)} />
//                         <a onClick={() => people.splice(idx, 1)}>&times;</a>
//                         <span>{p.firstName}</span>
//                     </div>
//                 ))
//             }
//             <button onClick={evt => people.push({ id: ++counter, firstName: `new Item ${counter}` })} >Add</button>
//         </div>
//     );
// }