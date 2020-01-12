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

export interface Expression<T> extends Subscribable<T>, Peekable<T>, Liftable<T> { 
    property<K extends keyof T>(propertyName: K): Property<T[K]>;
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

export function isExpression(o: any): o is Expression<unknown> {
    if (typeof o !== "object")
        return false;
    
    if (typeof o.lift !== "function")
        return false;

    return isSubscribable(o);
}

export interface Liftable<T> {
    lift<U>(project: (value: T, prev?: U) => U): Expression<U>;
}

export function isLiftable(o: any): o is Expression<unknown> {
    if (typeof o !== "object")
        return false;
    
    return typeof o.lift === "function";
}

export function isSubscribable(o: any): o is Subscribable<unknown> {
    if (o === null || typeof o !== "object")
        return false;
    
    if (typeof o.subscribe !== "function")
        return false;
    
    return true;
}

export type State<T> = 
    {
        [K in keyof T]: T[K] extends ((...args: any) => any) ? T[K] : State<T[K]>;
    }
    & Updatable<T>
    & Expression<T>;

interface NextObserver<T> {
    next(value: T);
}

export function isNextObserver<T>(value): value is NextObserver<T> {
    if (value === null)
        return false;
    if (typeof value === 'object')
        return typeof value.next === 'function'

    return false;
}
