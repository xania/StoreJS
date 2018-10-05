import * as Rx from 'rxjs';
import * as Re from './xania/store';
import { Organisation, compile, personTemplate } from "./template"

// export let __hotReload = true

var counter = 3;
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

var model = {
    count: 1,
    people: [
        {
            id: 1,
            firstName: "Ibrahim",
            address: { street: "Punter 315" }
        },
        {
            id: 2,
            firstName: "Ramy",
            address: { street: "Punter 315" }
        },
        {
            id: 3,
            firstName: "Rania",
            address: { street: "Punter 315" }
        }
    ]
};

window["model"] = model;

var store = new Re.Store<Organisation>(model);

export function run(dom) {
    var subject = new Rx.Subject<string[]>();

    store.property("people").iterator().map(compile(personTemplate))
    subject.subscribe(console.log);

    // store.property("people").property(0).property("firstName").subscribe({ next: x => console.log(' - ', x) });

    Rx.interval(0, Rx.animationFrameScheduler).subscribe({
        next() {
            if (store.refresh()) {
                // ReactDOM.render(view(model.people), dom);
            }
        }
    });
}
