<template>
  <div class="pageMax1">
    <div v-for="item in orderList" :key="item.id">
      <div class="reserve"><span class="circles"></span>预定日期：<span class="clr_2">{{ timestampToTime(item.add_time) }}</span></div>
      <div class="flex_box" @click="tomoveOrder(item.id)">
        <div class="flex_top">
          <div class="flex-bet"><img :src="hsjd" class="img" alt=""><span>景区门票</span></div>
          <div class="stutas">{{ item.third_party_status }}</div>
        </div>

        <div class="flex_center">
          <div>
            <div class="cl0">{{ item.name }}</div>
            <div class="mt10">{{ item.piaotype }} </div>
            <div class="fs12"><span>{{ item.passenger_data.length }}</span>张 <span class="ml18">{{ item.rq }} </span>{{ item.resource_data[0].useDate }}（出游） </div>
          </div>
          <div class="prices"><span class="fs10">￥</span>{{ item.total_price }}</div>
        </div>
      </div>




    </div>
  </div>
</template>
<script>
export default {
  name: "OrderList",
  props: {
    orderList: [Object, Array],
  },
  data() {
    return {
      hsjd: require('@/assets/menpiao/hsjd.png')
    }
  },
  methods: {
    gopay(id, new1) {
      this.$router.push({ path: "/paymentpage", query: { order: id, change: 0, new: new1 } })
    },
    tomoveOrder(id) {
      this.$router.push({ path: "/orderpage", query: { id } })

    },
    // tocardOrder(id) {
    //   this.$router.push({ path: "/cardorderinfo", query: { id } })
    // },
    timestampToTime(time) {
      // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var date = new Date(time * 1000)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + " " + h + ":" + m + ":" + s
    },
  }
}
</script>

<style scoped lang="less">
.pageMax1 {
  padding: 0px 10px 50px 10px;

  .reserve {
    font-size: 12px;

    .circles {
      background-color: #eae7e8;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 5px;
    }

    .clr_2 {
      color: #222222;
    }

    background-color: #ffffff;
    margin-top: 10px;
    padding:4px 10px;
    display: inline-block;
    border-radius: 60px;
    color: #555555;

  }

  .flex_box {
    background-color: #ffffff;
    padding: 10px;
    margin-top: 10px;
    border-radius: 10px;

    // .stutas{
    //   font-size: 14px;
    // }
    .flex_top {
      font-size: 12px;
      color: #222222;
      display: flex;
      justify-content: space-between;

      .img {
        width: 16px;
        height: 12px;
        margin-right: 4px;
      }

      .flex-bet {
        display: flex;
        align-items: center;
      }
    }

    .flex_center {
      .cl0{
        color: #000;
      }
      margin-top: 10px;
      color: #575757;

      .fs12 {
        font-size: 12px;
      }

      .ml18 {
        margin-left: 10px;
      }

      display: flex;
      font-size: 14px;
      justify-content: space-between;

      .mt10 {
        margin-top: 6px;
        font-size: 12px;
      }

      .prices {
        color: #f44;
        font-weight: 500;

        .fs10 {
          font-size: 10px;
        }
      }
    }
  }

}
</style>