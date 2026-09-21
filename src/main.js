import Vue from 'vue'
import App from './App.vue'
import router from "./router";
// 时间格式化过滤器
import moment from 'moment';
Vue.filter('dateFormat',(dateStr,pattern = 'YYYY-DD-MM HH:mm:ss')=>{
    return moment(dateStr).format(pattern)
})
 import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
// 导入进度条插件
import NProgress from './components/EnterLoging.vue';

// vue vant 组件
// import Vant from 'vant';
import 'vant/lib/index.css'
import {Tabbar, TabbarItem} from 'vant';

Vue.use(Tabbar).use(TabbarItem);
import {Field} from 'vant';

Vue.use(Field);
import {Button} from 'vant';

Vue.use(Button);

Vue.use(Swipe).use(SwipeItem);
import { Cell, CellGroup,Search,Icon,Swipe, SwipeItem,Tab, Tabs,Checkbox, CheckboxGroup,Lazyload,Toast,Overlay,Radio,RadioGroup} from 'vant';
Vue.use(Cell).use(CellGroup).use(Search).use(Icon).use(Swipe).use(SwipeItem).use(Tab).use(Tabs).use(Checkbox).use(CheckboxGroup).use(Lazyload).use(Toast);
import { Popup,Dialog,showConfirmDialog  } from 'vant';
Vue.use(Popup,Dialog,showConfirmDialog );
import { PasswordInput, NumberKeyboard } from 'vant';
import { Loading } from 'vant';
Vue.use(Loading);
Vue.use(PasswordInput).use(NumberKeyboard);
import { Uploader } from 'vant';
Vue.use(Uploader);
import { Stepper } from 'vant';
Vue.use(Stepper);
Vue.use(Popup).use(Overlay).use(Radio).use(RadioGroup);
//vant 组件结束
import VueScroller from 'vue-scroller'  // 触底加载

Vue.use(VueScroller) // 使用组件
import 'babel-polyfill';

import ReturnBack from '../src/components/ReturnBack.vue'

Vue.component("ReturnBack",ReturnBack)
// ASCLL 和 md5
import * as utils from './utils'

Vue.prototype.$utils = utils;
// vuex
import store from './store/index';

Vue.config.productionTip = false

// router.beforeEach((to, from, next) => {
//     NProgress.start();
//     next()
//   });
  
//   router.afterEach(() => {
//     NProgress.done();
//   });
Vue.component('NProgress', NProgress);

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
