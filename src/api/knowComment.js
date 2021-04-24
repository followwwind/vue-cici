/** 
 * 项目所有请求接口
 */
import {request} from '@/utils/axios.js'

//添加
export function save(data){
    return request('post','/api/knowComment/',data);
}

//修改
export function update(data){
    return request('put','/api/knowComment/',data);
}

//列表
export function list(data){
    return request('post','/api/knowComment/list',data);
}

//分页列表
export function pageList(data){
    return request('post','/api/knowComment/page/list',data);
}

//详情信息
export function get(data){
    return request('get','/api/knowComment/' + data);
}

//删除
export function del(data){
    return request('delete','/api/knowComment/' + data);
}




