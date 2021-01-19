
//深拷贝
export function deepCopy<T>(targetObj: T): T {
    let type = Object.prototype.toString.call(targetObj);
    let newObj;
    if (type === "[object Object]") {
        newObj = {};
    } else if (type === "[object Array]") {
        newObj = [];
    } else {
        return targetObj;
    }
    for (let key in targetObj) {
        let value = targetObj[key];
        newObj[key] = deepCopy(value);
    }
    return newObj;
}
