import setaxios from "@/utils/setaxios";
import store from "@/store";

// 影视会员轮播图/分类
export function getKaquan() {
    return setaxios.post("/Kaquan/index", {
        channel_no: store.state.channel_no,
        
    });
}
// 影视会员列表内容
export function getKaquanlist(data) {
    return setaxios.post("/Kaquan/lists", {
        channel_no: store.state.channel_no,
        ...data
    });
}
// 音乐会员列表
export function getMusicMember(data){
    return setaxios.post("/Kaquan/music",{
        channel_no: store.state.channel_no,
        ...data
    })
}
// 阅读会员列表
export function getReadMember(data){
    return setaxios.post("/Kaquan/read",{
        channel_no: store.state.channel_no,
        ...data
    })
}
// 卡券-详细页
export function geCardDetail(data){
    return setaxios.post("/Kaquan/show",{
        channel_no: store.state.channel_no,
        ...data
    })
}
// 影视分类--列表
export function getclassify(data){
    return setaxios.post("/Kaquan/classify",{
        channel_no: store.state.channel_no,
        ...data
    })
}
//立即支付-计算卡是否够支付
export function toPay_date(data){
    return setaxios.post("/Kaquan/pay_date",{
        channel_no: store.state.channel_no,
        ...data
    })
}
// 福利卡支付
export function getflkpay(data){
    return setaxios.post("/Kaquan/flkpay",{
        channel_no: store.state.channel_no,
        ...data
    })
}