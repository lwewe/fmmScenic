import setaxios from "@/utils/setaxios";
import store from "@/store";
// 订单接口

// 锁座下单
export function lockSeatOrder(data) {
    return setaxios.post("/Film/lockseat", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
// 用户有效期内未支付的订单
export function unpayorder(data) {
    return setaxios.post("/Film/unpayorder", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
// 结算-订单详情查询
export function jsordershow(data) {
    return setaxios.post("/Film/jsordershow", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
// 订单列表
export function getOrderList(data) {
    return setaxios.post("/Scenic/orderlist", {
        // channel_no: store.state.channel_no,
        ...data
    });
}


// 电影订单详细页
export function getmoveOrderList(data) {
    return setaxios.post("/Scenic/showorder", {
        // channel_no: store.state.channel_no,
        ...data
    });
}


// 卡券订单详情
export function getcardOrderList(data) {
    return setaxios.post("/Dyorder/kqshow", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
// 取消锁座订单
export function unlockseat(data) {
    return setaxios.post("/Film/unlockseat", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
//电影微信支付
// export function filmWxpay(data) {
//     return setaxios.post("/Film/wxpay", {
//         // channel_no: store.state.channel_no,
//         ...data
//     });
// }


export function filmWxpay(data) {
    return setaxios.post("/Scenic/wxpay", {
        // channel_no: store.state.channel_no,
        ...data
    });
}


// 电影支付完成后检测
export function filmPaySuccess(data) {
    return setaxios.post("/Film/pay_success", {
        // channel_no: store.state.channel_no,
        ...data
    });
}


