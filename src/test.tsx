import * as ReactDOM from 'react-dom';
import * as React from 'react';
import * as Rx from 'rxjs';
import { map, tap, takeWhile } from 'rxjs/operators';
import * as Re from './store';

// export let __hotReload = true

class Organisation {
    public count: number = 1;
    public people: Person[] = [];
}

class Person {
    public firstName: string;
    public address?: Address = {};
}

class Address {
    public street?: string;
}

function view(people: Person[]) {

    return (
        <div>
            <h1>header ({people.length})</h1>
            {
                people.map((p, idx) => (
                    <div key={idx}>
                        <input type="text" key={0} defaultValue={p.firstName} onChange={evt => p.firstName = evt.target.value} />
                        <a onClick={() => people.splice(idx, 1)}>&times;</a>
                        <span>{p.firstName}</span>
                    </div>
                ))
            }
            <button onClick={evt => people.push({ firstName: "new Item" })} >Add</button>
        </div>
    );
}

var model = {
    count: 1,
    people: [
        {
            firstName: "Ibrahim",
            address: { street: "Punter 315" }
        },
        {
            firstName: "Ramy",
            address: { street: "Punter 315" }
        },
        {
            firstName: "Rania",
            address: { street: "Punter 315" }
        }
    ]
};

var store = new Re.Store<Organisation>(model);
export function run(dom) {
    var subject = new Rx.Subject<string[]>();

    var firstNames = new Re.Iterator<Person>(store.property("people"))
        .map(person => person.property("firstName"));

    firstNames.subscribe({ next: console.log });
    firstNames.subscribe(subject);

    subject.subscribe(console.log);

    store.property("people").property(0).property("firstName").subscribe({ next: x => console.log(' - ', x) });

    Rx.interval(0, Rx.animationFrameScheduler).subscribe({
        next() {
            if (store.refresh()) {
                ReactDOM.render(view(model.people), dom);
            }
        }
    });
}
