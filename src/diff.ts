type ObjectType = "string" | "number" | "bigint" | "boolean" | "undefined" | "object";
type PrimitiveType = "string" | "number" | "bigint" | "boolean" | "undefined" | null

export default function diff(from, to) {
    if (isPrimitive(to) || isPrimitive(from)) {
        return to;
    }

    const result = {};

    const fromKeys = Object.keys(from).sort();
    const toKeys = Object.keys(to).sort();

    for(var i=0 ; i<fromKeys.length ; i++) {
        const fromKey = fromKeys[i];

        if (from[fromKey] === to[fromKey]) {
            continue;
        }

        result[fromKey] = diff(from[fromKey], to[fromKey]);
    }

    for(var i=0 ; i<toKeys.length ; i++) {
        const toKey = toKeys[i];

        if (fromKeys.indexOf(toKey) >= 0 || from[toKey] === to[toKey]) {
            continue;
        }

        result[toKey] = diff(from[toKey], to[toKey]);
    }

    return result;
}

function isPrimitive(value: any): value is PrimitiveType {
    if (value === null)
        return true;

    var toType = typeof value;
    return (toType === "boolean" || toType === "number" || toType === "string" || toType === "bigint" || toType === "undefined");
}