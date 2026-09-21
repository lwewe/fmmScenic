import request from "../utils/nweRequest";

//获取接口访问令牌
export function getAccessToken(data) {
    return request.post("/api/oauth/token", data);
}
//获取城市列表
export function getCitiesList(data) {
    return request.get("/api/movie/get_citys", data);
}
//热映电影（pageIndex从0开始）
export function getHitFilmList(data){
    return request.get("/api/movie/movies",data)
}

// 即将上映电影
export function getComingMoviesList(data){
    return request.get("/api/movie/coming_movies",data)
}
// 获取影院列表
export function getFilmCinemas(data){
    return request.get("/api/movie/cinemas",data)
}
// 获取影院过滤列表(获取城市影院品牌和区域信息)
export function cinemaFilter(data){
    return request.get("/api/movie/cinema_filter",data)
}
// 获取电影的影院列表
export function getMovieCinemas(data){
    return request.get("/api/movie/movie_cinemas",data)
}
// 获取电影详情
export function getMovieDetail(data){
    return request.get("/api/movie/movie_detail",data)
}
// 获取影院某个电影的排片列表
export function getCinemashows(data){
    return request.get("/api/movie/cinema_shows",data)
}
//获取电影场次（座位）详情
export function getSession(data){
    return request.get("/api/movie/session",data)
}
//创建订单
export function createOrder2(data){
    return request.post("/api/movie/create_order2",data)
}