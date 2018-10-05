import * as Re from "./store"

export interface Binding {
    driver?(): IDriver;
    unsubscribe();
}

export declare type Element = TagElement | TextElement

export interface TagElement {
    driver(): IDriver;
    unsubscribe();
}

export interface TextElement {
    next(value: Primitive);
    unsubscribe();
}

export interface IDriver {
    createElement(name: string): TagElement;
    createText(value: any): TextElement;
}

export function isPrimitive(value: any): value is Primitive {
    return typeof value === "number" || typeof value === "string" || typeof value === "boolean"
}

export class DomDriver implements IDriver {
    private target;
    private domElements = [];
    private events: { eventName: string, eventBinding: any, dom: any }[] = [];

    constructor(target) {
        if (typeof target === "string")
            this.target = document.querySelector(target);
        else
            this.target = target;
    }

    createElement(name: string) {
        const tagNode = document.createElement(name);
        this.target.appendChild(tagNode);

        return {
            driver() {
                return new DomDriver(tagNode);
            },
            unsubscribe() {
                tagNode.remove();
            }
        }
    }

    createText(value: Primitive) {
        const textNode: Text = document.createTextNode(value as string);
        this.target.appendChild(textNode);

        // if (isPrimitive(value)) {
        //     binding = new Binding(() => textNode.nodeValue = value as string, unsubscribe);
        // }
        // else {
        //     var expr = value;
        //     binding = new Binding(() => textNode.nodeValue = expr.value as string, unsubscribe);
        //     expr.subscribe(binding);
        // }

        return {
            next(value) {
                textNode.nodeValue = value as string;
            },
            unsubscribe() {
                return textNode.remove();
            }
        }
    }


    findEventBinding(target, eventName) {
        var events = this.events;
        while (target) {
            var e = events.length;
            while (e--) {
                var ev = events[e];
                if (ev.dom === target && ev.eventName === eventName) {
                    return ev.eventBinding;
                }
            }
            target = target.parentNode;
        }
        return null;
    }

    on(eventName, dom, eventBinding) {
        var events = this.events,
            i = events.length,
            eventBound = false;

        while (i--) {
            var ev = events[i];
            if (ev.eventName === eventName) {
                if (ev.dom === dom)
                    return ev;
                else {
                    eventBound = true;
                    break;
                }
            }
        }

        if (!eventBound) {
            this.target.addEventListener(eventName,
                event => {
                    var eventBinding = this.findEventBinding(event.target, eventName);
                    if (eventBinding) {
                        eventBinding.fire(event);
                        event.preventDefault();
                    }
                });
        }

        var entry = {
            eventName,
            dom,
            eventBinding,
            dispose() {
                var idx = events.indexOf(this);
                if (idx >= 0) {
                    events.splice(idx, 1);
                    return true;
                }
                return false;
            }
        };
        this.events.push(entry);
        return entry;
    }

    insert(_, dom, idx: number) {
        var domElements = this.domElements;
        var target = this.target;

        var curIdx = domElements.indexOf(dom);
        if (idx !== curIdx) {
            var childNodes = target.childNodes;
            if (idx < childNodes.length) {
                var current = childNodes[idx];
                if (current !== dom) {
                    target.insertBefore(dom, current);
                }
            } else {
                target.appendChild(dom);
            }
            var length = childNodes.length;
            domElements.length = length;
            for (let i = 0; i < length; i++) {
                domElements[i] = childNodes[i];
            }
            return true;
        }
        return false;
    }

    dispose() {
        var domElements = this.domElements,
            i = domElements.length;
        while (i--) {
            domElements[i].remove();
        }
    }

    // static text(expressions: (Primitive | Re.IExpression<Primitive>)[]): Binding {
    //     const textNode: Text = document.createTextNode("text-node");
    //     document.body.appendChild(textNode);

    //     var next = () => {
    //         var exprs = expressions, length = exprs.length;
    //         var result = "";
    //         for(var i=0 ; i<length ; i++) {
    //             var expr = exprs[i];
    //             if (typeof expr === "string" || typeof expr === "number")
    //                 result += expr;
    //             // else
    //             //     result += expr.value;
    //         }

    //         textNode.nodeValue = result;
    //     }
    //     next();

    //     var unsubscribe = () => {
    //         console.log(textNode);
    //         textNode.remove();
    //     }

    //     // var binding = new Binding(next, unsubscribe);

    //     for(var i=0 ; i<expressions.length ; i++) {
    //         var expr = expressions[i];
    //         if (typeof expr !== "string" && typeof expr !== "number") {
    //             // expr.subscribe(binding);
    //         }
    //     }

    //     return null;

    //     // return binding;
    // }
}

type Primitive = string | number | boolean