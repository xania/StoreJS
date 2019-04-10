// import bestSeq, { lcs } from "./lcs"

type Unsubscribable = { unsubscribe() }
type Subscription = Unsubscribable;
type Selector<T, U> = (arg: T, newIndex?: number) => U;
type MoveHandler = (fromIndex: number, toIndex: number) => any;
type Parent = {
    set(path: (number | string)[], value): boolean;
    value?: any;
}
type Action<T> = (value: T) => void;

interface Operator<T, R> {
    (source: T): R;
}

export interface NextObserver<T> {
    next: (value: T) => void;
}

export type Subscribable<T> = { subscribe(observer: NextObserver<T> | Action<T>): Unsubscribable; };
export type Observable<T> = Subscribable<T> & { lift<R>(operator: Operator<T, R>): Observable<R>; };
type ItemOf<T> = T extends any[] ? T[number] : T;
type ProxyOf<T> =
    { [K in keyof T]: ProxyOf<T[K]> } &
    Observable<T> &
    {
        update?(value: T): boolean;
        value: T;
    };

export interface IExpression<T> {
    value?: T;
    observers?: NextObserver<T>[];
    properties?: IProperty<never>[];
    iterators?: Iterator<T>[];

    property<K extends keyof T>(propertyName: K): IProperty<T[K]>;
    p<K extends keyof T>(propertyName: K): IProperty<T[K]>;

    subscribe(next: (value: T) => void): Unsubscribable;
    subscribe(observer: NextObserver<T>): Unsubscribable;
    // flatMap<U>(selector: Selector<IExpression<ItemOf<T>>, IExpression<U[]>>): IExpression<U[]> ;
    // map(action: Action<IExpression<T>>);
    // iterations : Iteration<T, Subscription>[];
    iterator?(): Iterator<T>;
    update?(value: T): boolean;
    observe<U>(comparer: (prevValue: T, newValue: T) => U): ValueObserver<T, U>
}

export interface IProperty<T> extends IExpression<T> {
    // name: string | number;
    update(value: T): boolean;
}

const empty = "";
abstract class Value<T> implements IExpression<T> {

    public properties = [];
    public observers: NextObserver<T>[];
    public iterators: Iterator<T>[] = [];

    constructor(public value?: T) { }

    subscribe(observer: NextObserver<T> | Action<T>): Subscription {
        if (typeof observer === "function") {
            return this.subscribe({ next: observer });
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

    lift<R>(operator: Operator<T, R>): Observable<R> {
        return liftable(this, operator);
        function liftable<R>(source: Value<T>, operator: Operator<T, R>) {
            return {
                subscribe(observer: NextObserver<R> | Action<R>) {
                    if (typeof observer === "function")
                        return source.subscribe(value => observer(operator(value)));

                    return source.subscribe(value => observer.next(operator(value)));
                },
                lift<S>(second: Operator<R, S>) {
                    return liftable<S>(source, function (r) {
                        return second.call(this, operator.call(this, r));
                    });
                }
            };
        }
    }

    property<K extends keyof T>(propertyName: K): IProperty<T[K]> {
        return this.p(propertyName);
    }

    p<K extends keyof T>(propertyName: K): IProperty<T[K]> {
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
        iter.refresh(this.value);
        return iter;
    }

    asProxy(): ProxyOf<T> {
        return asProxy(this);
    }

    valueOf() {
        return this.value;
    }

    [Symbol.toStringTag] = (hint) => {
        console.log(`toPrimitive hint: ${hint}`)
        return this.value;
    }

    observe<U>(comparer: (prevValue: T, newValue: T) => U): ValueObserver<T, U> {
        const p = new ValueObserver(comparer);

        const {properties} = this;
        p.refresh(this.value);
        properties.push(p);
        return p;
    }
}

type ArrayMutation = (
    { type: "insert", index: number } |
    { type: "remove", index: number } |
    { type: "move", from: number, to: number }
);

export interface ObservableArray<T> {
    subscribe(observer: NextArrayMutationsObserver<T>): Subscription;
};
type ArrayMutationsCallback<T> = (array: T, mutations?: ArrayMutation[]) => any;

type NextArrayMutationsObserver<T> = {
    next: ArrayMutationsCallback<T>;
};

export class Iterator<T> implements ObservableArray<T> {
    // public observers: Observer<IExpression<ItemOf<T>>>[];
    public properties: ObjectProperty<ItemOf<T>>[] = [];
    public length: number = 0;
    public _observers: NextArrayMutationsObserver<T>[] = [];
    public value;
    public parentValue;

    constructor(public parent: IExpression<T>) {
    }

    subscribe(observer: NextArrayMutationsObserver<T>): Subscription;
    subscribe(observer: ArrayMutationsCallback<T>): Subscription;
    subscribe(observer: NextArrayMutationsObserver<T> | ArrayMutationsCallback<T>): Subscription {
        if (typeof observer === "function") {
            return this.subscribe({ next: observer });
        }

        const { _observers: observers } = this;
        observers.push(observer);

        if (Array.isArray(this.parent.value)) {
            const mutations = this.properties.map((p, i) => ({ type: "insert", index: i }) as ArrayMutation);
            this.notifyObservers(this.parent.value, mutations);
        }

        return {
            unsubscribe() {
                var idx = observers.indexOf(observer);
                observers.splice(idx, 1);
            }
        } as Subscription
    }

    refresh(parentValue: T) {
        this.value = parentValue;
        let valueLength = (parentValue && parentValue['length']) || 0,
            prevLength = this.length,
            properties = this.properties;

        // bestSeq(properties, parentValue as any, (p, v) => p.value === v, () => {
        //     // TODO
        // });

        const mutations: ArrayMutation[] = [];
        for (let n = 0; n < valueLength; n++) {
            let next = parentValue[n];
            let propIdx: false | number = false;

            if (typeof next === "object") {
                for (var m = n; m < prevLength; m++) {
                    if (properties[m].value === next) {
                        propIdx = m;
                        break;
                    }
                }
            } else if (properties[n]) {
                propIdx = n;
            }

            if (propIdx === false) {
                let item = new ObjectProperty<ItemOf<T>>(this, n, next);
                properties.splice(n, 0, item);
                prevLength++;
                mutations.push({ type: "insert", index: n })
            } else if (propIdx !== n) {
                let swap = properties[propIdx];
                properties[propIdx] = properties[n];
                properties[n] = swap;
                properties[n].name = n;
                properties[propIdx].name = propIdx;
                mutations.push({ type: "move", from: n, to: propIdx })
            }

        }

        for (let i = prevLength - 1; i >= valueLength; i--) {
            mutations.push({ type: "remove", index: i })
        }
        this.length = valueLength;
        properties.length = valueLength;

        if (mutations.length > 0) {
            this.notifyObservers(parentValue, mutations);
            return true;
        }
        return false;
    }

    notifyObservers(array: T, mutations) {
        const { _observers: observers } = this;
        for (var i = 0; i < observers.length; i++) {
            observers[i].next(array, mutations)
        }
    }

    set(path: string[], value): boolean {
        throw new Error("Not supported");
    }

    map<U>(project: (item: ItemOf<T>) => U) {
        const iterator = this;
        return create(project);

        function create<U>(project: (item: ItemOf<T>) => U) {
            const first = project;
            return {
                subscribe(observer: ArrayMutationsCallback<U[]>) {
                    return iterator.subscribe((arr, mutations) => {
                        observer(map(arr), mutations)
                    })
                },
                map<S>(project: (item: U) => S) {
                    return create<S>(x => project(first(x)));
                }
            }

            function map(arr: T): U[] {
                if (Array.isArray(arr)) {
                    return arr.map(project);
                } else {
                    return [project(arr as ItemOf<T>)];
                }
            }
        }
    }
}

class ObjectProperty<T> extends Value<T> implements IProperty<T> {
    constructor(protected parent: Parent, public name: string | number, value?) {
        super(value);
    }

    refresh(parentValue) {
        var name = this.name,
            newValue = parentValue ? parentValue[name] : void 0;

        if (newValue !== this.value) {
            this.value = newValue;
            return true;
        }

        return false;
    }

    update = (value: T) => {
        return this.parent.set([this.name], value);
    }

    set(path: string[], value: T): boolean {
        return this.parent.set([this.name, ...path], value);
    }
}

export class Store<T> extends Value<T> {
    constructor(public value?: T, public autoRefresh: boolean = true) {
        super();
        this.refresh();
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
        if (this.value !== value) {
            this.value = value;
            this.autoRefresh && this.refresh();
            return true;
        }
        return false;
    }

    set(path: (number | string)[], value): boolean {
        const newValue = mergeObject(this.value, path, value);
        if (newValue !== this.value) {
            this.value = newValue;
            if (this.autoRefresh) {
                this.refresh();
            }
            return true;
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


function mergeObject(parent: any, path: (string | number)[], value: any) {
    if (path.length === 0) {
        return value;
    }
    const property = path[0]

    if (parent === null || parent === undefined)
        return { [property]: value };

    const current = parent[property];
    const newValue = path.length ? mergeObject(current, path.slice(1), value) : value;
    if (current === newValue) {
        return parent;
    } else {
        return { ...parent, [property]: newValue };
    }
}

export function asProxy<T>(self: IExpression<T>): ProxyOf<T> {
    return new Proxy<any>(self, {
        get<K extends keyof T>(parent: IExpression<T>, name: K) {
            if (name === "subscribe")
                return subscribe;
            if (name === "update")
                return update;

            if (typeof name === "symbol" || name in self)
                return (self as any)[name];

            return asProxy(parent.p(name));
        },
        set<K extends keyof T>(parent: Value<T>, name: K, value: T[K]) {
            return parent.p(name).update(value);
        },

    });

    function subscribe(observer): Unsubscribable {
        return self.subscribe(observer);
    }

    function update(value: T): boolean {
        return self.update(value);
    }
}

export default Store;

class ValueObserver<T, U> extends Value<T> {
    constructor(public comparer: (prevValue: T, newValue: T) => U) {
        super();
    }

    refresh(parentValue) {
        var compareResult = this.comparer(this.value, parentValue)
        if (compareResult) {
            this.value = parentValue;
            return true;
        } else {
            return false;
        }
    }
}