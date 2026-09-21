import request from "../utils/nweRequest";

//获取接口访问令牌
export function getAccessToken(data) {
    return request.post("/api/Scenic/getList", data);
}
//获取城市列表
// export function getCitiesList(data) {
//     return request.get("/api/movie/get_citys", data);
// }
