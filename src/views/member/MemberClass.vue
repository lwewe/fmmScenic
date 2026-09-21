<template>
  <div class="memberindex">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <div class="topIndex">

    </div>
    <div class="memberBox">
      <!--        会员列表-->
      <MemberList :applist="applist" :change="2" @changeSelectId="changeSelectId"></MemberList>
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
    changeSelectId(id) {
      this.qitalist = []
      this.golist(id)
    },
    golist(fid) {
      getclassify({
        fid,
        pageno: this.pageno,
        pagesize: this.pagesize
      }).then(res => {
        this.loadingflag = false
        // console.log(res.data);
        this.qitalist = res.data
      })
    },
    getKaquanList() {
      getKaquan({}).then(res => {
        this.applist = res.data.classify
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
    this.golist(this.$route.query.id)
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

.topIndex {
  padding: 49px 10px 0px;
}

.memberBox {
  background-color: white;
  padding: 3px 0px 3px 12px;
}
</style>