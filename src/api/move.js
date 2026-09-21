import request from "../utils/request";

/**
 * 拼团列表
 */
export function getRechargeList(data) {
    return request.post("/recharge/goodslist", data, { login: false });
}