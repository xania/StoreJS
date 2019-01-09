type Unsubscribable = { unsubscribe() }
type Subscription = Unsubscribable;
type Selector<T, U> = (arg: T, newIndex?: number) => U;
type MoveHandler = (fromIndex: number, toIndex: number) => any;
type Parent = {
    set(path: (number | string)[], value): boolean;
}
type Action<T> = (value: T) => void;

export interface NextObserver<T> {
    next: (value: T) => void;
}

type ItemOf<T> = T extends any[] ? T[number] : T;

export interface IExpression<T> {
    value?: T;
    observers?: NextObserver<T>[];
    properties?: IProperty<never>[];
    iterators?: Iterator<T>[];

    property<K extends keyof T>(propertyName: K): IProperty<T[K]>;

    subscribe(next: (value: T) => void): Unsubscribable;
    subscribe(observer: NextObserver<T>): Unsubscribable;
    // flatMap<U>(selector: Selector<IExpression<ItemOf<T>>, IExpression<U[]>>): IExpression<U[]> ;
    // map(action: Action<IExpression<T>>);
    // iterations : Iteration<T, Subscription>[];
    iterator(): Iterator<T>;
    update?(value: T): boolean;
}

export interface IProperty<T> extends IExpression<T> {
    name: string | number;
}

const empty = "";
abstract class Value<T> implements IExpression<T> {

    public properties = [];
    public value?: T;
    public observers: NextObserver<T>[];
    public iterators: Iterator<T>[] = [];

    subscribe(observer: NextObserver<T> | Action<T>) : Subscription  {
        if (typeof observer === "function") {
            return this.subscribe({next: observer});
        }

        if (this.value !== void 0)
            observer.next(this.value);

        var observers = this.observers;
        if (observers) {
            let length = observers.length;
            observers[length] = observer;
        } else {
            this.observers = observers = [observer];
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
        const property = new ObjectProperty<T[K]>(this, propertyName as string);
        property.refresh(this.value);
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

    set(path: (number | string)[], value): boolean {
        throw new Error("Not supported");
    }

    iterator(): Iterator<T> {
        let iter = new Iterator<T>(this);
        this.iterators.push(iter);
        return iter;
    }
}

class Iteration<T> {
    constructor(public execute: Selector<IExpression<ItemOf<T>>, Subscription>, public move: MoveHandler) {

    }

    unsubscribe(item: IExpression<ItemOf<T>>) {
        console.log('unsubscribe item: ', item);
    }
}

function findIndex<T>(properties: IProperty<T>[], idx: number, value: T) {
    for (var m = idx; m < properties.length; m++) {
        if (properties[m].value === value) {
            return m;
        }
    }
    return false;
}

export class Iterator<T> {
    // public observers: Observer<IExpression<ItemOf<T>>>[];
    public properties: ObjectProperty<ItemOf<T>>[] = [];
    public length: number = 0;
    public iterations: Iteration<T>[] = [];
    public value;
    public parentValue;
    private subscrSymbol = Symbol("subscriptions")

    constructor(public parent: IExpression<T>) {
    }

    get propertyObservers() {
        const { subscrSymbol } = this;

        let result = [];
        for (let prop of this.properties) {
            result.push.apply(result, prop[subscrSymbol])
        }

        return result;
    }

    map(execute: Selector<IExpression<ItemOf<T>>, Subscription>, move: MoveHandler): any[] {
        var iterations = this.iterations || (this.iterations = []);
        var iteration = new Iteration(execute, move);
        iterations.push(iteration);
        return iterations;
    }

    refresh(parentValue: T) {
        this.value = parentValue;
        let valueLength = parentValue['length'],
            prevLength = this.length,
            properties = this.properties,
            { subscrSymbol } = this;

        let changed = valueLength !== prevLength;
        for (let n = 0; n < valueLength; n++) {
            let next = parentValue[n];
            let propIdx: false | number = false; // findIndex<ItemOf<T>>(properties, n, next);

            for (var m = n; m < prevLength; m++) {
                if (properties[m].value === next) {
                    propIdx = m;
                    break;
                }
            }

            if (propIdx !== false) {
                if (propIdx !== n) {
                    properties[propIdx].value = properties[n].value;
                    properties[n].value = next;
                    this.moveTo(n, propIdx)
                } else {
                    properties[n].name = n;
                }
            } else {
                let item = new ObjectProperty<ItemOf<T>>(this, n);
                item[subscrSymbol] = [];
                properties.splice(n, 0, item);
                this.insertAt(item, n);
                prevLength++;
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

    set(path: string[], value): boolean {
        throw new Error("Not supported");
    }

    insertAt(item: IProperty<ItemOf<T>>, newIndex: number) {
        var { iterations, subscrSymbol } = this;
        if (iterations) {
            for (let e = 0; e < iterations.length; e++) {
                let subscription = iterations[e].execute(item, newIndex);
                item[subscrSymbol].push(subscription);
            }
        }
    }

    moveTo(oldIndex: number, newIndex: number) {
        var { iterations } = this;
        if (iterations) {
            for (let e = 0; e < iterations.length; e++) {
                let subscription = iterations[e].move(newIndex, oldIndex);
                // item[subscrSymbol].push(subscription)
            }
        }
    }
}

class ObjectProperty<T> extends Value<T> implements IProperty<T> {
    constructor(protected parent: Parent, public name: string | number) {
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

    update = (value: T) => {
        return this.parent.set([this.name], value);
    }

    set(path: string[], value: T): boolean {
        this.parent.set([this.name, ...path], value);
        return false;
    }
}

export class Store<T> extends Value<T> {
    constructor(public value?: T, public autoRefresh: boolean = true) {
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

    update = (value: T) => {
        if (mergeObject(this, 'value', value)) {
            this.autoRefresh && this.refresh();
            return true;
        }

        return false;
    }

    resolve(path: (number | string)[]) {
        var obj = this.value || (this.value = {} as T);
        for(var i=0 ; i<path.length-1 ; i++) {
            var name = path[i];
            obj = obj[name] || (obj[name] = {})
        }
        const last = path[path.length - 1];
        return { obj, property: last };
    }

    set(path: (number | string)[], value): boolean {
        if (path.length === 0)
            return false;

        const { obj, property } = this.resolve(path);

        if (obj[property] !== value) {
            var changed = mergeObject(obj, property, value)
            if (changed && this.autoRefresh) {
                this.refresh();
            }
            return changed;
        }

        return false;
    }

    public refresh() {
        var stack: { properties, value?, iterators?}[] = [this];
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
                let observer = observers[e];
                observer.next(value);
            }
        }

        if (dirtyLength) {
            const { observers, value } = this;
            var e = (observers && observers.length) | 0;
            while (e--) {
                let observer = observers[e];
                observer.next(value);
            }
        }

        return dirtyLength;
    }
}


function mergeObject(parent: any, property: string | number, value: any): boolean {
    const current = parent[property];
    if (current === value) {
        return false;
    }
    else if (current && typeof current === "object" && value && typeof value === "object") {
        let b = false;
        for(var prop in value) {
            b = mergeObject(current, prop, value[prop]) || b;
        }
        return b;
    } else {
        parent[property] = value;
        return true;
    }
}