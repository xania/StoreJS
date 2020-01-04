export interface Subscribable<T> {
    subscribe(observer: PartialObserver<T>): Unsubscribable;
    subscribe(next?: (value: T) => void, error?: null | undefined, complete?: () => void): Unsubscribable;
}

export interface Peekable<T> {
    peek<U>(project: (value: T) => U): U;
}

export type Updater<T> = T | ((a: T) => void | T)

export interface Updatable<T> extends Peekable<T> {
    update(value: Updater<T>): boolean;
}

export interface Property<T> extends Expression<T>, Updatable<T> {}

export interface Expression<T> extends Subscribable<T>, Peekable<T> { 
    property<K extends keyof T>(propertyName: K): Property<T[K]>;
    lift<U>(project: (value: T, prev?: U) => U): Expression<U>;
    dispose();
}

export interface Unsubscribable { unsubscribe(): void }

export type Action<T> = (value: T) => void;
export type Subscription = Unsubscribable;
export type SubscribableOrPromise<T> = Subscribable<T> | PromiseLike<T>

export interface PartialObserver<T> {
    next?: (value: T) => void;
    error?: (err: any) => void;
    complete?: () => void;
}

interface Operator<T, U> {
    (source: T): U;
}

export function isObservable(o: any): o is Expression<unknown> {
    if (typeof o !== "object")
        return false;
    
    if (typeof o.lift !== "function")
        return false;

    return isSubscribable(o);
}

export function isSubscribable(o: any): o is Subscribable<unknown> {
    if (o === null || typeof o !== "object")
        return false;
    
    if (typeof o.subscribe !== "function")
        return false;
    
    return true;
}
