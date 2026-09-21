import request from "../utils/setaxios";

/**
 * 城市列表
 */
export function getCityList(data) {
    return request.post("/Movie/citylist", data,);
}
//景区
export function scenicgetList(data) {
    return request.post("/Scenic/getList", data);
}
//景区游客
export function scenicViewer(data) {
    return request.post("/Scenic/viewer", data);
}
//添加
export function scenicAddviewer(data) {
    return request.post("/Scenic/addviewer", data);
}
// 查询
export function scenicShowviewer(data) {
    return request.post("/Scenic/showviewer", data);
}
// 编辑
export function scenicediTviewer(data) {
    return request.post("/Scenic/editviewer", data);
}
// 删除
export function scenicdelviewer(data) {
    return request.post("/Scenic/delviewer", data);
}
// 
export function scenicCard(data) {
    return request.post("/Scenic/card", data);
}
// 下单前价格验证 参数验证
export function findFilloutProfile(data) {
    return request.post("/Scenic/findFilloutProfile", data);
}


 
// 热门城市
export function getHotCityList(data) {
    return request.post("/Movie/hotcity", data,);
}
// 影院
export function getCinemaListLoca(data) {
    return request.post("/Movie/cinema", data,);
}
// 影院
// export function getCinemaListLoca(data) {
//     return request.post("/Test/cinema", data,);
// }
// 购票/观影须知
export function getCinemaGuide(data) {
    return request.post("/Movie/guide", data,);
}
// 创建订单
export function creatNewOrder(data) {
    return request.post("/Movie/create_order", data,);
}
// 用户有效期内未支付的订单
export function getunpayorder(data) {
    return request.post("/Movie/unpayorder", data,);
}
// 取消订单
export function unorder(data) {
    return request.post("/Movie/unorder", data,);
}
// 结算-订单详情查询
export function getPayOrdershow(data) {
    return request.post("/Movie/jsordershow", data,);
}

export function getIndexBannerList(data) {
    return request.post("/Movie/sylbt", data,);
}
//fffffjiade
//结算-福利卡列表
export function getMoviecard(data) {
    return request.post("/Movie/card", data,);
}
//立即支付-计算卡是否够支付
export function getMoviepayDate(data) {
    return request.post("/Movie/pay_date", data,);
}
//福利卡支付
export function getMovieflkpay(data) {
    return request.post("/Movie/flkpay", data,);
}
//电影微信支付
// export function getMoviewxpay(data) {
//     return request.post("/Movie/wxpay", data,);
// }
export function getMoviewxpay(data) {
    return request.post("/Scenic/wxpay", data,);
}

//支付完成后检测
export function getMoviepaySuccess(data) {
    return request.post("/Movie/pay_success", data,);
}
//获取当前时间
export function getNowTime(data) {
    return request.post("/Movie/gettime", data,);
}
//区县
// export function getCountyList(data) {
//     return request.post("", data, { login: false });
// }
// export function getDramaList(data) {
//     return request.post("", data, { login: false });
// }
