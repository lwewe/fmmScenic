<template>
  <div class="memberindex">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <div class="topIndex">
      <div class="banner">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="red" style="border-radius: 10px;">
          <van-swipe-item v-for="(item,index) in banner" :key="index" style="border-radius: 10px;">
            <img :id="item.id" :src=" item.img" alt=""
                 style="border-radius: 10px;width: 100%;height: 100%;">
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="list1">
        <div @click="goreadmember()" class="imgbox">
          <img class="img" :src=" yuedu.img" :id="yuedu.id" alt="">
        </div>
        <div @click="gomusicmember()" class="imgbox">
          <img class="img" :src=" yinyue.img" :id="yinyue.id" alt="">
        </div>
      </div>
      <!--  tab切换-->
      <div class="tabList">
        <div class="titleBox">
          <div class="leftImg">
            <img class="img" src="../../assets/member/zz.png" alt="">
          </div>
          <div>视频会员</div>
          <div class="leftImg">
            <img class="img" src="../../assets/member/yy.png" alt="">
          </div>
        </div>
        <!--        会员列表-->
        <div>
          <MemberList :applist="applist" :change="1"></MemberList>
        </div>
      </div>
    </div>
    <!--    列表-->
    <div>
      <List :Kaquanlist="qitalist"></List>
    </div>
  </div>
</template>

<script>
import List from "@/components/List.vue";
import {getKaquan, getKaquanlist, getclassify} from "@/api/member";
import MemberList from "@/components/MemberList.vue";

export default {
  components: {MemberList, List},
  data() {
    return {
      banner: [],
      yinyue: [],
      yuedu: [],
      applist: [],
      Kaquanlist1: [],
      pageno: 1,
      pagesize: 100,
      ishow: false,
      qitalist: [],
      id: 0,
      loadingflag: true
    };
  },
  methods: {
    getKaquanList() {
      getKaquan({}).then(res => {
        this.loadingflag = false
        // console.log(res.data.yinyue);
        this.applist = res.data.classify
        this.banner = res.data.lbt.lbt
        // this.banner.push(res.data.lbt.lbt[0])
        // console.log(this.banner);
        this.yuedu = res.data.yuedu
        this.yinyue = res.data.yinyue
      })
    },
    getAllKaquanlist() {
      getKaquanlist({
        pageno: this.pageno + "",
        pagesize: this.pagesize + ""
      }).then(res => {
        if (res.code == 200) {
          this.qitalist = res.data
          this.loadingflag = false
          this.ishow = true
        }
        // console.log(this.Kaquanlist1);
      })
    },
    gomusicmember() {
      this.$router.push({path: "/musicmember"})
    },
    goreadmember() {
      this.$router.push({path: "/readmember"})
    }
  },
  created() {
    this.getKaquanList()
    this.getAllKaquanlist()
  },

};
</script>
<style scoped lang="less">
.memberindex {
  background-color: #745645;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 10px;
}

.list1 {
  display: flex;
  border-radius: 10px;
  background-image: linear-gradient(to bottom, #D2FFF5, #F9FEFD);
  margin-top: 5px;
  gap: 10px;
  padding: 0px 10px 5px;
}

.topIndex {
  padding: 49px 10px 0px;
}

.tabList {
  background-image: url("../../assets/member/bg.png");
  background-size: 100% 100%;
  width: 100%;
  height: 97px;
  margin-top: 8px;
  padding: 10px;
  box-sizing: border-box;

  .titleBox {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 15px;

    .leftImg {
      width: 17px;
    }
  }
}

</style>