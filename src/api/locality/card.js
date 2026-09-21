import setaxios from "@/utils/setaxios";
import store from "@/store";
// 绑卡接口

// 绑定卡-温馨提示
export function bindingcard(data) {
    return setaxios.post("/Card/bindingcard", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
// 消费记录
export function getConsumeList(data) {
    return setaxios.post("/Card/consume", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
// 充值记录
export function getRechargeList(data) {
    return setaxios.post("/Card/recharge", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
// 账号绑卡
export function addbinding(data) {
    return setaxios.post("/Card/addbinding", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
// 二维码绑卡
export function qrcodeBinging(data) {
    return setaxios.post("/Card/scanbinding", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
// 充值套餐
export function getPackage(data) {
    return setaxios.post("/Card/chongzhi", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
// 结算-福利卡列表
// export function getcardList(data) {
//     return setaxios.post("/Film/card", {
//         // channel_no: store.state.channel_no,
//         ...data
//     });
// }

export function getcardList(data) {
    return setaxios.post("/Scenic/card", {
        // channel_no: store.state.channel_no,
        ...data
    });
}

// 立即支付-计算卡是否够支付
export function pay_date(data) {
    return setaxios.post("/Scenic/pay_date", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
// 福利卡支付
export function toflkpay(data) {
    return setaxios.post("/Scenic/flkpay", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
// 充值微信支付
export function czwxpay(data) {
    return setaxios.post("/Card/czwxpay", {
        // channel_no: store.state.channel_no,
        ...data
    });
}

export function scenicpaysuccess(data) {
    return setaxios.post("/Scenic/pay_success", {
        // channel_no: store.state.channel_no,
        ...data
    });
}


// 获取微信openid
export function getopenid(data) {
    return setaxios.post("/Login/getopenid", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
// 充值完成检测
export function cxpay_success(data) {
    return setaxios.post("/Card/cxpay_success", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
// 卡券微信支付
export function KaquanWxpay(data) {
    return setaxios.post("/Kaquan/wxpay", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
// 卡券支付完成后检测
export function KaquanPaySuccess(data) {
    return setaxios.post("/Kaquan/pay_success", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
// 删除卡
export function delcard(data) {
    return setaxios.post("/Card/delcard", {
        // channel_no: store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 检测卡
export function checkmergecards(data) {
    return setaxios.post("/Card/checkmergecards", {
        // channel_no: store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 合并卡
export function mergecards(data) {
    return setaxios.post("/Card/mergecards", {
        // channel_no: store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}