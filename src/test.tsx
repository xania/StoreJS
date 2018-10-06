import * as Rx from 'rxjs';
import * as Re from './xania/store';
import { Organisation, organisationTemplate } from "./template"
import { DomDriver } from "./xania/binding"

// export let __hotReload = true

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
    console.log(organisationTemplate(store).render(new DomDriver(dom)));
    // store.property("people").iterator().map(compile(personTemplate))
    // store.property("people").property(0).property("firstName").subscribe({ next: x => console.log(' - ', x) });
    Rx.interval(0, Rx.animationFrameScheduler).subscribe({
        next() {
            if (store.refresh()) {
                // ReactDOM.render(view(model.people), dom);
            }
        }
    });
    store.refresh()
}
