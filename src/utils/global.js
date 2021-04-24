import Vue from 'vue'
export const GLOBAL = {
    // API : 'https://api.lovecici.com',     //正式环境
    API : 'http://localhost:8989',  //测试环境
}
Vue.prototype.$global = GLOBAL;

/**
 * 日期格式化
 * value 日期
 * type 展示类型
 */
Vue.filter('formatDate',function(value,type = 1) {
    if(value != '' && value != undefined && value != null) {
        var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
        var date = new Date(value);
        var Y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var H = date.getHours();
        var i = date.getMinutes();
        var s = date.getSeconds();
        var k = date.getDay();
        var str = '';
        if (m < 10) {
            m = '0' + m;
        }
        if (d < 10) {
            d = '0' + d;
        }
        if (H < 10) {
            H = '0' + H;
        }
        if (i < 10) {
            i = '0' + i;
        }
        if (s < 10) {
            s = '0' + s;
        }
        if(type == 1) {
            str = Y + '-' + m + '-' + d + ' ' + H + ':' + i + ':' + s;
        } else if (type == 2) {
            str = Y + '-' + m + '-' + d + ' ' + H + ':' + i;
        } else  if (type == 3) {
            str = Y + '-' + m + '-' + d + ' ' + H ;
        } else if (type == 4) {
            str = Y + '-' + m + '-' + d ;
        } else if (type == 5) {
            str = Y + '-' + m ;
        } else if (type == 6) {
            str = Y  ;
        } else if(type == 7){
            str = weekday[k];
        }
        return  str;
    }
});