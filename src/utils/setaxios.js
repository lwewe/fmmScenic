import axios from "axios";
import router from "@/router";
import toast from "vant/lib/toast";
import store from "@/store";

const instance = axios.create({
    baseURL: "/api/api.php",
    // timeout: 10000,
    headers: {
        " Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    }
});

// const defaultOpt = { login: true };
function baseRequest(options) {
    // const token = $store.state.app.token;
    const headers = options.headers || {};
    // headers["Authori-zation"] = "Bearer " + token;
    options.headers = headers;
    // if (options.login && !token) {
    //     toLogin();
    //     return Promise.reject({ msg: "未登录", toLogin: true });
    // }
    // console.log(options);
    return instance(options).then(res => {
        const data = res.data || {};

        if (res.status !== 200)
            return Promise.resolve({msg: "请求失败", res, data, code: res.data.code});

            // if ([410000, 410001, 410002].indexOf(data.status) !== -1) {
            //     // toLogin();
            //     return Promise.reject({ msg: res.data.msg, res, data, toLogin: true });
        // }
        else if (res.status === 200 && res.data.code == 200) {
            return Promise.resolve({ msg: res.data.msg||"操作成功", data:data.data,code:res.data.code,status:data.status||200});
        } else if (res.data.code == "-1") {
            toast("请先登录")
            // localStorage.removeItem("token")
            // localStorage.removeItem("uid")
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                router.replace("/quickLogin")
                return true;
            } else {
                router.replace("/login")
                return false;
            }
        } else {
            // toast(res.data.msg||"暂无数据")
            // setTimeout(() => {
            //     router.go(-1)
            // },1000)
            return Promise.resolve({msg: res.data.msg, res, data, code: res.data.code});
        }
    });
}

/**
 * http 请求基础类
 * 参考文档 https://www.kancloud.cn/yunye/axios/234845
 *
 */
const request = ["post", "put", "patch"].reduce((request, method) => {
    /**
     *
     * @param url string 接口地址
     * @param data object get参数
     * @param options object axios 配置项
     * @returns {AxiosPromise}
     */
    request[method] = (url, data = {}, options = {}) => {
        return baseRequest(
            Object.assign({url, data:{
                        channel_no: store.state.channel_no,
                        ...data
                    }, method},

                // defaultOpt,
                options)
        );
    };
    return request;
}, {});

["get", "delete", "head"].forEach(method => {
    /**
     *
     * @param url string 接口地址
     * @param params object get参数
     * @param options object axios 配置项
     * @returns {AxiosPromise}
     */
    request[method] = (url, params = {}, options = {}) => {
        return baseRequest(
            Object.assign({url, params, method},
                // defaultOpt,
                options)
        );
    };
});

export default request;