import request from "../utils/request";

/**
 * 影院列表
 */
export function getCinemaList(data) {
    return request.post("", data, { login: false });
}
//影院详情
export function getCinemaDetail(data) {
    return request.post("", data, { login: false });
}
// 影院排期列表
export function getSchedulingList(data) {
    return request.post("", data, { login: false });
}
// 影片详情
export function getMoveDetail(data) {
    return request.post("", data, { login: false });
}
//座位图
export function getSeatMaps(data) {
    return request.post("", data, { login: false });
}

// 根据购票传来的数据查询有该电影的影院
export function getFilmplace(data) {
    return request.post("", data, { login: false });
}