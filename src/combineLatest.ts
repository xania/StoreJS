import { Expression } from "./observable";
import { PartialObserver, Action, Unsubscribable, isSubscribable } from "./observable";


type ExpressionType<T> = T extends Expression<infer U> ? U : T;
export type UnpackSubscribables<T> = { [K in keyof T]: Exclude<T[K], Expression<any>> | ExpressionType<Extract<T[K], Expression<any>>> }

export function combineLatest<T extends any[]>(expressions: T) {
    type U = UnpackSubscribables<T>;
    return {
        subscribe(observer: PartialObserver<U> | Action<U>) {
            const state = new Array(expressions.length) as U;
            const subscriptions: Unsubscribable[] = [];

            for (let i = 0; i < expressions.length; i++) {
                const expr = expressions[i];
                if (isSubscribable(expr)) {
                    const subscr = expr.subscribe(v => {
                        if (state[i] !== v) {
                            state[i] = v;
                            emit();
                        }
                    });
                    subscriptions.push(subscr);
                } else {
                    state[i] = expr;
                }
            }
            emit();

            function emit() {
                if (typeof observer === 'function')
                    observer(state);
                else
                    observer.next(state);
            }

            return {
                unsubscribe() {
                    for (let i = 0; i < subscriptions.length; i++) {
                        subscriptions[i].unsubscribe();
                    }
                }
            }
        }
    }
}
