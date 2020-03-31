const fs = require('fs');
const getMdText = () => {
    const mdText = fs.readFileSync(`./notes/${format(new Date(),'yyyyMM')}/${format(new Date(),'MMdd')}.md`,'utf8')
    let result = mdText.split('\n'); // 解析出md文档返回每一行可字符串
    // 每次取最后一条记录
    const last_index = findLastIndex(result, item => {
        return item.includes('-')
    });
    const splice_target = result.splice(last_index);
    let returnValue = {};
    for (let i = 0; i < splice_target.length; i++) {
        let curStr = splice_target[i].trim(),
            nextStr = i + 1 < splice_target.length ? splice_target[i + 1].trim() : '.';
        let cur_isDot = curStr.includes('.'),
            isTitle = curStr.includes('-'),
            next_isDot = nextStr.includes('.');
        // 找到 -
        if (curStr.includes('-')) {
            returnValue['title'] = curStr.replace('-','').trim();
        }
        // 找到 .
        if (cur_isDot && next_isDot) {
            let keyValue = curStr.split('.')[1].split(':');
            returnValue[keyValue[0].trim()] = keyValue[1].trim();
        }
        // 空行情况
        if (cur_isDot && !next_isDot) {
            let currentIndex = i + 1,
                isnextDot = splice_target[currentIndex].includes('.');
            while (!isnextDot && currentIndex < splice_target.length) {
                curStr += splice_target[currentIndex].trim();
                currentIndex++;
            }
            let keyValue = curStr.split('.')[1].split(':');
            returnValue[keyValue[0].trim()] = keyValue[1].trim();
        }
    }
    return returnValue;
}

function findLastIndex(target, fn) {
    let index;
    for (let i = target.length - 1; i >= 0; i--) {
        if (fn(target[i])) {
            index = i;
            break;
        }
    }
    return index;
}
/**
 * 将日期对象转化为一个预设格式的字符串
 * @param {Date} date 一个日期对象
 * @param {预期格式} fmt 预期格式
 */
function format(date, fmt) {
    var o = {
        // 月份
        'M+': date.getMonth() + 1,
        // 日
        'd+': date.getDate(),
        // 小时
        'h+': date.getHours(),
        // 分
        'm+': date.getMinutes(),
        // 秒
        's+': date.getSeconds(),
        // 季度
        'q+': Math.floor((date.getMonth() + 3) / 3),
        // 毫秒
        'S': date.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
}
module.exports = getMdText();