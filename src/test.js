"use strict";
exports.__esModule = true;
var ReactDOM = require("react-dom");
var React = require("react");
var Rx = require("rxjs");
var Re = require("./store");
// export let __hotReload = true
var Organisation = /** @class */ (function () {
    function Organisation() {
        this.count = 1;
        this.people = [];
    }
    return Organisation;
}());
var Person = /** @class */ (function () {
    function Person() {
        this.address = {};
    }
    return Person;
}());
var Address = /** @class */ (function () {
    function Address() {
    }
    return Address;
}());
function view(people) {
    return (React.createElement("div", null,
        React.createElement("h1", null,
            "header (",
            people.length,
            ")"),
        people.map(function (p, idx) { return (React.createElement("div", { key: idx },
            React.createElement("input", { type: "text", key: 0, defaultValue: p.firstName, onChange: function (evt) { return p.firstName = evt.target.value; } }),
            React.createElement("a", { onClick: function () { return people.splice(idx, 1); } }, "\u00D7"),
            React.createElement("span", null, p.firstName))); }),
        React.createElement("button", { onClick: function (evt) { return people.push({ firstName: "new Item" }); } }, "Add")));
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
var store = new Re.Store(model);
function run(dom) {
    var subject = new Rx.Subject();
    var firstNames = new Re.Iterator(store.property("people"))
        .map(function (person) { return person.property("firstName"); });
    firstNames.subscribe({ next: console.log });
    firstNames.subscribe(subject);
    subject.subscribe(console.log);
    store.property("people").property(0).property("firstName").subscribe({ next: function (x) { return console.log(' - ', x); } });
    Rx.interval(0, Rx.animationFrameScheduler).subscribe({
        next: function () {
            if (store.refresh()) {
                ReactDOM.render(view(model.people), dom);
            }
        }
    });
}
exports.run = run;
//# sourceMappingURL=test.js.map