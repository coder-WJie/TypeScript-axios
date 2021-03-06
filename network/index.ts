import HRequest from './request/request';
import { API_BASE_URL, TIME_OUT } from './request/config';
import localCache from '../utils/cache'
/**
 *  为什么我们要对axios进行封装？
 * 1.外部依赖库，有停止维护的风险，将项目中使用的方法逻辑封装到一个文件/文件夹中同意导出，方便更换库，有利于维护
 * 2.封装起来符合高内聚低耦合的思想
 */

/**
 * 一般情况下，只需创建一个实例
 * 什么时候需要创建多个实例？
 * 比如baseURL不同，且在这个baseURL下请求多次，这个时候创建一个公用的请求实例能够提升代码的可维护性
 */

/**
 * 这里值得特别注意的一点：如何做到支持传入请求/响应拦截器
 * 思路：要想在创建实例的时候能传入（请求/响应）拦截器，需要修改传入配置对象options: AxiosRequestConfig的类型，读源码可知AxiosRequestConfig类型定义中并不包括拦截器选项，因此如果要传入拦截器配置，需要扩展AxiosRequestConfig类型，这里我定义了一个 HRequestConfig接口来继承AxiosRequestConfig接口，实现对AxiosRequestConfig的扩展。
 *  当然要传入拦截器配置，首先要定义拦截器的类型，我们可以定义一个InterceptorHooks接口，包含了4个拦截器方法，都为可选项（不是每次请求都要传入拦截器，如果不设置为可选，则必须要传）
 * ，原有的需要在 HRequest类中声明一个承载interceptor的属性
 */
const hrequest = new HRequest({
  baseURL: API_BASE_URL,
  timeout: TIME_OUT,
  interceptorHooks: {
    requestInterceptor: (config) => {
      const token = localCache.getCache('token');
      console.log('config',config);
      
      if (config !== undefined && token) {
        config!.headers!.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    requestInterceptorCatch: (err) => {
      return err;
    },
    responseInterceptor: (res) => {
      return res.data;
    },
    responseInterceptorCatch: (err) => {
      return err;
    },
  },
});

export default hrequest;
