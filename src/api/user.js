/** 
 * 项目所有请求接口
 */
import {request} from '@/utils/axios.js'

//添加
export function save(data){
    return request('post','/api/user/',data);
}

//修改
export function update(data){
    return request('put','/api/user/',data);
}

//列表
export function list(data){
    return request('post','/api/user/list',data);
}

//分页列表
export function pageList(data){
    return request('post','/api/user/page/list',data);
}

//详情信息
export function get(data){
    return request('get','/api/user/' + data);
}

//删除
export function del(data){
    return request('delete','/api/user/' + data);
}




