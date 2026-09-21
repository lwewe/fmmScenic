import request from "@utils/request";

/**
 * 拼团列表
 */
export function getCombinationList(data) {
    return request.get("/combination/list", data, { login: false });
}

/**
 * 拼团产品详情
 * @param {*} id
 */
export function getCombinationDetail(id) {
    return request.get("/combination/detail/" + id, {}, { login: false });
}

/**
 * 拼团 开团
 * @param {*} id
 */
export function getCombinationPink(id) {
    return request.get("/combination/pink/" + id);
}