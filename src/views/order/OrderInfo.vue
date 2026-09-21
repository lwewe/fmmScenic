<template>
  <div style="width: 100%;position: absolute;">
    <NProgress v-if="loadingflag"/>
    <div class="location">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <div class="tab">
      <van-tabs @click="changeType" v-model="active" title-active-color="#ED2E34" color="#F05B60"
                title-inactive-color="#B0B0B0"
                :line-width="15" :line-height="2">
        <van-tab title="全部"></van-tab>
        <van-tab title="待使用"></van-tab>
        <van-tab title="已完成"></van-tab>
        <van-tab title="已取消"></van-tab>

        
      </van-tabs>
    </div>
<!--    列表-->
    <div v-if="orderList.length>0">
      <OrderList :orderList="orderList"></OrderList>
    </div>
    <div ref="bottom" style="height: 10px;"></div>
<!--    没有更多了-->
    <div class="none">
      <div>--没有更多数据了--</div>
    </div>
  </div>
  </div>
</template>
<script>
import OrderList from "@/components/OrderList.vue";
import {getOrderList} from "@/api/locality/order";

export default {
  name: "OrderInfo",
  components:{
    OrderList
  },
  data(){
    return{
      active:0,
      token:"",
      pageno:2,
      orderList:[],
      stopAdd:true,
      element:null,
      loadingflag:false
    }
  },
  methods: {
    changeType(e) {
      if(this.active==e){
        return
      }
      this.active = e
      this.orderList = []
      this.pageno = 2
      this.getOrder()
      this.$router.replace({path:'/orderInfo',query:{tabIndex:e}})
    },
  //   订单列表
    getOrder(pageno=1){
      getOrderList({
        token:this.token,
        type:Number(this.active)+1,
        pageno:pageno,
        pagesize:1000000
      }).then(res=>{
        this.loadingflag = false
        if(res.code == 200){
          if(res.data.list.length==0){
            this.stopAdd = false
            return
          }
          res.data.list.forEach(item=>{
            this.orderList.push(item)
          })
        }
      })
    },
  //   触底刷新
    handleScroll() {
      let scrollTop = this.element.scrollTop || document.body.scrollTop
      let clientHeight = this.element.clientHeight
      let scrollHeight = this.element.scrollHeight
      if (scrollTop + clientHeight >= scrollHeight) {
        this.loadMore();
      }
    },
    loadMore() {
      this.isLoading = true;
      if (this.stopAdd) {
        this.getOrder(this.pageno)
        this.pageno++;
        this.isLoading = false;
      }
    },
  },
  created() {
    this.active = this.$route.query.tabIndex
    this.token = localStorage.getItem("token")
    this.getOrder()
    //加载
    this.loadingflag=true
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.element = document.documentElement
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
}
</script>

<style scoped lang="less">
.location{
  background-color: #F4F4F4;
  min-height: 100vh;
  position: relative;
}
.tab {
  //font-weight: bold;
  padding: 0px 24px;
  background-color: white;
}
/deep/ .van-tab span {
  font-weight: 600;
  font-size: 15px;
}
/deep/ .van-tabs__nav--line {
  padding-bottom: 8px;
}
.none{
  text-align: center;
  color: #8a8888;
  font-size: 14px;
  width: 100%;
  padding: 10px 0px;
}
</style>