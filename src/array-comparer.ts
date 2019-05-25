type ArrayMutation = (
    { type: "insert", index: number } |
    { type: "remove", index: number } |
    { type: "move", from: number, to: number }
);

export default function arrayComparer<T extends any[]>(newArray: T, prevValue: T): ArrayMutation[] {
    
    if (!prevValue) {
        return newArray && typeof newArray.map === "function" ? newArray.map((p, i) => ({ type: "insert", index: i })) : [];
    }

    let newLength = (newArray && newArray['length']) || 0,
        prevLength = prevValue.length;

    // bestSeq(properties, parentValue as any, (p, v) => p.value === v, () => {
    //     // TODO
    // });

    const mutations: ArrayMutation[] = [];
    for (let n = 0; n < newLength; n++) {
        let next = newArray[n];
        let propIdx: false | number = false;

        if (typeof next === "object") {
            for (var m = n; m < prevLength; m++) {
                if (prevValue[m] === next) {
                    propIdx = m;
                    break;
                }
            }
        } else if (prevValue[n]) {
            propIdx = n;
        }

        if (propIdx === false) {
            prevLength++;
            mutations.push({ type: "insert", index: n })
        } else if (propIdx !== n) {
            mutations.push({ type: "move", from: n, to: propIdx })
        }

    }

    for (let i = prevLength - 1; i >= newLength; i--) {
        mutations.push({ type: "remove", index: i })
    }

    return mutations;
}

