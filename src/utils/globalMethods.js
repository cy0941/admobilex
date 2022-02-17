/**
 * 判断数据类型
 * @param {any} val - 基本类型数据或者引用类型数据
 * @return {string} - 可能返回的结果有，均为小写字符串
 * number、boolean、string、null、undefined、array、object、function等
 */
export function getType(val) {
    //判断数据是 null 和 undefined 的情况
    if (val == null) {
        return val + "";
    }
    return typeof (val) === "object" ?
        Object.prototype.toString.call(val).slice(8, -1).toLowerCase() :
        typeof (val);
}


/*
 * 是否为数组
 */
export function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

/*
 * 是否空数组
 */
export function isArrayEmpty(val) {
    if (val && val instanceof Array && val.length > 0) {
        return false;
    } else {
        return true;
    }
}

/*
 * 递归深拷贝
 */
export function deepCopy(obj) {
    let result = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                result[key] = deepCopy(obj[key]);
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}

/**
 * 去除参数空数据（用于向后台传递参数的时候）
 * @param {Object} obj [参数对象]
 */
export function filterEmptyData(obj) {
    for (let prop in obj) {
        obj[prop] === '' ? delete obj[prop] : obj[prop];
    }
    return obj;
}

/**
 * @desc  函数防抖，用于将多次执行变为最后一次执行
 * @param {function} func - 需要使用函数防抖的被执行的函数。必传
 * @param {Number} wait - 多少毫秒之内触发，只执行第一次，默认1000ms。可以不传
 */
export function debounce(fn, delay) {
    delay = delay || 1000; //默认1s后执行
    let timer = null;
    return function () {
        let context = this;
        let arg = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(context, arg);
        }, delay);
    };
}

/**
 * 节流函数, 用于将多次执行变为每隔一段时间执行
 * @param fn 事件触发的操作
 * @param delay 间隔多少毫秒需要触发一次事件
 */
export function throttle2(fn, delay) {
    let timer = null;
    return function () {
        let context = this;
        let args = arguments;
        if (!timer) {
            timer = setTimeout(function () {
                fn.apply(context, args);
                clearTimeout(timer);
            }, delay);
        }
    };
}
/**
 * 时间格式化
 */
export function GetTime(dt) {
    var year = dt.getFullYear(); //年
    var month = dt.getMonth() + 1; //月
    var date = dt.getDate(); //日
    month = month < 10 ? "0" + month : month;
    date = date < 10 ? "0" + date : date;
    var str = year + "-" + month + "-" + date + " 00:00:00";
    return str;
}

/*
 *  删除cookie
 */
export function delCookie() {
    var keys = document.cookie.match(/[^ =;]+(?==)/g)
    if (keys) {
        for (var i = keys.length; i--;) {
            document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() // 清除当前域名下的
            document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString() // 清除当前域名下的
            document.cookie = keys[i] + '=0;path=/;domain=ratingdog.cn;expires=' + new Date(0).toUTCString() // 清除一级域名下的或指定的
        }
    }
}
