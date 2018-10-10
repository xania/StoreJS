type Observer<T> = { next(value?: T): void }
type Subscription = { unsubscribe() }
type Selector<T, U> = (arg: T, newIndex?: number, oldIndex?: number) => U;
type Parent = {}

type ItemOf<T> = T extends any[] ? T[number] : T;

export interface IExpression<T> {
    value?: T;
    observers?: Observer<T>[];

    property<K extends keyof T>(propertyName: K): IProperty<T[K]>;
    subscribe(observer: Observer<T>): Subscription;
    // flatMap<U>(selector: Selector<IExpression<ItemOf<T>>, IExpression<U[]>>): IExpression<U[]> ;
    // map(action: Action<IExpression<T>>);
    // iterations : Iteration<T, Subscription>[];
    iterator(): Iterator<T>;
}

export interface IProperty<T> extends IExpression<T> {
    name: string;
    // update(value: T);
}

interface IObservable<T> {
    subscribe(observer: Observer<T>): Subscription;
    complete();
}

export function map<T, U>(iterator: Iterator<T>, selector: Selector<IExpression<ItemOf<T>>, any>): Iteration<T> {
    var iteration = null; // new Iteration(iterator, selector);

    // value.subscribe(iterator);
    // if (!value.iterations) {
    //     value.iterations = [];
    // }
    // value.iterations.push(iteration);
    return iteration;
}

const empty = "";
abstract class Value<T> implements IExpression<T> {

    public properties = [];
    public value?: T;
    public observers: Observer<T>[];
    public iterators: Iterator<T>[] = [];

    // map() {
    //     if (!this.iterator)
    //         this.iterator = new Iterator(this);
    //     return this.iterator;
    // }

    subscribe(observer: Observer<T>): Subscription {
        if (this.value !== void 0)
            observer.next(this.value);

        var observers = this.observers;
        if (observers) {
            let length = observers.length;
            observers[length] = observer;
        } else {
            this.observers = [observer];
        }

        return {
            unsubscribe() {
                var idx = observers.indexOf(observer);
                observers.splice(idx, 1);
            }
        } as Subscription
    }

    property<K extends keyof T>(propertyName: K): IProperty<T[K]> {
        const properties = this.properties;
        let i = properties.length;
        while (i--) {
            const prop = properties[i];
            if (prop.name === propertyName) {
                return prop;
            }
        }
        const property = new ObjectProperty<T[K]>(this, propertyName);
        properties.push(property);
        return property;
    }

    toString(): string {
        var value = this.value;
        if (typeof value === "string")
            return value;
        else if (value === void 0 || value === null)
            return empty;
        else
            return value.toString();
    }

    set(name, value) {
        if (this.value[name] !== value) {
            this.value[name] = value;
            return true;
        }
        return false;
    }

    iterator(): Iterator<T> {
        let iter = new Iterator<T>(this);
        this.iterators.push(iter);
        return iter;
    }
}

class Iteration<T> {
    constructor(public execute: Selector<IExpression<ItemOf<T>>, Subscription>) { }

    unsubscribe(item: IExpression<ItemOf<T>>) {
        console.log('unsubscribe item: ', item);
    }
}

function findIndex<T>(properties: IProperty<T>[], idx: number, value: T) {
    for(var i=idx ; i<properties.length ; i++) {
        if (properties[i].value === value) {
            return i;
        }
    }
    return false;
}

export class Iterator<T> {
    public observers: Observer<IExpression<ItemOf<T>>>[];
    public properties: ObjectProperty<ItemOf<T>>[] = [];
    public length: number = 0;
    public iterations: Iteration<T>[] = [];
    public value;
    public parentValue;
    private subscrSymbol = Symbol("subscriptions")

    constructor(public parent: IExpression<T>) {
    }

    // map<U>(selector: Selector<IExpression<ItemOf<T>>, IExpression<U>>): Iteration<T, U> {
    //     var iteration = new Iteration(this, selector);
    //     this.iterations.push(iteration);
    //     return iteration;
    // }

    map(select: Selector<IExpression<ItemOf<T>>, Subscription>): any[] {
        var iterations = this.iterations || (this.iterations = []);
        var iteration = new Iteration(select);
        iterations.push(iteration);
        // return {
        //     unsubscribe() {
        //         var idx = iterations.indexOf(iteration);
        //         iterations.splice(idx, 1);
        //     }
        // } as Subscription
        return iterations;
    }

    refresh(parentValue: T) {
        this.value = parentValue;
        const valueLength = parentValue['length'],
            prevLength = this.length,
            properties = this.properties,
            { subscrSymbol } = this;

        let changed = valueLength !== prevLength;
        for(let n = 0; n<valueLength ; n++) {
            let next = parentValue[n];
            let propIdx = findIndex<ItemOf<T>>(properties, n, next);
            if (propIdx !== false) {
                if (propIdx !== n) {
                    let prop = properties[propIdx];
                    properties[propIdx] = properties[n]
                    properties[n] = prop;
                    prop.name = n;
                    properties[propIdx].name = propIdx;
                    this.notify(prop, n, propIdx)
                }
            } else {
                let item = new ObjectProperty<ItemOf<T>>(this, n);
                properties.splice(n, 0, item);
                this.notify(item, n);
            }
        }

        for (let i = valueLength; i < prevLength; i++) {
            let item = properties[i];
            var subscriptions = item[subscrSymbol];
            for (let e = 0; e < subscriptions.length; e++) {
                subscriptions[e].unsubscribe()
            }
        }
        this.length = valueLength;
        properties.length = valueLength;

        return changed;
    }

    notify(item: IProperty<ItemOf<T>>, newIndex: number, oldIndex?: number) {
        var { iterations } = this;
        if (iterations) {
            for (let e = 0; e < iterations.length; e++) {
                let subscription = iterations[e].execute(item, newIndex, oldIndex);
                // item[subscrSymbol].push(subscription)
            }
        }
    }

    // next(parentValue: T[]) {
    //     if (!Array.isArray(parentValue))
    //         throw Error("Not an array!");

    //     this.parentValue = parentValue;

    //     const valueLength = parentValue.length,
    //         prevLength = this.length;

    //     this.length = valueLength;
    //     let changed = valueLength !== prevLength;
    //     const propertyLength = properties.length;

    //     for (let i = 0; i < valueLength; i++) {
    //         if (i < propertyLength) {
    //             // let item = properties[i];
    //             // if (item.value !== value) {
    //             //     item.value = value;
    //             //     changed = true;
    //             // }
    //         }
    //         else {
    //             var item = this.parent.property(i);
    //             properties.push(item);
    //             changed = true;

    //             // for(var e=0 ; e<this.iterations.length; e++) {
    //             //     var iter = this.iterations[e];
    //             //     iter.selector(item);
    //             // }
    //         }
    //     }
    //     properties.length = valueLength;
    // }
}

// class ArrayItem<T> {
//     public value;

//     constructor(public name: number) {
//     }

//     refresh(parentValue) {
//         var name = this.name,
//             newValue = parentValue ? parentValue[name] : void 0;

//         if (newValue !== this.value) {
//             this.value = newValue;

//             // if (newValue === void 0 || newValue === null)
//             //     this.properties.length = 0;

//             return true;
//         }
//         return false;
//     }
// }


class ObjectProperty<T> extends Value<T> implements IProperty<T> {
    constructor(protected parent: Parent, public name) {
        super();
    }

    valueOf() {
        return this.value;
    }

    refresh(parentValue) {
        var name = this.name,
            newValue = parentValue ? parentValue[name] : void 0;

        if (newValue !== this.value) {
            this.value = newValue;

            if (newValue === void 0 || newValue === null)
                this.properties.length = 0;

            return true;
        }
        return false;
    }
}

export class Store<T> extends Value<T> {
    constructor(public value) {
        super();
    }

    expr(expr: string) {
        var parts = expr.split('.');
        console.log(parts)
        return (value) => {
            var obj = this.value;
            var len = parts.length - 1;
            for (var i = 0; i < len; i++) {
                var prop = parts[i];
                var child = obj[prop];
                if (!child) {
                    obj[prop] = (child = {});
                }
                obj = child;
            }
            var last = parts[len];
            obj[last] = value;
        }
    }

    update(value: T) {
        throw new Error("")
    }

    public refresh() {
        var stack: { properties, value, iterators?}[] = [this];
        var stackLength: number = 1;
        var dirty: IProperty<any>[] = [];
        var dirtyLength: number = 0;

        while (stackLength--) {
            const parent = stack[stackLength];
            const parentValue = parent.value;

            const iterators = parent.iterators;
            if (iterators) {
                for (let i = 0; i < iterators.length; i++) {
                    const iter = iterators[i];
                    if (iter.refresh(parentValue)) {
                        dirty[dirtyLength] = iter;
                        dirtyLength = (dirtyLength + 1) | 0;
                    }
                    if (iter && iter.properties && iter.properties.length > 0) {
                        stack[stackLength] = iter;
                        stackLength = (stackLength + 1) | 0;
                    }
                }
            }

            var properties = parent.properties;
            let i: number = properties.length | 0;
            while (i) {
                i = (i - 1) | 0;
                var child = properties[i];
                stack[stackLength] = child;
                stackLength = (stackLength + 1) | 0;

                if (child.refresh && child.refresh(parentValue)) {
                    dirty[dirtyLength] = child;
                    dirtyLength = (dirtyLength + 1) | 0;
                }
            };
        }

        var j = dirtyLength;
        while (j--) {
            const property = dirty[j];
            const { observers } = property;
            if (!observers) continue;
            const { value } = property;
            var e = observers.length | 0;
            while (e--) {
                var observer = observers[e];
                observer.next(value);
            }
        }
        return dirtyLength;
    }
}
