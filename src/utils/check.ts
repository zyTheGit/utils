
//数据类型检测
export function toStringType(object: any): string {
	return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
}

/**
*检验是否是微信端
*第一个是校验移动端
*第二个是校验PC端
**/
export checkWechat(): boolean{
	return navigator.userAgent.toLowerCase().indexOf('windowswechat') !== -1 || /MicroMessenger/i.test(navigator.userAgent)
}

/**
 * 数据转换  utf16转utf8
 * @param {Object} str
 */
export function utf16to8<T>(str: T): T {
	var out, i, len, c;
	out = "";
	len = str.length;
	for (i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
	}
	return out;
}

/**
 * 判断a与b是否相等 暂时用来比较对象，后续需要扩展为比较任意对象
 * @param {Object} x
 * @param {Object} y
 */
export function isEqual(x: object, y: object): boolean {
	if (x === y) {
		return true;
	}

	// If they are not strictly equal, they both need to be Objects 
	if (!(x instanceof Object) || !(y instanceof Object)) {
		return false;
	}

	//They must have the exact same prototype chain,the closest we can do is
	//test the constructor. 
	if (x.constructor !== y.constructor) {
		return false;
	}

	for (var p in x) {
		//Inherited properties were tested using x.constructor === y.constructor
		if (x.hasOwnProperty(p)) {
			// Allows comparing x[ p ] and y[ p ] when set to undefined 
			if (!y.hasOwnProperty(p)) {
				return false;
			}

			// If they have the same strict value or identity then they are equal 
			if (x[p] === y[p]) {
				continue;
			}

			// Numbers, Strings, Functions, Booleans must be strictly equal 
			if (typeof (x[p]) !== "object") {
				return false;
			}

			// Objects and Arrays must be tested recursively 
			if (!isEqual(x[p], y[p])) {
				return false;
			}
		}
	}

	for (p in y) {
		// allows x[ p ] to be set to undefined 
		if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
			return false;
		}
	}
	return true;
}