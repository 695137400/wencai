var https = require('https');
var fs = require("fs");
var cheerio = require("cheerio");
Date.prototype.Format = function (formatStr) {
    var str = formatStr;
    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/mm/, (this.getMinutes() + 1) > 9 && (this.getMinutes() + 1) <= 59 ? (this.getMinutes() + 1).toString() : ((this.getMinutes() + 1) <= 59 ? ('0' + (this.getMinutes() + 1)) : (this.getMinutes())));
    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    return str;
};
var fileName = new Date().Format('YYYY-MM-DD') + '.csv';
var cookie = 'sp_search_last_right_status=hide; cid=1280025a9fc1ec2c2c81ee8f94fadad81593997547; WafStatus=0; guideState=1; user=MDpteF81MzAyNDQ2NzU6Ok5vbmU6NTAwOjo6MDo6OjUzMDI0NDY3NToxNTk0MDAwNTc0Ojo6MDoyNjc4NDAwOjA6MTEyYTY0MmMyMDI4ZjFmZTBmNDVkZWY0Y2NmMzM1ODI0OmRlZmF1bHRfNDow; userid=530244675; u_name=mx_530244675; escapename=mx_530244675; ticket=d6613af894b7139df65429f6005ee023; ComputerID=1280025a9fc1ec2c2c81ee8f94fadad81593997547; PHPSESSID=1d9fe509022d180d10b3f918aeade4b4; vvvv=1; v=AkKoinNhqRl54LVF6mrfqujYk0OnE0Yt-Bc6UYxbbrVg3-z1dKOWPcinimBf';
var url = 'https://www.iwencai.com/stockpick/load-data?w=连续5年ROE大于15%，连续5年净利润现金含量大于80%，连续5年毛利率大于30%，上市大于3年，连续5年TTM市盈率，连续5年TTM股息率';
var req = https.request(url, function (res) {
    var html = "";
    res.on("data", function (data) {
        html += data;
    });
    res.on("end", function () {
        html = JSON.parse(html);
        var title = html.data.result.title;
        var arr = [];
        for (var i = 0; i < title.length; i++) {
            if (typeof title[i] == 'object') {
                for (var k in title[i]) {
                    if (title[i][k].length > 0) {
                        for (var l = 0; l < title[i][k].length; l++) {
                            arr.push(k.replace(new RegExp('\\r|\\n', 'gi'), '').replace(new RegExp('<\/?.+?\/?>', 'gi'), '') + '：' + title[i][k][l]);
                        }
                    }
                }
            } else {
                arr.push(title[i].replace(new RegExp('<\/?.+?\/?>', 'gi'), ''));
            }
        }
        fs.writeFileSync(fileName, arr.toString(), 'utf-8');
        var $ = cheerio.load(html.data.tableTempl);
        $('body').html($('table'));
        var st = $('.static_tbody_table tr');
        var bt = $('.scroll_tbody_table tr');
        for (var i = 0; i < st.length; i++) {
            var ld = [];
            var sd = $(st[i]).find('td');
            var bd = $(bt[i]).find('td');
            for (var c = 1; c < sd.length; c++) {
                var s = $(sd[c]).text().replace(new RegExp('\\r|\\n', 'gi'), '');
                if (s != '') {
                    ld.push(s);
                }
            }
            for (var d = 0; d < bd.length; d++) {
                var ss = ld.push($(bd[d]).text().replace(new RegExp('\\r|\\n', 'gi'), ''));
                if (ss != '') {
                    ld.push(ss);
                }
            }
            fs.appendFileSync(fileName, '\n' + ld.toString(), 'utf-8');
        }
    })
});
req.setHeader('Cookie', cookie);

req.end();



