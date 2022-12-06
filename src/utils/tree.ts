
/**
 * 数组转树结构
 * @param data
 * @param idKey
 * @param parentIdKey
 * @param childrenKey
 * @returns
 */
export function arrayToTree<T = Record<string, any>>(
  data:any,
  childrenKey = 'children',
  idKey = 'id',
  parentIdKey = 'pid',
): T[] {
  const result: T[] = [];

  if (!Array.isArray(data)) return data;

  const copyData = deepClone(data) as any[];

  const map: Record<string, any> = {};

  copyData.map((item) => {
    map[item[idKey]] = item;
  });

  copyData.map((item) => {
    let parent = map[item[parentIdKey]];
    if (parent) {
      item['tierNum'] = ~~(parent.tierNum)+1;
      parent[childrenKey]
        ? parent[childrenKey].push(item)
        : (parent[childrenKey] = [item]);
    } else {
      result.push(map[item[idKey]]);
    }
  });

  return result;
}

/**
 * 树结构转数组
 * @param data
 * @param childrenKey
 * @param idKey
 * @param parentIdKey
 * @returns
 */
export function treeToArray<T = Record<string, any>>(
  data:any,
  childrenKey = 'children',
  idKey = 'id',
  parentIdKey = 'pid',
) {
  const result: T[] = [],
    hasOwnProperty = Object.prototype.hasOwnProperty;
  if (!Array.isArray(data)) return data;

  data.map((item) => {
    if (hasOwnProperty.call(item, childrenKey)) {
      const childList = (item[childrenKey] || []) as any[];
      childList.map((child) => {
        if (!hasOwnProperty.call(child, parentIdKey)) {
          child[parentIdKey] = item[idKey];
        }
        result.push(child);
      });
    } else {
      result.push(item);
    }
  });

  return result;
};

  /**
   * 当前元素是否是父元素
   * @param list
   * @param current
   * @param target
   * @param idKey
   * @param pidKey
   * @returns
   */
   export const isParent = (
    list: Record<string, any>[],
    current: Record<string, any>,
    target: Record<string, any>,
    idKey: string,
    pidKey: string,
  ): boolean => {
    let targetParent: Record<string, any> | undefined = current;

    while (targetParent) {
      if (!targetParent[pidKey]) {
        return false;
      }

      if (targetParent[pidKey] === target[idKey]) {
        // 当前元素是否为父元素
        return true;
      }

      targetParent = list.find((i) => i[idKey] === targetParent?.[pidKey]);
    }

    return true;
  };

  /**
   * 当前元素与目标元素是否同层级
   * @param list
   * @param current
   * @param target
   * @param idKey
   * @param pidKey
   * @returns
   */
  export const isSomeLevel = (
    list: Record<string, any>[],
    current: Record<string, any>,
    target: Record<string, any>,
    idKey: string,
    pidKey: string
    )=>{

      const getTargetLevel = (item: Record<string, any>)=>{
        let targetParent: Record<string, any> | undefined = item,currentLevel = 0;

        while(targetParent){
          if (!targetParent[pidKey]) {
            break;
          }
          currentLevel++;
          targetParent = list.find((i) => i[idKey] === targetParent?.[pidKey]);
        }

        return currentLevel;
      }

      const currentLevel = getTargetLevel(current);
      const targetLevel = getTargetLevel(target);

      if(currentLevel===targetLevel){
        return true;
      }
      return false;
  }
