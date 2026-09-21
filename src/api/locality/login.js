import setaxios from "@/utils/setaxios";
import store from "@/store";
// 登录页接口


// 获取logo
export function getLogo() {
    return setaxios.post("/Login/index", {
        channel_no: store.state.channel_no,
    });
}
// 登录发送验证码
export function sendCode(data) {
    return setaxios.post("/Login/sendcode", {
        channel_no: store.state.channel_no,
        ...data
    });
}
// 登录
export function phoneLogin(data) {
    return setaxios.post("/Login/phoneLogin", {
        channel_no: store.state.channel_no,
        ...data
    });
}
// 用户隐私协议
export function single(data) {
    return setaxios.post("/Login/single", {
        channel_no: store.state.channel_no,
        ...data
    });
}
// 个人中心
export function getUserInfo(data) {
    return setaxios.post("/Member/index", {
        channel_no: store.state.channel_no,
        ...data
    });
}
// 修改密码发送验证码
export function sendPasswordCode(data) {
    return setaxios.post("/Member/getsendcode", {
        channel_no: store.state.channel_no,
        ...data
    });
}
// 修改密码
export function changePassword(data) {
    return setaxios.post("/Member/editpassword", {
        channel_no: store.state.channel_no,
        ...data
    });
}
// 修改头像
export function changeAvatar(data) {
    return setaxios.post("/Member/uploadimg", data,{
        header: {
            'Content-Type': 'multipart/form-data',
            }
    });
}
// 微信登录
export function wxlogin(data) {
    return setaxios.post("/Login/wxlogin", {
        // channel_no: store.state.channel_no,
        ...data
    });
}
// 微信绑定手机号
export function wxbindingPhone(data) {
    return setaxios.post("/Login/wxbindingPhone", {
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
//小程序定位
export function getLocations(data) {
    return setaxios.post("Movie/getLocation", {
        // channel_no: store.state.channel_no,
        ...data
    });
}