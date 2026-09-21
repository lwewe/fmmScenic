import setaxios from "@/utils/setaxios";
import store from "@/store";

/**
 * 影院列表
 */
export function getBannerList() {
    return setaxios.post("/Movie/yclbt", {
        // channel_no: store.state.channel_no,
    });
}

//首页  轮播图
export function getIndexBannerList() {
    return setaxios.post("/Movie/sylbt", {
        // channel_no: store.state.channel_no,
    });
}