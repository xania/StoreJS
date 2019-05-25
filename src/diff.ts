type ObjectType = "string" | "number" | "bigint" | "boolean" | "undefined" | "object";
type PrimitiveType = "string" | "number" | "bigint" | "boolean" | "undefined" | null

export default function diff(from, to) {
    const toType = typeOf(to);
    const fromType = typeOf(from);
    if (toType === null || toType !== fromType) {
        return to;
    }

    if (toType === "array")
        return to.map( (e, i) => diff(from[i], e) );

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

function typeOf(value: any) {
    if (value === null || value === undefined)
        return null;

    if (Array.isArray(value))
        return "array";

    return typeof value;
}