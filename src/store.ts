// import bestSeq, { lcs } from "./lcs"

type Unsubscribable = { unsubscribe() }
type Subscription = Unsubscribable;
type Parent = {
    properties: IExpression<any>[];
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
    properties: IExpression<T[keyof T]>[];
    iterators?: Iterator<T>[];

    property<K extends keyof T>(propertyName: K): IProperty<T[K]>;
    property<K extends keyof T>(propertyName: K, immutable: true): IExpression<T[K]>;

    subscribe(next: (value: T) => void): Unsubscribable;
    subscribe(observer: NextObserver<T>): Unsubscribable;
    // flatMap<U>(selector: Selector<IExpression<ItemOf<T>>, IExpression<U[]>>): IExpression<U[]> ;
    // map(action: Action<IExpression<T>>);
    // iterations : Iteration<T, Subscription>[];
    iterator?(): Iterator<T>;
    update?(value: T): boolean;
    /**
     * maps value of this expressions of type T to type U
     * and emits distinct values of U
     * @param project projects value of T to U 
     */
    lift<U>(project: (value: T, prev) => U): ValueObserver<T, U>;
    dispose();
}

export interface IProperty<T> extends IExpression<T> {
    // name: string | number;
    update(value: T): boolean;
}

const empty = "";
class Value<T> implements IExpression<T> {

    public properties: IExpression<T[keyof T]>[] = [];
    public observers: NextObserver<T>[];
    public iterators: Iterator<T>[] = [];

    constructor(public parent: Parent, public value?: T) { }

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

    get <K extends keyof T>(propertyName: K): IProperty<T[K]> {
        const { properties } = this;
        let i = properties.length;
        while (i--) {
            const prop: any = properties[i];
            if (prop.name === propertyName) {
                return prop;
            }
        }
    }

    property<K extends keyof T>(propertyName: K): IProperty<T[K]>;
    property<K extends keyof T>(propertyName: K, immutable: true): IExpression<T[K]>;
    property<K extends keyof T>(propertyName: K, immutable?: true) {
        const prop = !immutable && this.get(propertyName);
        if (prop) return prop;

        var parentValue = this.value;
        var initValue = parentValue ? parentValue[propertyName] : void 0;

        const property = immutable 
            ? new Value<T[K]>(this, initValue)
            : new ObjectProperty<T[K]>(this, propertyName as string, initValue);
        this.properties.push(property as any);
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
        if (path.length === 0 || !this.value) {
            throw new Error("Invalid");
        }
        const first = path[0];
        const current = this.value[first]
        const newValue =mergeObject(current, path.slice(1), value);
        if (newValue !== current) {
            this.value[first] = newValue;
            refresh(this);
            return true;
        }
        return false;
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

    lift<U>(comparer: (newValue: T, prevValue: U) => U): ValueObserver<T, U> {
        const p = new ValueObserver(this, comparer, comparer(this.value, null));
        const { properties } = this;
        properties.push(p as any);
        return p;
    }

    dispose() {
        const { properties } = this.parent;
        var idx = properties.indexOf(this as any);
        if (idx >= 0) {
            properties.splice(idx, 1);
        }
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

class ObjectProperty<T> extends Value<T> implements IProperty<T> {
    constructor(parent: Parent, public name: string | number, value?: T) {
        super(parent, value);
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
    constructor(value?: T, public autoRefresh: boolean = true) {
        super(null, value);
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

    refresh() {
        return refresh(this);
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

            return asProxy(parent.property(name));
        },
        set<K extends keyof T>(parent: Value<T>, name: K, value: T[K]) {
            return parent.property(name).update(value);
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

class ValueObserver<T, U> extends Value<U> {
    constructor(parent: Parent, public project: (newValue: T, prevValue: U) => U, initValue) {
        super(parent, initValue);
    }

    refresh(parentValue: T) {
        var result = this.project(parentValue, this.value)
        if (result !== this.value) {
            this.value = result;
            return true;
        } else {
            return false;
        }
    }
}

function refresh<T>(root: Value<T>): boolean {
    var stack: { properties, value?, iterators?}[] = [root];
    var stackLength: number = 1;
    var dirty: IProperty<any>[] = [];
    var dirtyLength: number = 0;

    while (stackLength--) {
        const parent = stack[stackLength];
        const parentValue = parent.value;

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
        const { observers, value } = root;
        var e = (observers && observers.length) | 0;
        while (e--) {
            let observer = observers[e];
            observer.next(value);
        }
    }

    return dirtyLength > 0;
}
