/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var getRandomKey = function (time) {
    if (time === void 0) { time = 1; }
    var getRandomStr = function () {
        return Math.random().toString(32).slice(2, 7);
    };
    var randomStr = '';
    for (var i = 0; i < time; i++) {
        randomStr += getRandomStr();
        i !== time - 1 && (randomStr += '-');
    }
    return randomStr;
};
var request = function (method, url, param, successCallback, failCallback) {
    if (successCallback === void 0) { successCallback = function () { }; }
    if (failCallback === void 0) { failCallback = function () { }; }
    try {
        var xmlHttp_1 = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xmlHttp_1.open(method, url, true);
        xmlHttp_1.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlHttp_1.onreadystatechange = function () {
            if (xmlHttp_1.readyState == 4 && xmlHttp_1.status >= 200 && xmlHttp_1.status < 300) {
                var res = JSON.parse(xmlHttp_1.responseText);
                typeof successCallback == 'function' && successCallback(res);
            }
            else {
                typeof failCallback == 'function' && failCallback();
            }
        };
        xmlHttp_1.send("data=" + JSON.stringify(param));
    }
    catch (error) {
        console.warn(error);
    }
};

var BaseError = (function () {
    function BaseError(msgType) {
        this.msgType = msgType;
    }
    return BaseError;
}());
var JSError = (function (_super) {
    __extends(JSError, _super);
    function JSError(errorMsg, errorStack) {
        var _this = _super.call(this, UPLOAD_TYPE.JS_ERROR) || this;
        _this.data = encodeURIComponent(errorMsg);
        _this.errorStack = errorStack;
        return _this;
    }
    return JSError;
}(BaseError));
var RejError = (function (_super) {
    __extends(RejError, _super);
    function RejError(errorMsg) {
        var _this = _super.call(this, UPLOAD_TYPE.REJ_ERROR) || this;
        _this.data = encodeURIComponent(errorMsg);
        return _this;
    }
    return RejError;
}(BaseError));
var ResourceError = (function (_super) {
    __extends(ResourceError, _super);
    function ResourceError(type, url) {
        var _this = _super.call(this, UPLOAD_TYPE.RESOURCE_ERROR) || this;
        _this.data = "\u52A0\u8F7D\u7C7B\u578B" + type + "\n\u52A0\u8F7D\u5730\u5740:" + encodeURIComponent(url);
        return _this;
    }
    return ResourceError;
}(BaseError));

var config = {
    remoteUrl: 'http://example.com'
};

var recordHttpLog = function () {
    function eventRegister(event) {
        var eve = new CustomEvent(event, {
            detail: this
        });
        window.dispatchEvent(eve);
    }
    var oldXHR = window.XMLHttpRequest;
    var newXHR = function () {
        var realXHR = new oldXHR();
        realXHR.addEventListener("loadstart", function () {
            eventRegister.call(this, "ajaxLoadStart");
        }, false);
        realXHR.addEventListener("loadend", function () {
            eventRegister.call(this, "ajaxLoadEnd");
        }, false);
        return realXHR;
    };
    var timeRecordArray = [];
    window.XMLHttpRequest = newXHR;
    window.addEventListener("ajaxLoadStart", function (e) {
        console.log(e, 'ajaxLoadStart');
        var tempObj = {
            timeStamp: new Date().getTime(),
            event: e
        };
        timeRecordArray.push(tempObj);
    });
    window.addEventListener("ajaxLoadEnd", function (e) {
        for (var i = 0; i < timeRecordArray.length; i++) {
            if (timeRecordArray[i].event.detail.status > 0 && e === timeRecordArray[i].event) {
                console.log('找到相同的event了');
            }
        }
    });
};

var UPLOAD_TYPE;
(function (UPLOAD_TYPE) {
    UPLOAD_TYPE["JS_ERROR"] = "JS_ERROR";
    UPLOAD_TYPE["REJ_ERROR"] = "REJ_ERROR";
    UPLOAD_TYPE["RESOURCE_ERROR"] = "RESOURCE_ERROR";
    UPLOAD_TYPE["HTTP_LOG"] = "HTTP_LOG";
})(UPLOAD_TYPE || (UPLOAD_TYPE = {}));

var BaseMonitorInfo = (function () {
    function BaseMonitorInfo() {
        var _this = this;
        this.projectId = '';
        this.visitorKey = getRandomKey(3);
        this.monitorIp = "";
        this.country = "";
        this.province = "";
        this.city = "";
        this.userId = "";
        this.debug = false;
        this.msgStack = [];
        this.isInit = this.projectId !== '';
        this.pushStack = function (msgObj) {
            msgObj = Object.assign(msgObj, {
                happenTime: new Date().getTime(),
                currentUrl: encodeURIComponent(window.location.href),
                projectId: monitorInstance.getProjectId(),
                visitorKey: monitorInstance.getVisitorKey(),
                userId: monitorInstance.getUserId()
            });
            _this.msgStack.push(msgObj);
        };
        this.start = function () {
            setInterval(function () {
                if (_this.msgStack.length <= 0) {
                    return;
                }
                var stack = _this.msgStack.slice();
                _this.msgStack = [];
                request('get', config.remoteUrl, stack);
            }, 2000);
        };
        this.log = function () {
            var msg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                msg[_i] = arguments[_i];
            }
            if (_this.debug) {
                console.log.apply(console, __spread(msg));
            }
        };
    }
    BaseMonitorInfo.prototype.setUser = function (id) {
        this.userId = id;
    };
    BaseMonitorInfo.prototype.getUserId = function () {
        return this.userId;
    };
    BaseMonitorInfo.prototype.setProjectId = function (id) {
        this.projectId = id;
    };
    BaseMonitorInfo.prototype.getProjectId = function () {
        return this.projectId;
    };
    BaseMonitorInfo.prototype.getVisitorKey = function () {
        return this.visitorKey;
    };
    return BaseMonitorInfo;
}());
var monitorInstance = new BaseMonitorInfo();
var recordJavaScriptError = function () {
    addEventListener('error', function (e) {
        var errorObj = e.error;
        var msgStack = errorObj ? errorObj.stack : null;
        var errorMsg = e.message;
        var typeName = null;
        if (e && e.target != null) {
            typeName = e.target.localName;
        }
        var sourceUrl = "";
        if (!typeName) {
            pushJSError(errorMsg, msgStack);
        }
        else {
            switch (typeName) {
                case 'href':
                    sourceUrl = e.target.href;
                    break;
                case 'script':
                    sourceUrl = e.target.src;
                    break;
                case 'img':
                    sourceUrl = e.target.src;
                    break;
            }
            pushSourceError(typeName, sourceUrl);
        }
    }, true);
    addEventListener('unhandledrejection', function (e) {
        pushRejectError(e.reason);
    }, true);
};
var enhanceError = function (obj) {
    return obj;
};
var pushJSError = function (origin_errorMsg, origin_errorObj) {
    var errorMsg = origin_errorMsg ? origin_errorMsg : '';
    var errorObj = origin_errorObj ? origin_errorObj : '';
    var errorType = "";
    var msgStackStr = "";
    if (errorMsg) {
        msgStackStr = JSON.stringify(errorObj);
        errorType = msgStackStr.split(": ")[0].replace('"', "");
    }
    var jsError = enhanceError(new JSError(errorType + ": " + errorMsg, msgStackStr));
    monitorInstance.log(jsError);
    monitorInstance.pushStack(jsError);
};
var pushRejectError = function (origin_errorMsg) {
    var errorMsg = origin_errorMsg ? origin_errorMsg : '';
    var rejError = enhanceError(new RejError(errorMsg));
    monitorInstance.log(rejError);
    monitorInstance.pushStack(rejError);
};
var pushSourceError = function (resourceType, resourceUrl) {
    var resourceError = enhanceError(new ResourceError(resourceType, resourceUrl));
    monitorInstance.log(resourceError);
    monitorInstance.pushStack(resourceError);
};
function init(projectId, options) {
    monitorInstance.setProjectId(projectId);
    monitorInstance.start();
    if (options.debug) {
        monitorInstance.debug = true;
    }
    recordJavaScriptError();
    recordHttpLog();
}
var setUser = function (id) {
    monitorInstance.setUser(id);
};

export default init;
export { init, setUser };
