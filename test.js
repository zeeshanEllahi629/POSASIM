const mariadb = require("mariadb");
const urlFormat = /mariadb:\/\/(([^/@:]+)?(:([^/]+))?@)?(([^/:]+)(:([0-9]+))?)\/([^?]+)(\?(.*))?$/;
const str = "mariadb://root@127.0.0.1:3306/foodefy_code";
console.log("Match:", str.match(urlFormat));
