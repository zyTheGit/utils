interface ExceedThreeMonth {
    timeArr: string[];
    currentTimeDisable?: boolean;
    yearStatus?: boolean;
    callback: ({ txt, type }: { txt: string, type: number }) => void;
}

/**
 * 时间格式化
 * @param {Object} fmt
 */
Date.prototype.format = function (fmt: string): string {
    var showDayArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "E+": showDayArr[this.getDay()], //周
        "D+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/i.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}



/***
 * 时间校验
 * @params {Array}     timeArr 时间数组["2019/09/01","2019/09/01"] 开始时间和结束时间
 * @params {Boolean}   currentTimeDisable 结束是否可以大于当前时间 默认是不校验
 * @params {Boolean}   yearStatus 是否校验查询一年的数据 默认是校验
 * @return {Boolean}   true校验通过，false校验未通过
 */
export function isExceedThreeMonth({ timeArr, currentTimeDisable = false, yearStatus = true, callback }: ExceedThreeMonth): boolean {
    try {
        let [startDate, endDate] = timeArr;
        let __startDate = new Date(startDate);
        let __currentDate = new Date();

        let timeLinux = function (time) {
            return new Date(time + " 00:00:00").getTime();
        }

        //开始时间不能大于结束时间
        if (timeLinux(startDate) > timeLinux(endDate)) {
            callback && callback({
                txt: '开始时间不能大于结束时间',
                type: 1
            })
            return false;
        }

        //结束时间大于当前时间
        if (currentTimeDisable && timeLinux(endDate) > timeLinux(new Date().format("YYYY/MM/DD"))) {
            callback && callback({
                txt: '最长时间间隔不能超过当前时间',
                type: 2
            })
            return false;
        }

        //最长时间间隔不能超过三个月
        __startDate.setMonth(__startDate.getMonth() + 3);
        __startDate.setSeconds(__startDate.getSeconds() - 1);
        if (timeLinux(__startDate.format("YYYY/MM/DD")) < timeLinux(endDate)) {
            callback && callback({
                txt: '最长时间间隔不能超过三个月',
                type: 3
            })
            return false;
        }


        //起始时间超过一年
        __currentDate.setFullYear(__currentDate.getFullYear() - 1);
        if (yearStatus && timeLinux(startDate) < timeLinux(__currentDate.format("YYYY/MM/DD"))) {
            callback && callback({
                txt: '请查询一年以内时间',
                type: 4
            })
            return false;
        }
        __startDate = null;
        __currentDate = null;
        return true;

    } catch (e) {
        console.log(e);
        callback && callback({
            txt: '选择日期失败',
            type: 0
        })
    }
}

/**
 * 从今年今月开始向下，获取year年内的年月数组
 * @params year 往前多少年，默认是20年
 * @return object 返回当年当月的下标和年月数组
 */
export function getOneYearDate(year = 20): object {
    let dateObj = new Date(),
        arr = [],
        sameMonthIndex = 0, //当年当月的下标
        sameYear = dateObj.getFullYear(), //今年
        sameMonth = dateObj.getMonth() + 1,
        sameDate = `${sameYear}-${sameMonth < 10 ? "0" + sameMonth : sameMonth}`; //当年当月

    for (let y = sameYear - year; y <= sameYear; y++) {
        let monthLen = 12;
        (y == sameYear) ? monthLen = sameMonth : monthLen = 12;
        for (let m = 1; m <= monthLen; m++) {
            let nM = m < 10 ? `0${m}` : m;
            let date = y + "-" + nM;
            arr.unshift({ text: date, value: 0 });
        }
    }

    arr.map((item, index) => {
        sameDate == item.text && (sameMonthIndex = index)
        item.value = index;
        return item;
    })
    return {
        arr,
        sameMonthIndex
    };
}


//三个月时间
export function threeTimeMonthly(): [object, object] {
    const start = new Date();
    const end = new Date();
    start.setMonth(start.getMonth() - 3);
    return [start, end];
}

//转换时间戳(秒),当前时间0点 和当前时间24点时间戳
export function linuxTimeStamp(time: number, t: boolean = false): number {
    let newTime = new Date(time).format("YYYY/MM/DD");
    if (t) {
        let t1 = `${newTime} 23:59:59`
        return (time && (Date.parse(t1)) / 1000) || 0;
    }
    let t2 = `${newTime} 00:00:00`
    return (time && (Date.parse(t2) / 1000)) || 0;
}
