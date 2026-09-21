import Vue from 'vue'
import Vuex from 'vuex'
import moment from "moment/moment";
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
Vue.use(Vuex)

// 用来存储数据
const state = {
    // 线上
    appkey: "yxjuhui",
    privatekey: "WFAHST3JAVOGKR8PUXFN3RLMWIYNDZVE",
    // 线下
    // appkey: "yxjuhui",
    // privatekey: "2EQZREUIKMEJKSNG475J9MH2EC0MQFRG",
    timestamp:moment(new Date()).format('yyyy-MM-DD HH:mm:ss'),
    parameter: {
        appkey: "yxjuhui",
        timestamp: moment(new Date()).format('yyyy-MM-DD HH:mm:ss'),
        v: "1.0",
    },
    channel_no:"12358",
    //   baseUrl: "/laiyipiao/cgi-bin/api/v1/1753183526117/+UH6xsCP4Jg5RX5ddETCxg/scenic_spot_interface",
    // baseUrl:"http://192.168.3.7/",
    // baseUrl:"https://sc.bjyxfl.com/",
    baseUrl:"http://image.bjyxfl.com/",
    baseUrl2:"https://gw.alicdn.com/tfscom/",
    token:"",
    uid:"",
    targetId:"",
    cityName:"",
    // shopUrl:"http://192.168.3.9:8080/#",
    shopUrl:"http://yxfmm.bjyxfl.com/#",
    // cakeUrl:"http://192.168.3.9:8080/#",
    cakeUrl:"http://yxfmm.bjyxfl.com/cake/#",
    areaUrl:"http://yxfmm.bjyxfl.com/scenic/#",    
    // bookUrl:"http://192.168.3.9:8080/#",
    bookUrl:"http://yxfmm.bjyxfl.com/book/#",
    perkUrl:"http://yxfmm.bjyxfl.com/performance/#",
    // flag:true
}
// 响应组件中的事件
const actions = {}
// 操作数据
const mutations = {
    settoken(state, token) {
        state.token = token;
    },
    setuid(state, uid){
        state.uid = uid;
    },
    changeTargetId(state, uid){
        state.targetId = uid;
    },
    changeCityName(state, uid){
        state.cityName = uid;
    },
}
// 用来将state数据进行加工
const getters = {}
// 新建并暴露store
export default new Vuex.Store({
    state,
    actions,
    mutations,
    getters
})
