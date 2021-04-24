/** 
 * axios网络请求配置
 * Created by aerfa on 2018/8/9.
 */
import axios from 'axios'
import {GLOBAL} from '@/utils/global';
import {alertModule,confirmModule} from '@/utils/element';
import {getToken, setToken} from '@/utils/store';

// 请求配置项
var instance = axios.create({
    headers:{
        'Content-Type': 'application/json',
    },
    timeout: 30000,
	baseURL: GLOBAL.API      //接口地址
})

const TOKEN = 'X-API-TOKEN'

//请求拦截器
instance.interceptors.request.use(config => {
    const token = getToken();
    if(token){
        config.headers[TOKEN] = token;
    }
    return config;
},error => {
    return Promise.reject(error);
})

//响应拦截器
instance.interceptors.response.use(
    res => {
        if(res.headers[TOKEN]){
            setToken(res.headers[TOKEN]);
        }
        return res.data
    },
    error => {
        return Promise.reject(error);
    }
)

//封装所有请求，restful
export function request(methed,url, data = {},headers) {
    return new Promise((resolve, reject) => {
        instance({
            method: methed || 'post',
            url:url,
            data: methed === 'get' ? { params: data } : data,
            headers: headers || {'Content-Type':'application/json'},
        })
        .then(response => {
            if(response.code === 200){
                resolve(response.data);
            }else if(response.code === 100014){
                alertModule('用户名已存在');
            }else if(response.code === 100023){
                alertModule(response.msg);
            }else if(response.code === 100006){
                alertModule(response.msg);
                location.href = GLOBAL.API + "/#/login";
            }else{
                alertModule(response.msg);
                if(response.code === 100016){
                    resolve('no_auth');
                }
            }
        })
        .catch(err => {
            reject(err)
        })
    })
}