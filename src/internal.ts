import { getRandomKey, request } from './utils'
import { getDeviceInfo } from './device'
import { JSError, RejError, ResourceError } from './errorCreator'
import { IMessage } from './core'
import config from './config'
import { recordHttpLog } from './replaceXhr'
import { UPLOAD_TYPE } from './messageCreator'
export {
  getRandomKey,
  getDeviceInfo,
  request,
  JSError, RejError, ResourceError,
  config,
  IMessage,
  recordHttpLog,
  UPLOAD_TYPE
}
