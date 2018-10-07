import * as Rx from 'rxjs';
import * as Re from './xania/store';
import { Organisation, organisationTemplate } from "./template"
import Xania from "./xania"

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
    Xania.render(dom, organisationTemplate(store));
    Rx.interval(0, Rx.animationFrameScheduler).subscribe({
        next() {
            if (store.refresh()) {
                // ReactDOM.render(view(model.people), dom);
            }
        }
    });
    store.refresh()
}

window["swap"] = function swap(arr, x, y) {
    let temp = arr[x];
    arr[x] = arr[y];
    arr[y] = temp;
}

window["insert"] = function insert(arr, x, y) {
    let temp = arr[x];
    arr[x] = arr[y];
    arr[y] = temp;
}