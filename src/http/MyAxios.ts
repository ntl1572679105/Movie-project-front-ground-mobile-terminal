import axios from 'axios'
const instance = axios.create()  // 创建axios实例
import qs from 'qs'
import { showLoadingToast } from 'vant'
import 'vant/es/toast/style'

interface Response{
    code: number;
    msg: string;
    data?: any;
}

// 添加请求拦截器, 弹出等待框
var toast:any;
instance.interceptors.request.use(function(config){
    // 发请求之前将自动执行该方法, 在此处弹窗即可
    toast = showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration: 0
    })
    return config;
})

// 添加响应拦截器, 隐藏等待框
instance.interceptors.response.use(function(resp){
    // 隐藏弹窗
    if(toast) {
        toast.close()
    }
    // 也可以在此处, 判断resp.code响应状态码是否是200  200代表正常
    // 如果不是200, 有可能:404/500/302/400/401.....
    // 此处就可以针对非200状态码的响应做统一处理
    return resp
})

const myaxios = {
    /** 用于发送get请求 
     *  url: 请求资源路径  
     *  params: 请求参数（Object形式）
     */
    get(url:string, params?:object):Promise<Response>{
        return instance({
            url, 
            method: 'get',
            params
        })
    },

    /**
     * 用于发送post请求
     * @param {String} url   请求资源路径
     * @param {Object} params   请求参数（对象类型）
     * @returns Promise<Response>
     */
    post(url:string, params?:object):Promise<Response>{
        return instance({
            url,
            method: 'post',
            data: qs.stringify(params)
        })
    }
}

export default myaxios