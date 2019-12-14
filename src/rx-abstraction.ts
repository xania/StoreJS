export interface Subscribable<T> {
    subscribe(observer: PartialObserver<T> | Action<T>): Unsubscribable;
    subscribe(next?: (value: T) => void, error?: null | undefined, complete?: () => void): Unsubscribable;
}

export interface Observable<T> extends Subscribable<T> { 
    lift<R>(operator: Operator<T, R>): Observable<R>;
}
export interface Unsubscribable { unsubscribe(): any }

export type Action<T> = (value: T) => void;
export type Subscription = Unsubscribable;
export type SubscribableOrPromise<T> = Subscribable<T> | PromiseLike<T>

export interface PartialObserver<T> {
    next?: (value: T) => void;
    error?: (err: any) => void;
    complete?: () => void;
}

interface Operator<T, R> {
    (source: T): R;
}

export function isObservable(o: any): o is Observable<unknown> {
    if (typeof o !== "object")
        return false;
    
    if (typeof o.lift !== "function")
        return false;

    return isSubscribable(o);
}

export function isSubscribable(o: any): o is Subscribable<unknown> {
    if (typeof o !== "object")
        return false;
    
    if (typeof o.subscribe !== "function")
        return false;
    
    return true;
}
