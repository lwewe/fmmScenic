import setaxios from "@/utils/setaxios";
import store from "@/store";

// 福利卡列表
export function getCardList(data) {
    return setaxios.post("/Card/lists", {
        channel_no: store.state.channel_no,
        ...data
    });
}
// 福利卡列表
export function getCardInfo(data) {
    return setaxios.post("/Card/show", {
        channel_no: store.state.channel_no,
        ...data
    });
}
// 不可用福利卡
export function getEnableCard(data) {
    return setaxios.post("/Card/nucard", {
        channel_no: store.state.channel_no,
        ...data
    });
}

