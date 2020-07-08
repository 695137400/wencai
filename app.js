var https = require('https');
var fs = require("fs");
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
var cookie = 'PHPSESSID=d6364216c5f24cb373d0a696f388f3a7; cid=d6364216c5f24cb373d0a696f388f3a71594205748; ComputerID=d6364216c5f24cb373d0a696f388f3a71594205748; WafStatus=0; v=AjjS5N1zk54Pl_8ahPN17K7qCe3JoZuK_jdwyXKphXkm_tbbGrFsu04VQAjB';
var url = 'https://www.iwencai.com/stockpick/load-data?&p=1&perpage=3&w=连续5年ROE大于15%，连续5年净利润现金含量大于80%，连续5年毛利率大于30%，上市大于3年，连续5年TTM市盈率，连续5年TTM股息率';
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
        var result = html.data.result.result;
        for (var i = 0; i < result.length; i++) {
            var rarr = [];
            var len = result[i];
            for (var g = 0; g < len.length; g++) {
                var kl = len[g];
                if (typeof kl == 'object') {
                    for (var k = 0; k < kl.length; k++) {
                        var dk = kl[k];
                        rarr.push(dk);
                    }
                } else {
                    rarr.push(kl);
                }
            }
            fs.appendFileSync(fileName, '\n' + rarr.toString(), 'utf-8');
        }
    })
});
req.setHeader('Cookie', cookie);

req.end();


''
