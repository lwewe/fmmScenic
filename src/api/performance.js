import request from "../utils/request";
// 9. 演出接口

//演出分类列表
export function getDramaList(data) {
    return request.post("", data, { login: false });
}