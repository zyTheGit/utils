/**
 *兼容数组、对象嵌套的深拷贝
 * @export
 * @param {*} target
 * @return {*}
 */
 export function deepClone(source: any, hash = new WeakMap()): unknown {
  if (typeof source !== 'object' || source === null) {
    return source;
  }
  if (hash.has(source)) {
    return hash.get(source);
  }
  hash.set(source, source);
  const target = (Array.isArray(source) ? [] : {}) as any;
  Reflect.ownKeys(source).forEach((key) => {
    const val = source[key];
    if (typeof val === 'object' && val != null) {
      target[key] = deepClone(val, hash);
    } else {
      target[key] = val;
    }
  });
  return target;
}
