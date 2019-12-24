import { IExpression } from "./store";
import { PartialObserver, Action, Unsubscribable, isSubscribable } from "./rx-abstraction";


type llllll<T> = T extends IExpression<infer U> ? U : T;
export type UnpackSubscribables<T> = { [K in keyof T]: Exclude<T[K], IExpression<any>> | llllll<Extract<T[K], IExpression<any>>> }

export function join<T extends any[]>(expressions: T) {
    type U = UnpackSubscribables<T>;
    return {
        subscribe(observer: PartialObserver<U> | Action<U>) {
            const state = new Array(expressions.length) as U;
            const subscriptions: Unsubscribable[] = [];

            for(let i=0 ; i<expressions.length ; i++) {
                const expr = expressions[i];
                if (isSubscribable(expr)) {
                    const subscr = expr.subscribe(v => {
                        state[i] = v;
                        emit();
                    });
                    subscriptions.push(subscr);
                } else {
                    state[i] = expr;
                }
            }
            emit();

            function emit() {
                for(let i=0 ; i<state.length ; i++) {
                    if (state[i] === undefined)
                        return;
                }
                if (typeof observer === 'function' )
                    observer(state);
                else
                    observer.next(state);
            }

            return {
                unsubscribe() {
                    for(let i=0 ; i<subscriptions.length ; i++) {
                        subscriptions[i].unsubscribe();
                    }
                }
            }
        }
    }
}
