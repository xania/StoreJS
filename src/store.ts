// import bestSeq, { lcs } from "./lcs"
import { Observable, PartialObserver, Unsubscribable, Action, Subscription } from "./rx-abstraction";

type Func = (...args: any) => any;

export type ProxyOf<T> =
    {
        [K in keyof T]: T[K] extends Func ? T[K] : ProxyOf<T[K]>
    }
    & Observable<T>
    & {
        update?(value: T): boolean;
        value: T;
    };

export interface IExpression<T> {
    value?: T;

    property<K extends keyof T>(propertyName: K): IProperty<T[K]>;
    property<K extends keyof T>(propertyName: K, freeze: true): IExpression<T[K]>;

    subscribe(next: (value: T) => void): Unsubscribable;
    subscribe(observer: PartialObserver<T>): Unsubscribable;

    update?(value: T): boolean;
    lift<U>(project: (value: T, prev?: U) => U): ValueObserver<T, U>;
    dispose();
}

export interface IProperty<T> extends IExpression<T> {
    // name: string | number;
    update(value: T): boolean;
}

const observable = typeof Symbol === 'function' && Symbol.observable || '@@observable';

const empty = "";

interface Parent<T> {
    value?: T;
    properties?: IExpression<T[keyof T]>[];
}

abstract class Value<T> implements IExpression<T> {

    public properties: IExpression<T[keyof T]>[] = [];
    //     public lifters: IExpression<T[keyof T]>[] = [];
    public observers: PartialObserver<T>[];
    // public iterators: Iterator<T>[] = [];

    constructor(public parent: Parent<any>, public value?: T) { }

    [observable]() {
        return this;
    }

    subscribe = (observer: PartialObserver<T> | Action<T>) => {
        if (typeof observer === "function") {
            return this.subscribe({ next: observer });
        }

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
        } as Unsubscribable
    }

    get<K extends keyof T>(propertyName: K): IProperty<T[K]> {
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
    property<K extends keyof T>(propertyName: K, freeze: true): IExpression<T[K]>;
    property<K extends keyof T>(propertyName: K, freeze?: true) {
        const prop = !freeze && this.get(propertyName);
        if (prop) return prop;

        var parentValue = this.value;
        var initValue = parentValue ? parentValue[propertyName] : void 0;

        const property = freeze
            ? new FrozenValue<T[K]>(this, initValue)
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
        const p = new ValueObserver(this, comparer, comparer(this.value, undefined));
        // const { lifters } = this;
        // lifters.push(p as any);
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

class FrozenValue<T> extends Value<T> {
    constructor(parent: Value<any>, value: T) {
        super(parent, value);
    }

    valueFrom() {
        // ignore updates
        return this.value;
    }

    dispose() {
        super.dispose();


        const idx = this.parent.value && this.parent.value.indexOf
            ? this.parent.value.indexOf(this.value)
            : -1
            ;

        if (idx >= 0) {
            this.parent.value.splice(idx, 1);

            const dirty = digest(this.parent);
            // const dirty: Value<any>[] = [];
            let parent = this.parent;
            while (parent) {
                dirty.push(parent);
                parent = parent['parent']; //.parent;
            }

            flush(dirty);
            // refreshStack([this.parent], dirty);
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

export class ObjectProperty<T> extends Value<T> implements IProperty<T> {
    constructor(parent: Parent<any>, public name: string | number, value?: T) {
        super(parent, value);
    }

    valueFrom(parentValue) {
        return parentValue && parentValue[this.name];
    }

    update = (value: T, autoRefresh: boolean = true) => {
        if (value === this.value)
            return false;
        this.value = value;

        var parentValue = this.parent.value;
        if (parentValue) {
            parentValue[this.name] = value;
        } else {
            mergeParent(this.parent, { [this.name]: value });
        }

        if (autoRefresh) {
            const dirty = digest(this);
            let parent: any = this;
            while (parent) {
                dirty.push(parent);
                parent = parent.parent;
            }
            flush(dirty);
        }

        return true;

        function mergeParent(parent, value) {
            parent.update(value, false);
        }
    }
}

export class Store<T> extends Value<T> {
    constructor(value?: T, public autoRefresh: boolean = true) {
        super(null, value);
    }

    expr(expr: string) {
        var parts = expr.split('.');
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

    update = (value: T | Action<T>, autoRefresh: boolean = true) => {
        if (typeof value === 'function') {
            value.apply(null, [this.value]);

            if (autoRefresh) {
                const dirty = digest(this);
                dirty.push(this);
                flush(dirty);
            }
            return true;
        }
        else if (this.value !== value) {
            this.value = value;

            if (autoRefresh) {
                const dirty = digest(this);
                // TODO do we still need this?
                dirty.push(this);
                flush(dirty);
            }
            return true;
        }
        return false;
    }

    refresh = refresh

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

            var result = parent.property(name);
            if (typeof result === "function")
                return result;

            return asProxy(result);
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
    constructor(parent: Value<any>, public valueFrom: (newValue: T, prevValue: U) => U, initValue) {
        super(parent, initValue);
    }
}

export function refresh<T>(root = this) {
    const dirty = digest(root);
    if (dirty.length) {
        flush(dirty);
        return true;
    }
    return false;
}

export function digest(root: { properties?, value?}): any[] {
    var stack = [root];
    var stackLength: number = stack.length;
    var dirtyLength: number = 0;
    var dirty = [];

    while (stackLength--) {
        const parent = stack[stackLength];
        const parentValue = parent.value;

        var { properties } = parent;

        if (properties) {
            let propIdx: number = properties.length | 0;
            while (propIdx) {
                propIdx = (propIdx - 1) | 0;
                var prop = properties[propIdx];
                //recurse
                stack[stackLength] = prop;
                stackLength = (stackLength + 1) | 0;

                const prevValue = prop.value;
                const childValue = prevValue === null ? prop.valueFrom(parentValue) : prop.valueFrom(parentValue, prevValue);
                if (prevValue !== childValue) {
                    prop.value = childValue;
                    dirty[dirtyLength] = prop;
                    dirtyLength = (dirtyLength + 1) | 0;
                }
            };
        }
    }

    // expand with parents
    return dirty;
}

// TODO refactor / merge with refreshStack
function flush(dirty: any[]) {
    var listLength: number = dirty.length;

    while (listLength--) {
        const item = dirty[listLength];
        const itemValue = item.value;

        const { observers } = item;
        if (observers) {
            var e = observers.length | 0;
            while (e--) {
                let observer = observers[e];
                observer.next(itemValue);
            }
        }
    }
}



export class ListItem<T> extends Value<T> {
    constructor(public value: T) {
        super(null, value);
    }

    update = (newValue: T, autoRefresh: boolean = true) => {
        const { value } = this;

        if (value === newValue) {
            return false;
        }

        this.value = newValue;

        if (autoRefresh) {
            const dirty = digest(this);
            dirty.push(this);
            flush(dirty);
            return true;
        }
        return true;
    }
}
