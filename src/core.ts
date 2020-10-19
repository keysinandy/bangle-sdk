import { getRandomKey, getDeviceInfo, request, JSError, RejError, ResourceError, config, recordHttpLog } from './internal'

export interface IMessage {
  msgType: string,
  data: any,

}
export interface IEnhanceMessage {
  msgType: string,
  data: any,
  happenTime: number,
  // 当前页面URL
  currentUrl: string
  // 项目id
  projectId: string
  // 游客id
  visitorKey: string
  // 用户id
  userId: string
}
export interface IOption {
  debug?: boolean
}

// 基本信息
class BaseMonitorInfo {
  // this.happenTime = new Date().getTime(); // 日志发生时间
  private projectId = ''    // 用于区分应用的唯一标识（一个项目对应一个）
  // this.simpleUrl =  window.location.href.split('?')[0].replace('#', ''); // 页面的url
  private visitorKey = getRandomKey(3)  // 每一个页面对应一个值，当用户登陆后可覆盖这个值

  // 获取设备信息 userAgent 尝试后端解决
  // private deviceInfo = getDeviceInfo()
  // private engine = this.deviceInfo.engine
  // private engineVs = this.deviceInfo.engineVs
  // private systemName = this.deviceInfo.sys
  // private systemVersion = this.deviceInfo.sysVs
  // private browserName = this.deviceInfo.supporter
  // private browserVersion = this.deviceInfo.supporterVs

  // TODO: 位置信息, 待处理
  private monitorIp = "";  // 用户的IP地址
  private country = "";  // 用户所在国家
  private province = "";  // 用户所在省份
  private city = "";  // 用户所在城市
  // 用户自定义信息， 由开发者主动传入， 便于对线上进行准确定位
  private userId = "";
  public debug = false;
  private msgStack: IMessage[] =  [];

  public setUser(id: string) {
    this.userId = id
  }
  public getUserId() {
    return this.userId
  } 

  public setProjectId(id: string) {
    this.projectId = id
  }

  public getProjectId() {
    return this.projectId
  } 
  public isInit = this.projectId !== ''
  public pushStack = (msgObj: IMessage) => {
    // TODO: 此时，给对象设置属性
    msgObj = Object.assign(msgObj, {
      // 产生时间
      happenTime: new Date().getTime(),
      // 当前页面URL
      currentUrl: encodeURIComponent(window.location.href) ,
      // 项目id
      projectId: monitorInstance.getProjectId(),
      // 游客id
      visitorKey: monitorInstance.getVisitorKey(),
      // 用户id
      userId: monitorInstance.getUserId()
    })
    this.msgStack.push(msgObj)
  }
  public getVisitorKey () {
    return this.visitorKey
  }
  // 设置一个定时器，定时上报信息
  public start = () => {
    setInterval(() => {
      if (this.msgStack.length <= 0) {
        return
      }
      let stack = this.msgStack.slice()
      this.msgStack = []
      request('get', config.remoteUrl, stack)
    }, 2000)
  }

  public log = (...msg: any): void => {
    if (this.debug) {
      console.log(...msg)
    }
  }
}

// 创建他的实例
const monitorInstance = new BaseMonitorInfo()

/**
 * 页面错误监控
 */
const recordJavaScriptError = () => {
  // 对error添加监听
  addEventListener('error', (e) => {
    let errorObj = e.error
    let msgStack = errorObj ? errorObj.stack : null
    let errorMsg = e.message
    let typeName = null
    if (e && e.target != null) {
      typeName = (e.target as any).localName
    }
    let sourceUrl = "";
    if (!typeName) {
      pushJSError(errorMsg, msgStack);
    } else {
      switch (typeName) {
      case 'href':
        sourceUrl = (e.target as any).href
        break;
      case 'script':
        sourceUrl = (e.target as any).src
        break;
      case 'img':
        sourceUrl = (e.target as any).src
        break;
      default:
        break;
      }
      // TODO: css background-img url 无法收集
      pushSourceError(typeName, sourceUrl)
    }
  }, true)

  addEventListener('unhandledrejection', (e) => {
    pushRejectError(e.reason);
  }, true)


}
const enhanceError = (obj: IMessage) => {
  return obj
}

const pushJSError = (origin_errorMsg: string, origin_errorObj: IMessage) => {
  let errorMsg = origin_errorMsg ? origin_errorMsg : '';
  let errorObj = origin_errorObj ? origin_errorObj : '';
  let errorType = "";
  let msgStackStr = ""
  if (errorMsg) {
    msgStackStr = JSON.stringify(errorObj)
    errorType = msgStackStr.split(": ")[0].replace('"', "");
  }
  let jsError = enhanceError(new JSError(errorType + ": " + errorMsg, msgStackStr))
  monitorInstance.log(jsError)
  monitorInstance.pushStack(jsError)
}

const pushRejectError = (origin_errorMsg: string) => {
  let errorMsg = origin_errorMsg ? origin_errorMsg : '';
  let rejError = enhanceError(new RejError(errorMsg));
  monitorInstance.log(rejError)
  monitorInstance.pushStack(rejError)
}

const pushSourceError = (resourceType: string, resourceUrl: string) => {
  let resourceError = enhanceError(new ResourceError(resourceType, resourceUrl))
  monitorInstance.log(resourceError)
  monitorInstance.pushStack(resourceError)
}
/**
 * 初始化方法，传入projectId
 * @param {*} projectId
 * @param {*} options
 * debug-boolean
 */
export function init(projectId: string, options: IOption) {
  monitorInstance.setProjectId(projectId)
  monitorInstance.start()
  if (options.debug) {
    monitorInstance.debug = true
  }
  // 记录js错误
  recordJavaScriptError()
  // 记录http
  recordHttpLog()
}

/**
 * 设置用户唯一id，在登陆时使用
 * @param {*} id
 */
export const setUser = (id: string) => {
  monitorInstance.setUser(id)
}
