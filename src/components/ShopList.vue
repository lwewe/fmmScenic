<template>
  <!--  :ref="'ShopList'+index"-->
  <div @click="toDetail" ref="ShopList">
    <div class="listItem2" style="position: relative" v-if="listItem">
      <div class="imgMax2 " :class="{shopImg:flag==1,imgMax3:flag==2}">
        <div class="imgBox" :class="{imgBox2:flag==2}">
          <img class="img imgMax" :src="listItem.showPic" alt="">
          <div class="imgText" v-if="flag==2">{{listItem.subClassifyName}}</div>
<!--          <div class="imgText  imgText2" v-if="type==1">256<span>人想看</span></div>-->
          <div class="imgText  imgText2 imgText3" v-if="flag==1">{{listItem.subClassifyName}}</div>
        </div>
      </div>
      <div class="shopInfo" :class="{shopInfo2:flag==2}">
        <!--        <div class="label" style="background-color:#fff0;height: 17px;" v-else></div>-->
        <div class="title">{{listItem.projectName}}</div>
        <div class="label" v-if="flag==1&&listItem.showStartTime">{{listItem.showStartTime.split(" ") [0]}}</div>
        <div class="label" style="margin-top: 2px;" v-if="type==1&&listItem.showStartTime&&listItem.daysDiff">{{listItem.daysDiff==1?'今日':listItem.daysDiff==2?'一天后':listItem.showStartTime.split(" ") [0].split("-").slice(1).join("-")}}演出</div>
        <div class="priceBox" :class="{priceBox2:flag==2}" v-if="type!=1">
          <div class="price">
            <span>￥</span><span class="priceNum" :class="{priceNum2:flag==2}">{{listItem.minPrice}}</span>起
          </div>
          <!--          <div class="plus">-->
          <!--            <van-icon name="plus"/>-->
          <!--          </div>-->
        </div>
        <div class="btn" v-if="type==1">想看</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ShopList",
  props: {
    listItem: [Array, Number, Object, String],
    index: [Number, String],
    flag: [Number, String],
    detail: [Number, String],
    type: [Number, String],
  },
  data() {
    return {}
  },
  methods: {
    // 价格处理
    changePrice1(price) {
      return price.toString().includes(".") ? price.toString().split('.')[0] : price
    },
    changePrice2(price) {
      return price.toString().includes(".") ? Number(price).toFixed(2).toString().split('.')[1] : "00"
    },
    toDetail() {
      // if (this.flag == 1) {
      //
      // if(this.detail==1){
      //   this.$router.replace({path:"/filmdetail",query:{id:this.listItem.projectId,type:this.listItem.subClassifyName}})
      //   this.$router.go(0)
      // }else{
      //   this.$router.push({path:"/filmdetail",query:{id:this.listItem.projectId,type:this.listItem.subClassifyName}})
      // }
      window.location.href = this.$store.state.perkUrl+"/filmdetail?id="+this.listItem.projectId+"&type="+this.listItem.subClassifyName
      // window.location.href = this.$store.state.perkUrl
      // }
      // if (this.flag == 2) {
      //   window.location.href = this.$store.state.base+`/couponsdetail?id=` + this.listItem.id+"&token="+localStorage.getItem("token")
      // }
      // if (this.flag == 3) {
      //   this.$router.push({path:"/directCharge",query:{id:this.listItem.id}})
      // }
    }
  },
  created() {

  },
  mounted() {
    // setTimeout(() => {
    //   // console.log(this.$refs.ShopList.offsetHeight)
    //   this.$emit("ShopList", this.$refs.ShopList.offsetHeight)
    // }, 200)
  },
}
</script>

<style scoped lang="less">
.listItem2 {
  width: 100%;
  //background-color: white;
  border-radius: 10px;
}

.shopImg {
  border-bottom-right-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
}

.imgMax {
  width: 100%;
  object-fit: cover;
}

.imgMax2 {
  border-radius: 10px;
  //height: 164px;
  overflow: hidden;
  //display: flex;
  //align-items: center;
  //justify-content: center;
}

.imgMax3 {
  border-radius: 5px;
}

.imgBox {
  //width: 90%;
  margin: auto;
  display: flex;
  width: 100%;
  height: 227px;
  position: relative;
}

.imgBox2 {
  height: 106px;
}

.plus {
  color: white;
  background-color: #CA403E;
  border-radius: 50%;
  width: 13px;
  height: 13px;
  text-align: center;
  font-size: 14px;
  line-height: 13px;
  padding: 5px;
}

.priceBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 13px;
}

.priceBox2 {
  margin-top: 3px;
}

.shopInfo {
  padding: 6px 10px;
}

.shopInfo2 {
  padding: 1px 2px;
}

.price {
  color: #9D9D9D;
  white-space: nowrap;
  font-size: 10px;
}

.price span {
  color: #F2568A;
}

.priceNum {
  font-size: 16px;
}

.priceNum2 {
  font-size: 14px;
}

.label {
  color: #8B8B8B;
  font-size: 12px;
  margin-top: 7px;
}

.title {
  font-size: 14px;
  color: #313131;
  padding-top: 3px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 1; /* 显示两行 */
}

.imgText {
  position: absolute;
  white-space: nowrap;
  text-overflow: ellipsis;
  top: 3px;
  right: 4px;
  font-size: 10px;
  max-width: 60px;
  height: 14px;
  overflow: hidden;
  background-color: #191521cc;
  color: white;
  border-radius: 3px;
  text-align: center;
  line-height: 14px;
  padding: 1px;
  box-sizing: border-box;
}

.imgText2 {
  background-color: transparent;
  top: inherit;
  right: inherit;
  left: 4px;
  bottom: 2px;
  max-width: 73px;
}

.imgText2 span {
  font-size: 6px;
}

.imgText3 {
  background-color: #1915219e;
  border-radius: 30px;
  border: 1px solid #7C7376;
  padding:2px 5px;
  box-sizing: content-box;
  left: 5px;
  bottom: 5px;
}

.btn {
  width: 57px;
  height: 24px;
  line-height: 25px;
  text-align: center;
  color: white;
  border-radius: 30px;
  margin: auto;
  background-image: linear-gradient(to right, #FCA726, #FCA726);
  font-size: 12px;
  margin-top: 4px;
}
</style>