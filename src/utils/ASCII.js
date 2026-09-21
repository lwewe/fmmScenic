import store from '../store/index';
import EnterLoging from "@/components/EnterLoging.vue";
// ASCII排序
var ASCII = {
    components: {EnterLoging},
    sort_ascii(obj) {
        let arr = new Array();
        let num = 0;
        for (let i in obj) {
            arr[num] = i;
            num++;
        }
        let sortArr = arr.sort();
        let str = '';             //自定义排序字符串
        for (let i in sortArr) {
            if(undefined != obj[sortArr[i]]  && null != obj[sortArr[i]]){
                str += sortArr[i] + '=' + obj[sortArr[i]] + '&';
            }
        }
        // let apikey = "f2385fa1170d818d"
        // let secret = "71e1e4a283292c1f25ba15993a7b8f30"
        //去除两侧字符串
        let char = '&';
        // str = "apikey="+store.state.apikey+"&"+"secret="+store.state.secret+"&"+str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '')+"&"+"apikey="+store.state.apikey+"&"+"secret="+store.state.secret;
        str = str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '')+store.state.privatekey;
        // console.log(str)
        return str;
    }
};

//导出
export default ASCII
