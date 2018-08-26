type Observer<T> = { next(value?: T): void }
type Subscription = { unsubscribe() }
type Action<T> = (arg: T) => any;
type Selector<T, U> = (arg: T, idx?: number) => U;
type Parent = {}

type Unpack<T> = T extends any[] ? T[number] : T;

interface IValue<T> {
    value?: T;
    observers?: Observer<T>[];

    property<K extends keyof T>(propertyName: K): IProperty<T[K]>;
    subscribe(observer: Observer<T>): Subscription;
    // flatMap<U>(selector: Selector<IValue<Unpack<T>>, IValue<U[]>>): IValue<U[]> ;
    // map(action: Action<IValue<T>>);
    // iterator<K extends keyof T>() : Iterator<T[K]>;
}

interface IProperty<T> extends IValue<T> {
    name: string;
    // update(value: T);
}

interface IObservable<T> {
    subscribe(observer: Observer<T>): Subscription;
    complete();
}

const empty = "";
abstract class Value<T> implements IValue<T> {
    public properties = [];
    public value?: T;
    public observers: Observer<T>[];

    subscribe(observer: Observer<T>): Subscription {
        if (this.value !== void 0)
            observer.next(this.value);

        var observers = this.observers || (this.observers = []);
        observers.push(observer);
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
}

class Iteration<T, U> implements IObservable<U[]> {
    public observers: Observer<U[]>[] = [];

    constructor(public iterator: Iterator<T>, public selector: Selector<IValue<Unpack<T>>, IValue<U>>) { }

    subscribe(observer: Observer<U[]>): Subscription {
        var { observers } = this;
        observers.push(observer);
        return {
            unsubscribe() {
                var idx = observers.indexOf(observer);
                if (idx >= 0) observers.splice(idx, 1);
            }
        }
    }

    complete() {
        // /var { iterations } = this.iterator;
        // var idx = iterations.indexOf(this);
        // if (idx >= 0) iterations.splice(idx, 1);
    }

    next(items: IValue<Unpack<T>>[]) {
        var { selector } = this;

        console.log(items, items.map((item, idx) => selector(item, idx).value));
    }
}

export class Iterator<T> {
    // public properties: IProperty<T>[] = [];
    public length: number = 0;
    public iterations: Iteration<T, any>[] = [];
    // public value: ArrayItem<Unpack<T>>[];
    public observers: Observer<T>[] = [];
    public parentValue;

    constructor(public parent: IValue<T[]>) {
        parent.subscribe(this);
    }

    subscribe(observer: Observer<T>): Subscription {
        var { observers } = this;
        observers.push(observer);
        return {
            unsubscribe() {
                var idx = observers.indexOf(observer);
                if (idx >= 0) observers.splice(idx, 1);
            }
        }
    }

    map<U>(selector: Selector<IValue<Unpack<T>>, IValue<U>>): Iteration<T, U> {
        var iteration = new Iteration(this, selector);
        this.iterations.push(iteration);
        return iteration;
    }

    next(parentValue: T[]) {
        if (!Array.isArray(parentValue))
            throw Error("Not an array!");

        this.parentValue = parentValue;

        const valueLength = parentValue.length,
            prevLength = this.length;

        this.length = valueLength;
        let changed = valueLength !== prevLength;
        const propertyLength = properties.length;

        for (let i = 0; i < valueLength; i++) {
            if (i < propertyLength) {
                // let item = properties[i];
                // if (item.value !== value) {
                //     item.value = value;
                //     changed = true;
                // }
            }
            else {
                var item = this.parent.property(i);
                properties.push(item);
                changed = true;

                // for(var e=0 ; e<this.iterations.length; e++) {
                //     var iter = this.iterations[e];
                //     iter.selector(item);
                // }
            }
        }
        properties.length = valueLength;
    }
}

class ArrayItem<T> extends Value<T> implements IProperty<T> {
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
        var stack: { properties, value }[] = [this];
        var stackLength: number = 1;
        var dirty: IProperty<any>[] = [];
        var dirtyLength: number = 0;

        while (stackLength--) {
            const parent = stack[stackLength];
            var properties = parent.properties;
            const parentValue = parent.value;
            let i: number = properties.length | 0;
            while (i) {
                i = (i - 1) | 0;
                var child = properties[i];
                var changed = child.refresh && child.refresh(parentValue);
                stack[stackLength] = child;
                stackLength = (stackLength + 1) | 0;

                if (changed) {
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
