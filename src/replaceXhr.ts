import { config, IMessage, UPLOAD_TYPE } from './internal'
const UPLOAD_ADDRESS = config.remoteUrl

class HttpLogInfo {
  httpUrl: string;
  status: string;
  statusText: string;
  statusResult: string;
  happenTime: any;
  loadTime: number;
  msgType: UPLOAD_TYPE;
  startTime: number;
  constructor (url: string, status: string, statusText: string, statusResult: string,startTime: number, loadTime: number) {
    this.msgType = UPLOAD_TYPE.HTTP_LOG
    this.httpUrl = encodeURIComponent(url); // 请求地址
    this.status = status; // 接口状态
    this.statusText = statusText; // 状态描述
    this.statusResult = statusResult; // 区分发起和返回状态
    this.startTime = startTime; // 接口请求耗时
    this.loadTime = loadTime; // 接口请求耗时
  }
}


/**
 * 页面接口请求监控
 */
export const recordHttpLog = () => {
  // 监听ajax的状态
  function eventRegister(event: string) { 
    // 注册一个事件，并且用dispatchEvent调用它
    let eve = new CustomEvent(event, {
      // @ts-ignore
        detail: this
    });
    window.dispatchEvent(eve);
  }
  // 保存之前的XHR构造函数
  let oldXHR = window.XMLHttpRequest;
  const newXHR = () => {
      const realXHR = new oldXHR();
      // 添加了两个自定义监听器
      realXHR.addEventListener(
        "loadstart",
        function() {
          eventRegister.call(this, "ajaxLoadStart");
        },
        false
      );
      realXHR.addEventListener(
        "loadend",
        function() {
          eventRegister.call(this, "ajaxLoadEnd");
        },
        false
      );
      // 此处的捕获的异常会连日志接口也一起捕获，如果日志上报接口异常了，就会导致死循环了。
      // realXHR.onerror = function () {
      //   siftAndMakeUpMessage("Uncaught FetchError: Failed to ajax", WEB_LOCATION, 0, 0, {});
      // }
      return realXHR;
  }
  const timeRecordArray: any [] = [];
  // @ts-ignore
  window.XMLHttpRequest = newXHR;
  // xhr开始
  window.addEventListener("ajaxLoadStart", function(e) {
    console.log(e,'ajaxLoadStart')
    const tempObj = {
        timeStamp: new Date().getTime(),
        event: e
    };
    timeRecordArray.push(tempObj);
  });
  window.addEventListener("ajaxLoadEnd", function(e) {
    // TODO: 找到相同的事件对象
    for (let i = 0; i < timeRecordArray.length; i++) {
      if (timeRecordArray[i].event.detail.status > 0 && e === timeRecordArray[i].event) {
        console.log('找到相同的event了')
        // const currentTime = new Date().getTime();
        // const url = timeRecordArray[i].event.detail.responseURL;
        // const status = timeRecordArray[i].event.detail.status;
        // const statusText = timeRecordArray[i].event.detail.statusText;
        // const loadTime = currentTime - timeRecordArray[i].timeStamp;
        // // 
        // if (!url || url.indexOf(UPLOAD_ADDRESS) != -1) return;
        // const httpLogInfoStart = new HttpLogInfo(
        //     url,
        //     status,
        //     statusText,
        //     "发起请求",
        //     timeRecordArray[i].timeStamp,
        //     0
        // );
        // //httpLogInfoStart.handleLogInfo(HTTP_LOG, httpLogInfoStart);
        // const httpLogInfoEnd = new HttpLogInfo(
        //     url,
        //     status,
        //     statusText,
        //     "请求返回",
        //     currentTime,
        //     loadTime
        // );
        // //httpLogInfoEnd.handleLogInfo(HTTP_LOG, httpLogInfoEnd);
        // // 当前请求成功后就在数组中移除掉
        // timeRecordArray.splice(i, 1);
      }
    }
  });
}
