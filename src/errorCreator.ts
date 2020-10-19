import { UPLOAD_TYPE } from './internal'

class BaseError {
  public msgType
  constructor(msgType: string) {
    // 错误类型
    this.msgType = msgType
  }
}
// JS错误日志
export class JSError extends BaseError {
  public data
  public errorStack
  constructor (errorMsg: string, errorStack: string) {
    super(UPLOAD_TYPE.JS_ERROR)
    // 错误信息
    this.data = encodeURIComponent(errorMsg)
    // 错误堆栈
    this.errorStack = errorStack;
  }
}

// promise uncatch错误日志
export class RejError extends BaseError {
  public data
  constructor (errorMsg: string) {
    super(UPLOAD_TYPE.REJ_ERROR)
    this.data = encodeURIComponent(errorMsg);
  }
}

// 资源加载错误
export class ResourceError extends BaseError{
  public data
  constructor (type: string, url: string) {
    super(UPLOAD_TYPE.RESOURCE_ERROR)
    this.data = `加载类型${type}\n加载地址:${encodeURIComponent(url)}`
  }

}
