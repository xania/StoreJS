type ArrayMutation = (
    { type: "insert", index: number } |
    { type: "update", index: number } |
    { type: "remove", index: number } |
    { type: "move", from: number, to: number }
);

type Comparer<T, U> = (x:T, y:U)=> boolean;
type MutationHandler<T, U> = {
    comparer: Comparer<T, U>
};
export default function arrayComparer<T, U>(newArray: T[], oldArray: U[], comparer: Comparer<T, U>): ArrayMutation[] {

    if (!oldArray) {
        return newArray && typeof newArray.map === "function" ? newArray.map((p, i) => ({ type: "insert", index: i })) : [];
    }

    let newLength = (newArray && newArray['length']) || 0;
    
    const mutations: ArrayMutation[] = [];
    let previous = oldArray.slice(0);
    for (let n = 0; n < newLength && n < previous.length; n++) {
        let next = newArray[n];
        let fromIdx: false | number = false;

        for (let g = n; g < previous.length; g++) {
            const p = previous[g];
            if (comparer(next, p)) {
                fromIdx = g;
                break;
            }
        }

        if (fromIdx === false) {
            const newIdx = indexOf(newArray, previous[n], comparer);
            if (newIdx >= 0) {
                previous.splice(n, 0, null);
                mutations.push({ type: "insert", index: n })
            } else {
                mutations.push({ type: "update", index: n })
            }
        } else if (fromIdx !== n) {
            // move
            move(previous, fromIdx, n);
            mutations.push({ type: "move", from: fromIdx, to: n })
        }
    }

    for (let i = previous.length; i < newLength; i++) {
        mutations.push({ type: "insert", index: i })
    }

    for (let i = previous.length - 1; i >= newLength; i--) {
        mutations.push({ type: "remove", index: i })
    }

    return mutations;
}

function indexOf<T, U>(array: T[], item:U, comparer: Comparer<T, U>) {
    for(let i=0 ; i<array.length ;i++) {
        if (comparer(array[i], item))
            return i;
    }
    return -1;
}

export function move(source: any[], from: number, to: number) {
    if (from === to)
        return;
    if (from > to) {
        const tmp = source[from];
        for (let i = from; i > to; i--) {
            source[i] = source[i - 1];
        }
        source[to] = tmp;
    } else {
        const tmp = source[from];
        for (let i = from; i < to; i++) {
            source[i] = source[i + 1];
        }
        source[to] = tmp;
    }
}
