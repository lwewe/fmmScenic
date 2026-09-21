<template>
  <div class="page-view">
    <!-- 返回按钮 -->
    <ReturnBack :rcolor="'#000'" :bcolor="'transparent'" />

    <!-- 顶部背景 -->
    <div class="top-back">
      <img :src="dpback" alt="背景" />
    </div>

    <!-- 主要内容区 -->
    <div class="center-box">
      <!-- 信息 -->
      <div class="entrance-box white-box">
        <div class="entrance poi-name flex">
          <div class="jd-nox">
            <img :src="jqmpx" alt="">
          </div>
          <div class="resource-name">{{ poiName || productDetail.name }}</div>
        </div>
        <div class="entrance-list introduction">

          <div class="date-item-date">{{ resourceName }}</div>
          <div>日期：{{ dates }}</div>
          <div>场次：{{ resourceName }}</div>
        </div>
      </div>

      <!-- 票务信息 -->
      <div class="entrance-box white-box entrance-box2">
        <div class="entrance-list">
          <div class="entrance-item">

            <div class="adult">{{ productDetail.name }}</div>
            <div class="flex-between label-tips-box">
              <div class="left-label-tips">
                <div class="label-tips">
                  <span>无需换票</span> | <span>随时退</span> |
                  <span class="max-quantity">每笔订单最多{{ maxQuantity }}张</span>
                </div>
                <div class="flex label-tips label-tips2" @click="showPurchaseNotice">
                  <div style="display: flex;align-items: end;">购买须知<div class="time-icon">
                      <img :src="mores" alt="更多" />
                    </div>
                  </div>



                  <div class="flex del-price-box">
                    <div class="price-box">
                      <span>￥</span>
                      <span class="price">{{ ticketPrice || calculatePrice(productDetail.salePrice) }}</span>
                    </div>
                    <div class="subscribe flex">
                      <div class="jian" @click="changeQuantity(-1)">
                        <img :src="jian" alt="减少" />
                      </div>
                      <div>{{ quantity }}</div>
                      <div class="jian" @click="changeQuantity(1)">
                        <img :src="jia" alt="增加" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- 游客信息 -->
      <div class="entrance-box white-box entrance-box3">
        <div class="entrance">出游信息</div>
        <div class="entrance-list">
          <div>
            <div>需填{{ quantity }}位游客</div>
            <div class="flex adult-box">
              <div class="adult-name" :class="{ 'adult-name2': visitor.selected }" v-for="visitor in visitorList"
                :key="visitor.id" @click="toggleVisitor(visitor)">
                {{ visitor.name }}
              </div>
            </div>
            <div class="people-box">
              <div class="flex people-item" v-for="(visitor, index) in selectedVisitors" :key="index">
                <div class="del" @click="removeVisitor(visitor, index)">
                  <img :src="del" alt="删除" />
                </div>
                <div>
                  <div class="flex edit-box">
                    <div>{{ visitor.name }}</div>
                    <div class="del" @click="editVisitor(visitor)">
                      <img :src="xiugai" alt="编辑" />
                    </div>
                  </div>
                  <div class="card-no" v-if="visitor.idCard">身份证 {{ visitor.idCard }}</div>
                  <div class="card-no">手机号 {{ visitor.phone }}</div>
                </div>
              </div>
            </div>
            <div class="flex add-people" @click="addNewVisitor">
              <div class="jian">
                <img :src="jia" alt="添加" />
              </div>
              <div class="add-people-text">
                点击添加游客信息
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 联系人信息 -->
      <div class="entrance-box white-box entrance-box3">
        <div class="entrance">联系人信息</div>
        <div class="entrance-list flex">
          <div class="phone-text">手机号</div>
          <div class="inp">
            <input type="number" v-model="contactPhone" placeholder="用于生成订单" />
          </div>
        </div>
      </div>

      <!-- 价格明细 -->
      <div class="entrance-box white-box entrance-box3">
        <div class="entrance">价格明细</div>
        <div class="entrance-list flex-between">
          <div>{{ productDetail.name }} </div>
          <div>￥{{ getSinglePrice() }}x{{ quantity }}</div>
        </div>
        <div class="entrance-list entrance-list2 entrance-list3">
          <span class="price">*</span>此产品由景区开具发票，如有疑问，可在消费前联系景区确认开票方法
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="footer-fixed footer flex">
      <div>
        <div class="price-box">
          ￥ <span>{{  totalPrice }}</span>
        </div>
      </div>
      <div class="submit-order" @click="submitOrder">提交订单</div>
    </div>

    <!-- 游客信息弹窗 -->
    <div v-if="showPopup" class="screen-popup">
      <div class="popup-mask" @click="closePopup"></div>
      <div class="popup-content">
        <div v-if="popupType === 'visitor'" class="popup">
          <div class="flex-between bottom-title">
            <div class="title">游客信息</div>
            <div class="close" @click="closePopup">
              <img :src="del" alt="关闭" />
            </div>
          </div>
          <div class="popup-bottom">
            <div class="white-box document-box">
              <div class="flex document-type">
                <div class="user-name">证件类型</div>
                <div>身份证</div>
              </div>
              <div class="flex document-type">
                <div class="user-name">姓名</div>
                <div class="inp-box">
                  <input v-model="newVisitor.name" type="text" placeholder="必填，请输入真实姓名" />
                </div>
              </div>
              <div class="flex document-type">
                <div class="user-name">证件号码</div>
                <div class="inp-box">
                  <input v-model="newVisitor.idCard" type="number" placeholder="必填，请输入证件号码" />
                </div>
              </div>
              <div class="flex document-type">
                <div class="user-name">手机号</div>
                <div class="inp-box">
                  <input v-model="newVisitor.phone" type="number" placeholder="必填，请输入手机号" />
                </div>
              </div>
              <div style="font-size: 12px;color: #555555;margin-top: 10px;">已阅读并同意授权以上信息用于产品预订及相关信息通知。</div>
            </div>
          </div>
          <div class="submit-box">
            <div class="submit-btn"
              :class="{ 'submit-btn-active': newVisitor.name && newVisitor.idCard && newVisitor.phone }"
              @click="saveVisitor">
              保存
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import   { calculatePrice } from '@/utils/price'
import { getCurrentInstance } from 'vue';
import ReturnBack from '@/components/ReturnBack.vue';
import { scenicgetList, scenicViewer, scenicAddviewer, scenicShowviewer, scenicediTviewer, scenicdelviewer, findFilloutProfile } from "@/api/city";
export default {
  name: 'FilmTicketOrder',
  components: {
    ReturnBack
  },
  data() {
    return {
      dpback: require('@/assets/menpiao/dpback.png'),
      jqmpx: require('@/assets/menpiao/jqmpx.png'),
      mores: require('@/assets/menpiao/genduo.png'),
      jia: require('@/assets/menpiao/jia.png'),
      jian: require('@/assets/menpiao/jian.png'),
      del: require('@/assets/menpiao/del.png'),
      xiugai: require('@/assets/menpiao/xiugai.png'),
      imgUrl: '/img', // 根据实际配置调整
      showPopup: false,

      // 影院信息
      cinemaInfo: {
        name: '生态园景区',
        address: '北京市朝阳区建国路93号万达广场'
      },

      // 电影信息
      filmInfo: {
        name: '',
        duration: '',
        language: '',
        type: ''
      },

      // 票务信息
      selectedDate: '2024-12-25',
      selectedSession: {
        time: '',
        hall: '',
        price: 89
      },

      ticketPrice: 0,
      quantity: 1,
      maxQuantity: 3,
      contactPhone: '',
      productDetail: '', packageID: '',
      // 游客信息
      visitorList: [

      ],
      selectedVisitors: [],

      // 弹窗相关
      popupType: '',
      newVisitor: {
        name: '',
        idCard: '',
        phone: ''
      },
      editingVisitorId: null,
      poiName: "", productId: "", resourceName: "", dateItem: {}, token: '', packageID: "", resourceIDs: '',
      codes: '',
      filloutProfile: {},
               
        piaotype:'',id:''
    }
  },
  computed: {
    // totalPrice() {
    //   return (this.ticketPrice || calculatePrice(this.productDetail.salePrice) ) * this.quantity;
    // }
    totalPrice() {
    // 计算增加10%后的单价
    let singlePrice = 0;
    if (this.ticketPrice) {
      
      singlePrice = this.ticketPrice;
    } else if (this.productDetail.salePrice) {
       
      singlePrice = calculatePrice(this.productDetail.salePrice);
    }
    
    // 计算总价
    return (parseFloat(singlePrice) * this.quantity).toFixed(2);
  }
  },
  mounted() {

    this.token = localStorage.getItem("token")
    if (this.token) {
      // 获取已保存的游客信息
      this.getVisitorList();
    } else {
      this.$toast("请先登录");
      // 可以跳转到登录页
      // this.$router.push('/login');
    }
    console.log(this.token)
    // 从路由参数获取电影信息
    const routeParams = this.$route.query;
    console.log(routeParams)
    if (routeParams.filmName) {
      this.filmInfo.name = routeParams.filmName;
    }
    if (routeParams.cinemaName) {
      this.cinemaInfo.name = routeParams.cinemaName;
    }
    if (routeParams.sessionTime) {
      this.selectedSession.time = routeParams.sessionTime;
    }
    this.resourceIDs = routeParams.resourceID;
    this.packageID = routeParams.packageID;
    console.log(routeParams.price)
    console.log(routeParams.dateItem.salePrice)
    if (routeParams.dateItem) {
      this.dateItem = routeParams.dateItem;

      const originalPrice = this.dateItem.marketPrice ? this.dateItem.marketPrice : this.dateItem.salePrice;
     this.ticketPrice = routeParams.price; 
      // this.ticketPrice = this.dateItem.marketPrice ? this.dateItem.marketPrice : this.dateItem.salePrice;
      this.getFullPrice()
    }
    this.dates = routeParams.date;
    this.dateItem = routeParams.dateItem;
    this.productId = routeParams.productId;
    this.poiName = routeParams.poiName;

    	this.id = routeParams.id;

    if (routeParams.dateItem) {
      this.dateItem = (routeParams.dateItem)
    }
    this.resourceName = routeParams.resourceName;

    this.maxQuantity = routeParams.maxQuantity

    this.getProductDetail();


  },
  methods: {
    // 获取单价（已增加10%）
  getSinglePrice() {
    if (this.ticketPrice) {
      return this.ticketPrice;
    } else if (this.productDetail.salePrice) {
      return calculatePrice(this.productDetail.salePrice);
    }
    return '0.00';
  },
  
  // 计算总价
  calculateTotal() {
    const singlePrice = parseFloat(this.getSinglePrice());
    return (singlePrice * this.quantity).toFixed(2);
  },
     // 获取显示价格（已修改为增加10%）
    calculatePrice(price) {
      // 调用导入的工具函数
      return calculatePrice(price);
    },
    // 获取游客列表
    // findFilloutProfiles() {

    // },
    getVisitorList() {
      scenicViewer({
        token: this.token,
      }).then(res => {
        if (res.code == 200) {
          // 格式化游客列表数据
          this.visitorList = res.data.list.map(item => ({
            id: item.id || Math.random(), // 如果接口返回id就用，否则生成随机id
            name: item.name,
            idCard: item.num || item.idCard, // 根据接口返回的字段名调整
            phone: item.phone,
          }));
        }
      }).catch(error => {
        console.error("获取游客列表失败:", error);
      });
    },
    getFullPrice() {
      this.fullPrice = Number(this.marketPrice) * Number(this.number)
    },
    getProductDetail() {
      const datalist = {
        "productIds": this.productId
      };

      scenicgetList({
        data: JSON.stringify(datalist),
        interfaceCode: 'findProductDetail',
      }).then(res => {
        console.log(res)
        if (res.code == 200) {

          this.productDetail = res.data[0] || {};
          console.log(this.productDetail.salePrice)
          this.findFilloutProfiles();


        }
      })
    },
    // 修改票数
    changeQuantity(change) {
      const newQuantity = this.quantity + change;

      if (newQuantity < 1) return;
      if (newQuantity > this.maxQuantity) {
        this.$message.error(`每笔订单最多${this.maxQuantity}张`);
        return;
      }

      this.quantity = newQuantity;

      // 如果选择的游客多于票数，自动取消选择
      if (this.selectedVisitors.length > this.quantity) {
        const toRemove = this.selectedVisitors.length - this.quantity;
        for (let i = 0; i < toRemove; i++) {
          const visitor = this.selectedVisitors[this.selectedVisitors.length - 1];
          this.toggleVisitor(visitor);
        }
      }

      this.findFilloutProfiles();
    },


    // 移除游客
    removeVisitor(visitor, index) {
      this.selectedVisitors.splice(index, 1);
      const visitorListIndex = this.visitorList.findIndex(v => v.id === visitor.id);
      if (visitorListIndex !== -1) {
        this.visitorList.splice(visitorListIndex, 1);
      }
      scenicdelviewer({
        token: this.token,
        id: visitor.id
      }).then(res => {
        if (res.code == 200) {

          this.getVisitorList()
          // this.$toast(res.data);
        }
      }).catch(error => {
        console.error("获取游客列表失败:", error);
      });


    },

    // 选择/取消选择游客
    toggleVisitor(visitor) {
      const index = this.visitorList.findIndex(v => v.id === visitor.id);
      if (index === -1) return;

      if (visitor.selected) {
        // 取消选择
        this.visitorList[index].selected = false;
        this.selectedVisitors = this.selectedVisitors.filter(v => v.id !== visitor.id);
      } else {
        // 检查是否已满
        if (this.selectedVisitors.length >= this.quantity) {
          this.$toast(`只能选择${this.quantity}位游客`);
          return;
        }

        // 选择
        this.visitorList[index].selected = true;
        this.selectedVisitors.push({ ...this.visitorList[index] });
      }
    },
    // 编辑游客
    editVisitor(visitor) {
      this.editingVisitorId = visitor.id;
      this.newVisitor = {
        name: visitor.name,
        idCard: visitor.idCard,
        phone: visitor.phone
      };
      this.popupType = 'visitor';
      this.showPopup = true;
    },

    // 添加新游客
    addNewVisitor() {
      this.editingVisitorId = null;
      this.newVisitor = {
        name: '',
        idCard: '',
        phone: ''
      };
      this.popupType = 'visitor';
      this.showPopup = true;
    },

    // 保存游客信息
    saveVisitor() {
      // 验证姓名
      if (!this.newVisitor.name.trim()) {
        this.$toast('请输入真实姓名');
        return;
      }

      // 验证身份证
      const idCardReg = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
      if (!idCardReg.test(this.newVisitor.idCard)) {
        this.$toast('请输入正确的身份证号码');
        return;
      }

      // 验证手机号
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(this.newVisitor.phone)) {
        this.$toast('请输入正确的手机号');
        return;
      }

      if (this.editingVisitorId) {
        // 编辑现有游客
        const index = this.visitorList.findIndex(v => v.id === this.editingVisitorId);
        if (index !== -1) {
          this.visitorList[index] = {
            ...this.visitorList[index],
            name: this.newVisitor.name,
            idCard: this.newVisitor.idCard,
            phone: this.newVisitor.phone
          };

          // 更新已选中的游客
          const selectedIndex = this.selectedVisitors.findIndex(v => v.id === this.editingVisitorId);
          if (selectedIndex !== -1) {
            this.selectedVisitors[selectedIndex] = {
              ...this.selectedVisitors[selectedIndex],
              name: this.newVisitor.name,
              idCard: this.newVisitor.idCard,
              phone: this.newVisitor.phone
            };
          }
        }


        scenicediTviewer({
          token: this.token,
          name: this.newVisitor.name,
          type: 1,
          id: this.editingVisitorId,
          num: this.newVisitor.idCard,
          phone: this.newVisitor.phone
        }).then(res => {
          console.log(res)
          if (res.code == 200) {
            this.getVisitorList()
            // this.visitorList.push(newVisitor);
          }
        })


      } else {
        // 添加新游客
        const newId = Math.max(...this.visitorList.map(v => v.id), 0) + 1;
        const newVisitor = {
          id: newId,
          name: this.newVisitor.name,
          idCard: this.newVisitor.idCard,
          phone: this.newVisitor.phone,
          selected: false
        };
        scenicAddviewer({
          token: this.token,
          name: this.newVisitor.name,
          type: 1,
          num: this.newVisitor.idCard,
          phone: this.newVisitor.phone
        }).then(res => {
          console.log(res)
          if (res.code == 200) {
            this.visitorList.push(newVisitor);


          }
        })

      }

      this.closePopup();




    },

    // 显示购买须知
    showPurchaseNotice() {
      // 这里可以显示购买须知弹窗
      this.$message.info('购买须知：请仔细阅读相关条款');
    },

    // 关闭弹窗
    closePopup() {
      this.showPopup = false;
      this.popupType = '';
      this.newVisitor = {
        name: '',
        idCard: '',
        phone: ''
      };
      this.editingVisitorId = null;
    },
    findFilloutProfiles() {
      const totalPriceValue = this.totalPrice;
  
      findFilloutProfile({
        token: this.token,
        productId: this.productId,	//是	int	产品id
        packageId: this.packageID,	//是	int	packageId
        resourceID: this.resourceIDs,	//是	int	resourceID
        dateItem: this.dates,//是	date	日期
        quantity: this.quantity,//	是	num	数量
        price: totalPriceValue,	//是	float	价格
      }).then(res => {
        if (res.code == 200) {
          console.log(res)
          // 跳转到支付页面

          this.codes = res.data.code;
          this.filloutProfile = res.data;

        } else {
          this.$toast(res.msg)
        }
      }).catch(error => {
        this.$toast(error)
      });
    },
    // 提交订单
    submitOrder() {
      if (this.selectedVisitors.length !== this.quantity) {
        // this.$toast("暂无数据");
        this.$toast(`请选择${this.quantity}位观影人`);
        return;
      }
      // 验证联系人手机号
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(this.contactPhone)) {
        this.$toast('请输入正确的手机号');
        return;
      }
      // 准备订单数据
      // const orderData = {
      //   cinemaInfo: this.cinemaInfo,
      //   filmInfo: this.filmInfo,
      //   ticketInfo: {
      //     date: this.selectedDate,
      //     session: this.selectedSession,
      //     quantity: this.quantity,
      //     price: this.ticketPrice,
      //     total: this.totalPrice
      //   },
      //   visitors: this.selectedVisitors,
      //   contact: {
      //     phone: this.contactPhone
      //   }
      // };
      // add
console.log(this.selectedVisitors)

      let passengerList = this.selectedVisitors.map(visitor => ({
        ...visitor,
        packageID: this.packageID,
        resourceId: this.resourceIDs,
        questionAnswerList: []
      }));
      this.filloutProfile.passengerQuestionList.forEach(item3 => {
        passengerList.forEach((item, index) => {
          item.questionAnswerList.push({
            "questionID": item3.questionID,
            "questionCode": item3.code,
            "answerList": []
          },)
          item.questionAnswerList.forEach((item2, index2) => {
            if (item2.questionCode == "P_NAME" || item2.questionCode ==
              "P_CNAME") {
              item2.answerList = [item.name]
              item2.questionCode = "P_CNAME"
            } else if (item2.questionCode == "P_TELPHONE") {
              item2.answerList = [item.phone]
            } else if (item2.questionCode == "P_TELPHONE_AREA_CODE") {
              item2.answerList = ["86"]
            } else if (item2.questionCode == "P_ID_CARD") {
              item2.answerList = [item.idCard]
            } else {
              item2.answerList = [""]
            }

          })
        })
      })

      let orderData = {
        travelScenicAreaId: this.id || "",
        contact: {
          name: this.selectedVisitors[0].name,
          mobile: {
            "internationalTelephoneCode": "86",
            "mobileNumber": this.contactPhone
          }
        },
        passengerList,
        basicOrder: {
          "productID": this.productId,
          "packageID": this.packageID,
          "orderResourceList": [{
            "resourceID": this.resourceIDs,
            "useDate": this.dates.split(" ")[0] || this.dates,
            "endDate": this.dates.split(" ")[0] || this.dates,
            "day": 1,
            "quantity": this.quantity
          }]
        }
      }
      // add




      // 跳转到支付页面
      this.$router.push({
        path: '/PaymentPage',
        query: {
          orderData: JSON.stringify(orderData),
          code: this.codes,
          price: this.totalPrice,	//是	float	价格
          quantity: this.quantity,
          names:this.poiName,
        piaotype:this.productDetail.name
        }
      });



    }
  }
};
</script>

<style lang="less" scoped>
.page-view {
  background-color: #FCFCFC;
  min-height: 100vh;
  padding-bottom: 100px;
  position: relative;
}

.top-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.center-box {
  padding: 16px;
  position: relative;
  z-index: 1;
  padding-top: 60px;
}

/* 卡片样式 */
.entrance-box {
  padding: 10px;
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  background: white;

  .poi-name {
    margin-top: 0;
    gap: 10px;

    .jd-nox {
      width: 20px;
      height: 20px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    div {
      font-size: 14px;
      font-weight: 600;
      color: #381719;
    }
  }

  .entrance {
    font-weight: 600;
    color: #381719;
    border-bottom: 2px solid #FAF5F5;
    padding-bottom: 10px;
    font-size: 14px;
  }

  .entrance-list {
    margin-top: 10px;

    font-size: 14px;
    color: #342C2C;

    &.introduction {
      .resource-name {
        color: #555555;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 8px;
      }

      .date-item-date {
        margin: 8px 0;
        color: #000000;
        font-weight: bold;
      }

      div {
        margin: 4px 0;
      }
    }
  }
}

/* 票务信息样式 */
.entrance-box2 {
  margin-bottom: 10px;
  padding: 2px 10px 10px 10px;

  .entrance-list {
    .entrance-item {
      .adult {
        font-size: 14px;
        color: #240003;
        margin-bottom: 6px;
        font-weight: 500;
      }

      .label-tips-box {
        align-items: flex-end;

        .left-label-tips {
          width: 100%;
        }
      }

      .label-tips {
        color: #342C2C;
        font-size: 12px;
        // margin-left: -8px;

        span {
          color: #28AFB4;
          // padding: 0 8px;
        }

        .max-quantity {
          color: #342C2C;
        }
      }

      .label-tips2 {
        margin-top: 8px;
        margin-left: 0;
        cursor: pointer;
        display: flex;
        justify-content: space-between;

        .time-icon {
          // margin-left: 8px;
          width: 14px;
          height: 14px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .del-price-box {
        gap: 0px;
        align-items: center;

        .price-box {
          font-weight: 400;
          font-size: 12px;
          color: #9F9D9D;

          span {
            font-size: 14px;
            color: #D7000F;
          }

          .price {
            font-size: 16px;
          }
        }

        .subscribe {
          margin-left: 10px;
          font-weight: 400;
          font-size: 14px;
          color: #240003;
          gap: 16px;
          align-items: center;

          .jian {
            width: 20px;
            height: 20px;
            cursor: pointer;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}

/* 游客信息样式 */
.entrance-box3 {
  .entrance {
    font-weight: 600;
    color: #381719;
    font-size: 14px;
    border-bottom: 2px solid #FAF5F5;
    // padding-bottom: 10px;
  }

  .entrance-list {
    gap: 20px;
    font-weight: 400;
    font-size: 14px;
    color: #342C2C;

    .phone-text {
      width: 60px;
    }

    .inp {
      flex: 1;
      background: #FCFCFC;
      border-radius: 8px;
      padding: 4px 8px;
      box-sizing: border-box;

      input {
        width: 100%;
        border: none;
        background: transparent;
        outline: none;
        font-size: 14px;

        &::placeholder {
          color: #9F9D9D;
          font-size: 14px;
        }
      }
    }

    .adult-box {
      gap: 16px;
      margin-top: 10px;
      flex-wrap: wrap;
    }

    .adult-name {
      padding: 0 16px;
      height: 30px;
      background: #FCFCFC;
      border-radius: 8px;
      font-size: 14px;
      color: #240003;
      line-height: 30px;
      border: 1px solid #F0F0F0;
      // margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: #28AFB4;
      }
    }

    .adult-name2 {
      border: 1px solid #28AFB4;
      color: #28AFB4;
      background: rgba(40, 175, 180, 0.05);
    }

    .add-people {
      margin-top: 10px;
      gap: 16px;
      align-items: center;
      cursor: pointer;

      .jian {
        width: 24px;
        height: 24px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .add-people-text {
        flex: 1;
        height: 30px;
        background: rgba(40, 175, 180, 0.05);
        border-radius: 8px;
        font-weight: 400;
        font-size: 14px;
        color: #28AFB4;
        line-height: 30px;
        padding: 0 16px;
        box-sizing: border-box;
      }
    }

    .people-box {
      border-bottom: 1px solid #FAF5F5;
      margin-top: 16px;

      .people-item {
        gap: 16px;
        padding: 16px 0;
        border-bottom: 1px solid #FAF5F5;

        &:last-child {
          border-bottom: none;
        }

        .edit-box {
          gap: 8px;
          align-items: center;
        }

        .del {
          width: 22px;
          height: 22px;
          cursor: pointer;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .card-no {
          margin-top: 8px;
          color: #666;
          font-size: 12px;
        }
      }
    }
  }

  .entrance-list2 {
    margin-top: 20px;

    .price {
      color: #D7000F;
    }
  }

  .entrance-list3 {
    font-size: 12px;
    color: #9F9D9D;
    margin-top: 16px;

    .price {
      padding-right: 6px;
      color: #D7000F;
    }
  }
}

/* 底部操作栏 */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  gap: 40px;
  padding: 12px 32px;
  background: #FFFFFF;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
  z-index: 100;

  .price-box {
    font-size: 14px;
    color: #D7000F;
    text-align: end;

    span {
      font-size: 20px;
      font-weight: 600;
    }
  }

  .submit-order {
    flex: 1;
    height: 40px;
    background: linear-gradient(135deg, #19c2c9 0%, #49dadf 100%);
    border-radius: 25px;
    font-weight: 400;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    transition: opacity 0.3s;

    &:hover {
      opacity: 0.9;
    }
  }
}

/* 工具类 */
.flex {
  display: flex;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.white-box {
  background: #fff;
}

/* 弹窗样式 */
.screen-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;

  .popup-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .popup-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    border-radius: 16px 16px 0 0;
    max-height: 80vh;
    overflow-y: auto;

    .popup {
      font-weight: 400;
      font-size: 16px;
      color: #342C2C;

      .bottom-title {
        padding: 16px 32px;

        .close {
          width: 22px;
          height: 22px;
          cursor: pointer;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .popup-bottom {
        background: #FCFCFC;
        padding: 16px;
        font-weight: 400;
        font-size: 14px;
        color: #240003;
        line-height: 24px;

        .document-box {
          padding: 16px;
          background: white;
          border-radius: 8px;
        }

        .document-type {
          padding: 16px 0;
          border-bottom: 2px solid #FAF5F5;
          gap: 20px;

          .inp-box {
            flex: 1;

            input {
              width: 100%;
              border: none;
              background: transparent;
              outline: none;
              font-size: 14px;

              &::placeholder {
                color: #9F9D9D;
              }
            }
          }
        }

        .user-name {
          min-width: 80px;
        }
      }
    }
  }

  .submit-box {
    padding: 16px 32px;

    .submit-btn {
      width: 100%;
      height: 40px;
      background: linear-gradient(135deg, #19c2c7 0%, #49dadf 100%);
      border-radius: 25px;
      opacity: 0.4;
      font-size: 16px;
      color: #FFFFFF;
      line-height: 40px;
      text-align: center;
      cursor: not-allowed;

      &.submit-btn-active {
        opacity: 1;
        cursor: pointer;
      }
    }
  }
}
</style>