/** 
 * 项目所有请求接口
 */
import {request} from '@/utils/axios.js'

//图片修改
export function uploadImg(data){
    return request('post','/api/file/uploadFile',data,{'Content-Type':'multipart/form-data'});
}

export function login(data){
    return request('post','/api/login',data);
}

export function reg(data){
    return request('post','/api/reg',data);
}

