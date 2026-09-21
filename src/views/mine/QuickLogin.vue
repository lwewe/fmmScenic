<template>
  <div>
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <div class="topBack">
      <div class="logo">
        <img class="img" src="../../assets/logotitle.png" alt="">
      </div>
      <button class="loginbtn" @click="getOpenid" :style="{background:checked?'#D82128':'#c7c7c7',disable:checked?false:true}">快捷登录
      </button>
      <div style="width: 100%;margin: 0 auto;margin-top: 10px;">
        <van-checkbox v-model="checked" checked-color="#ee0a24" style="float: left;margin-right: 5px;"></van-checkbox>
        <p class="prompt" style="padding-left: 5vw;">未注册的手机号验证后将自动创建账号，登录即代表您已同意<a
            style="color: red;" @click="yinsipage()">《用户隐私政策》</a>及<a style="color: red;" @click="useexplain()">《使用说明及规则》</a>
        </p>
      </div>
    </div>
    <!--  其他-->
    <div class="otherBox">
      <div>其他登录方式</div>
      <div class="toPhone" @click="toPhone">
        <img class="img" src="../../assets/ph.png" alt="">
      </div>
      <div style="margin-top: 5px">手机号</div>
    </div>
  </div>
</template>
<script>
import {wxlogin} from "@/api/locality/login";

export default {
  name: "QuickLogin",
  data() {
    return {
      checked: false,
      list2:{},
      wxCode:"",
      openid:"",
      yz_code:"",
      openid1:"",
      historyLength:0
    }
  },
  methods:{
    // 获取getOpenid
    getOpenid() {
      wxlogin({
        openid: this.openid1
      }).then(res => {
        this.list2 = res
        if (res.code == 200) {
          if (res.data.token) {
            this.$store.commit("settoken", res.data.token)
            this.$store.commit("setuid", res.data.uid)
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('uid', res.data.uid);
            this.$toast("快捷登录成功")
            setTimeout(()=>{
                if(this.change == 1){
                  window.location.href = this.$store.state.shopUrl+"/index?token="+res.data.token
                }else{
                  if(this.historyLength<=1){
                    this.$router.replace("/index")
                  }else{
                    this.$router.go(-1)
                  }
                }
            },1000)
            return
          }
          this.openid = res.data.openid
          this.yz_code = res.data.yz_code
          this.$router.push({path:"/login",query:{openid:this.openid,yz_code:this.yz_code,isphone:true}})
        }
      })
    },
    toPhone(){
      this.$router.push({path:"/login"})
    },
    //隐私政策页面
    yinsipage() {
      this.$router.push({path: "/yinsizhengce",})
    },
    // 使用说明页面
    useexplain() {
      this.$router.push({path: "/useexplain",})
    },
  },
  created() {
    this.historyLength = Number(window.history.length)
    if(localStorage.getItem("openid")){
      this.openid1 = localStorage.getItem("openid")
    }
  }
}
</script>

<style scoped>
.topBack {
  width: 100%;
  height: 327px;
  background-image: url("../../assets/bg1.png");
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 150px 30px 0px;
}

.logo {
  width: 100px;
  margin: auto;
}

.loginbtn {
  width: 100%;
  height: 45px;
  border-radius: 30px;
  border: none;
  /* background-color: #c7c7c7; */
  background-color: #ed3036;
  color: #fff;
  font-size: 16px;
  display: block;
  margin: 0 auto;
  margin-top: 20px;
}

.prompt {
  font-size: .7rem;
  width: 90%;
  margin: 0 auto;
  line-height: 20px;
  margin-top: 1vh;
  color: #949393;
}

.toPhone {
  width: 50px;
  margin: auto;
  margin-top: 15px;
}

.otherBox {
  width: 100%;
  text-align: center;
  font-size: 10px;
  color: #B4B4B4;
  position: absolute;
  bottom: 15px;
  left: 0px;
}
</style>