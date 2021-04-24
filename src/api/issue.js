/** 
 * 项目所有请求接口
 */
import {request} from '@/utils/axios.js'

//添加
export function save(data){
    return request('post','/api/issue/',data);
}

//修改
export function update(data){
    return request('put','/api/issue/',data);
}

//列表
export function list(data){
    return request('post','/api/issue/list',data);
}

//分页列表
export function pageList(data){
    return request('post','/api/issue/page/list',data);
}

//详情信息
export function get(data){
    return request('get','/api/issue/' + data);
}

//删除
export function del(data){
    return request('delete','/api/issue/' + data);
}




