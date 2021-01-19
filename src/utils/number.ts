/**
 * 插入特定位置的字符串
 * @param str 原字符串
 * @param flg 插入字符
 * @param sn  插入位置
 * @returns {String}
 */
export function insert_flg(str: string, flg: string, sn: number): string {
    var newstr = "";

    if (3 > str.length) {//如果sn为负数
        str = pad(str, 3);
        sn = 1;
    }

    var arr = str.split("");

    for (var i = 0; i < arr.length; i++) {
        if (i == sn) {
            newstr += flg;
        }
        newstr += arr[i];
    }

    return newstr;
}