type ArrayMutation = (
    { type: "insert", index: number } |
    { type: "update", index: number } |
    { type: "remove", index: number } |
    { type: "move", from: number, to: number }
);

type Comparer<T> = (x:T, y:T)=> boolean;
const identity = (x, y) => x === y;

export default function arrayComparer<T>(newArray: T[], oldArray: T[], comparer: Comparer<T> = identity): ArrayMutation[] {

    if (!oldArray) {
        return newArray && typeof newArray.map === "function" ? newArray.map((p, i) => ({ type: "insert", index: i })) : [];
    }

    let newLength = (newArray && newArray['length']) || 0;
    
    const mutations: ArrayMutation[] = [];
    let previous = oldArray;
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
                previous.splice(n, 0, next);
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
        previous.push(newArray[i]);
        mutations.push({ type: "insert", index: i })
    }

    for (let i = previous.length - 1; i >= newLength; i--) {
        previous.pop();
        mutations.push({ type: "remove", index: i })
    }

    if (previous.length !== newArray.length)
        debugger;

    return mutations;
}

function indexOf<T>(array: T[], item:T, comparer: Comparer<T>) {
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
