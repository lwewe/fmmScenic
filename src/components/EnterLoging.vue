<template>
  <div class="enterloading">
    <van-popup v-model:show="show" :overlay="false" style="width: 100%;background-color: #fff ">

      <div class="nprogress-container" :style="{width:progress +'%' }">
        <div class="nprogress-bar"></div>
      </div>

      <div class="box">
        <img src="../assets/logotitle.png" alt="">
        <p><span style="display: inline-block;width: 40px;white-space: nowrap">加载中</span><span
            style="display: inline-block;width: 0px;">{{ text }}</span></p>
      </div>
    </van-popup>


  </div>
</template>

<script>
export default {
  data() {
    return {
      progress: 0,
      text: "",
      loading: [".", "..", "..."],
      time: 0,
      show: true
    };
  },

  mounted() {
    this.openTimer();
    this.openTimer2()
    // console.log(timer);
    // this.time=0
  },

  methods: {

    openTimer() {
      var timer = setInterval(() => {
        // this.text="加载中"
        if (this.progress < 95) {
          this.progress = this.progress + 5
        }
      }, 50);

    },
    openTimer2() {
      var timer = setInterval(() => {
        this.text = ""
        if (this.time == 3) {
          this.time = 0
        }

        this.text = this.text + this.loading[this.time]
        this.time = this.time + 1

      }, 500);
    }
  },
  destroyed() {
    clearInterval(this.openTimer)
    clearInterval(this.openTimer2)
  }

};
</script>
<style>
.enterloading {
  position: absolute;
  width: 100vw;
  min-height: 100vh;
  height: 100%;
  background: #fff;
  z-index: 100000;
}

.enterloading .box {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  white-space: nowrap;
}

.enterloading .box img {
  width: 50px;
  height: 50px;
  margin: 0 auto;
}

.enterloading .box p {
  text-align: center;
  color: #999;
  font-size: 13px;
}

.nprogress-container {
  position: fixed;
  top: 0;
  left: 0;
  /* width: 10%; */
  height: 2px;
  background-color: #29d;

  z-index: 9999;
}

.nprogress-bar {
  height: 100%;
  background-color: #29d;
}
</style>