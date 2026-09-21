<template>
  <!--  登录-->
  <div class="login">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <div class="wrap">
      <input v-model="phone" disabled  class="phone public" placeholder="请输入手机号" type="text">
      <input v-model="phonecode" type="number" class="code public" placeholder="请输入验证码" >
      <input v-if="show" type="button" class="send" :class="{send1:change==3,send2:per==1,}" @click="getcodetime()" name="" id="" value="获取验证码">
      <input v-if="!show" type="button" class="send" :class="{send1:change==3,send2:per==1,}" name="" id="" :value="count+'秒后重新获取'">
    </div>
    <div class="wrap passwordBox">
      <input v-model="password" class="phone password public" placeholder="请输入6位支付密码" :type="type" maxlength="6">
      <div class="hide" @click="changeHide">
        <div v-if="isShow" class="show">
          <img class="img" src="../../assets/mine/show.png" alt="">
        </div>
        <div v-else class="hideImg">
          <img class="img" src="../../assets/mine/hide.png" alt="">
        </div>
      </div>
    </div>
    <div class="wrap passwordBox">
      <input v-model="againPassword" class=" code againPassword public" placeholder="请再次输入支付密码" :type="type2" maxlength="6">
      <div class="hide" @click="changeHide2">
        <div v-if="isShow2" class="show">
          <img class="img" src="../../assets/mine/show.png" alt="">
        </div>
        <div v-else class="hideImg">
          <img class="img" src="../../assets/mine/hide.png" alt="">
        </div>
      </div>
    </div>
    <div class="info" :class="{info2:per==1}">修改支付密码请验证已绑定手机信息</div>
    <button class="loginbtn" :class="{loginbtn2:change==3,loginbtn3:per==1,}" @click="login()">确定</button>
  </div>
</template>
<script>
import {changePassword, getLogo, getUserInfo, phoneLogin, sendCode, sendPasswordCode} from "@/api/locality/login"
import {showFailToast, showSuccessToast} from 'vant';

export default {
  watch: {
    checked() {
      if (this.checked) {
        document.querySelector(".loginbtn").style.background = "#ed3036"
        document.querySelector(".loginbtn").style.disable = false
      } else {
        document.querySelector(".loginbtn").style.background = "#c7c7c7"
        document.querySelector(".loginbtn").style.disable = true
      }
    }
  },
  data() {
    return {
      webinfo: [],
      checked: true,
      phone: null,
      phonecode: "",
      show: true,
      count: "",
      timer: null,
      isphone: false,
      isShow: false,
      isShow2: false,
      type: "password",
      type2: "password",
      password: "",
      againPassword: "",
      userInfo: {},
      token:"",
      change:"",
      per:"",
    }
  },
  methods: {
    getUserInfo() {
      getUserInfo({
        token:this.token
      }).then(res => {
        this.userInfo = res.data
        this.phone = this.userInfo.phone
      })
    },
    changeHide() {
      this.isShow = !this.isShow
      if (this.isShow) {
        this.type = "number"
      } else {
        this.type = "password"
      }
    },
    changeHide2() {
      this.isShow2 = !this.isShow2
      if (this.isShow2) {
        this.type2 = "number"
      } else {
        this.type2 = "password"
      }
    },
    // 登录
    login() {
      if (this.phonecode == "") {
        this.$toast("请输入验证码")
        return
      }
      const regex = /^\d+$/;
      if(!regex.test(this.password)){
        this.$toast("请输入6位数字密码")
        return
      }
      if (this.password.length != 6) {
        this.$toast("请输入6位密码")
        return
      }
      if (this.againPassword.length != 6) {
        this.$toast("请再次输入6位密码")
        return
      }
      if (this.password != this.againPassword) {
        this.$toast("两次输入密码不一致")
        return;
      }
      if (this.checked == true) {
        changePassword({
          token: this.token,
          code: this.phonecode,
          password: this.password
        }).then(res => {
          if (res.code == 200) {
            this.showSuccessToast("success")
            this.$store.commit("settoken", res.data.token)
            this.$store.commit("setuid", res.data.uid)
            this.$toast("修改成功")
            setTimeout(()=>{
              this.$router.go(-1)
            },1000)
          } else {
            this.$toast(res.msg)
          }

        })

      }
    },
    // 发送短信
    sendPhonecode() {
      sendPasswordCode({
        token:this.token,
      }).then(res => {
        if (res.data != undefined&&res.code==200) {
          this.showSuccessToast(res.data)
        }
      })
    },
    // 请求 成功
    showSuccessToast(option) {
      if (option == "success") {
        // 登录成功
        this.$toast({message: "登录成功", type: "success"})
      } else {
        // 发送验证码成功
        this.$toast({message: option, type: "success"})
      }

    },
    // 请求失败
    showFailToast(option) {
      if (option == "fail") {
        // 登录失败
        this.$toast({message: "修改失败", type: "fail"})
      } else {
        // 发送验证码失败
        this.$toast({message: "请输入正确的手机号", type: "fail"})
      }

    },
    // 点击获取验证码  倒计时替换验证码
    getcodetime() {
      // 手机号格式
      // const reg = /^1[3-9]\d{9}$/;
      // if (reg.test(this.phone) == false) {
      //   this.showFailToast()
      // } else {
        this.show = !this.show
        let TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.sendPhonecode()
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
        }
      // }

    },
    // 判断是电脑登录还是手机登录
    isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      if (flag == null) {
        this.isphone = false
      } else {
        this.isphone = true
      }
    },
    //隐私政策页面
    yinsipage() {
      this.$router.push({path: "/yinsizhengce",})
    },
    // 使用说明页面
    useexplain() {
      this.$router.push({path: "/useexplain",})
    }
  },
  created() {
    this.token = localStorage.getItem("token")
    this.change = sessionStorage.getItem("change")
    this.per = sessionStorage.getItem("per")
    this.isMobile()
    this.getUserInfo()
  }
}
</script>

<style scoped>
.login {
  padding-top: 30px;
}

.login .picbox {
  width: 100%;
  height: 34vh;
  text-align: center;
  margin-top: 3vh;
}

.login .picbox img {
  width: 60%;
  height: auto;
}

.login .wrap {
  width: 100%;
  text-align: center;
  margin-top: 2vh;
  position: relative;
}

.login .wrap .phone, .code {
  width: 80vw;
  height: 35px;
  margin-top: 10px;
  border-radius: 5px;
  border: none;
  background-color: #f0f0f0;
  padding: 5px;
  font-size: 0.7em;
  padding-left: 15px;
}

.login .wrap .send {
  position: absolute;
  font-size: .7rem;
  right: 11vw;
  color: red;
  bottom: 2.2vh;
  border: none;
}
.login .wrap .send1 {
  position: absolute;
  font-size: .7rem;
  right: 11vw;
  color: #2697EF;
  bottom: 2.2vh;
  border: none;
}

.login .wrap .send2 {
  position: absolute;
  font-size: .7rem;
  right: 11vw;
  color: #F26B91;
  bottom: 2.2vh;
  border: none;
}

.login .prompt {
  font-size: .7rem;
  width: 90%;
  margin: 0 auto;
  line-height: 2.5vh;
  margin-top: 1vh;
}

.login .loginbtn {
  width: 80%;
  height: 40px;
  border-radius: 30px;
  border: none;
  /* background-color: #c7c7c7; */
  background-color: #F05960;
  color: #fff;
  font-size: .9rem;
  display: block;
  margin: 0 auto;
  margin-top: 8vh;
}
.login .loginbtn2{
  background-color: #2697EF;
}
.login .loginbtn3{
  background-color:transparent;
  background-image: linear-gradient(to right,#FD83DB,#FE5D9B);
}
.login .wxlogin {
  width: 10vw;
  height: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-top: 5vh;
}

.passwordBox {
  margin-top: 0px !important;
}

.public {
  border-radius: 30px !important;
}

.info {
  color: #E1787B;
  font-size: 12px;
  padding: 10px 0px 0px 35px;
}
.info2 {
  color: #F37FA0;
}

.hide {
  position: absolute;
  right: calc(3em + 5px);
  top: 22px;
}

.show {
  width: 20px;
}

.hideImg {
  width: 20px;
}
</style>
