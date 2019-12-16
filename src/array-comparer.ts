type ArrayMutation = (
    { type: "insert", index: number } |
    { type: "update", index: number } |
    { type: "remove", index: number } |
    { type: "move", from: number, to: number }
);

export default function arrayComparer<T>(newArray: T[], prevValue: T[]): ArrayMutation[] {

    if (!prevValue) {
        return newArray && typeof newArray.map === "function" ? newArray.map((p, i) => ({ type: "insert", index: i })) : [];
    }

    let newLength = (newArray && newArray['length']) || 0,
        prevLength = prevValue.length;

    // bestSeq(properties, parentValue as any, (p, v) => p.value === v, () => {
    //     // TODO
    // });

    const mutations: ArrayMutation[] = [];
    let previous = prevValue.slice(0);
    for (let n = 0; n < newLength && n < previous.length; n++) {
        let next = newArray[n];
        let fromIdx: false | number = false;

        for (let g = n; g < previous.length; g++) {
            const p = previous[g];
            if (p === next) {
                fromIdx = g;
                break;
            }
        }

        if (fromIdx === false) {
            const newIdx = newArray.indexOf(previous[n]);
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
        mutations.push({ type: "insert", index: i })
    }

    for (let i = previous.length - 1; i >= newLength; i--) {
        mutations.push({ type: "remove", index: i })
    }

    return mutations;
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
