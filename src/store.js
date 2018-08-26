"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var empty = "";
var Value = /** @class */ (function () {
    function Value() {
        this.properties = [];
    }
    Value.prototype.subscribe = function (observer) {
        if (this.value !== void 0)
            observer.next(this.value);
        var observers = this.observers || (this.observers = []);
        observers.push(observer);
        return {
            unsubscribe: function () {
                var idx = observers.indexOf(observer);
                observers.splice(idx, 1);
            }
        };
    };
    Value.prototype.property = function (propertyName) {
        var properties = this.properties;
        var i = properties.length;
        while (i--) {
            var prop = properties[i];
            if (prop.name === propertyName) {
                return prop;
            }
        }
        var property = new ObjectProperty(this, propertyName);
        properties.push(property);
        return property;
    };
    Value.prototype.toString = function () {
        var value = this.value;
        if (typeof value === "string")
            return value;
        else if (value === void 0 || value === null)
            return empty;
        else
            return value.toString();
    };
    Value.prototype.set = function (name, value) {
        if (this.value[name] !== value) {
            this.value[name] = value;
            return true;
        }
        return false;
    };
    return Value;
}());
var Iteration = /** @class */ (function () {
    function Iteration(iterator, selector) {
        this.iterator = iterator;
        this.selector = selector;
        this.observers = [];
    }
    Iteration.prototype.subscribe = function (observer) {
        var observers = this.observers;
        observers.push(observer);
        return {
            unsubscribe: function () {
                var idx = observers.indexOf(observer);
                if (idx >= 0)
                    observers.splice(idx, 1);
            }
        };
    };
    Iteration.prototype.complete = function () {
        // /var { iterations } = this.iterator;
        // var idx = iterations.indexOf(this);
        // if (idx >= 0) iterations.splice(idx, 1);
    };
    Iteration.prototype.next = function (items) {
        var selector = this.selector;
        console.log(items, items.map(function (item, idx) { return selector(item, idx).value; }));
    };
    return Iteration;
}());
var Iterator = /** @class */ (function () {
    function Iterator(parent) {
        this.parent = parent;
        // public properties: IProperty<T>[] = [];
        this.length = 0;
        this.iterations = [];
        // public value: ArrayItem<Unpack<T>>[];
        this.observers = [];
        parent.subscribe(this);
    }
    Iterator.prototype.subscribe = function (observer) {
        var observers = this.observers;
        observers.push(observer);
        return {
            unsubscribe: function () {
                var idx = observers.indexOf(observer);
                if (idx >= 0)
                    observers.splice(idx, 1);
            }
        };
    };
    Iterator.prototype.map = function (selector) {
        var iteration = new Iteration(this, selector);
        this.iterations.push(iteration);
        return iteration;
    };
    Iterator.prototype.next = function (parentValue) {
        if (!Array.isArray(parentValue))
            throw Error("Not an array!");
        this.parentValue = parentValue;
        var valueLength = parentValue.length, prevLength = this.length;
        this.length = valueLength;
        var changed = valueLength !== prevLength;
        var propertyLength = properties.length;
        for (var i = 0; i < valueLength; i++) {
            if (i < propertyLength) {
                // let item = properties[i];
                // if (item.value !== value) {
                //     item.value = value;
                //     changed = true;
                // }
            }
            else {
                var item = this.parent.property(i);
                properties.push(item);
                changed = true;
                // for(var e=0 ; e<this.iterations.length; e++) {
                //     var iter = this.iterations[e];
                //     iter.selector(item);
                // }
            }
        }
        properties.length = valueLength;
    };
    return Iterator;
}());
exports.Iterator = Iterator;
var ArrayItem = /** @class */ (function (_super) {
    __extends(ArrayItem, _super);
    function ArrayItem(parent, name) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.name = name;
        return _this;
    }
    ArrayItem.prototype.valueOf = function () {
        return this.value;
    };
    ArrayItem.prototype.refresh = function (parentValue) {
        var name = this.name, newValue = parentValue ? parentValue[name] : void 0;
        if (newValue !== this.value) {
            this.value = newValue;
            if (newValue === void 0 || newValue === null)
                this.properties.length = 0;
            return true;
        }
        return false;
    };
    return ArrayItem;
}(Value));
var ObjectProperty = /** @class */ (function (_super) {
    __extends(ObjectProperty, _super);
    function ObjectProperty(parent, name) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.name = name;
        return _this;
    }
    ObjectProperty.prototype.valueOf = function () {
        return this.value;
    };
    ObjectProperty.prototype.refresh = function (parentValue) {
        var name = this.name, newValue = parentValue ? parentValue[name] : void 0;
        if (newValue !== this.value) {
            this.value = newValue;
            if (newValue === void 0 || newValue === null)
                this.properties.length = 0;
            return true;
        }
        return false;
    };
    return ObjectProperty;
}(Value));
var Store = /** @class */ (function (_super) {
    __extends(Store, _super);
    function Store(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    Store.prototype.expr = function (expr) {
        var _this = this;
        var parts = expr.split('.');
        console.log(parts);
        return function (value) {
            var obj = _this.value;
            var len = parts.length - 1;
            for (var i = 0; i < len; i++) {
                var prop = parts[i];
                var child = obj[prop];
                if (!child) {
                    obj[prop] = (child = {});
                }
                obj = child;
            }
            var last = parts[len];
            obj[last] = value;
        };
    };
    Store.prototype.update = function (value) {
        throw new Error("");
    };
    Store.prototype.refresh = function () {
        var stack = [this];
        var stackLength = 1;
        var dirty = [];
        var dirtyLength = 0;
        while (stackLength--) {
            var parent_1 = stack[stackLength];
            var properties = parent_1.properties;
            var parentValue = parent_1.value;
            var i = properties.length | 0;
            while (i) {
                i = (i - 1) | 0;
                var child = properties[i];
                var changed = child.refresh && child.refresh(parentValue);
                stack[stackLength] = child;
                stackLength = (stackLength + 1) | 0;
                if (changed) {
                    dirty[dirtyLength] = child;
                    dirtyLength = (dirtyLength + 1) | 0;
                }
            }
            ;
        }
        var j = dirtyLength;
        while (j--) {
            var property = dirty[j];
            var observers = property.observers;
            if (!observers)
                continue;
            var value = property.value;
            var e = observers.length | 0;
            while (e--) {
                var observer = observers[e];
                observer.next(value);
            }
        }
        return dirtyLength;
    };
    return Store;
}(Value));
exports.Store = Store;
//# sourceMappingURL=store.js.map