/** 
 * 项目所有请求接口
 */
import {request} from '@/utils/axios.js'

//添加
export function save(data){
    return request('post','/api/category/',data);
}

//修改
export function update(data){
    return request('put','/api/category/',data);
}

//列表
export function list(data){
    return request('post','/api/category/list',data);
}

//分页列表
export function pageList(data){
    return request('post','/api/category/page/list',data);
}

//详情信息
export function get(data){
    return request('get','/api/category/' + data);
}

//删除
export function del(data){
    return request('delete','/api/category/' + data);
}




