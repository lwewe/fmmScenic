<template>
  <div class="list2">
    <div class="product" v-for="(item,index) in Kaquanlist" :key="index" :id="item.id" @click="gocarddetail(item.id)">
      <div class="imgbox">
        <img :src=" item.img" alt="">
      </div>
      <div style="padding: 10px;">
        <p class="title">{{ item.title }}</p>
        <p class="price">￥{{ item.price }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'List',
  props: ['Kaquanlist'],
  data() {
    return {
    };
  },
  methods: {
    gocarddetail(id) {
      this.$router.push({path: "/couponsdetail", query: {id: '' + id}})
    }
  },
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}

.list2 {
  width: 100%;
  /* height: 100%; */
  /* background-color: pink; */
  border-radius: 10px;
  padding: 0px 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.list2 .product {
  width: 49%;
  background: #fff;
  border-radius: 10px;
  margin-top: 10px;
}

.list2 .product .imgbox {
  width: 100%;
  /* background-color: yellow; */
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.list2 .product .imgbox img {
  width: 100%;
  height: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.list2 .product .title {
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.list2 .product .price {
  font-size: 15px;
  font-size: 18px;
  font-weight: 600;
  color: red;
}
</style>