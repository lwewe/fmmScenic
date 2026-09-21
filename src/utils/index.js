import ASCII from "./ASCII";
import MD5 from "md5";//在使用的页面引入加密插件


/**
 * @Description:ASCII加密后MD5加密，再转大写字符串
 * @author xxx
 * @createDate 2022/2/28
 * @param {Object} data
 * @return {string}
 */
function getASCII(data) {
    return MD5(ASCII.sort_ascii(data)).toString();
}
//ASCII加密
function setASCII(data) {
    return ASCII.sort_ascii(data);
}

export{
    getASCII,
    setASCII
}
