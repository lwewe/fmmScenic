<template>
  <div class="MemberList">
    <div class="listBox" :class="{listBox2:change==2}" ref="listBox">
      <div v-for="(item,index) in applist" :key="item.id" class="appItem" @click="toClass(item.id,index)" :class="{appItem2:selectId==item.id}">
        <div class="memberLogo">
          <img class="img" :src="item.img" alt="">
        </div>
        <div class="title">{{ item.title }}</div>
      </div>
    </div>
    <!--    更多-->
    <div class="moreBox" :class="{moreBox2:change==2}">
      <div @click="memberShow=true" v-if="!memberShow">
        <div class="moreImg">
          <img class="img" src="../assets/member/gd.png" alt="">
        </div>
        <div class="moreText">更多</div>
      </div>
      <div @click="memberShow=false" v-else>
        <div class="moreImg">
          <img class="img" src="../assets/member/gb.png" alt="">
        </div>
        <div class="moreText">关闭</div>
      </div>
    </div>
    <!--  弹窗-->
    <div v-if="memberShow" :class="{popupBox:change==2}">
      <van-popup v-model="memberShow" position="top">
        <div class="popup" :class="{popup2:change==2}">
          <div class="sortCenter" v-for="(item,index) in applist" :key="item.id" @click="toClass(item.id,index)" :class="{appItem2:selectId==item.id}">
            <div class="memberLogo">
              <img class="img" :src="item.img" alt="">
            </div>
            <div class="title">{{ item.title }}</div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
export default {
  name: "MemberList",
  props: ['applist', 'change'],
  data() {
    return {
      memberShow: false,
      selectId:''
    }
  },
  methods: {
    toClass(id,index) {
      this.memberShow = false
      if (this.change == 1) {
        this.$router.push({path: '/memberClass', query: {id,index}})
      } else {
        this.selectId = id
        this.$emit("changeSelectId",id)
        this.$router.replace({path: '/memberClass', query: {id,index}})
        if(index>=4){
          setTimeout(()=>{
            this.$refs.listBox.scrollLeft = 50*index
          },500)
        }
      }
    }
  },
  created() {
   if(this.change==2){
     this.selectId = this.$route.query.id
    }
  },
  mounted() {
    if(this.$route.query.index>=4){
      setTimeout(()=>{
        this.$refs.listBox.scrollLeft = 50*this.$route.query.index
      },500)
    }
  }
}
</script>

<style scoped lang="less">
.MemberList {
  position: relative;
}

.listBox {
  display: flex;
  align-items: center;
  overflow-x: auto;
  gap: 5px;
  margin-top: 5px;
  padding-right: 43px;
}
.listBox2{
  margin: 0;
  padding-right: 60px;
}

.appItem {
  min-width: 48px;
  padding: 6px;
  border-radius: 5px;
}
.appItem2{
  background-color: #FFF4DA;
  box-shadow: inset 0 0 0 1px #FFECB2; /* 内阴影模拟内边框 */
  border-radius: 5px;
}

.memberLogo {
  width: 28px;
  margin: auto;
}

.title {
  white-space: nowrap;
  font-size: 12px;
  text-align: center;
  color: #5A5A5A;
}

.listBox::-webkit-scrollbar {
  display: none
}

.moreBox {
  position: absolute;
  top: 0px;
  right: -10px;
  background-image: linear-gradient(to bottom, #EBFEFA, #FFFFFF);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 100%;
  border-bottom-right-radius: 10px;

  .moreImg {
    width: 24px;
    height: 24px;
  }

  .moreText {
    font-size: 13px;
    text-align: center;
    margin-top: 3px;
    color: #6A6A6A;
  }
}

.moreBox2 {
  right: 0px;
  background-image: initial;
  background-color: white;
}

//弹窗
/deep/ .van-overlay {
  position: absolute;
  top: 63px;
  width: calc(100% + 40px);
  left: -20px;
  height: 100vh;
  background-color: rgba(0, 0, 0, .4);
}

/deep/ .van-popup--top {
  width: calc(100% + 20px);
  border-radius: 13px;
  transition: none;
  position: absolute;
  top: 68px;
  max-height: initial;
}
.popupBox{
  /deep/ .van-popup--top {
    width: 97%;
    left: 48.5%;
    border-radius: 13px;
    transition: none;
    position: absolute;
    top: 68px;
    max-height: initial;
  }
}
.popup {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 0px 4px;
  box-sizing: border-box;

  .sortCenter {
    width: 20%;
    padding: 11px 0px;
  }
}
.popup2{
  padding: 5px 7px;
}
</style>