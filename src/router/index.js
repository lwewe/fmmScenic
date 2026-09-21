import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from "@/HelloWorld.vue";
import Login from "@/views/mine/Login.vue";
import FilmSeat from "@/views/fim/FilmSeat.vue";
import IndexView from "@/views/IndexView.vue";
import MoveList from "@/views/MoveList.vue";
import Multiplex from "@/views/fim/Multiplex.vue";
import PersonCenter from "@/views/mine/PersonCenter.vue";
import VueRouter from "vue-router";
import MultiplexDetail from "@/views/fim/MultiplexDetail.vue";
import CityList from '@/views/list/CityList.vue';
import PaymentPage from "@/views/order/PaymentPage.vue"
import YinsiZhengce from '@/views/agreement/YinsiZhengce.vue';
import UseExplain from '../views/agreement/UseExplain.vue';
import HotList from "../views/move/HotList.vue"
import PayPassword from "@/views/mine/PayPassword.vue";
import FilmDetail from '@/views/move/FilmDetail.vue';
import OrderPage from '@/views/order/OrderPage.vue';
import OrderInfo from "@/views/order/OrderInfo.vue";
import MemberIndex from "@/views/member/MemberIndex.vue"
import CouponsDetail from "@/views/member/CouponsDetail.vue";
import CardorderInfo from "@/views/order/CardorderInfo.vue"
import ConsumptionRecords from "@/views/freeca/ConsumptionRecords.vue";
import RechargeRecords from "@/views/freeca/RechargeRecords.vue";
import Package from "@/views/freeca/Package.vue";
import BindingCard from "@/views/freeca/BindingCard.vue";
import CouponCode from "@/views/freeca/CouponCode.vue";
import SecurityCards from "@/views/freeca/SecurityCards.vue" 
import CardInfo from "@/views/freeca/CardInfo.vue"
import MusicMember from '@/views/member/MusicMember.vue';
import ReadMember from '@/views/member/ReadMember.vue';
import QuickLogin from "@/views/mine/QuickLogin.vue";
import MemberClass from "@/views/member/MemberClass.vue";
import MultiplexNewDetail from "@/views/fim/MultiplexNewDetail.vue";
import FilmNewSeat from "@/views/fim/FilmNewSeat.vue";
Vue.use(Router)


const routes = [
    {
        path: '',
        redirect: "/index"
    },
    {
        path: '/helloWord',
        component: HelloWorld,
        meta: {
            title: 'helloWord'
        }
    },
    //登录
    {
        path: '/login',
        component: Login,
        meta: {
            title: '登录'
        },
    },
    //首页
    {
        path: '/index',
        component: IndexView,
        meta: {
            title: '景区',
            keepAlive:true,
            keep:true,
            active:0
        },
    },
    //热映榜单更多
    {
        path: '/hotlist',
        component: HotList,
        meta: {
            title: '游客订单',
            keepAlive:true,
            keep:true,
        },
    },
    // 城市列表
    {
        path: '/citylist',
        component: CityList,
        meta: {
            title: '城市列表'
        },
    },
     // 福利卡订单详情
     {
        path: '/cardorderinfo',
        component: CardorderInfo,
        meta: {
            title: '福利卡订单详情'
        },
    },
    // 电影详情
    {
        path: '/filmdetail',
        component: FilmDetail,
        meta: {
            title: '景区详情'
        },
    },
    {
        path: '/multiplex',
        component: Multiplex,
        meta: {
            title: '影城',
            // keepAlive:true,
            // keep:true,
            // active:1
        },
    }, {
        path: '/multiplexDetail',
        component: MultiplexDetail,
        meta: {
            title: '影城详情'
        },
    }, {
        path: '/multiplexNewDetail',
        component: MultiplexNewDetail,
        meta: {
            title: '影城详情'
        },
    }, {
        path: '/personCenter',
        component: PersonCenter,
        meta: {
            keepAlive:true,
            keep:true,
            title: '我的',
            active:2
        },
    },
    {
        path: '/movelist',
        component: MoveList,
        meta: {
            title: '充值商品'
        },
    },
    {
        path: '/filmSeat',
        component: FilmSeat,
        meta: {
            title: '电影选座'
        },
    },
    {
        path: '/filmNewSeat',
        component: FilmNewSeat,
        meta: {
            title: '电影选座'
        },
    }, {
        path: '/couponsDetail',
        component: CouponsDetail,
        meta: {
            title: '详情'
        },
    },
    {
        path: '/paymentpage',
        component: PaymentPage,
        meta: {
            title: '支付'
        },
    },
    {
        path: '/payPassword',
        component: PayPassword,
        meta: {
            title: '支付密码'
        }
    }, {
        path: '/orderInfo',
        component: OrderInfo,
        meta: {
            title: '订单'
        }
    },
    // 电影订单详情页面
    {
        path: '/orderpage',
        component: OrderPage,
        meta: {
            title: '订单详情'
        },
    },
    // 登录页隐私政策
    {
        path: '/yinsizhengce',
        component: YinsiZhengce,
        meta: {
            title: '隐私政策',
            keepAlive:true,
            keep:true,
        },
    },
    // 登录页使用说明
    {
        path: '/useexplain',
        component: UseExplain,
        meta: {
            title: '使用说明',
            keepAlive:true,
            keep:true,
        },
    }, {
        path: '/quickLogin',
        component: QuickLogin,
        meta: {
            title: '快捷登录'
        },
    },
    // 会员页面
    {
        path: '/memberindex',
        component: MemberIndex,
        meta: {
            title: '会员',
        },
    },
    // 个人中心福利卡
    {
        path: '/securitycards',
        component: SecurityCards,
        meta: {
            title: '福利卡'
        },
    },
    {
        path: '/consumptionRecords',
        component: ConsumptionRecords,
        meta: {
            title: '消费记录'
        },
    },
    {
        path: '/rechargeRecords',
        component: RechargeRecords,
        meta: {
            title: '充值记录'
        },
    },
    {
        path: '/package',
        component: Package,
        meta: {
            title: '充值套餐'
        },
    }, {
        path: '/bindingCard',
        component: BindingCard,
        meta: {
            title: '绑定新卡'
        },
    },{
        path: '/couponCode',
        component: CouponCode,
        meta: {
            title: '券码绑定'
        }
    },
    // 个人中心福利卡详情页
    {
        path: '/cardinfo',
        component: CardInfo,
        meta: {
            title: '福利卡详情'
        },
    },
    // 音乐会员页
    {
        path: '/musicmember',
        component: MusicMember,
        meta: {
            title: '音乐会员',
            keepAlive:true,
            keep:true,
        },
    },
    // 阅读会员页
    {
        path: '/readmember',
        component: ReadMember,
        meta: {
            title: '阅读会员',
            keepAlive:true,
            keep:true,
        },
    },{
        path: '/memberClass',
        component: MemberClass,
        meta: {
            title: '会员',
        },
    },
   
]

const router = new Router({
    routes,
    // mode: 'history'
})
// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location, onResolve, onReject) {

    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)

    return originalPush.call(this, location).catch(err => err)

}
router.beforeEach((to,from,next) => {
    document.title = to.meta.title

    // }

    next()
})

export default router