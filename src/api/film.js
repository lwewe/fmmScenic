import request from "../utils/request";

//热映电影列表
export function getFilmList(data) {
    return request.post("", data, { login: false });
}
//即将上映电影列表
export function getFutureFilmList(data){
    return request.post("/",data,{login : false})
}

// 获取电影的详情页
export function getFilmDetail(data){
    return request.post("",data,{login : false})
}
// // 获取电影影院排期
export function getFilmdata(data){
    return request.post("",data,{login : false})
}