/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 923:
/***/ (function() {



// @ts-ignore
try {
  self['workbox:core:6.5.3'] && _();
} catch (e) {}

/***/ }),

/***/ 190:
/***/ (function() {



// @ts-ignore
try {
  self['workbox:expiration:6.5.3'] && _();
} catch (e) {}

/***/ }),

/***/ 437:
/***/ (function() {



// @ts-ignore
try {
  self['workbox:precaching:6.5.3'] && _();
} catch (e) {}

/***/ }),

/***/ 185:
/***/ (function() {



// @ts-ignore
try {
  self['workbox:routing:6.5.3'] && _();
} catch (e) {}

/***/ }),

/***/ 833:
/***/ (function() {



// @ts-ignore
try {
  self['workbox:strategies:6.5.3'] && _();
} catch (e) {}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {

// EXTERNAL MODULE: ./node_modules/workbox-core/_version.js
var _version = __webpack_require__(923);
;// CONCATENATED MODULE: ./node_modules/workbox-core/_private/logger.js

/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

var logger_logger =  true ? null : 0;

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js

function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js


function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function createClass_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function classCallCheck_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js


function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createSuper.js



function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/isNativeFunction.js
function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/construct.js


function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct.bind();
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js




function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;
  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;
    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);
      _cache.set(Class, Wrapper);
    }
    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };
  return _wrapNativeSuper(Class);
}
;// CONCATENATED MODULE: ./node_modules/workbox-core/models/messages/messages.js
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

var messages_messages = {
  'invalid-value': function invalidValue(_ref) {
    var paramName = _ref.paramName,
      validValueDescription = _ref.validValueDescription,
      value = _ref.value;
    if (!paramName || !validValueDescription) {
      throw new Error("Unexpected input to 'invalid-value' error.");
    }
    return "The '".concat(paramName, "' parameter was given a value with an ") + "unexpected value. ".concat(validValueDescription, " Received a value of ") + "".concat(JSON.stringify(value), ".");
  },
  'not-an-array': function notAnArray(_ref2) {
    var moduleName = _ref2.moduleName,
      className = _ref2.className,
      funcName = _ref2.funcName,
      paramName = _ref2.paramName;
    if (!moduleName || !className || !funcName || !paramName) {
      throw new Error("Unexpected input to 'not-an-array' error.");
    }
    return "The parameter '".concat(paramName, "' passed into ") + "'".concat(moduleName, ".").concat(className, ".").concat(funcName, "()' must be an array.");
  },
  'incorrect-type': function incorrectType(_ref3) {
    var expectedType = _ref3.expectedType,
      paramName = _ref3.paramName,
      moduleName = _ref3.moduleName,
      className = _ref3.className,
      funcName = _ref3.funcName;
    if (!expectedType || !paramName || !moduleName || !funcName) {
      throw new Error("Unexpected input to 'incorrect-type' error.");
    }
    var classNameStr = className ? "".concat(className, ".") : '';
    return "The parameter '".concat(paramName, "' passed into ") + "'".concat(moduleName, ".").concat(classNameStr) + "".concat(funcName, "()' must be of type ").concat(expectedType, ".");
  },
  'incorrect-class': function incorrectClass(_ref4) {
    var expectedClassName = _ref4.expectedClassName,
      paramName = _ref4.paramName,
      moduleName = _ref4.moduleName,
      className = _ref4.className,
      funcName = _ref4.funcName,
      isReturnValueProblem = _ref4.isReturnValueProblem;
    if (!expectedClassName || !moduleName || !funcName) {
      throw new Error("Unexpected input to 'incorrect-class' error.");
    }
    var classNameStr = className ? "".concat(className, ".") : '';
    if (isReturnValueProblem) {
      return "The return value from " + "'".concat(moduleName, ".").concat(classNameStr).concat(funcName, "()' ") + "must be an instance of class ".concat(expectedClassName, ".");
    }
    return "The parameter '".concat(paramName, "' passed into ") + "'".concat(moduleName, ".").concat(classNameStr).concat(funcName, "()' ") + "must be an instance of class ".concat(expectedClassName, ".");
  },
  'missing-a-method': function missingAMethod(_ref5) {
    var expectedMethod = _ref5.expectedMethod,
      paramName = _ref5.paramName,
      moduleName = _ref5.moduleName,
      className = _ref5.className,
      funcName = _ref5.funcName;
    if (!expectedMethod || !paramName || !moduleName || !className || !funcName) {
      throw new Error("Unexpected input to 'missing-a-method' error.");
    }
    return "".concat(moduleName, ".").concat(className, ".").concat(funcName, "() expected the ") + "'".concat(paramName, "' parameter to expose a '").concat(expectedMethod, "' method.");
  },
  'add-to-cache-list-unexpected-type': function addToCacheListUnexpectedType(_ref6) {
    var entry = _ref6.entry;
    return "An unexpected entry was passed to " + "'workbox-precaching.PrecacheController.addToCacheList()' The entry " + "'".concat(JSON.stringify(entry), "' isn't supported. You must supply an array of ") + "strings with one or more characters, objects with a url property or " + "Request objects.";
  },
  'add-to-cache-list-conflicting-entries': function addToCacheListConflictingEntries(_ref7) {
    var firstEntry = _ref7.firstEntry,
      secondEntry = _ref7.secondEntry;
    if (!firstEntry || !secondEntry) {
      throw new Error("Unexpected input to " + "'add-to-cache-list-duplicate-entries' error.");
    }
    return "Two of the entries passed to " + "'workbox-precaching.PrecacheController.addToCacheList()' had the URL " + "".concat(firstEntry, " but different revision details. Workbox is ") + "unable to cache and version the asset correctly. Please remove one " + "of the entries.";
  },
  'plugin-error-request-will-fetch': function pluginErrorRequestWillFetch(_ref8) {
    var thrownErrorMessage = _ref8.thrownErrorMessage;
    if (!thrownErrorMessage) {
      throw new Error("Unexpected input to " + "'plugin-error-request-will-fetch', error.");
    }
    return "An error was thrown by a plugins 'requestWillFetch()' method. " + "The thrown error message was: '".concat(thrownErrorMessage, "'.");
  },
  'invalid-cache-name': function invalidCacheName(_ref9) {
    var cacheNameId = _ref9.cacheNameId,
      value = _ref9.value;
    if (!cacheNameId) {
      throw new Error("Expected a 'cacheNameId' for error 'invalid-cache-name'");
    }
    return "You must provide a name containing at least one character for " + "setCacheDetails({".concat(cacheNameId, ": '...'}). Received a value of ") + "'".concat(JSON.stringify(value), "'");
  },
  'unregister-route-but-not-found-with-method': function unregisterRouteButNotFoundWithMethod(_ref10) {
    var method = _ref10.method;
    if (!method) {
      throw new Error("Unexpected input to " + "'unregister-route-but-not-found-with-method' error.");
    }
    return "The route you're trying to unregister was not  previously " + "registered for the method type '".concat(method, "'.");
  },
  'unregister-route-route-not-registered': function unregisterRouteRouteNotRegistered() {
    return "The route you're trying to unregister was not previously " + "registered.";
  },
  'queue-replay-failed': function queueReplayFailed(_ref11) {
    var name = _ref11.name;
    return "Replaying the background sync queue '".concat(name, "' failed.");
  },
  'duplicate-queue-name': function duplicateQueueName(_ref12) {
    var name = _ref12.name;
    return "The Queue name '".concat(name, "' is already being used. ") + "All instances of backgroundSync.Queue must be given unique names.";
  },
  'expired-test-without-max-age': function expiredTestWithoutMaxAge(_ref13) {
    var methodName = _ref13.methodName,
      paramName = _ref13.paramName;
    return "The '".concat(methodName, "()' method can only be used when the ") + "'".concat(paramName, "' is used in the constructor.");
  },
  'unsupported-route-type': function unsupportedRouteType(_ref14) {
    var moduleName = _ref14.moduleName,
      className = _ref14.className,
      funcName = _ref14.funcName,
      paramName = _ref14.paramName;
    return "The supplied '".concat(paramName, "' parameter was an unsupported type. ") + "Please check the docs for ".concat(moduleName, ".").concat(className, ".").concat(funcName, " for ") + "valid input types.";
  },
  'not-array-of-class': function notArrayOfClass(_ref15) {
    var value = _ref15.value,
      expectedClass = _ref15.expectedClass,
      moduleName = _ref15.moduleName,
      className = _ref15.className,
      funcName = _ref15.funcName,
      paramName = _ref15.paramName;
    return "The supplied '".concat(paramName, "' parameter must be an array of ") + "'".concat(expectedClass, "' objects. Received '").concat(JSON.stringify(value), ",'. ") + "Please check the call to ".concat(moduleName, ".").concat(className, ".").concat(funcName, "() ") + "to fix the issue.";
  },
  'max-entries-or-age-required': function maxEntriesOrAgeRequired(_ref16) {
    var moduleName = _ref16.moduleName,
      className = _ref16.className,
      funcName = _ref16.funcName;
    return "You must define either config.maxEntries or config.maxAgeSeconds" + "in ".concat(moduleName, ".").concat(className, ".").concat(funcName);
  },
  'statuses-or-headers-required': function statusesOrHeadersRequired(_ref17) {
    var moduleName = _ref17.moduleName,
      className = _ref17.className,
      funcName = _ref17.funcName;
    return "You must define either config.statuses or config.headers" + "in ".concat(moduleName, ".").concat(className, ".").concat(funcName);
  },
  'invalid-string': function invalidString(_ref18) {
    var moduleName = _ref18.moduleName,
      funcName = _ref18.funcName,
      paramName = _ref18.paramName;
    if (!paramName || !moduleName || !funcName) {
      throw new Error("Unexpected input to 'invalid-string' error.");
    }
    return "When using strings, the '".concat(paramName, "' parameter must start with ") + "'http' (for cross-origin matches) or '/' (for same-origin matches). " + "Please see the docs for ".concat(moduleName, ".").concat(funcName, "() for ") + "more info.";
  },
  'channel-name-required': function channelNameRequired() {
    return "You must provide a channelName to construct a " + "BroadcastCacheUpdate instance.";
  },
  'invalid-responses-are-same-args': function invalidResponsesAreSameArgs() {
    return "The arguments passed into responsesAreSame() appear to be " + "invalid. Please ensure valid Responses are used.";
  },
  'expire-custom-caches-only': function expireCustomCachesOnly() {
    return "You must provide a 'cacheName' property when using the " + "expiration plugin with a runtime caching strategy.";
  },
  'unit-must-be-bytes': function unitMustBeBytes(_ref19) {
    var normalizedRangeHeader = _ref19.normalizedRangeHeader;
    if (!normalizedRangeHeader) {
      throw new Error("Unexpected input to 'unit-must-be-bytes' error.");
    }
    return "The 'unit' portion of the Range header must be set to 'bytes'. " + "The Range header provided was \"".concat(normalizedRangeHeader, "\"");
  },
  'single-range-only': function singleRangeOnly(_ref20) {
    var normalizedRangeHeader = _ref20.normalizedRangeHeader;
    if (!normalizedRangeHeader) {
      throw new Error("Unexpected input to 'single-range-only' error.");
    }
    return "Multiple ranges are not supported. Please use a  single start " + "value, and optional end value. The Range header provided was " + "\"".concat(normalizedRangeHeader, "\"");
  },
  'invalid-range-values': function invalidRangeValues(_ref21) {
    var normalizedRangeHeader = _ref21.normalizedRangeHeader;
    if (!normalizedRangeHeader) {
      throw new Error("Unexpected input to 'invalid-range-values' error.");
    }
    return "The Range header is missing both start and end values. At least " + "one of those values is needed. The Range header provided was " + "\"".concat(normalizedRangeHeader, "\"");
  },
  'no-range-header': function noRangeHeader() {
    return "No Range header was found in the Request provided.";
  },
  'range-not-satisfiable': function rangeNotSatisfiable(_ref22) {
    var size = _ref22.size,
      start = _ref22.start,
      end = _ref22.end;
    return "The start (".concat(start, ") and end (").concat(end, ") values in the Range are ") + "not satisfiable by the cached response, which is ".concat(size, " bytes.");
  },
  'attempt-to-cache-non-get-request': function attemptToCacheNonGetRequest(_ref23) {
    var url = _ref23.url,
      method = _ref23.method;
    return "Unable to cache '".concat(url, "' because it is a '").concat(method, "' request and ") + "only 'GET' requests can be cached.";
  },
  'cache-put-with-no-response': function cachePutWithNoResponse(_ref24) {
    var url = _ref24.url;
    return "There was an attempt to cache '".concat(url, "' but the response was not ") + "defined.";
  },
  'no-response': function noResponse(_ref25) {
    var url = _ref25.url,
      error = _ref25.error;
    var message = "The strategy could not generate a response for '".concat(url, "'.");
    if (error) {
      message += " The underlying error is ".concat(error, ".");
    }
    return message;
  },
  'bad-precaching-response': function badPrecachingResponse(_ref26) {
    var url = _ref26.url,
      status = _ref26.status;
    return "The precaching request for '".concat(url, "' failed") + (status ? " with an HTTP status of ".concat(status, ".") : ".");
  },
  'non-precached-url': function nonPrecachedUrl(_ref27) {
    var url = _ref27.url;
    return "createHandlerBoundToURL('".concat(url, "') was called, but that URL is ") + "not precached. Please pass in a URL that is precached instead.";
  },
  'add-to-cache-list-conflicting-integrities': function addToCacheListConflictingIntegrities(_ref28) {
    var url = _ref28.url;
    return "Two of the entries passed to " + "'workbox-precaching.PrecacheController.addToCacheList()' had the URL " + "".concat(url, " with different integrity values. Please remove one of them.");
  },
  'missing-precache-entry': function missingPrecacheEntry(_ref29) {
    var cacheName = _ref29.cacheName,
      url = _ref29.url;
    return "Unable to find a precached response in ".concat(cacheName, " for ").concat(url, ".");
  },
  'cross-origin-copy-response': function crossOriginCopyResponse(_ref30) {
    var origin = _ref30.origin;
    return "workbox-core.copyResponse() can only be used with same-origin " + "responses. It was passed a response with origin ".concat(origin, ".");
  },
  'opaque-streams-source': function opaqueStreamsSource(_ref31) {
    var type = _ref31.type;
    var message = "One of the workbox-streams sources resulted in an " + "'".concat(type, "' response.");
    if (type === 'opaqueredirect') {
      return "".concat(message, " Please do not use a navigation request that results ") + "in a redirect as a source.";
    }
    return "".concat(message, " Please ensure your sources are CORS-enabled.");
  }
};
;// CONCATENATED MODULE: ./node_modules/workbox-core/models/messages/messageGenerator.js
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


var fallback = function fallback(code) {
  var msg = code;
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  if (args.length > 0) {
    msg += " :: ".concat(JSON.stringify(args));
  }
  return msg;
};
var generatorFunction = function generatorFunction(code) {
  var details = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var message = messages[code];
  if (!message) {
    throw new Error("Unable to find message for code '".concat(code, "'."));
  }
  return message(details);
};
var messageGenerator =  true ? fallback : 0;
;// CONCATENATED MODULE: ./node_modules/workbox-core/_private/WorkboxError.js





/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


/**
 * Workbox errors should be thrown with this class.
 * This allows use to ensure the type easily in tests,
 * helps developers identify errors from workbox
 * easily and allows use to optimise error
 * messages correctly.
 *
 * @private
 */
var WorkboxError_WorkboxError = /*#__PURE__*/function (_Error) {
  _inherits(WorkboxError, _Error);
  var _super = _createSuper(WorkboxError);
  /**
   *
   * @param {string} errorCode The error code that
   * identifies this particular error.
   * @param {Object=} details Any relevant arguments
   * that will help developers identify issues should
   * be added as a key on the context object.
   */
  function WorkboxError(errorCode, details) {
    var _this;
    classCallCheck_classCallCheck(this, WorkboxError);
    var message = messageGenerator(errorCode, details);
    _this = _super.call(this, message);
    _this.name = errorCode;
    _this.details = details;
    return _this;
  }
  return createClass_createClass(WorkboxError);
}( /*#__PURE__*/_wrapNativeSuper(Error));

;// CONCATENATED MODULE: ./node_modules/workbox-core/_private/assert.js

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


/*
 * This method throws if the supplied value is not an array.
 * The destructed values are required to produce a meaningful error for users.
 * The destructed and restructured object is so it's clear what is
 * needed.
 */
var isArray = function isArray(value, details) {
  if (!Array.isArray(value)) {
    throw new WorkboxError('not-an-array', details);
  }
};
var hasMethod = function hasMethod(object, expectedMethod, details) {
  var type = typeof object[expectedMethod];
  if (type !== 'function') {
    details['expectedMethod'] = expectedMethod;
    throw new WorkboxError('missing-a-method', details);
  }
};
var isType = function isType(object, expectedType, details) {
  if (typeof object !== expectedType) {
    details['expectedType'] = expectedType;
    throw new WorkboxError('incorrect-type', details);
  }
};
var isInstance = function isInstance(object,
// Need the general type to do the check later.
// eslint-disable-next-line @typescript-eslint/ban-types
expectedClass, details) {
  if (!(object instanceof expectedClass)) {
    details['expectedClassName'] = expectedClass.name;
    throw new WorkboxError('incorrect-class', details);
  }
};
var isOneOf = function isOneOf(value, validValues, details) {
  if (!validValues.includes(value)) {
    details['validValueDescription'] = "Valid values are ".concat(JSON.stringify(validValues), ".");
    throw new WorkboxError('invalid-value', details);
  }
};
var isArrayOfClass = function isArrayOfClass(value,
// Need general type to do check later.
expectedClass,
// eslint-disable-line
details) {
  var error = new WorkboxError('not-array-of-class', details);
  if (!Array.isArray(value)) {
    throw error;
  }
  var _iterator = _createForOfIteratorHelper(value),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var item = _step.value;
      if (!(item instanceof expectedClass)) {
        throw error;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};
var finalAssertExports =  true ? null : 0;

;// CONCATENATED MODULE: ./node_modules/workbox-core/models/quotaErrorCallbacks.js
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

// Callbacks to be executed whenever there's a quota error.
// Can't change Function type right now.
// eslint-disable-next-line @typescript-eslint/ban-types
var quotaErrorCallbacks = new Set();

;// CONCATENATED MODULE: ./node_modules/workbox-core/registerQuotaErrorCallback.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




/**
 * Adds a function to the set of quotaErrorCallbacks that will be executed if
 * there's a quota error.
 *
 * @param {Function} callback
 * @memberof workbox-core
 */
// Can't change Function type
// eslint-disable-next-line @typescript-eslint/ban-types
function registerQuotaErrorCallback(callback) {
  if (false) {}
  quotaErrorCallbacks.add(callback);
  if (false) {}
}

;// CONCATENATED MODULE: ./node_modules/workbox-core/_private/cacheNames.js
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

var _cacheNameDetails = {
  googleAnalytics: 'googleAnalytics',
  precache: 'precache-v2',
  prefix: 'workbox',
  runtime: 'runtime',
  suffix: typeof registration !== 'undefined' ? registration.scope : ''
};
var _createCacheName = function _createCacheName(cacheName) {
  return [_cacheNameDetails.prefix, cacheName, _cacheNameDetails.suffix].filter(function (value) {
    return value && value.length > 0;
  }).join('-');
};
var eachCacheNameDetail = function eachCacheNameDetail(fn) {
  for (var _i = 0, _Object$keys = Object.keys(_cacheNameDetails); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];
    fn(key);
  }
};
var cacheNames_cacheNames = {
  updateDetails: function updateDetails(details) {
    eachCacheNameDetail(function (key) {
      if (typeof details[key] === 'string') {
        _cacheNameDetails[key] = details[key];
      }
    });
  },
  getGoogleAnalyticsName: function getGoogleAnalyticsName(userCacheName) {
    return userCacheName || _createCacheName(_cacheNameDetails.googleAnalytics);
  },
  getPrecacheName: function getPrecacheName(userCacheName) {
    return userCacheName || _createCacheName(_cacheNameDetails.precache);
  },
  getPrefix: function getPrefix() {
    return _cacheNameDetails.prefix;
  },
  getRuntimeName: function getRuntimeName(userCacheName) {
    return userCacheName || _createCacheName(_cacheNameDetails.runtime);
  },
  getSuffix: function getSuffix() {
    return _cacheNameDetails.suffix;
  }
};
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/regeneratorRuntime.js

function regeneratorRuntime_regeneratorRuntime() {
  "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  regeneratorRuntime_regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  };
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function asyncToGenerator_asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createForOfIteratorHelper.js

function createForOfIteratorHelper_createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}
;// CONCATENATED MODULE: ./node_modules/workbox-core/_private/cacheMatchIgnoreParams.js



/*
  Copyright 2020 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

function stripParams(fullURL, ignoreParams) {
  var strippedURL = new URL(fullURL);
  var _iterator = createForOfIteratorHelper_createForOfIteratorHelper(ignoreParams),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var param = _step.value;
      strippedURL.searchParams.delete(param);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return strippedURL.href;
}
/**
 * Matches an item in the cache, ignoring specific URL params. This is similar
 * to the `ignoreSearch` option, but it allows you to ignore just specific
 * params (while continuing to match on the others).
 *
 * @private
 * @param {Cache} cache
 * @param {Request} request
 * @param {Object} matchOptions
 * @param {Array<string>} ignoreParams
 * @return {Promise<Response|undefined>}
 */
function cacheMatchIgnoreParams(_x, _x2, _x3, _x4) {
  return _cacheMatchIgnoreParams.apply(this, arguments);
}
function _cacheMatchIgnoreParams() {
  _cacheMatchIgnoreParams = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee(cache, request, ignoreParams, matchOptions) {
    var strippedRequestURL, keysOptions, cacheKeys, _iterator2, _step2, cacheKey, strippedCacheKeyURL;
    return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          strippedRequestURL = stripParams(request.url, ignoreParams); // If the request doesn't include any ignored params, match as normal.
          if (!(request.url === strippedRequestURL)) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", cache.match(request, matchOptions));
        case 3:
          // Otherwise, match by comparing keys
          keysOptions = Object.assign(Object.assign({}, matchOptions), {
            ignoreSearch: true
          });
          _context.next = 6;
          return cache.keys(request, keysOptions);
        case 6:
          cacheKeys = _context.sent;
          _iterator2 = createForOfIteratorHelper_createForOfIteratorHelper(cacheKeys);
          _context.prev = 8;
          _iterator2.s();
        case 10:
          if ((_step2 = _iterator2.n()).done) {
            _context.next = 17;
            break;
          }
          cacheKey = _step2.value;
          strippedCacheKeyURL = stripParams(cacheKey.url, ignoreParams);
          if (!(strippedRequestURL === strippedCacheKeyURL)) {
            _context.next = 15;
            break;
          }
          return _context.abrupt("return", cache.match(cacheKey, matchOptions));
        case 15:
          _context.next = 10;
          break;
        case 17:
          _context.next = 22;
          break;
        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](8);
          _iterator2.e(_context.t0);
        case 22:
          _context.prev = 22;
          _iterator2.f();
          return _context.finish(22);
        case 25:
          return _context.abrupt("return");
        case 26:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[8, 19, 22, 25]]);
  }));
  return _cacheMatchIgnoreParams.apply(this, arguments);
}

;// CONCATENATED MODULE: ./node_modules/workbox-core/_private/canConstructReadableStream.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

var supportStatus;
/**
 * A utility function that determines whether the current browser supports
 * constructing a [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/ReadableStream)
 * object.
 *
 * @return {boolean} `true`, if the current browser can successfully
 *     construct a `ReadableStream`, `false` otherwise.
 *
 * @private
 */
function canConstructReadableStream() {
  if (supportStatus === undefined) {
    // See https://github.com/GoogleChrome/workbox/issues/1473
    try {
      new ReadableStream({
        start: function start() {}
      });
      supportStatus = true;
    } catch (error) {
      supportStatus = false;
    }
  }
  return supportStatus;
}

;// CONCATENATED MODULE: ./node_modules/workbox-core/_private/canConstructResponseFromBodyStream.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

var canConstructResponseFromBodyStream_supportStatus;
/**
 * A utility function that determines whether the current browser supports
 * constructing a new `Response` from a `response.body` stream.
 *
 * @return {boolean} `true`, if the current browser can successfully
 *     construct a `Response` from a `response.body` stream, `false` otherwise.
 *
 * @private
 */
function canConstructResponseFromBodyStream() {
  if (canConstructResponseFromBodyStream_supportStatus === undefined) {
    var testResponse = new Response('');
    if ('body' in testResponse) {
      try {
        new Response(testResponse.body);
        canConstructResponseFromBodyStream_supportStatus = true;
      } catch (error) {
        canConstructResponseFromBodyStream_supportStatus = false;
      }
    }
    canConstructResponseFromBodyStream_supportStatus = false;
  }
  return canConstructResponseFromBodyStream_supportStatus;
}

;// CONCATENATED MODULE: ./node_modules/workbox-core/_private/dontWaitFor.js
/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/**
 * A helper function that prevents a promise from being flagged as unused.
 *
 * @private
 **/
function dontWaitFor(promise) {
  // Effective no-op.
  void promise.then(function () {});
}
;// CONCATENATED MODULE: ./node_modules/workbox-core/_private/Deferred.js


/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/**
 * The Deferred class composes Promises in a way that allows for them to be
 * resolved or rejected from outside the constructor. In most cases promises
 * should be used directly, but Deferreds can be necessary when the logic to
 * resolve a promise must be separate.
 *
 * @private
 */
var Deferred = /*#__PURE__*/createClass_createClass(
/**
 * Creates a promise and exposes its resolve and reject functions as methods.
 */
function Deferred() {
  var _this = this;
  classCallCheck_classCallCheck(this, Deferred);
  this.promise = new Promise(function (resolve, reject) {
    _this.resolve = resolve;
    _this.reject = reject;
  });
});

;// CONCATENATED MODULE: ./node_modules/workbox-core/_private/executeQuotaErrorCallbacks.js



/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/



/**
 * Runs all of the callback functions, one at a time sequentially, in the order
 * in which they were registered.
 *
 * @memberof workbox-core
 * @private
 */
function executeQuotaErrorCallbacks() {
  return _executeQuotaErrorCallbacks.apply(this, arguments);
}
function _executeQuotaErrorCallbacks() {
  _executeQuotaErrorCallbacks = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee() {
    var _iterator, _step, callback;
    return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (false) {}
          _iterator = createForOfIteratorHelper_createForOfIteratorHelper(quotaErrorCallbacks);
          _context.prev = 2;
          _iterator.s();
        case 4:
          if ((_step = _iterator.n()).done) {
            _context.next = 11;
            break;
          }
          callback = _step.value;
          _context.next = 8;
          return callback();
        case 8:
          if (false) {}
        case 9:
          _context.next = 4;
          break;
        case 11:
          _context.next = 16;
          break;
        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](2);
          _iterator.e(_context.t0);
        case 16:
          _context.prev = 16;
          _iterator.f();
          return _context.finish(16);
        case 19:
          if (false) {}
        case 20:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[2, 13, 16, 19]]);
  }));
  return _executeQuotaErrorCallbacks.apply(this, arguments);
}

;// CONCATENATED MODULE: ./node_modules/workbox-core/_private/getFriendlyURL.js
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

var getFriendlyURL = function getFriendlyURL(url) {
  var urlObj = new URL(String(url), location.href);
  // See https://github.com/GoogleChrome/workbox/issues/2323
  // We want to include everything, except for the origin if it's same-origin.
  return urlObj.href.replace(new RegExp("^".concat(location.origin)), '');
};

;// CONCATENATED MODULE: ./node_modules/workbox-core/_private/timeout.js
/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/**
 * Returns a promise that resolves and the passed number of milliseconds.
 * This utility is an async/await-friendly version of `setTimeout`.
 *
 * @param {number} ms
 * @return {Promise}
 * @private
 */
function timeout_timeout(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}
;// CONCATENATED MODULE: ./node_modules/workbox-core/_private/resultingClientExists.js


/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


var MAX_RETRY_TIME = 2000;
/**
 * Returns a promise that resolves to a window client matching the passed
 * `resultingClientId`. For browsers that don't support `resultingClientId`
 * or if waiting for the resulting client to apper takes too long, resolve to
 * `undefined`.
 *
 * @param {string} [resultingClientId]
 * @return {Promise<Client|undefined>}
 * @private
 */
function resultingClientExists(_x) {
  return _resultingClientExists.apply(this, arguments);
}
function _resultingClientExists() {
  _resultingClientExists = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(resultingClientId) {
    var existingWindows, existingWindowIds, resultingWindow, startTime;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (resultingClientId) {
            _context.next = 2;
            break;
          }
          return _context.abrupt("return");
        case 2:
          _context.next = 4;
          return self.clients.matchAll({
            type: 'window'
          });
        case 4:
          existingWindows = _context.sent;
          existingWindowIds = new Set(existingWindows.map(function (w) {
            return w.id;
          }));
          startTime = performance.now(); // Only wait up to `MAX_RETRY_TIME` to find a matching client.
        case 7:
          if (!(performance.now() - startTime < MAX_RETRY_TIME)) {
            _context.next = 18;
            break;
          }
          _context.next = 10;
          return self.clients.matchAll({
            type: 'window'
          });
        case 10:
          existingWindows = _context.sent;
          resultingWindow = existingWindows.find(function (w) {
            if (resultingClientId) {
              // If we have a `resultingClientId`, we can match on that.
              return w.id === resultingClientId;
            } else {
              // Otherwise match on finding a window not in `existingWindowIds`.
              return !existingWindowIds.has(w.id);
            }
          });
          if (!resultingWindow) {
            _context.next = 14;
            break;
          }
          return _context.abrupt("break", 18);
        case 14:
          _context.next = 16;
          return timeout(100);
        case 16:
          _context.next = 7;
          break;
        case 18:
          return _context.abrupt("return", resultingWindow);
        case 19:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _resultingClientExists.apply(this, arguments);
}
;// CONCATENATED MODULE: ./node_modules/workbox-core/_private/waitUntil.js
/*
  Copyright 2020 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/**
 * A utility method that makes it easier to use `event.waitUntil` with
 * async functions and return the result.
 *
 * @param {ExtendableEvent} event
 * @param {Function} asyncFn
 * @return {Function}
 * @private
 */
function waitUntil(event, asyncFn) {
  var returnPromise = asyncFn();
  event.waitUntil(returnPromise);
  return returnPromise;
}

;// CONCATENATED MODULE: ./node_modules/workbox-core/_private.js
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
// We either expose defaults or we expose every named export.
















;// CONCATENATED MODULE: ./node_modules/workbox-core/cacheNames.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


/**
 * Get the current cache names and prefix/suffix used by Workbox.
 *
 * `cacheNames.precache` is used for precached assets,
 * `cacheNames.googleAnalytics` is used by `workbox-google-analytics` to
 * store `analytics.js`, and `cacheNames.runtime` is used for everything else.
 *
 * `cacheNames.prefix` can be used to retrieve just the current prefix value.
 * `cacheNames.suffix` can be used to retrieve just the current suffix value.
 *
 * @return {Object} An object with `precache`, `runtime`, `prefix`, and
 *     `googleAnalytics` properties.
 *
 * @memberof workbox-core
 */
var workbox_core_cacheNames_cacheNames = {
  get googleAnalytics() {
    return cacheNames_cacheNames.getGoogleAnalyticsName();
  },
  get precache() {
    return cacheNames_cacheNames.getPrecacheName();
  },
  get prefix() {
    return cacheNames_cacheNames.getPrefix();
  },
  get runtime() {
    return cacheNames_cacheNames.getRuntimeName();
  },
  get suffix() {
    return cacheNames_cacheNames.getSuffix();
  }
};

;// CONCATENATED MODULE: ./node_modules/workbox-core/copyResponse.js


/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/



/**
 * Allows developers to copy a response and modify its `headers`, `status`,
 * or `statusText` values (the values settable via a
 * [`ResponseInit`]{@link https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#Syntax}
 * object in the constructor).
 * To modify these values, pass a function as the second argument. That
 * function will be invoked with a single object with the response properties
 * `{headers, status, statusText}`. The return value of this function will
 * be used as the `ResponseInit` for the new `Response`. To change the values
 * either modify the passed parameter(s) and return it, or return a totally
 * new object.
 *
 * This method is intentionally limited to same-origin responses, regardless of
 * whether CORS was used or not.
 *
 * @param {Response} response
 * @param {Function} modifier
 * @memberof workbox-core
 */
function copyResponse(_x, _x2) {
  return _copyResponse.apply(this, arguments);
}
function _copyResponse() {
  _copyResponse = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee(response, modifier) {
    var origin, responseURL, clonedResponse, responseInit, modifiedResponseInit, body;
    return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          origin = null; // If response.url isn't set, assume it's cross-origin and keep origin null.
          if (response.url) {
            responseURL = new URL(response.url);
            origin = responseURL.origin;
          }
          if (!(origin !== self.location.origin)) {
            _context.next = 4;
            break;
          }
          throw new WorkboxError_WorkboxError('cross-origin-copy-response', {
            origin: origin
          });
        case 4:
          clonedResponse = response.clone(); // Create a fresh `ResponseInit` object by cloning the headers.
          responseInit = {
            headers: new Headers(clonedResponse.headers),
            status: clonedResponse.status,
            statusText: clonedResponse.statusText
          }; // Apply any user modifications.
          modifiedResponseInit = modifier ? modifier(responseInit) : responseInit; // Create the new response from the body stream and `ResponseInit`
          // modifications. Note: not all browsers support the Response.body stream,
          // so fall back to reading the entire body into memory as a blob.
          if (!canConstructResponseFromBodyStream()) {
            _context.next = 11;
            break;
          }
          _context.t0 = clonedResponse.body;
          _context.next = 14;
          break;
        case 11:
          _context.next = 13;
          return clonedResponse.blob();
        case 13:
          _context.t0 = _context.sent;
        case 14:
          body = _context.t0;
          return _context.abrupt("return", new Response(body, modifiedResponseInit));
        case 16:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _copyResponse.apply(this, arguments);
}

;// CONCATENATED MODULE: ./node_modules/workbox-core/clientsClaim.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/**
 * Claim any currently available clients once the service worker
 * becomes active. This is normally used in conjunction with `skipWaiting()`.
 *
 * @memberof workbox-core
 */
function clientsClaim() {
  self.addEventListener('activate', function () {
    return self.clients.claim();
  });
}

;// CONCATENATED MODULE: ./node_modules/workbox-core/setCacheNameDetails.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




/**
 * Modifies the default cache names used by the Workbox packages.
 * Cache names are generated as `<prefix>-<Cache Name>-<suffix>`.
 *
 * @param {Object} details
 * @param {Object} [details.prefix] The string to add to the beginning of
 *     the precache and runtime cache names.
 * @param {Object} [details.suffix] The string to add to the end of
 *     the precache and runtime cache names.
 * @param {Object} [details.precache] The cache name to use for precache
 *     caching.
 * @param {Object} [details.runtime] The cache name to use for runtime caching.
 * @param {Object} [details.googleAnalytics] The cache name to use for
 *     `workbox-google-analytics` caching.
 *
 * @memberof workbox-core
 */
function setCacheNameDetails(details) {
  if (false) {}
  cacheNames.updateDetails(details);
}

;// CONCATENATED MODULE: ./node_modules/workbox-core/skipWaiting.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


/**
 * This method is deprecated, and will be removed in Workbox v7.
 *
 * Calling self.skipWaiting() is equivalent, and should be used instead.
 *
 * @memberof workbox-core
 */
function skipWaiting() {
  // Just call self.skipWaiting() directly.
  // See https://github.com/GoogleChrome/workbox/issues/2525
  if (false) {}
  void self.skipWaiting();
}

;// CONCATENATED MODULE: ./node_modules/workbox-core/types.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

;// CONCATENATED MODULE: ./node_modules/workbox-core/index.js
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/








/**
 * All of the Workbox service worker libraries use workbox-core for shared
 * code as well as setting default values that need to be shared (like cache
 * names).
 *
 * @module workbox-core
 */


;// CONCATENATED MODULE: ./node_modules/workbox-core/index.mjs

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
;// CONCATENATED MODULE: ./node_modules/idb/build/wrap-idb-value.js
var instanceOfAny = function instanceOfAny(object, constructors) {
  return constructors.some(function (c) {
    return object instanceof c;
  });
};
var idbProxyableTypes;
var cursorAdvanceMethods;
// This is a function to prevent it throwing up in node environments.
function getIdbProxyableTypes() {
  return idbProxyableTypes || (idbProxyableTypes = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]);
}
// This is a function to prevent it throwing up in node environments.
function getCursorAdvanceMethods() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey]);
}
var cursorRequestMap = new WeakMap();
var transactionDoneMap = new WeakMap();
var transactionStoreNamesMap = new WeakMap();
var transformCache = new WeakMap();
var reverseTransformCache = new WeakMap();
function promisifyRequest(request) {
  var promise = new Promise(function (resolve, reject) {
    var unlisten = function unlisten() {
      request.removeEventListener('success', success);
      request.removeEventListener('error', error);
    };
    var success = function success() {
      resolve(wrap(request.result));
      unlisten();
    };
    var error = function error() {
      reject(request.error);
      unlisten();
    };
    request.addEventListener('success', success);
    request.addEventListener('error', error);
  });
  promise.then(function (value) {
    // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
    // (see wrapFunction).
    if (value instanceof IDBCursor) {
      cursorRequestMap.set(value, request);
    }
    // Catching to avoid "Uncaught Promise exceptions"
  }).catch(function () {});
  // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
  // is because we create many promises from a single IDBRequest.
  reverseTransformCache.set(promise, request);
  return promise;
}
function cacheDonePromiseForTransaction(tx) {
  // Early bail if we've already created a done promise for this transaction.
  if (transactionDoneMap.has(tx)) return;
  var done = new Promise(function (resolve, reject) {
    var unlisten = function unlisten() {
      tx.removeEventListener('complete', complete);
      tx.removeEventListener('error', error);
      tx.removeEventListener('abort', error);
    };
    var complete = function complete() {
      resolve();
      unlisten();
    };
    var error = function error() {
      reject(tx.error || new DOMException('AbortError', 'AbortError'));
      unlisten();
    };
    tx.addEventListener('complete', complete);
    tx.addEventListener('error', error);
    tx.addEventListener('abort', error);
  });
  // Cache it for later retrieval.
  transactionDoneMap.set(tx, done);
}
var idbProxyTraps = {
  get: function get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      // Special handling for transaction.done.
      if (prop === 'done') return transactionDoneMap.get(target);
      // Polyfill for objectStoreNames because of Edge.
      if (prop === 'objectStoreNames') {
        return target.objectStoreNames || transactionStoreNamesMap.get(target);
      }
      // Make tx.store return the only store in the transaction, or undefined if there are many.
      if (prop === 'store') {
        return receiver.objectStoreNames[1] ? undefined : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    // Else transform whatever we get back.
    return wrap(target[prop]);
  },
  set: function set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has: function has(target, prop) {
    if (target instanceof IDBTransaction && (prop === 'done' || prop === 'store')) {
      return true;
    }
    return prop in target;
  }
};
function replaceTraps(callback) {
  idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
  // Due to expected object equality (which is enforced by the caching in `wrap`), we
  // only create one new func per func.
  // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
  if (func === IDBDatabase.prototype.transaction && !('objectStoreNames' in IDBTransaction.prototype)) {
    return function (storeNames) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      var tx = func.call.apply(func, [unwrap(this), storeNames].concat(args));
      transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
      return wrap(tx);
    };
  }
  // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
  // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
  // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
  // with real promises, so each advance methods returns a new promise for the cursor object, or
  // undefined if the end of the cursor has been reached.
  if (getCursorAdvanceMethods().includes(func)) {
    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
      // the original object.
      func.apply(unwrap(this), args);
      return wrap(cursorRequestMap.get(this));
    };
  }
  return function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
    // the original object.
    return wrap(func.apply(unwrap(this), args));
  };
}
function transformCachableValue(value) {
  if (typeof value === 'function') return wrapFunction(value);
  // This doesn't return, it just creates a 'done' promise for the transaction,
  // which is later returned for transaction.done (see idbObjectHandler).
  if (value instanceof IDBTransaction) cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes())) return new Proxy(value, idbProxyTraps);
  // Return the same value back if we're not going to transform it.
  return value;
}
function wrap(value) {
  // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
  // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
  if (value instanceof IDBRequest) return promisifyRequest(value);
  // If we've already transformed this value before, reuse the transformed value.
  // This is faster, but it also provides object equality.
  if (transformCache.has(value)) return transformCache.get(value);
  var newValue = transformCachableValue(value);
  // Not all types are transformed.
  // These may be primitive types, so they can't be WeakMap keys.
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
}
var unwrap = function unwrap(value) {
  return reverseTransformCache.get(value);
};

;// CONCATENATED MODULE: ./node_modules/idb/build/index.js






/**
 * Open a database.
 *
 * @param name Name of the database.
 * @param version Schema version.
 * @param callbacks Additional callbacks.
 */
function openDB(name, version) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    blocked = _ref.blocked,
    upgrade = _ref.upgrade,
    blocking = _ref.blocking,
    terminated = _ref.terminated;
  var request = indexedDB.open(name, version);
  var openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener('upgradeneeded', function (event) {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener('blocked', function (event) {
      return blocked(
      // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
      event.oldVersion, event.newVersion, event);
    });
  }
  openPromise.then(function (db) {
    if (terminated) db.addEventListener('close', function () {
      return terminated();
    });
    if (blocking) {
      db.addEventListener('versionchange', function (event) {
        return blocking(event.oldVersion, event.newVersion, event);
      });
    }
  }).catch(function () {});
  return openPromise;
}
/**
 * Delete a database.
 *
 * @param name Name of the database.
 */
function deleteDB(name) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    blocked = _ref2.blocked;
  var request = indexedDB.deleteDatabase(name);
  if (blocked) {
    request.addEventListener('blocked', function (event) {
      return blocked(
      // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
      event.oldVersion, event);
    });
  }
  return wrap(request).then(function () {
    return undefined;
  });
}
var readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
var writeMethods = ['put', 'add', 'delete', 'clear'];
var cachedMethods = new Map();
function getMethod(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === 'string')) {
    return;
  }
  if (cachedMethods.get(prop)) return cachedMethods.get(prop);
  var targetFuncName = prop.replace(/FromIndex$/, '');
  var useIndex = prop !== targetFuncName;
  var isWrite = writeMethods.includes(targetFuncName);
  if (
  // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
  !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) {
    return;
  }
  var method = /*#__PURE__*/function () {
    var _ref3 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee(storeName) {
      var _target;
      var tx,
        target,
        _len,
        args,
        _key,
        _args = arguments;
      return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
            tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
            target = tx.store;
            for (_len = _args.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = _args[_key];
            }
            if (useIndex) target = target.index(args.shift());
            // Must reject if op rejects.
            // If it's a write operation, must reject if tx.done rejects.
            // Must reject with op rejection first.
            // Must resolve with op value.
            // Must handle both promises (no unhandled rejections)
            _context.next = 6;
            return Promise.all([(_target = target)[targetFuncName].apply(_target, args), isWrite && tx.done]);
          case 6:
            return _context.abrupt("return", _context.sent[0]);
          case 7:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    return function method(_x) {
      return _ref3.apply(this, arguments);
    };
  }();
  cachedMethods.set(prop, method);
  return method;
}
replaceTraps(function (oldTraps) {
  return _objectSpread2(_objectSpread2({}, oldTraps), {}, {
    get: function get(target, prop, receiver) {
      return getMethod(target, prop) || oldTraps.get(target, prop, receiver);
    },
    has: function has(target, prop) {
      return !!getMethod(target, prop) || oldTraps.has(target, prop);
    }
  });
});

// EXTERNAL MODULE: ./node_modules/workbox-expiration/_version.js
var workbox_expiration_version = __webpack_require__(190);
;// CONCATENATED MODULE: ./node_modules/workbox-expiration/models/CacheTimestampsModel.js




/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


var DB_NAME = 'workbox-expiration';
var CACHE_OBJECT_STORE = 'cache-entries';
var normalizeURL = function normalizeURL(unNormalizedUrl) {
  var url = new URL(unNormalizedUrl, location.href);
  url.hash = '';
  return url.href;
};
/**
 * Returns the timestamp model.
 *
 * @private
 */
var CacheTimestampsModel = /*#__PURE__*/function () {
  /**
   *
   * @param {string} cacheName
   *
   * @private
   */
  function CacheTimestampsModel(cacheName) {
    classCallCheck_classCallCheck(this, CacheTimestampsModel);
    this._db = null;
    this._cacheName = cacheName;
  }
  /**
   * Performs an upgrade of indexedDB.
   *
   * @param {IDBPDatabase<CacheDbSchema>} db
   *
   * @private
   */
  createClass_createClass(CacheTimestampsModel, [{
    key: "_upgradeDb",
    value: function _upgradeDb(db) {
      // TODO(philipwalton): EdgeHTML doesn't support arrays as a keyPath, so we
      // have to use the `id` keyPath here and create our own values (a
      // concatenation of `url + cacheName`) instead of simply using
      // `keyPath: ['url', 'cacheName']`, which is supported in other browsers.
      var objStore = db.createObjectStore(CACHE_OBJECT_STORE, {
        keyPath: 'id'
      });
      // TODO(philipwalton): once we don't have to support EdgeHTML, we can
      // create a single index with the keyPath `['cacheName', 'timestamp']`
      // instead of doing both these indexes.
      objStore.createIndex('cacheName', 'cacheName', {
        unique: false
      });
      objStore.createIndex('timestamp', 'timestamp', {
        unique: false
      });
    }
    /**
     * Performs an upgrade of indexedDB and deletes deprecated DBs.
     *
     * @param {IDBPDatabase<CacheDbSchema>} db
     *
     * @private
     */
  }, {
    key: "_upgradeDbAndDeleteOldDbs",
    value: function _upgradeDbAndDeleteOldDbs(db) {
      this._upgradeDb(db);
      if (this._cacheName) {
        void deleteDB(this._cacheName);
      }
    }
    /**
     * @param {string} url
     * @param {number} timestamp
     *
     * @private
     */
  }, {
    key: "setTimestamp",
    value: function () {
      var _setTimestamp = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee(url, timestamp) {
        var entry, db, tx;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              url = normalizeURL(url);
              entry = {
                url: url,
                timestamp: timestamp,
                cacheName: this._cacheName,
                // Creating an ID from the URL and cache name won't be necessary once
                // Edge switches to Chromium and all browsers we support work with
                // array keyPaths.
                id: this._getId(url)
              };
              _context.next = 4;
              return this.getDb();
            case 4:
              db = _context.sent;
              tx = db.transaction(CACHE_OBJECT_STORE, 'readwrite', {
                durability: 'relaxed'
              });
              _context.next = 8;
              return tx.store.put(entry);
            case 8:
              _context.next = 10;
              return tx.done;
            case 10:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function setTimestamp(_x, _x2) {
        return _setTimestamp.apply(this, arguments);
      }
      return setTimestamp;
    }()
    /**
     * Returns the timestamp stored for a given URL.
     *
     * @param {string} url
     * @return {number | undefined}
     *
     * @private
     */
  }, {
    key: "getTimestamp",
    value: function () {
      var _getTimestamp = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee2(url) {
        var db, entry;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.getDb();
            case 2:
              db = _context2.sent;
              _context2.next = 5;
              return db.get(CACHE_OBJECT_STORE, this._getId(url));
            case 5:
              entry = _context2.sent;
              return _context2.abrupt("return", entry === null || entry === void 0 ? void 0 : entry.timestamp);
            case 7:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function getTimestamp(_x3) {
        return _getTimestamp.apply(this, arguments);
      }
      return getTimestamp;
    }()
    /**
     * Iterates through all the entries in the object store (from newest to
     * oldest) and removes entries once either `maxCount` is reached or the
     * entry's timestamp is less than `minTimestamp`.
     *
     * @param {number} minTimestamp
     * @param {number} maxCount
     * @return {Array<string>}
     *
     * @private
     */
  }, {
    key: "expireEntries",
    value: function () {
      var _expireEntries = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee3(minTimestamp, maxCount) {
        var db, cursor, entriesToDelete, entriesNotDeletedCount, result, urlsDeleted, _i, _entriesToDelete, entry;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.getDb();
            case 2:
              db = _context3.sent;
              _context3.next = 5;
              return db.transaction(CACHE_OBJECT_STORE).store.index('timestamp').openCursor(null, 'prev');
            case 5:
              cursor = _context3.sent;
              entriesToDelete = [];
              entriesNotDeletedCount = 0;
            case 8:
              if (!cursor) {
                _context3.next = 16;
                break;
              }
              result = cursor.value; // TODO(philipwalton): once we can use a multi-key index, we
              // won't have to check `cacheName` here.
              if (result.cacheName === this._cacheName) {
                // Delete an entry if it's older than the max age or
                // if we already have the max number allowed.
                if (minTimestamp && result.timestamp < minTimestamp || maxCount && entriesNotDeletedCount >= maxCount) {
                  // TODO(philipwalton): we should be able to delete the
                  // entry right here, but doing so causes an iteration
                  // bug in Safari stable (fixed in TP). Instead we can
                  // store the keys of the entries to delete, and then
                  // delete the separate transactions.
                  // https://github.com/GoogleChrome/workbox/issues/1978
                  // cursor.delete();
                  // We only need to return the URL, not the whole entry.
                  entriesToDelete.push(cursor.value);
                } else {
                  entriesNotDeletedCount++;
                }
              }
              _context3.next = 13;
              return cursor.continue();
            case 13:
              cursor = _context3.sent;
              _context3.next = 8;
              break;
            case 16:
              // TODO(philipwalton): once the Safari bug in the following issue is fixed,
              // we should be able to remove this loop and do the entry deletion in the
              // cursor loop above:
              // https://github.com/GoogleChrome/workbox/issues/1978
              urlsDeleted = [];
              _i = 0, _entriesToDelete = entriesToDelete;
            case 18:
              if (!(_i < _entriesToDelete.length)) {
                _context3.next = 26;
                break;
              }
              entry = _entriesToDelete[_i];
              _context3.next = 22;
              return db.delete(CACHE_OBJECT_STORE, entry.id);
            case 22:
              urlsDeleted.push(entry.url);
            case 23:
              _i++;
              _context3.next = 18;
              break;
            case 26:
              return _context3.abrupt("return", urlsDeleted);
            case 27:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function expireEntries(_x4, _x5) {
        return _expireEntries.apply(this, arguments);
      }
      return expireEntries;
    }()
    /**
     * Takes a URL and returns an ID that will be unique in the object store.
     *
     * @param {string} url
     * @return {string}
     *
     * @private
     */
  }, {
    key: "_getId",
    value: function _getId(url) {
      // Creating an ID from the URL and cache name won't be necessary once
      // Edge switches to Chromium and all browsers we support work with
      // array keyPaths.
      return this._cacheName + '|' + normalizeURL(url);
    }
    /**
     * Returns an open connection to the database.
     *
     * @private
     */
  }, {
    key: "getDb",
    value: function () {
      var _getDb = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee4() {
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (this._db) {
                _context4.next = 4;
                break;
              }
              _context4.next = 3;
              return openDB(DB_NAME, 1, {
                upgrade: this._upgradeDbAndDeleteOldDbs.bind(this)
              });
            case 3:
              this._db = _context4.sent;
            case 4:
              return _context4.abrupt("return", this._db);
            case 5:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function getDb() {
        return _getDb.apply(this, arguments);
      }
      return getDb;
    }()
  }]);
  return CacheTimestampsModel;
}();

;// CONCATENATED MODULE: ./node_modules/workbox-expiration/CacheExpiration.js





/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/






/**
 * The `CacheExpiration` class allows you define an expiration and / or
 * limit on the number of responses stored in a
 * [`Cache`](https://developer.mozilla.org/en-US/docs/Web/API/Cache).
 *
 * @memberof workbox-expiration
 */
var CacheExpiration = /*#__PURE__*/function () {
  /**
   * To construct a new CacheExpiration instance you must provide at least
   * one of the `config` properties.
   *
   * @param {string} cacheName Name of the cache to apply restrictions to.
   * @param {Object} config
   * @param {number} [config.maxEntries] The maximum number of entries to cache.
   * Entries used the least will be removed as the maximum is reached.
   * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
   * it's treated as stale and removed.
   * @param {Object} [config.matchOptions] The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
   * that will be used when calling `delete()` on the cache.
   */
  function CacheExpiration(cacheName) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck_classCallCheck(this, CacheExpiration);
    this._isRunning = false;
    this._rerunRequested = false;
    if (false) {}
    this._maxEntries = config.maxEntries;
    this._maxAgeSeconds = config.maxAgeSeconds;
    this._matchOptions = config.matchOptions;
    this._cacheName = cacheName;
    this._timestampModel = new CacheTimestampsModel(cacheName);
  }
  /**
   * Expires entries for the given cache and given criteria.
   */
  createClass_createClass(CacheExpiration, [{
    key: "expireEntries",
    value: function () {
      var _expireEntries = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee() {
        var minTimestamp, urlsExpired, cache, _iterator, _step, url;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!this._isRunning) {
                _context.next = 3;
                break;
              }
              this._rerunRequested = true;
              return _context.abrupt("return");
            case 3:
              this._isRunning = true;
              minTimestamp = this._maxAgeSeconds ? Date.now() - this._maxAgeSeconds * 1000 : 0;
              _context.next = 7;
              return this._timestampModel.expireEntries(minTimestamp, this._maxEntries);
            case 7:
              urlsExpired = _context.sent;
              _context.next = 10;
              return self.caches.open(this._cacheName);
            case 10:
              cache = _context.sent;
              _iterator = createForOfIteratorHelper_createForOfIteratorHelper(urlsExpired);
              _context.prev = 12;
              _iterator.s();
            case 14:
              if ((_step = _iterator.n()).done) {
                _context.next = 20;
                break;
              }
              url = _step.value;
              _context.next = 18;
              return cache.delete(url, this._matchOptions);
            case 18:
              _context.next = 14;
              break;
            case 20:
              _context.next = 25;
              break;
            case 22:
              _context.prev = 22;
              _context.t0 = _context["catch"](12);
              _iterator.e(_context.t0);
            case 25:
              _context.prev = 25;
              _iterator.f();
              return _context.finish(25);
            case 28:
              if (false) {}
              this._isRunning = false;
              if (this._rerunRequested) {
                this._rerunRequested = false;
                dontWaitFor(this.expireEntries());
              }
            case 31:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[12, 22, 25, 28]]);
      }));
      function expireEntries() {
        return _expireEntries.apply(this, arguments);
      }
      return expireEntries;
    }()
    /**
     * Update the timestamp for the given URL. This ensures the when
     * removing entries based on maximum entries, most recently used
     * is accurate or when expiring, the timestamp is up-to-date.
     *
     * @param {string} url
     */
  }, {
    key: "updateTimestamp",
    value: function () {
      var _updateTimestamp = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee2(url) {
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (false) {}
              _context2.next = 3;
              return this._timestampModel.setTimestamp(url, Date.now());
            case 3:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function updateTimestamp(_x) {
        return _updateTimestamp.apply(this, arguments);
      }
      return updateTimestamp;
    }()
    /**
     * Can be used to check if a URL has expired or not before it's used.
     *
     * This requires a look up from IndexedDB, so can be slow.
     *
     * Note: This method will not remove the cached entry, call
     * `expireEntries()` to remove indexedDB and Cache entries.
     *
     * @param {string} url
     * @return {boolean}
     */
  }, {
    key: "isURLExpired",
    value: function () {
      var _isURLExpired = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee3(url) {
        var timestamp, expireOlderThan;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (this._maxAgeSeconds) {
                _context3.next = 6;
                break;
              }
              if (true) {
                _context3.next = 3;
                break;
              }
              throw new WorkboxError_WorkboxError("expired-test-without-max-age", {
                methodName: 'isURLExpired',
                paramName: 'maxAgeSeconds'
              });
            case 3:
              return _context3.abrupt("return", false);
            case 6:
              _context3.next = 8;
              return this._timestampModel.getTimestamp(url);
            case 8:
              timestamp = _context3.sent;
              expireOlderThan = Date.now() - this._maxAgeSeconds * 1000;
              return _context3.abrupt("return", timestamp !== undefined ? timestamp < expireOlderThan : true);
            case 11:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function isURLExpired(_x2) {
        return _isURLExpired.apply(this, arguments);
      }
      return isURLExpired;
    }()
    /**
     * Removes the IndexedDB object store used to keep track of cache expiration
     * metadata.
     */
  }, {
    key: "delete",
    value: function () {
      var _delete2 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee4() {
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              // Make sure we don't attempt another rerun if we're called in the middle of
              // a cache expiration.
              this._rerunRequested = false;
              _context4.next = 3;
              return this._timestampModel.expireEntries(Infinity);
            case 3:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function _delete() {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }]);
  return CacheExpiration;
}();

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js




function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
;// CONCATENATED MODULE: ./node_modules/workbox-expiration/ExpirationPlugin.js






/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/









/**
 * This plugin can be used in a `workbox-strategy` to regularly enforce a
 * limit on the age and / or the number of cached requests.
 *
 * It can only be used with `workbox-strategy` instances that have a
 * [custom `cacheName` property set](/web/tools/workbox/guides/configure-workbox#custom_cache_names_in_strategies).
 * In other words, it can't be used to expire entries in strategy that uses the
 * default runtime cache name.
 *
 * Whenever a cached response is used or updated, this plugin will look
 * at the associated cache and remove any old or extra responses.
 *
 * When using `maxAgeSeconds`, responses may be used *once* after expiring
 * because the expiration clean up will not have occurred until *after* the
 * cached response has been used. If the response has a "Date" header, then
 * a light weight expiration check is performed and the response will not be
 * used immediately.
 *
 * When using `maxEntries`, the entry least-recently requested will be removed
 * from the cache first.
 *
 * @memberof workbox-expiration
 */
var ExpirationPlugin = /*#__PURE__*/function () {
  /**
   * @param {ExpirationPluginOptions} config
   * @param {number} [config.maxEntries] The maximum number of entries to cache.
   * Entries used the least will be removed as the maximum is reached.
   * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
   * it's treated as stale and removed.
   * @param {Object} [config.matchOptions] The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
   * that will be used when calling `delete()` on the cache.
   * @param {boolean} [config.purgeOnQuotaError] Whether to opt this cache in to
   * automatic deletion if the available storage quota has been exceeded.
   */
  function ExpirationPlugin() {
    var _this = this;
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck_classCallCheck(this, ExpirationPlugin);
    /**
     * A "lifecycle" callback that will be triggered automatically by the
     * `workbox-strategies` handlers when a `Response` is about to be returned
     * from a [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) to
     * the handler. It allows the `Response` to be inspected for freshness and
     * prevents it from being used if the `Response`'s `Date` header value is
     * older than the configured `maxAgeSeconds`.
     *
     * @param {Object} options
     * @param {string} options.cacheName Name of the cache the response is in.
     * @param {Response} options.cachedResponse The `Response` object that's been
     *     read from a cache and whose freshness should be checked.
     * @return {Response} Either the `cachedResponse`, if it's
     *     fresh, or `null` if the `Response` is older than `maxAgeSeconds`.
     *
     * @private
     */
    this.cachedResponseWillBeUsed = /*#__PURE__*/function () {
      var _ref2 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee(_ref) {
        var event, request, cacheName, cachedResponse, isFresh, cacheExpiration, updateTimestampDone;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              event = _ref.event, request = _ref.request, cacheName = _ref.cacheName, cachedResponse = _ref.cachedResponse;
              if (cachedResponse) {
                _context.next = 3;
                break;
              }
              return _context.abrupt("return", null);
            case 3:
              isFresh = _this._isResponseDateFresh(cachedResponse); // Expire entries to ensure that even if the expiration date has
              // expired, it'll only be used once.
              cacheExpiration = _this._getCacheExpiration(cacheName);
              dontWaitFor(cacheExpiration.expireEntries());
              // Update the metadata for the request URL to the current timestamp,
              // but don't `await` it as we don't want to block the response.
              updateTimestampDone = cacheExpiration.updateTimestamp(request.url);
              if (event) {
                try {
                  event.waitUntil(updateTimestampDone);
                } catch (error) {
                  if (false) {}
                }
              }
              return _context.abrupt("return", isFresh ? cachedResponse : null);
            case 9:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }();
    /**
     * A "lifecycle" callback that will be triggered automatically by the
     * `workbox-strategies` handlers when an entry is added to a cache.
     *
     * @param {Object} options
     * @param {string} options.cacheName Name of the cache that was updated.
     * @param {string} options.request The Request for the cached entry.
     *
     * @private
     */
    this.cacheDidUpdate = /*#__PURE__*/function () {
      var _ref4 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee2(_ref3) {
        var cacheName, request, cacheExpiration;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              cacheName = _ref3.cacheName, request = _ref3.request;
              if (false) {}
              cacheExpiration = _this._getCacheExpiration(cacheName);
              _context2.next = 5;
              return cacheExpiration.updateTimestamp(request.url);
            case 5:
              _context2.next = 7;
              return cacheExpiration.expireEntries();
            case 7:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function (_x2) {
        return _ref4.apply(this, arguments);
      };
    }();
    if (false) {}
    this._config = config;
    this._maxAgeSeconds = config.maxAgeSeconds;
    this._cacheExpirations = new Map();
    if (config.purgeOnQuotaError) {
      registerQuotaErrorCallback(function () {
        return _this.deleteCacheAndMetadata();
      });
    }
  }
  /**
   * A simple helper method to return a CacheExpiration instance for a given
   * cache name.
   *
   * @param {string} cacheName
   * @return {CacheExpiration}
   *
   * @private
   */
  createClass_createClass(ExpirationPlugin, [{
    key: "_getCacheExpiration",
    value: function _getCacheExpiration(cacheName) {
      if (cacheName === cacheNames_cacheNames.getRuntimeName()) {
        throw new WorkboxError_WorkboxError('expire-custom-caches-only');
      }
      var cacheExpiration = this._cacheExpirations.get(cacheName);
      if (!cacheExpiration) {
        cacheExpiration = new CacheExpiration(cacheName, this._config);
        this._cacheExpirations.set(cacheName, cacheExpiration);
      }
      return cacheExpiration;
    }
    /**
     * @param {Response} cachedResponse
     * @return {boolean}
     *
     * @private
     */
  }, {
    key: "_isResponseDateFresh",
    value: function _isResponseDateFresh(cachedResponse) {
      if (!this._maxAgeSeconds) {
        // We aren't expiring by age, so return true, it's fresh
        return true;
      }
      // Check if the 'date' header will suffice a quick expiration check.
      // See https://github.com/GoogleChromeLabs/sw-toolbox/issues/164 for
      // discussion.
      var dateHeaderTimestamp = this._getDateHeaderTimestamp(cachedResponse);
      if (dateHeaderTimestamp === null) {
        // Unable to parse date, so assume it's fresh.
        return true;
      }
      // If we have a valid headerTime, then our response is fresh iff the
      // headerTime plus maxAgeSeconds is greater than the current time.
      var now = Date.now();
      return dateHeaderTimestamp >= now - this._maxAgeSeconds * 1000;
    }
    /**
     * This method will extract the data header and parse it into a useful
     * value.
     *
     * @param {Response} cachedResponse
     * @return {number|null}
     *
     * @private
     */
  }, {
    key: "_getDateHeaderTimestamp",
    value: function _getDateHeaderTimestamp(cachedResponse) {
      if (!cachedResponse.headers.has('date')) {
        return null;
      }
      var dateHeader = cachedResponse.headers.get('date');
      var parsedDate = new Date(dateHeader);
      var headerTime = parsedDate.getTime();
      // If the Date header was invalid for some reason, parsedDate.getTime()
      // will return NaN.
      if (isNaN(headerTime)) {
        return null;
      }
      return headerTime;
    }
    /**
     * This is a helper method that performs two operations:
     *
     * - Deletes *all* the underlying Cache instances associated with this plugin
     * instance, by calling caches.delete() on your behalf.
     * - Deletes the metadata from IndexedDB used to keep track of expiration
     * details for each Cache instance.
     *
     * When using cache expiration, calling this method is preferable to calling
     * `caches.delete()` directly, since this will ensure that the IndexedDB
     * metadata is also cleanly removed and open IndexedDB instances are deleted.
     *
     * Note that if you're *not* using cache expiration for a given cache, calling
     * `caches.delete()` and passing in the cache's name should be sufficient.
     * There is no Workbox-specific method needed for cleanup in that case.
     */
  }, {
    key: "deleteCacheAndMetadata",
    value: function () {
      var _deleteCacheAndMetadata = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee3() {
        var _iterator, _step, _step$value, cacheName, cacheExpiration;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              // Do this one at a time instead of all at once via `Promise.all()` to
              // reduce the chance of inconsistency if a promise rejects.
              _iterator = createForOfIteratorHelper_createForOfIteratorHelper(this._cacheExpirations);
              _context3.prev = 1;
              _iterator.s();
            case 3:
              if ((_step = _iterator.n()).done) {
                _context3.next = 11;
                break;
              }
              _step$value = _slicedToArray(_step.value, 2), cacheName = _step$value[0], cacheExpiration = _step$value[1];
              _context3.next = 7;
              return self.caches.delete(cacheName);
            case 7:
              _context3.next = 9;
              return cacheExpiration.delete();
            case 9:
              _context3.next = 3;
              break;
            case 11:
              _context3.next = 16;
              break;
            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](1);
              _iterator.e(_context3.t0);
            case 16:
              _context3.prev = 16;
              _iterator.f();
              return _context3.finish(16);
            case 19:
              // Reset this._cacheExpirations to its initial state.
              this._cacheExpirations = new Map();
            case 20:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[1, 13, 16, 19]]);
      }));
      function deleteCacheAndMetadata() {
        return _deleteCacheAndMetadata.apply(this, arguments);
      }
      return deleteCacheAndMetadata;
    }()
  }]);
  return ExpirationPlugin;
}();

;// CONCATENATED MODULE: ./node_modules/workbox-expiration/index.js
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/



/**
 * @module workbox-expiration
 */

;// CONCATENATED MODULE: ./node_modules/workbox-expiration/index.mjs

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js




function toConsumableArray_toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
// EXTERNAL MODULE: ./node_modules/workbox-precaching/_version.js
var workbox_precaching_version = __webpack_require__(437);
;// CONCATENATED MODULE: ./node_modules/workbox-precaching/utils/createCacheKey.js
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


// Name of the search parameter used to store revision info.
var REVISION_SEARCH_PARAM = '__WB_REVISION__';
/**
 * Converts a manifest entry into a versioned URL suitable for precaching.
 *
 * @param {Object|string} entry
 * @return {string} A URL with versioning info.
 *
 * @private
 * @memberof workbox-precaching
 */
function createCacheKey(entry) {
  if (!entry) {
    throw new WorkboxError_WorkboxError('add-to-cache-list-unexpected-type', {
      entry: entry
    });
  }
  // If a precache manifest entry is a string, it's assumed to be a versioned
  // URL, like '/app.abcd1234.js'. Return as-is.
  if (typeof entry === 'string') {
    var urlObject = new URL(entry, location.href);
    return {
      cacheKey: urlObject.href,
      url: urlObject.href
    };
  }
  var revision = entry.revision,
    url = entry.url;
  if (!url) {
    throw new WorkboxError_WorkboxError('add-to-cache-list-unexpected-type', {
      entry: entry
    });
  }
  // If there's just a URL and no revision, then it's also assumed to be a
  // versioned URL.
  if (!revision) {
    var _urlObject = new URL(url, location.href);
    return {
      cacheKey: _urlObject.href,
      url: _urlObject.href
    };
  }
  // Otherwise, construct a properly versioned URL using the custom Workbox
  // search parameter along with the revision info.
  var cacheKeyURL = new URL(url, location.href);
  var originalURL = new URL(url, location.href);
  cacheKeyURL.searchParams.set(REVISION_SEARCH_PARAM, revision);
  return {
    cacheKey: cacheKeyURL.href,
    url: originalURL.href
  };
}
;// CONCATENATED MODULE: ./node_modules/workbox-precaching/utils/PrecacheInstallReportPlugin.js




/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/**
 * A plugin, designed to be used with PrecacheController, to determine the
 * of assets that were updated (or not updated) during the install event.
 *
 * @private
 */
var PrecacheInstallReportPlugin = /*#__PURE__*/createClass_createClass(function PrecacheInstallReportPlugin() {
  var _this = this;
  classCallCheck_classCallCheck(this, PrecacheInstallReportPlugin);
  this.updatedURLs = [];
  this.notUpdatedURLs = [];
  this.handlerWillStart = /*#__PURE__*/function () {
    var _ref2 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee(_ref) {
      var request, state;
      return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            request = _ref.request, state = _ref.state;
            // TODO: `state` should never be undefined...
            if (state) {
              state.originalRequest = request;
            }
          case 2:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }();
  this.cachedResponseWillBeUsed = /*#__PURE__*/function () {
    var _ref4 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee2(_ref3) {
      var event, state, cachedResponse, url;
      return regeneratorRuntime_regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            event = _ref3.event, state = _ref3.state, cachedResponse = _ref3.cachedResponse;
            if (event.type === 'install') {
              if (state && state.originalRequest && state.originalRequest instanceof Request) {
                // TODO: `state` should never be undefined...
                url = state.originalRequest.url;
                if (cachedResponse) {
                  _this.notUpdatedURLs.push(url);
                } else {
                  _this.updatedURLs.push(url);
                }
              }
            }
            return _context2.abrupt("return", cachedResponse);
          case 3:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function (_x2) {
      return _ref4.apply(this, arguments);
    };
  }();
});

;// CONCATENATED MODULE: ./node_modules/workbox-precaching/utils/PrecacheCacheKeyPlugin.js




/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/**
 * A plugin, designed to be used with PrecacheController, to translate URLs into
 * the corresponding cache key, based on the current revision info.
 *
 * @private
 */
var PrecacheCacheKeyPlugin = /*#__PURE__*/createClass_createClass(function PrecacheCacheKeyPlugin(_ref) {
  var _this = this;
  var precacheController = _ref.precacheController;
  classCallCheck_classCallCheck(this, PrecacheCacheKeyPlugin);
  this.cacheKeyWillBeUsed = /*#__PURE__*/function () {
    var _ref3 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee(_ref2) {
      var request, params, cacheKey;
      return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            request = _ref2.request, params = _ref2.params;
            // Params is type any, can't change right now.
            /* eslint-disable */
            cacheKey = (params === null || params === void 0 ? void 0 : params.cacheKey) || _this._precacheController.getCacheKeyForURL(request.url);
            /* eslint-enable */
            return _context.abrupt("return", cacheKey ? new Request(cacheKey, {
              headers: request.headers
            }) : request);
          case 3:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }();
  this._precacheController = precacheController;
});

;// CONCATENATED MODULE: ./node_modules/workbox-precaching/utils/printCleanupDetails.js

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


/**
 * @param {string} groupTitle
 * @param {Array<string>} deletedURLs
 *
 * @private
 */
var logGroup = function logGroup(groupTitle, deletedURLs) {
  logger.groupCollapsed(groupTitle);
  var _iterator = _createForOfIteratorHelper(deletedURLs),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var url = _step.value;
      logger.log(url);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  logger.groupEnd();
};
/**
 * @param {Array<string>} deletedURLs
 *
 * @private
 * @memberof workbox-precaching
 */
function printCleanupDetails(deletedURLs) {
  var deletionCount = deletedURLs.length;
  if (deletionCount > 0) {
    logger.groupCollapsed("During precaching cleanup, " + "".concat(deletionCount, " cached ") + "request".concat(deletionCount === 1 ? ' was' : 's were', " deleted."));
    logGroup('Deleted Cache Requests', deletedURLs);
    logger.groupEnd();
  }
}
;// CONCATENATED MODULE: ./node_modules/workbox-precaching/utils/printInstallDetails.js

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


/**
 * @param {string} groupTitle
 * @param {Array<string>} urls
 *
 * @private
 */
function _nestedGroup(groupTitle, urls) {
  if (urls.length === 0) {
    return;
  }
  logger.groupCollapsed(groupTitle);
  var _iterator = _createForOfIteratorHelper(urls),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var url = _step.value;
      logger.log(url);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  logger.groupEnd();
}
/**
 * @param {Array<string>} urlsToPrecache
 * @param {Array<string>} urlsAlreadyPrecached
 *
 * @private
 * @memberof workbox-precaching
 */
function printInstallDetails(urlsToPrecache, urlsAlreadyPrecached) {
  var precachedCount = urlsToPrecache.length;
  var alreadyPrecachedCount = urlsAlreadyPrecached.length;
  if (precachedCount || alreadyPrecachedCount) {
    var message = "Precaching ".concat(precachedCount, " file").concat(precachedCount === 1 ? '' : 's', ".");
    if (alreadyPrecachedCount > 0) {
      message += " ".concat(alreadyPrecachedCount, " ") + "file".concat(alreadyPrecachedCount === 1 ? ' is' : 's are', " already cached.");
    }
    logger.groupCollapsed(message);
    _nestedGroup("View newly precached URLs.", urlsToPrecache);
    _nestedGroup("View previously precached URLs.", urlsAlreadyPrecached);
    logger.groupEnd();
  }
}
// EXTERNAL MODULE: ./node_modules/workbox-strategies/_version.js
var workbox_strategies_version = __webpack_require__(833);
;// CONCATENATED MODULE: ./node_modules/workbox-strategies/StrategyHandler.js






/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/









function toRequest(input) {
  return typeof input === 'string' ? new Request(input) : input;
}
/**
 * A class created every time a Strategy instance instance calls
 * {@link workbox-strategies.Strategy~handle} or
 * {@link workbox-strategies.Strategy~handleAll} that wraps all fetch and
 * cache actions around plugin callbacks and keeps track of when the strategy
 * is "done" (i.e. all added `event.waitUntil()` promises have resolved).
 *
 * @memberof workbox-strategies
 */
var StrategyHandler = /*#__PURE__*/function () {
  /**
   * Creates a new instance associated with the passed strategy and event
   * that's handling the request.
   *
   * The constructor also initializes the state that will be passed to each of
   * the plugins handling this request.
   *
   * @param {workbox-strategies.Strategy} strategy
   * @param {Object} options
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params] The return value from the
   *     {@link workbox-routing~matchCallback} (if applicable).
   */
  function StrategyHandler(strategy, options) {
    classCallCheck_classCallCheck(this, StrategyHandler);
    this._cacheKeys = {};
    /**
     * The request the strategy is performing (passed to the strategy's
     * `handle()` or `handleAll()` method).
     * @name request
     * @instance
     * @type {Request}
     * @memberof workbox-strategies.StrategyHandler
     */
    /**
     * The event associated with this request.
     * @name event
     * @instance
     * @type {ExtendableEvent}
     * @memberof workbox-strategies.StrategyHandler
     */
    /**
     * A `URL` instance of `request.url` (if passed to the strategy's
     * `handle()` or `handleAll()` method).
     * Note: the `url` param will be present if the strategy was invoked
     * from a workbox `Route` object.
     * @name url
     * @instance
     * @type {URL|undefined}
     * @memberof workbox-strategies.StrategyHandler
     */
    /**
     * A `param` value (if passed to the strategy's
     * `handle()` or `handleAll()` method).
     * Note: the `param` param will be present if the strategy was invoked
     * from a workbox `Route` object and the
     * {@link workbox-routing~matchCallback} returned
     * a truthy value (it will be that value).
     * @name params
     * @instance
     * @type {*|undefined}
     * @memberof workbox-strategies.StrategyHandler
     */
    if (false) {}
    Object.assign(this, options);
    this.event = options.event;
    this._strategy = strategy;
    this._handlerDeferred = new Deferred();
    this._extendLifetimePromises = [];
    // Copy the plugins list (since it's mutable on the strategy),
    // so any mutations don't affect this handler instance.
    this._plugins = toConsumableArray_toConsumableArray(strategy.plugins);
    this._pluginStateMap = new Map();
    var _iterator = createForOfIteratorHelper_createForOfIteratorHelper(this._plugins),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var plugin = _step.value;
        this._pluginStateMap.set(plugin, {});
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    this.event.waitUntil(this._handlerDeferred.promise);
  }
  /**
   * Fetches a given request (and invokes any applicable plugin callback
   * methods) using the `fetchOptions` (for non-navigation requests) and
   * `plugins` defined on the `Strategy` object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - `requestWillFetch()`
   * - `fetchDidSucceed()`
   * - `fetchDidFail()`
   *
   * @param {Request|string} input The URL or request to fetch.
   * @return {Promise<Response>}
   */
  createClass_createClass(StrategyHandler, [{
    key: "fetch",
    value: function (_fetch) {
      function fetch(_x) {
        return _fetch.apply(this, arguments);
      }
      fetch.toString = function () {
        return _fetch.toString();
      };
      return fetch;
    }(
    /*#__PURE__*/
    function () {
      var _ref = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee(input) {
        var event, request, possiblePreloadResponse, originalRequest, _iterator2, _step2, cb, pluginFilteredRequest, fetchResponse, _iterator3, _step3, callback;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              event = this.event;
              request = toRequest(input);
              if (!(request.mode === 'navigate' && event instanceof FetchEvent && event.preloadResponse)) {
                _context.next = 9;
                break;
              }
              _context.next = 5;
              return event.preloadResponse;
            case 5:
              possiblePreloadResponse = _context.sent;
              if (!possiblePreloadResponse) {
                _context.next = 9;
                break;
              }
              if (false) {}
              return _context.abrupt("return", possiblePreloadResponse);
            case 9:
              // If there is a fetchDidFail plugin, we need to save a clone of the
              // original request before it's either modified by a requestWillFetch
              // plugin or before the original request's body is consumed via fetch().
              originalRequest = this.hasCallback('fetchDidFail') ? request.clone() : null;
              _context.prev = 10;
              _iterator2 = createForOfIteratorHelper_createForOfIteratorHelper(this.iterateCallbacks('requestWillFetch'));
              _context.prev = 12;
              _iterator2.s();
            case 14:
              if ((_step2 = _iterator2.n()).done) {
                _context.next = 21;
                break;
              }
              cb = _step2.value;
              _context.next = 18;
              return cb({
                request: request.clone(),
                event: event
              });
            case 18:
              request = _context.sent;
            case 19:
              _context.next = 14;
              break;
            case 21:
              _context.next = 26;
              break;
            case 23:
              _context.prev = 23;
              _context.t0 = _context["catch"](12);
              _iterator2.e(_context.t0);
            case 26:
              _context.prev = 26;
              _iterator2.f();
              return _context.finish(26);
            case 29:
              _context.next = 35;
              break;
            case 31:
              _context.prev = 31;
              _context.t1 = _context["catch"](10);
              if (!(_context.t1 instanceof Error)) {
                _context.next = 35;
                break;
              }
              throw new WorkboxError_WorkboxError('plugin-error-request-will-fetch', {
                thrownErrorMessage: _context.t1.message
              });
            case 35:
              // The request can be altered by plugins with `requestWillFetch` making
              // the original request (most likely from a `fetch` event) different
              // from the Request we make. Pass both to `fetchDidFail` to aid debugging.
              pluginFilteredRequest = request.clone();
              _context.prev = 36;
              _context.next = 39;
              return fetch(request, request.mode === 'navigate' ? undefined : this._strategy.fetchOptions);
            case 39:
              fetchResponse = _context.sent;
              if (false) {}
              _iterator3 = createForOfIteratorHelper_createForOfIteratorHelper(this.iterateCallbacks('fetchDidSucceed'));
              _context.prev = 42;
              _iterator3.s();
            case 44:
              if ((_step3 = _iterator3.n()).done) {
                _context.next = 51;
                break;
              }
              callback = _step3.value;
              _context.next = 48;
              return callback({
                event: event,
                request: pluginFilteredRequest,
                response: fetchResponse
              });
            case 48:
              fetchResponse = _context.sent;
            case 49:
              _context.next = 44;
              break;
            case 51:
              _context.next = 56;
              break;
            case 53:
              _context.prev = 53;
              _context.t2 = _context["catch"](42);
              _iterator3.e(_context.t2);
            case 56:
              _context.prev = 56;
              _iterator3.f();
              return _context.finish(56);
            case 59:
              return _context.abrupt("return", fetchResponse);
            case 62:
              _context.prev = 62;
              _context.t3 = _context["catch"](36);
              if (false) {}
              // `originalRequest` will only exist if a `fetchDidFail` callback
              // is being used (see above).
              if (!originalRequest) {
                _context.next = 68;
                break;
              }
              _context.next = 68;
              return this.runCallbacks('fetchDidFail', {
                error: _context.t3,
                event: event,
                originalRequest: originalRequest.clone(),
                request: pluginFilteredRequest.clone()
              });
            case 68:
              throw _context.t3;
            case 69:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[10, 31], [12, 23, 26, 29], [36, 62], [42, 53, 56, 59]]);
      }));
      return function (_x2) {
        return _ref.apply(this, arguments);
      };
    }()
    /**
     * Calls `this.fetch()` and (in the background) runs `this.cachePut()` on
     * the response generated by `this.fetch()`.
     *
     * The call to `this.cachePut()` automatically invokes `this.waitUntil()`,
     * so you do not have to manually call `waitUntil()` on the event.
     *
     * @param {Request|string} input The request or URL to fetch and cache.
     * @return {Promise<Response>}
     */
    )
  }, {
    key: "fetchAndCachePut",
    value: function () {
      var _fetchAndCachePut = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee2(input) {
        var response, responseClone;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.fetch(input);
            case 2:
              response = _context2.sent;
              responseClone = response.clone();
              void this.waitUntil(this.cachePut(input, responseClone));
              return _context2.abrupt("return", response);
            case 6:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function fetchAndCachePut(_x3) {
        return _fetchAndCachePut.apply(this, arguments);
      }
      return fetchAndCachePut;
    }()
    /**
     * Matches a request from the cache (and invokes any applicable plugin
     * callback methods) using the `cacheName`, `matchOptions`, and `plugins`
     * defined on the strategy object.
     *
     * The following plugin lifecycle methods are invoked when using this method:
     * - cacheKeyWillByUsed()
     * - cachedResponseWillByUsed()
     *
     * @param {Request|string} key The Request or URL to use as the cache key.
     * @return {Promise<Response|undefined>} A matching response, if found.
     */
  }, {
    key: "cacheMatch",
    value: function () {
      var _cacheMatch = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee3(key) {
        var request, cachedResponse, _this$_strategy, cacheName, matchOptions, effectiveRequest, multiMatchOptions, _iterator4, _step4, callback;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              request = toRequest(key);
              _this$_strategy = this._strategy, cacheName = _this$_strategy.cacheName, matchOptions = _this$_strategy.matchOptions;
              _context3.next = 4;
              return this.getCacheKey(request, 'read');
            case 4:
              effectiveRequest = _context3.sent;
              multiMatchOptions = Object.assign(Object.assign({}, matchOptions), {
                cacheName: cacheName
              });
              _context3.next = 8;
              return caches.match(effectiveRequest, multiMatchOptions);
            case 8:
              cachedResponse = _context3.sent;
              if (false) {}
              _iterator4 = createForOfIteratorHelper_createForOfIteratorHelper(this.iterateCallbacks('cachedResponseWillBeUsed'));
              _context3.prev = 11;
              _iterator4.s();
            case 13:
              if ((_step4 = _iterator4.n()).done) {
                _context3.next = 23;
                break;
              }
              callback = _step4.value;
              _context3.next = 17;
              return callback({
                cacheName: cacheName,
                matchOptions: matchOptions,
                cachedResponse: cachedResponse,
                request: effectiveRequest,
                event: this.event
              });
            case 17:
              _context3.t0 = _context3.sent;
              if (_context3.t0) {
                _context3.next = 20;
                break;
              }
              _context3.t0 = undefined;
            case 20:
              cachedResponse = _context3.t0;
            case 21:
              _context3.next = 13;
              break;
            case 23:
              _context3.next = 28;
              break;
            case 25:
              _context3.prev = 25;
              _context3.t1 = _context3["catch"](11);
              _iterator4.e(_context3.t1);
            case 28:
              _context3.prev = 28;
              _iterator4.f();
              return _context3.finish(28);
            case 31:
              return _context3.abrupt("return", cachedResponse);
            case 32:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[11, 25, 28, 31]]);
      }));
      function cacheMatch(_x4) {
        return _cacheMatch.apply(this, arguments);
      }
      return cacheMatch;
    }()
    /**
     * Puts a request/response pair in the cache (and invokes any applicable
     * plugin callback methods) using the `cacheName` and `plugins` defined on
     * the strategy object.
     *
     * The following plugin lifecycle methods are invoked when using this method:
     * - cacheKeyWillByUsed()
     * - cacheWillUpdate()
     * - cacheDidUpdate()
     *
     * @param {Request|string} key The request or URL to use as the cache key.
     * @param {Response} response The response to cache.
     * @return {Promise<boolean>} `false` if a cacheWillUpdate caused the response
     * not be cached, and `true` otherwise.
     */
  }, {
    key: "cachePut",
    value: function () {
      var _cachePut = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee4(key, response) {
        var request, effectiveRequest, vary, responseToCache, _this$_strategy2, cacheName, matchOptions, cache, hasCacheUpdateCallback, oldResponse, _iterator5, _step5, callback;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              request = toRequest(key); // Run in the next task to avoid blocking other cache reads.
              // https://github.com/w3c/ServiceWorker/issues/1397
              _context4.next = 3;
              return timeout_timeout(0);
            case 3:
              _context4.next = 5;
              return this.getCacheKey(request, 'write');
            case 5:
              effectiveRequest = _context4.sent;
              if (true) {
                _context4.next = 11;
                break;
              }
              if (!(effectiveRequest.method && effectiveRequest.method !== 'GET')) {
                _context4.next = 9;
                break;
              }
              throw new WorkboxError_WorkboxError('attempt-to-cache-non-get-request', {
                url: getFriendlyURL(effectiveRequest.url),
                method: effectiveRequest.method
              });
            case 9:
              // See https://github.com/GoogleChrome/workbox/issues/2818
              vary = response.headers.get('Vary');
              if (vary) {
                logger_logger.debug("The response for ".concat(getFriendlyURL(effectiveRequest.url), " ") + "has a 'Vary: ".concat(vary, "' header. ") + "Consider setting the {ignoreVary: true} option on your strategy " + "to ensure cache matching and deletion works as expected.");
              }
            case 11:
              if (response) {
                _context4.next = 14;
                break;
              }
              if (false) {}
              throw new WorkboxError_WorkboxError('cache-put-with-no-response', {
                url: getFriendlyURL(effectiveRequest.url)
              });
            case 14:
              _context4.next = 16;
              return this._ensureResponseSafeToCache(response);
            case 16:
              responseToCache = _context4.sent;
              if (responseToCache) {
                _context4.next = 20;
                break;
              }
              if (false) {}
              return _context4.abrupt("return", false);
            case 20:
              _this$_strategy2 = this._strategy, cacheName = _this$_strategy2.cacheName, matchOptions = _this$_strategy2.matchOptions;
              _context4.next = 23;
              return self.caches.open(cacheName);
            case 23:
              cache = _context4.sent;
              hasCacheUpdateCallback = this.hasCallback('cacheDidUpdate');
              if (!hasCacheUpdateCallback) {
                _context4.next = 31;
                break;
              }
              _context4.next = 28;
              return cacheMatchIgnoreParams(
              // TODO(philipwalton): the `__WB_REVISION__` param is a precaching
              // feature. Consider into ways to only add this behavior if using
              // precaching.
              cache, effectiveRequest.clone(), ['__WB_REVISION__'], matchOptions);
            case 28:
              _context4.t0 = _context4.sent;
              _context4.next = 32;
              break;
            case 31:
              _context4.t0 = null;
            case 32:
              oldResponse = _context4.t0;
              if (false) {}
              _context4.prev = 34;
              _context4.next = 37;
              return cache.put(effectiveRequest, hasCacheUpdateCallback ? responseToCache.clone() : responseToCache);
            case 37:
              _context4.next = 46;
              break;
            case 39:
              _context4.prev = 39;
              _context4.t1 = _context4["catch"](34);
              if (!(_context4.t1 instanceof Error)) {
                _context4.next = 46;
                break;
              }
              if (!(_context4.t1.name === 'QuotaExceededError')) {
                _context4.next = 45;
                break;
              }
              _context4.next = 45;
              return executeQuotaErrorCallbacks();
            case 45:
              throw _context4.t1;
            case 46:
              _iterator5 = createForOfIteratorHelper_createForOfIteratorHelper(this.iterateCallbacks('cacheDidUpdate'));
              _context4.prev = 47;
              _iterator5.s();
            case 49:
              if ((_step5 = _iterator5.n()).done) {
                _context4.next = 55;
                break;
              }
              callback = _step5.value;
              _context4.next = 53;
              return callback({
                cacheName: cacheName,
                oldResponse: oldResponse,
                newResponse: responseToCache.clone(),
                request: effectiveRequest,
                event: this.event
              });
            case 53:
              _context4.next = 49;
              break;
            case 55:
              _context4.next = 60;
              break;
            case 57:
              _context4.prev = 57;
              _context4.t2 = _context4["catch"](47);
              _iterator5.e(_context4.t2);
            case 60:
              _context4.prev = 60;
              _iterator5.f();
              return _context4.finish(60);
            case 63:
              return _context4.abrupt("return", true);
            case 64:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this, [[34, 39], [47, 57, 60, 63]]);
      }));
      function cachePut(_x5, _x6) {
        return _cachePut.apply(this, arguments);
      }
      return cachePut;
    }()
    /**
     * Checks the list of plugins for the `cacheKeyWillBeUsed` callback, and
     * executes any of those callbacks found in sequence. The final `Request`
     * object returned by the last plugin is treated as the cache key for cache
     * reads and/or writes. If no `cacheKeyWillBeUsed` plugin callbacks have
     * been registered, the passed request is returned unmodified
     *
     * @param {Request} request
     * @param {string} mode
     * @return {Promise<Request>}
     */
  }, {
    key: "getCacheKey",
    value: function () {
      var _getCacheKey = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee5(request, mode) {
        var key, effectiveRequest, _iterator6, _step6, callback;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              key = "".concat(request.url, " | ").concat(mode);
              if (this._cacheKeys[key]) {
                _context5.next = 24;
                break;
              }
              effectiveRequest = request;
              _iterator6 = createForOfIteratorHelper_createForOfIteratorHelper(this.iterateCallbacks('cacheKeyWillBeUsed'));
              _context5.prev = 4;
              _iterator6.s();
            case 6:
              if ((_step6 = _iterator6.n()).done) {
                _context5.next = 15;
                break;
              }
              callback = _step6.value;
              _context5.t0 = toRequest;
              _context5.next = 11;
              return callback({
                mode: mode,
                request: effectiveRequest,
                event: this.event,
                // params has a type any can't change right now.
                params: this.params // eslint-disable-line
              });
            case 11:
              _context5.t1 = _context5.sent;
              effectiveRequest = (0, _context5.t0)(_context5.t1);
            case 13:
              _context5.next = 6;
              break;
            case 15:
              _context5.next = 20;
              break;
            case 17:
              _context5.prev = 17;
              _context5.t2 = _context5["catch"](4);
              _iterator6.e(_context5.t2);
            case 20:
              _context5.prev = 20;
              _iterator6.f();
              return _context5.finish(20);
            case 23:
              this._cacheKeys[key] = effectiveRequest;
            case 24:
              return _context5.abrupt("return", this._cacheKeys[key]);
            case 25:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this, [[4, 17, 20, 23]]);
      }));
      function getCacheKey(_x7, _x8) {
        return _getCacheKey.apply(this, arguments);
      }
      return getCacheKey;
    }()
    /**
     * Returns true if the strategy has at least one plugin with the given
     * callback.
     *
     * @param {string} name The name of the callback to check for.
     * @return {boolean}
     */
  }, {
    key: "hasCallback",
    value: function hasCallback(name) {
      var _iterator7 = createForOfIteratorHelper_createForOfIteratorHelper(this._strategy.plugins),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var plugin = _step7.value;
          if (name in plugin) {
            return true;
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
      return false;
    }
    /**
     * Runs all plugin callbacks matching the given name, in order, passing the
     * given param object (merged ith the current plugin state) as the only
     * argument.
     *
     * Note: since this method runs all plugins, it's not suitable for cases
     * where the return value of a callback needs to be applied prior to calling
     * the next callback. See
     * {@link workbox-strategies.StrategyHandler#iterateCallbacks}
     * below for how to handle that case.
     *
     * @param {string} name The name of the callback to run within each plugin.
     * @param {Object} param The object to pass as the first (and only) param
     *     when executing each callback. This object will be merged with the
     *     current plugin state prior to callback execution.
     */
  }, {
    key: "runCallbacks",
    value: function () {
      var _runCallbacks = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee6(name, param) {
        var _iterator8, _step8, callback;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _iterator8 = createForOfIteratorHelper_createForOfIteratorHelper(this.iterateCallbacks(name));
              _context6.prev = 1;
              _iterator8.s();
            case 3:
              if ((_step8 = _iterator8.n()).done) {
                _context6.next = 9;
                break;
              }
              callback = _step8.value;
              _context6.next = 7;
              return callback(param);
            case 7:
              _context6.next = 3;
              break;
            case 9:
              _context6.next = 14;
              break;
            case 11:
              _context6.prev = 11;
              _context6.t0 = _context6["catch"](1);
              _iterator8.e(_context6.t0);
            case 14:
              _context6.prev = 14;
              _iterator8.f();
              return _context6.finish(14);
            case 17:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this, [[1, 11, 14, 17]]);
      }));
      function runCallbacks(_x9, _x10) {
        return _runCallbacks.apply(this, arguments);
      }
      return runCallbacks;
    }()
    /**
     * Accepts a callback and returns an iterable of matching plugin callbacks,
     * where each callback is wrapped with the current handler state (i.e. when
     * you call each callback, whatever object parameter you pass it will
     * be merged with the plugin's current state).
     *
     * @param {string} name The name fo the callback to run
     * @return {Array<Function>}
     */
  }, {
    key: "iterateCallbacks",
    value:
    /*#__PURE__*/
    regeneratorRuntime_regeneratorRuntime().mark(function iterateCallbacks(name) {
      var _this = this;
      var _iterator9, _step9, _loop;
      return regeneratorRuntime_regeneratorRuntime().wrap(function iterateCallbacks$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            _iterator9 = createForOfIteratorHelper_createForOfIteratorHelper(this._strategy.plugins);
            _context8.prev = 1;
            _loop = /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _loop() {
              var plugin, state, statefulCallback;
              return regeneratorRuntime_regeneratorRuntime().wrap(function _loop$(_context7) {
                while (1) switch (_context7.prev = _context7.next) {
                  case 0:
                    plugin = _step9.value;
                    if (!(typeof plugin[name] === 'function')) {
                      _context7.next = 6;
                      break;
                    }
                    state = _this._pluginStateMap.get(plugin);
                    statefulCallback = function statefulCallback(param) {
                      var statefulParam = Object.assign(Object.assign({}, param), {
                        state: state
                      });
                      // TODO(philipwalton): not sure why `any` is needed. It seems like
                      // this should work with `as WorkboxPluginCallbackParam[C]`.
                      return plugin[name](statefulParam);
                    };
                    _context7.next = 6;
                    return statefulCallback;
                  case 6:
                  case "end":
                    return _context7.stop();
                }
              }, _loop);
            });
            _iterator9.s();
          case 4:
            if ((_step9 = _iterator9.n()).done) {
              _context8.next = 8;
              break;
            }
            return _context8.delegateYield(_loop(), "t0", 6);
          case 6:
            _context8.next = 4;
            break;
          case 8:
            _context8.next = 13;
            break;
          case 10:
            _context8.prev = 10;
            _context8.t1 = _context8["catch"](1);
            _iterator9.e(_context8.t1);
          case 13:
            _context8.prev = 13;
            _iterator9.f();
            return _context8.finish(13);
          case 16:
          case "end":
            return _context8.stop();
        }
      }, iterateCallbacks, this, [[1, 10, 13, 16]]);
    })
    /**
     * Adds a promise to the
     * [extend lifetime promises]{@link https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises}
     * of the event event associated with the request being handled (usually a
     * `FetchEvent`).
     *
     * Note: you can await
     * {@link workbox-strategies.StrategyHandler~doneWaiting}
     * to know when all added promises have settled.
     *
     * @param {Promise} promise A promise to add to the extend lifetime promises
     *     of the event that triggered the request.
     */
  }, {
    key: "waitUntil",
    value: function waitUntil(promise) {
      this._extendLifetimePromises.push(promise);
      return promise;
    }
    /**
     * Returns a promise that resolves once all promises passed to
     * {@link workbox-strategies.StrategyHandler~waitUntil}
     * have settled.
     *
     * Note: any work done after `doneWaiting()` settles should be manually
     * passed to an event's `waitUntil()` method (not this handler's
     * `waitUntil()` method), otherwise the service worker thread my be killed
     * prior to your work completing.
     */
  }, {
    key: "doneWaiting",
    value: function () {
      var _doneWaiting = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee7() {
        var promise;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee7$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              if (!(promise = this._extendLifetimePromises.shift())) {
                _context9.next = 5;
                break;
              }
              _context9.next = 3;
              return promise;
            case 3:
              _context9.next = 0;
              break;
            case 5:
            case "end":
              return _context9.stop();
          }
        }, _callee7, this);
      }));
      function doneWaiting() {
        return _doneWaiting.apply(this, arguments);
      }
      return doneWaiting;
    }()
    /**
     * Stops running the strategy and immediately resolves any pending
     * `waitUntil()` promises.
     */
  }, {
    key: "destroy",
    value: function destroy() {
      this._handlerDeferred.resolve(null);
    }
    /**
     * This method will call cacheWillUpdate on the available plugins (or use
     * status === 200) to determine if the Response is safe and valid to cache.
     *
     * @param {Request} options.request
     * @param {Response} options.response
     * @return {Promise<Response|undefined>}
     *
     * @private
     */
  }, {
    key: "_ensureResponseSafeToCache",
    value: function () {
      var _ensureResponseSafeToCache2 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee8(response) {
        var responseToCache, pluginsUsed, _iterator10, _step10, callback;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee8$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              responseToCache = response;
              pluginsUsed = false;
              _iterator10 = createForOfIteratorHelper_createForOfIteratorHelper(this.iterateCallbacks('cacheWillUpdate'));
              _context10.prev = 3;
              _iterator10.s();
            case 5:
              if ((_step10 = _iterator10.n()).done) {
                _context10.next = 18;
                break;
              }
              callback = _step10.value;
              _context10.next = 9;
              return callback({
                request: this.request,
                response: responseToCache,
                event: this.event
              });
            case 9:
              _context10.t0 = _context10.sent;
              if (_context10.t0) {
                _context10.next = 12;
                break;
              }
              _context10.t0 = undefined;
            case 12:
              responseToCache = _context10.t0;
              pluginsUsed = true;
              if (responseToCache) {
                _context10.next = 16;
                break;
              }
              return _context10.abrupt("break", 18);
            case 16:
              _context10.next = 5;
              break;
            case 18:
              _context10.next = 23;
              break;
            case 20:
              _context10.prev = 20;
              _context10.t1 = _context10["catch"](3);
              _iterator10.e(_context10.t1);
            case 23:
              _context10.prev = 23;
              _iterator10.f();
              return _context10.finish(23);
            case 26:
              if (!pluginsUsed) {
                if (responseToCache && responseToCache.status !== 200) {
                  responseToCache = undefined;
                }
                if (false) {}
              }
              return _context10.abrupt("return", responseToCache);
            case 28:
            case "end":
              return _context10.stop();
          }
        }, _callee8, this, [[3, 20, 23, 26]]);
      }));
      function _ensureResponseSafeToCache(_x11) {
        return _ensureResponseSafeToCache2.apply(this, arguments);
      }
      return _ensureResponseSafeToCache;
    }()
  }]);
  return StrategyHandler;
}();

;// CONCATENATED MODULE: ./node_modules/workbox-strategies/Strategy.js






/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/






/**
 * An abstract base class that all other strategy classes must extend from:
 *
 * @memberof workbox-strategies
 */
var Strategy = /*#__PURE__*/function () {
  /**
   * Creates a new instance of the strategy and sets all documented option
   * properties as public instance properties.
   *
   * Note: if a custom strategy class extends the base Strategy class and does
   * not need more than these properties, it does not need to define its own
   * constructor.
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to the cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {Object} [options.matchOptions] The
   * [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
   * for any `cache.match()` or `cache.put()` calls made by this strategy.
   */
  function Strategy() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck_classCallCheck(this, Strategy);
    /**
     * Cache name to store and retrieve
     * requests. Defaults to the cache names provided by
     * {@link workbox-core.cacheNames}.
     *
     * @type {string}
     */
    this.cacheName = cacheNames_cacheNames.getRuntimeName(options.cacheName);
    /**
     * The list
     * [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
     * used by this strategy.
     *
     * @type {Array<Object>}
     */
    this.plugins = options.plugins || [];
    /**
     * Values passed along to the
     * [`init`]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters}
     * of all fetch() requests made by this strategy.
     *
     * @type {Object}
     */
    this.fetchOptions = options.fetchOptions;
    /**
     * The
     * [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
     * for any `cache.match()` or `cache.put()` calls made by this strategy.
     *
     * @type {Object}
     */
    this.matchOptions = options.matchOptions;
  }
  /**
   * Perform a request strategy and returns a `Promise` that will resolve with
   * a `Response`, invoking all relevant plugin callbacks.
   *
   * When a strategy instance is registered with a Workbox
   * {@link workbox-routing.Route}, this method is automatically
   * called when the route matches.
   *
   * Alternatively, this method can be used in a standalone `FetchEvent`
   * listener by passing it to `event.respondWith()`.
   *
   * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
   *     properties listed below.
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params]
   */
  createClass_createClass(Strategy, [{
    key: "handle",
    value: function handle(options) {
      var _this$handleAll = this.handleAll(options),
        _this$handleAll2 = _slicedToArray(_this$handleAll, 1),
        responseDone = _this$handleAll2[0];
      return responseDone;
    }
    /**
     * Similar to {@link workbox-strategies.Strategy~handle}, but
     * instead of just returning a `Promise` that resolves to a `Response` it
     * it will return an tuple of `[response, done]` promises, where the former
     * (`response`) is equivalent to what `handle()` returns, and the latter is a
     * Promise that will resolve once any promises that were added to
     * `event.waitUntil()` as part of performing the strategy have completed.
     *
     * You can await the `done` promise to ensure any extra work performed by
     * the strategy (usually caching responses) completes successfully.
     *
     * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
     *     properties listed below.
     * @param {Request|string} options.request A request to run this strategy for.
     * @param {ExtendableEvent} options.event The event associated with the
     *     request.
     * @param {URL} [options.url]
     * @param {*} [options.params]
     * @return {Array<Promise>} A tuple of [response, done]
     *     promises that can be used to determine when the response resolves as
     *     well as when the handler has completed all its work.
     */
  }, {
    key: "handleAll",
    value: function handleAll(options) {
      // Allow for flexible options to be passed.
      if (options instanceof FetchEvent) {
        options = {
          event: options,
          request: options.request
        };
      }
      var event = options.event;
      var request = typeof options.request === 'string' ? new Request(options.request) : options.request;
      var params = 'params' in options ? options.params : undefined;
      var handler = new StrategyHandler(this, {
        event: event,
        request: request,
        params: params
      });
      var responseDone = this._getResponse(handler, request, event);
      var handlerDone = this._awaitComplete(responseDone, handler, request, event);
      // Return an array of promises, suitable for use with Promise.all().
      return [responseDone, handlerDone];
    }
  }, {
    key: "_getResponse",
    value: function () {
      var _getResponse2 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee(handler, request, event) {
        var response, _iterator, _step, callback, _iterator2, _step2, _callback;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return handler.runCallbacks('handlerWillStart', {
                event: event,
                request: request
              });
            case 2:
              response = undefined;
              _context.prev = 3;
              _context.next = 6;
              return this._handle(request, handler);
            case 6:
              response = _context.sent;
              if (!(!response || response.type === 'error')) {
                _context.next = 9;
                break;
              }
              throw new WorkboxError_WorkboxError('no-response', {
                url: request.url
              });
            case 9:
              _context.next = 39;
              break;
            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](3);
              if (!(_context.t0 instanceof Error)) {
                _context.next = 34;
                break;
              }
              _iterator = createForOfIteratorHelper_createForOfIteratorHelper(handler.iterateCallbacks('handlerDidError'));
              _context.prev = 15;
              _iterator.s();
            case 17:
              if ((_step = _iterator.n()).done) {
                _context.next = 26;
                break;
              }
              callback = _step.value;
              _context.next = 21;
              return callback({
                error: _context.t0,
                event: event,
                request: request
              });
            case 21:
              response = _context.sent;
              if (!response) {
                _context.next = 24;
                break;
              }
              return _context.abrupt("break", 26);
            case 24:
              _context.next = 17;
              break;
            case 26:
              _context.next = 31;
              break;
            case 28:
              _context.prev = 28;
              _context.t1 = _context["catch"](15);
              _iterator.e(_context.t1);
            case 31:
              _context.prev = 31;
              _iterator.f();
              return _context.finish(31);
            case 34:
              if (response) {
                _context.next = 38;
                break;
              }
              throw _context.t0;
            case 38:
              if (false) {}
            case 39:
              _iterator2 = createForOfIteratorHelper_createForOfIteratorHelper(handler.iterateCallbacks('handlerWillRespond'));
              _context.prev = 40;
              _iterator2.s();
            case 42:
              if ((_step2 = _iterator2.n()).done) {
                _context.next = 49;
                break;
              }
              _callback = _step2.value;
              _context.next = 46;
              return _callback({
                event: event,
                request: request,
                response: response
              });
            case 46:
              response = _context.sent;
            case 47:
              _context.next = 42;
              break;
            case 49:
              _context.next = 54;
              break;
            case 51:
              _context.prev = 51;
              _context.t2 = _context["catch"](40);
              _iterator2.e(_context.t2);
            case 54:
              _context.prev = 54;
              _iterator2.f();
              return _context.finish(54);
            case 57:
              return _context.abrupt("return", response);
            case 58:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[3, 11], [15, 28, 31, 34], [40, 51, 54, 57]]);
      }));
      function _getResponse(_x, _x2, _x3) {
        return _getResponse2.apply(this, arguments);
      }
      return _getResponse;
    }()
  }, {
    key: "_awaitComplete",
    value: function () {
      var _awaitComplete2 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee2(responseDone, handler, request, event) {
        var response, error;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return responseDone;
            case 3:
              response = _context2.sent;
              _context2.next = 8;
              break;
            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](0);
            case 8:
              _context2.prev = 8;
              _context2.next = 11;
              return handler.runCallbacks('handlerDidRespond', {
                event: event,
                request: request,
                response: response
              });
            case 11:
              _context2.next = 13;
              return handler.doneWaiting();
            case 13:
              _context2.next = 18;
              break;
            case 15:
              _context2.prev = 15;
              _context2.t1 = _context2["catch"](8);
              if (_context2.t1 instanceof Error) {
                error = _context2.t1;
              }
            case 18:
              _context2.next = 20;
              return handler.runCallbacks('handlerDidComplete', {
                event: event,
                request: request,
                response: response,
                error: error
              });
            case 20:
              handler.destroy();
              if (!error) {
                _context2.next = 23;
                break;
              }
              throw error;
            case 23:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[0, 6], [8, 15]]);
      }));
      function _awaitComplete(_x4, _x5, _x6, _x7) {
        return _awaitComplete2.apply(this, arguments);
      }
      return _awaitComplete;
    }()
  }]);
  return Strategy;
}();

/**
 * Classes extending the `Strategy` based class should implement this method,
 * and leverage the {@link workbox-strategies.StrategyHandler}
 * arg to perform all fetching and cache logic, which will ensure all relevant
 * cache, cache options, fetch options and plugins are used (per the current
 * strategy instance).
 *
 * @name _handle
 * @instance
 * @abstract
 * @function
 * @param {Request} request
 * @param {workbox-strategies.StrategyHandler} handler
 * @return {Promise<Response>}
 *
 * @memberof workbox-strategies.Strategy
 */
;// CONCATENATED MODULE: ./node_modules/workbox-precaching/PrecacheStrategy.js








/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/







/**
 * A {@link workbox-strategies.Strategy} implementation
 * specifically designed to work with
 * {@link workbox-precaching.PrecacheController}
 * to both cache and fetch precached assets.
 *
 * Note: an instance of this class is created automatically when creating a
 * `PrecacheController`; it's generally not necessary to create this yourself.
 *
 * @extends workbox-strategies.Strategy
 * @memberof workbox-precaching
 */
var PrecacheStrategy = /*#__PURE__*/function (_Strategy) {
  _inherits(PrecacheStrategy, _Strategy);
  var _super = _createSuper(PrecacheStrategy);
  /**
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to the cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] {@link https://developers.google.com/web/tools/workbox/guides/using-plugins|Plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters|init}
   * of all fetch() requests made by this strategy.
   * @param {Object} [options.matchOptions] The
   * {@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions|CacheQueryOptions}
   * for any `cache.match()` or `cache.put()` calls made by this strategy.
   * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
   * get the response from the network if there's a precache miss.
   */
  function PrecacheStrategy() {
    var _this;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck_classCallCheck(this, PrecacheStrategy);
    options.cacheName = cacheNames_cacheNames.getPrecacheName(options.cacheName);
    _this = _super.call(this, options);
    _this._fallbackToNetwork = options.fallbackToNetwork === false ? false : true;
    // Redirected responses cannot be used to satisfy a navigation request, so
    // any redirected response must be "copied" rather than cloned, so the new
    // response doesn't contain the `redirected` flag. See:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=669363&desc=2#c1
    _this.plugins.push(PrecacheStrategy.copyRedirectedCacheableResponsesPlugin);
    return _this;
  }
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  createClass_createClass(PrecacheStrategy, [{
    key: "_handle",
    value: function () {
      var _handle2 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee(request, handler) {
        var response;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return handler.cacheMatch(request);
            case 2:
              response = _context.sent;
              if (!response) {
                _context.next = 5;
                break;
              }
              return _context.abrupt("return", response);
            case 5:
              if (!(handler.event && handler.event.type === 'install')) {
                _context.next = 9;
                break;
              }
              _context.next = 8;
              return this._handleInstall(request, handler);
            case 8:
              return _context.abrupt("return", _context.sent);
            case 9:
              _context.next = 11;
              return this._handleFetch(request, handler);
            case 11:
              return _context.abrupt("return", _context.sent);
            case 12:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function _handle(_x, _x2) {
        return _handle2.apply(this, arguments);
      }
      return _handle;
    }()
  }, {
    key: "_handleFetch",
    value: function () {
      var _handleFetch2 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee2(request, handler) {
        var response, params, integrityInManifest, integrityInRequest, noIntegrityConflict, wasCached, cacheKey;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              params = handler.params || {}; // Fall back to the network if we're configured to do so.
              if (!this._fallbackToNetwork) {
                _context2.next = 17;
                break;
              }
              if (false) {}
              integrityInManifest = params.integrity;
              integrityInRequest = request.integrity;
              noIntegrityConflict = !integrityInRequest || integrityInRequest === integrityInManifest; // Do not add integrity if the original request is no-cors
              // See https://github.com/GoogleChrome/workbox/issues/3096
              _context2.next = 8;
              return handler.fetch(new Request(request, {
                integrity: request.mode !== 'no-cors' ? integrityInRequest || integrityInManifest : undefined
              }));
            case 8:
              response = _context2.sent;
              if (!(integrityInManifest && noIntegrityConflict && request.mode !== 'no-cors')) {
                _context2.next = 15;
                break;
              }
              this._useDefaultCacheabilityPluginIfNeeded();
              _context2.next = 13;
              return handler.cachePut(request, response.clone());
            case 13:
              wasCached = _context2.sent;
              if (false) {}
            case 15:
              _context2.next = 18;
              break;
            case 17:
              throw new WorkboxError_WorkboxError('missing-precache-entry', {
                cacheName: this.cacheName,
                url: request.url
              });
            case 18:
              if (true) {
                _context2.next = 34;
                break;
              }
              _context2.t0 = params.cacheKey;
              if (_context2.t0) {
                _context2.next = 24;
                break;
              }
              _context2.next = 23;
              return handler.getCacheKey(request, 'read');
            case 23:
              _context2.t0 = _context2.sent;
            case 24:
              cacheKey = _context2.t0;
              // Workbox is going to handle the route.
              // print the routing details to the console.
              logger_logger.groupCollapsed("Precaching is responding to: " + getFriendlyURL(request.url));
              logger_logger.log("Serving the precached url: ".concat(getFriendlyURL(cacheKey instanceof Request ? cacheKey.url : cacheKey)));
              logger_logger.groupCollapsed("View request details here.");
              logger_logger.log(request);
              logger_logger.groupEnd();
              logger_logger.groupCollapsed("View response details here.");
              logger_logger.log(response);
              logger_logger.groupEnd();
              logger_logger.groupEnd();
            case 34:
              return _context2.abrupt("return", response);
            case 35:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function _handleFetch(_x3, _x4) {
        return _handleFetch2.apply(this, arguments);
      }
      return _handleFetch;
    }()
  }, {
    key: "_handleInstall",
    value: function () {
      var _handleInstall2 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee3(request, handler) {
        var response, wasCached;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              this._useDefaultCacheabilityPluginIfNeeded();
              _context3.next = 3;
              return handler.fetch(request);
            case 3:
              response = _context3.sent;
              _context3.next = 6;
              return handler.cachePut(request, response.clone());
            case 6:
              wasCached = _context3.sent;
              if (wasCached) {
                _context3.next = 9;
                break;
              }
              throw new WorkboxError_WorkboxError('bad-precaching-response', {
                url: request.url,
                status: response.status
              });
            case 9:
              return _context3.abrupt("return", response);
            case 10:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function _handleInstall(_x5, _x6) {
        return _handleInstall2.apply(this, arguments);
      }
      return _handleInstall;
    }()
    /**
     * This method is complex, as there a number of things to account for:
     *
     * The `plugins` array can be set at construction, and/or it might be added to
     * to at any time before the strategy is used.
     *
     * At the time the strategy is used (i.e. during an `install` event), there
     * needs to be at least one plugin that implements `cacheWillUpdate` in the
     * array, other than `copyRedirectedCacheableResponsesPlugin`.
     *
     * - If this method is called and there are no suitable `cacheWillUpdate`
     * plugins, we need to add `defaultPrecacheCacheabilityPlugin`.
     *
     * - If this method is called and there is exactly one `cacheWillUpdate`, then
     * we don't have to do anything (this might be a previously added
     * `defaultPrecacheCacheabilityPlugin`, or it might be a custom plugin).
     *
     * - If this method is called and there is more than one `cacheWillUpdate`,
     * then we need to check if one is `defaultPrecacheCacheabilityPlugin`. If so,
     * we need to remove it. (This situation is unlikely, but it could happen if
     * the strategy is used multiple times, the first without a `cacheWillUpdate`,
     * and then later on after manually adding a custom `cacheWillUpdate`.)
     *
     * See https://github.com/GoogleChrome/workbox/issues/2737 for more context.
     *
     * @private
     */
  }, {
    key: "_useDefaultCacheabilityPluginIfNeeded",
    value: function _useDefaultCacheabilityPluginIfNeeded() {
      var defaultPluginIndex = null;
      var cacheWillUpdatePluginCount = 0;
      var _iterator = createForOfIteratorHelper_createForOfIteratorHelper(this.plugins.entries()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
            index = _step$value[0],
            plugin = _step$value[1];
          // Ignore the copy redirected plugin when determining what to do.
          if (plugin === PrecacheStrategy.copyRedirectedCacheableResponsesPlugin) {
            continue;
          }
          // Save the default plugin's index, in case it needs to be removed.
          if (plugin === PrecacheStrategy.defaultPrecacheCacheabilityPlugin) {
            defaultPluginIndex = index;
          }
          if (plugin.cacheWillUpdate) {
            cacheWillUpdatePluginCount++;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (cacheWillUpdatePluginCount === 0) {
        this.plugins.push(PrecacheStrategy.defaultPrecacheCacheabilityPlugin);
      } else if (cacheWillUpdatePluginCount > 1 && defaultPluginIndex !== null) {
        // Only remove the default plugin; multiple custom plugins are allowed.
        this.plugins.splice(defaultPluginIndex, 1);
      }
      // Nothing needs to be done if cacheWillUpdatePluginCount is 1
    }
  }]);
  return PrecacheStrategy;
}(Strategy);
PrecacheStrategy.defaultPrecacheCacheabilityPlugin = {
  cacheWillUpdate: function cacheWillUpdate(_ref) {
    return asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee4() {
      var response;
      return regeneratorRuntime_regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            response = _ref.response;
            if (!(!response || response.status >= 400)) {
              _context4.next = 3;
              break;
            }
            return _context4.abrupt("return", null);
          case 3:
            return _context4.abrupt("return", response);
          case 4:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }))();
  }
};
PrecacheStrategy.copyRedirectedCacheableResponsesPlugin = {
  cacheWillUpdate: function cacheWillUpdate(_ref2) {
    return asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee5() {
      var response;
      return regeneratorRuntime_regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            response = _ref2.response;
            if (!response.redirected) {
              _context5.next = 7;
              break;
            }
            _context5.next = 4;
            return copyResponse(response);
          case 4:
            _context5.t0 = _context5.sent;
            _context5.next = 8;
            break;
          case 7:
            _context5.t0 = response;
          case 8:
            return _context5.abrupt("return", _context5.t0);
          case 9:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }))();
  }
};

;// CONCATENATED MODULE: ./node_modules/workbox-precaching/PrecacheController.js







/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/












/**
 * Performs efficient precaching of assets.
 *
 * @memberof workbox-precaching
 */
var PrecacheController = /*#__PURE__*/function () {
  /**
   * Create a new PrecacheController.
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] The cache to use for precaching.
   * @param {string} [options.plugins] Plugins to use when precaching as well
   * as responding to fetch events for precached assets.
   * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
   * get the response from the network if there's a precache miss.
   */
  function PrecacheController() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      cacheName = _ref.cacheName,
      _ref$plugins = _ref.plugins,
      plugins = _ref$plugins === void 0 ? [] : _ref$plugins,
      _ref$fallbackToNetwor = _ref.fallbackToNetwork,
      fallbackToNetwork = _ref$fallbackToNetwor === void 0 ? true : _ref$fallbackToNetwor;
    classCallCheck_classCallCheck(this, PrecacheController);
    this._urlsToCacheKeys = new Map();
    this._urlsToCacheModes = new Map();
    this._cacheKeysToIntegrities = new Map();
    this._strategy = new PrecacheStrategy({
      cacheName: cacheNames_cacheNames.getPrecacheName(cacheName),
      plugins: [].concat(toConsumableArray_toConsumableArray(plugins), [new PrecacheCacheKeyPlugin({
        precacheController: this
      })]),
      fallbackToNetwork: fallbackToNetwork
    });
    // Bind the install and activate methods to the instance.
    this.install = this.install.bind(this);
    this.activate = this.activate.bind(this);
  }
  /**
   * @type {workbox-precaching.PrecacheStrategy} The strategy created by this controller and
   * used to cache assets and respond to fetch events.
   */
  createClass_createClass(PrecacheController, [{
    key: "strategy",
    get: function get() {
      return this._strategy;
    }
    /**
     * Adds items to the precache list, removing any duplicates and
     * stores the files in the
     * {@link workbox-core.cacheNames|"precache cache"} when the service
     * worker installs.
     *
     * This method can be called multiple times.
     *
     * @param {Array<Object|string>} [entries=[]] Array of entries to precache.
     */
  }, {
    key: "precache",
    value: function precache(entries) {
      this.addToCacheList(entries);
      if (!this._installAndActiveListenersAdded) {
        self.addEventListener('install', this.install);
        self.addEventListener('activate', this.activate);
        this._installAndActiveListenersAdded = true;
      }
    }
    /**
     * This method will add items to the precache list, removing duplicates
     * and ensuring the information is valid.
     *
     * @param {Array<workbox-precaching.PrecacheController.PrecacheEntry|string>} entries
     *     Array of entries to precache.
     */
  }, {
    key: "addToCacheList",
    value: function addToCacheList(entries) {
      if (false) {}
      var urlsToWarnAbout = [];
      var _iterator = createForOfIteratorHelper_createForOfIteratorHelper(entries),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          // See https://github.com/GoogleChrome/workbox/issues/2259
          if (typeof entry === 'string') {
            urlsToWarnAbout.push(entry);
          } else if (entry && entry.revision === undefined) {
            urlsToWarnAbout.push(entry.url);
          }
          var _createCacheKey = createCacheKey(entry),
            cacheKey = _createCacheKey.cacheKey,
            url = _createCacheKey.url;
          var cacheMode = typeof entry !== 'string' && entry.revision ? 'reload' : 'default';
          if (this._urlsToCacheKeys.has(url) && this._urlsToCacheKeys.get(url) !== cacheKey) {
            throw new WorkboxError_WorkboxError('add-to-cache-list-conflicting-entries', {
              firstEntry: this._urlsToCacheKeys.get(url),
              secondEntry: cacheKey
            });
          }
          if (typeof entry !== 'string' && entry.integrity) {
            if (this._cacheKeysToIntegrities.has(cacheKey) && this._cacheKeysToIntegrities.get(cacheKey) !== entry.integrity) {
              throw new WorkboxError_WorkboxError('add-to-cache-list-conflicting-integrities', {
                url: url
              });
            }
            this._cacheKeysToIntegrities.set(cacheKey, entry.integrity);
          }
          this._urlsToCacheKeys.set(url, cacheKey);
          this._urlsToCacheModes.set(url, cacheMode);
          if (urlsToWarnAbout.length > 0) {
            var warningMessage = "Workbox is precaching URLs without revision " + "info: ".concat(urlsToWarnAbout.join(', '), "\nThis is generally NOT safe. ") + "Learn more at https://bit.ly/wb-precache";
            if (true) {
              // Use console directly to display this warning without bloating
              // bundle sizes by pulling in all of the logger codebase in prod.
              console.warn(warningMessage);
            } else {}
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    /**
     * Precaches new and updated assets. Call this method from the service worker
     * install event.
     *
     * Note: this method calls `event.waitUntil()` for you, so you do not need
     * to call it yourself in your event handlers.
     *
     * @param {ExtendableEvent} event
     * @return {Promise<workbox-precaching.InstallResult>}
     */
  }, {
    key: "install",
    value: function install(event) {
      var _this = this;
      // waitUntil returns Promise<any>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return waitUntil(event, /*#__PURE__*/asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee() {
        var installReportPlugin, _iterator2, _step2, _step2$value, url, cacheKey, integrity, cacheMode, request, updatedURLs, notUpdatedURLs;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              installReportPlugin = new PrecacheInstallReportPlugin();
              _this.strategy.plugins.push(installReportPlugin);
              // Cache entries one at a time.
              // See https://github.com/GoogleChrome/workbox/issues/2528
              _iterator2 = createForOfIteratorHelper_createForOfIteratorHelper(_this._urlsToCacheKeys);
              _context.prev = 3;
              _iterator2.s();
            case 5:
              if ((_step2 = _iterator2.n()).done) {
                _context.next = 14;
                break;
              }
              _step2$value = _slicedToArray(_step2.value, 2), url = _step2$value[0], cacheKey = _step2$value[1];
              integrity = _this._cacheKeysToIntegrities.get(cacheKey);
              cacheMode = _this._urlsToCacheModes.get(url);
              request = new Request(url, {
                integrity: integrity,
                cache: cacheMode,
                credentials: 'same-origin'
              });
              _context.next = 12;
              return Promise.all(_this.strategy.handleAll({
                params: {
                  cacheKey: cacheKey
                },
                request: request,
                event: event
              }));
            case 12:
              _context.next = 5;
              break;
            case 14:
              _context.next = 19;
              break;
            case 16:
              _context.prev = 16;
              _context.t0 = _context["catch"](3);
              _iterator2.e(_context.t0);
            case 19:
              _context.prev = 19;
              _iterator2.f();
              return _context.finish(19);
            case 22:
              updatedURLs = installReportPlugin.updatedURLs, notUpdatedURLs = installReportPlugin.notUpdatedURLs;
              if (false) {}
              return _context.abrupt("return", {
                updatedURLs: updatedURLs,
                notUpdatedURLs: notUpdatedURLs
              });
            case 25:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[3, 16, 19, 22]]);
      })));
    }
    /**
     * Deletes assets that are no longer present in the current precache manifest.
     * Call this method from the service worker activate event.
     *
     * Note: this method calls `event.waitUntil()` for you, so you do not need
     * to call it yourself in your event handlers.
     *
     * @param {ExtendableEvent} event
     * @return {Promise<workbox-precaching.CleanupResult>}
     */
  }, {
    key: "activate",
    value: function activate(event) {
      var _this2 = this;
      // waitUntil returns Promise<any>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return waitUntil(event, /*#__PURE__*/asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee2() {
        var cache, currentlyCachedRequests, expectedCacheKeys, deletedURLs, _iterator3, _step3, request;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return self.caches.open(_this2.strategy.cacheName);
            case 2:
              cache = _context2.sent;
              _context2.next = 5;
              return cache.keys();
            case 5:
              currentlyCachedRequests = _context2.sent;
              expectedCacheKeys = new Set(_this2._urlsToCacheKeys.values());
              deletedURLs = [];
              _iterator3 = createForOfIteratorHelper_createForOfIteratorHelper(currentlyCachedRequests);
              _context2.prev = 9;
              _iterator3.s();
            case 11:
              if ((_step3 = _iterator3.n()).done) {
                _context2.next = 19;
                break;
              }
              request = _step3.value;
              if (expectedCacheKeys.has(request.url)) {
                _context2.next = 17;
                break;
              }
              _context2.next = 16;
              return cache.delete(request);
            case 16:
              deletedURLs.push(request.url);
            case 17:
              _context2.next = 11;
              break;
            case 19:
              _context2.next = 24;
              break;
            case 21:
              _context2.prev = 21;
              _context2.t0 = _context2["catch"](9);
              _iterator3.e(_context2.t0);
            case 24:
              _context2.prev = 24;
              _iterator3.f();
              return _context2.finish(24);
            case 27:
              if (false) {}
              return _context2.abrupt("return", {
                deletedURLs: deletedURLs
              });
            case 29:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[9, 21, 24, 27]]);
      })));
    }
    /**
     * Returns a mapping of a precached URL to the corresponding cache key, taking
     * into account the revision information for the URL.
     *
     * @return {Map<string, string>} A URL to cache key mapping.
     */
  }, {
    key: "getURLsToCacheKeys",
    value: function getURLsToCacheKeys() {
      return this._urlsToCacheKeys;
    }
    /**
     * Returns a list of all the URLs that have been precached by the current
     * service worker.
     *
     * @return {Array<string>} The precached URLs.
     */
  }, {
    key: "getCachedURLs",
    value: function getCachedURLs() {
      return toConsumableArray_toConsumableArray(this._urlsToCacheKeys.keys());
    }
    /**
     * Returns the cache key used for storing a given URL. If that URL is
     * unversioned, like `/index.html', then the cache key will be the original
     * URL with a search parameter appended to it.
     *
     * @param {string} url A URL whose cache key you want to look up.
     * @return {string} The versioned URL that corresponds to a cache key
     * for the original URL, or undefined if that URL isn't precached.
     */
  }, {
    key: "getCacheKeyForURL",
    value: function getCacheKeyForURL(url) {
      var urlObject = new URL(url, location.href);
      return this._urlsToCacheKeys.get(urlObject.href);
    }
    /**
     * @param {string} url A cache key whose SRI you want to look up.
     * @return {string} The subresource integrity associated with the cache key,
     * or undefined if it's not set.
     */
  }, {
    key: "getIntegrityForCacheKey",
    value: function getIntegrityForCacheKey(cacheKey) {
      return this._cacheKeysToIntegrities.get(cacheKey);
    }
    /**
     * This acts as a drop-in replacement for
     * [`cache.match()`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
     * with the following differences:
     *
     * - It knows what the name of the precache is, and only checks in that cache.
     * - It allows you to pass in an "original" URL without versioning parameters,
     * and it will automatically look up the correct cache key for the currently
     * active revision of that URL.
     *
     * E.g., `matchPrecache('index.html')` will find the correct precached
     * response for the currently active service worker, even if the actual cache
     * key is `'/index.html?__WB_REVISION__=1234abcd'`.
     *
     * @param {string|Request} request The key (without revisioning parameters)
     * to look up in the precache.
     * @return {Promise<Response|undefined>}
     */
  }, {
    key: "matchPrecache",
    value: function () {
      var _matchPrecache = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee3(request) {
        var url, cacheKey, cache;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              url = request instanceof Request ? request.url : request;
              cacheKey = this.getCacheKeyForURL(url);
              if (!cacheKey) {
                _context3.next = 7;
                break;
              }
              _context3.next = 5;
              return self.caches.open(this.strategy.cacheName);
            case 5:
              cache = _context3.sent;
              return _context3.abrupt("return", cache.match(cacheKey));
            case 7:
              return _context3.abrupt("return", undefined);
            case 8:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function matchPrecache(_x) {
        return _matchPrecache.apply(this, arguments);
      }
      return matchPrecache;
    }()
    /**
     * Returns a function that looks up `url` in the precache (taking into
     * account revision information), and returns the corresponding `Response`.
     *
     * @param {string} url The precached URL which will be used to lookup the
     * `Response`.
     * @return {workbox-routing~handlerCallback}
     */
  }, {
    key: "createHandlerBoundToURL",
    value: function createHandlerBoundToURL(url) {
      var _this3 = this;
      var cacheKey = this.getCacheKeyForURL(url);
      if (!cacheKey) {
        throw new WorkboxError_WorkboxError('non-precached-url', {
          url: url
        });
      }
      return function (options) {
        options.request = new Request(url);
        options.params = Object.assign({
          cacheKey: cacheKey
        }, options.params);
        return _this3.strategy.handle(options);
      };
    }
  }]);
  return PrecacheController;
}();

;// CONCATENATED MODULE: ./node_modules/workbox-precaching/utils/getOrCreatePrecacheController.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


var precacheController;
/**
 * @return {PrecacheController}
 * @private
 */
var getOrCreatePrecacheController_getOrCreatePrecacheController = function getOrCreatePrecacheController() {
  if (!precacheController) {
    precacheController = new PrecacheController();
  }
  return precacheController;
};
;// CONCATENATED MODULE: ./node_modules/workbox-precaching/addPlugins.js

/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


/**
 * Adds plugins to the precaching strategy.
 *
 * @param {Array<Object>} plugins
 *
 * @memberof workbox-precaching
 */
function addPlugins(plugins) {
  var _precacheController$s;
  var precacheController = getOrCreatePrecacheController();
  (_precacheController$s = precacheController.strategy.plugins).push.apply(_precacheController$s, _toConsumableArray(plugins));
}

// EXTERNAL MODULE: ./node_modules/workbox-routing/_version.js
var workbox_routing_version = __webpack_require__(185);
;// CONCATENATED MODULE: ./node_modules/workbox-routing/utils/constants.js
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/**
 * The default HTTP method, 'GET', used when there's no specific method
 * configured for a route.
 *
 * @type {string}
 *
 * @private
 */
var defaultMethod = 'GET';
/**
 * The list of valid HTTP methods associated with requests that could be routed.
 *
 * @type {Array<string>}
 *
 * @private
 */
var validMethods = (/* unused pure expression or super */ null && (['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT']));
;// CONCATENATED MODULE: ./node_modules/workbox-routing/utils/normalizeHandler.js
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


/**
 * @param {function()|Object} handler Either a function, or an object with a
 * 'handle' method.
 * @return {Object} An object with a handle method.
 *
 * @private
 */
var normalizeHandler = function normalizeHandler(handler) {
  if (handler && typeof handler === 'object') {
    if (false) {}
    return handler;
  } else {
    if (false) {}
    return {
      handle: handler
    };
  }
};
;// CONCATENATED MODULE: ./node_modules/workbox-routing/Route.js


/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




/**
 * A `Route` consists of a pair of callback functions, "match" and "handler".
 * The "match" callback determine if a route should be used to "handle" a
 * request by returning a non-falsy value if it can. The "handler" callback
 * is called when there is a match and should return a Promise that resolves
 * to a `Response`.
 *
 * @memberof workbox-routing
 */
var Route = /*#__PURE__*/function () {
  /**
   * Constructor for Route class.
   *
   * @param {workbox-routing~matchCallback} match
   * A callback function that determines whether the route matches a given
   * `fetch` event by returning a non-falsy value.
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  function Route(match, handler) {
    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultMethod;
    classCallCheck_classCallCheck(this, Route);
    if (false) {}
    // These values are referenced directly by Router so cannot be
    // altered by minificaton.
    this.handler = normalizeHandler(handler);
    this.match = match;
    this.method = method;
  }
  /**
   *
   * @param {workbox-routing-handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response
   */
  createClass_createClass(Route, [{
    key: "setCatchHandler",
    value: function setCatchHandler(handler) {
      this.catchHandler = normalizeHandler(handler);
    }
  }]);
  return Route;
}();

;// CONCATENATED MODULE: ./node_modules/workbox-routing/RegExpRoute.js




/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




/**
 * RegExpRoute makes it easy to create a regular expression based
 * {@link workbox-routing.Route}.
 *
 * For same-origin requests the RegExp only needs to match part of the URL. For
 * requests against third-party servers, you must define a RegExp that matches
 * the start of the URL.
 *
 * @memberof workbox-routing
 * @extends workbox-routing.Route
 */
var RegExpRoute = /*#__PURE__*/function (_Route) {
  _inherits(RegExpRoute, _Route);
  var _super = _createSuper(RegExpRoute);
  /**
   * If the regular expression contains
   * [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
   * the captured values will be passed to the
   * {@link workbox-routing~handlerCallback} `params`
   * argument.
   *
   * @param {RegExp} regExp The regular expression to match against URLs.
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  function RegExpRoute(regExp, handler, method) {
    classCallCheck_classCallCheck(this, RegExpRoute);
    if (false) {}
    var match = function match(_ref) {
      var url = _ref.url;
      var result = regExp.exec(url.href);
      // Return immediately if there's no match.
      if (!result) {
        return;
      }
      // Require that the match start at the first character in the URL string
      // if it's a cross-origin request.
      // See https://github.com/GoogleChrome/workbox/issues/281 for the context
      // behind this behavior.
      if (url.origin !== location.origin && result.index !== 0) {
        if (false) {}
        return;
      }
      // If the route matches, but there aren't any capture groups defined, then
      // this will return [], which is truthy and therefore sufficient to
      // indicate a match.
      // If there are capture groups, then it will return their values.
      return result.slice(1);
    };
    return _super.call(this, match, handler, method);
  }
  return createClass_createClass(RegExpRoute);
}(Route);

;// CONCATENATED MODULE: ./node_modules/workbox-routing/Router.js







/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/







/**
 * The Router can be used to process a `FetchEvent` using one or more
 * {@link workbox-routing.Route}, responding with a `Response` if
 * a matching route exists.
 *
 * If no route matches a given a request, the Router will use a "default"
 * handler if one is defined.
 *
 * Should the matching Route throw an error, the Router will use a "catch"
 * handler if one is defined to gracefully deal with issues and respond with a
 * Request.
 *
 * If a request matches multiple routes, the **earliest** registered route will
 * be used to respond to the request.
 *
 * @memberof workbox-routing
 */
var Router = /*#__PURE__*/function () {
  /**
   * Initializes a new Router.
   */
  function Router() {
    classCallCheck_classCallCheck(this, Router);
    this._routes = new Map();
    this._defaultHandlerMap = new Map();
  }
  /**
   * @return {Map<string, Array<workbox-routing.Route>>} routes A `Map` of HTTP
   * method name ('GET', etc.) to an array of all the corresponding `Route`
   * instances that are registered.
   */
  createClass_createClass(Router, [{
    key: "routes",
    get: function get() {
      return this._routes;
    }
    /**
     * Adds a fetch event listener to respond to events when a route matches
     * the event's request.
     */
  }, {
    key: "addFetchListener",
    value: function addFetchListener() {
      var _this = this;
      // See https://github.com/Microsoft/TypeScript/issues/28357#issuecomment-436484705
      self.addEventListener('fetch', function (event) {
        var request = event.request;
        var responsePromise = _this.handleRequest({
          request: request,
          event: event
        });
        if (responsePromise) {
          event.respondWith(responsePromise);
        }
      });
    }
    /**
     * Adds a message event listener for URLs to cache from the window.
     * This is useful to cache resources loaded on the page prior to when the
     * service worker started controlling it.
     *
     * The format of the message data sent from the window should be as follows.
     * Where the `urlsToCache` array may consist of URL strings or an array of
     * URL string + `requestInit` object (the same as you'd pass to `fetch()`).
     *
     * ```
     * {
     *   type: 'CACHE_URLS',
     *   payload: {
     *     urlsToCache: [
     *       './script1.js',
     *       './script2.js',
     *       ['./script3.js', {mode: 'no-cors'}],
     *     ],
     *   },
     * }
     * ```
     */
  }, {
    key: "addCacheListener",
    value: function addCacheListener() {
      var _this2 = this;
      // See https://github.com/Microsoft/TypeScript/issues/28357#issuecomment-436484705
      self.addEventListener('message', function (event) {
        // event.data is type 'any'
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (event.data && event.data.type === 'CACHE_URLS') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          var payload = event.data.payload;
          if (false) {}
          var requestPromises = Promise.all(payload.urlsToCache.map(function (entry) {
            if (typeof entry === 'string') {
              entry = [entry];
            }
            var request = _construct(Request, toConsumableArray_toConsumableArray(entry));
            return _this2.handleRequest({
              request: request,
              event: event
            });
            // TODO(philipwalton): TypeScript errors without this typecast for
            // some reason (probably a bug). The real type here should work but
            // doesn't: `Array<Promise<Response> | undefined>`.
          })); // TypeScript
          event.waitUntil(requestPromises);
          // If a MessageChannel was used, reply to the message on success.
          if (event.ports && event.ports[0]) {
            void requestPromises.then(function () {
              return event.ports[0].postMessage(true);
            });
          }
        }
      });
    }
    /**
     * Apply the routing rules to a FetchEvent object to get a Response from an
     * appropriate Route's handler.
     *
     * @param {Object} options
     * @param {Request} options.request The request to handle.
     * @param {ExtendableEvent} options.event The event that triggered the
     *     request.
     * @return {Promise<Response>|undefined} A promise is returned if a
     *     registered route can handle the request. If there is no matching
     *     route and there's no `defaultHandler`, `undefined` is returned.
     */
  }, {
    key: "handleRequest",
    value: function handleRequest(_ref) {
      var _this3 = this;
      var request = _ref.request,
        event = _ref.event;
      if (false) {}
      var url = new URL(request.url, location.href);
      if (!url.protocol.startsWith('http')) {
        if (false) {}
        return;
      }
      var sameOrigin = url.origin === location.origin;
      var _this$findMatchingRou = this.findMatchingRoute({
          event: event,
          request: request,
          sameOrigin: sameOrigin,
          url: url
        }),
        params = _this$findMatchingRou.params,
        route = _this$findMatchingRou.route;
      var handler = route && route.handler;
      var debugMessages = [];
      if (false) {}
      // If we don't have a handler because there was no matching route, then
      // fall back to defaultHandler if that's defined.
      var method = request.method;
      if (!handler && this._defaultHandlerMap.has(method)) {
        if (false) {}
        handler = this._defaultHandlerMap.get(method);
      }
      if (!handler) {
        if (false) {}
        return;
      }
      if (false) {}
      // Wrap in try and catch in case the handle method throws a synchronous
      // error. It should still callback to the catch handler.
      var responsePromise;
      try {
        responsePromise = handler.handle({
          url: url,
          request: request,
          event: event,
          params: params
        });
      } catch (err) {
        responsePromise = Promise.reject(err);
      }
      // Get route's catch handler, if it exists
      var catchHandler = route && route.catchHandler;
      if (responsePromise instanceof Promise && (this._catchHandler || catchHandler)) {
        responsePromise = responsePromise.catch( /*#__PURE__*/function () {
          var _ref2 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee(err) {
            return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  if (!catchHandler) {
                    _context.next = 11;
                    break;
                  }
                  if (false) {}
                  _context.prev = 2;
                  _context.next = 5;
                  return catchHandler.handle({
                    url: url,
                    request: request,
                    event: event,
                    params: params
                  });
                case 5:
                  return _context.abrupt("return", _context.sent);
                case 8:
                  _context.prev = 8;
                  _context.t0 = _context["catch"](2);
                  if (_context.t0 instanceof Error) {
                    err = _context.t0;
                  }
                case 11:
                  if (!_this3._catchHandler) {
                    _context.next = 14;
                    break;
                  }
                  if (false) {}
                  return _context.abrupt("return", _this3._catchHandler.handle({
                    url: url,
                    request: request,
                    event: event
                  }));
                case 14:
                  throw err;
                case 15:
                case "end":
                  return _context.stop();
              }
            }, _callee, null, [[2, 8]]);
          }));
          return function (_x) {
            return _ref2.apply(this, arguments);
          };
        }());
      }
      return responsePromise;
    }
    /**
     * Checks a request and URL (and optionally an event) against the list of
     * registered routes, and if there's a match, returns the corresponding
     * route along with any params generated by the match.
     *
     * @param {Object} options
     * @param {URL} options.url
     * @param {boolean} options.sameOrigin The result of comparing `url.origin`
     *     against the current origin.
     * @param {Request} options.request The request to match.
     * @param {Event} options.event The corresponding event.
     * @return {Object} An object with `route` and `params` properties.
     *     They are populated if a matching route was found or `undefined`
     *     otherwise.
     */
  }, {
    key: "findMatchingRoute",
    value: function findMatchingRoute(_ref3) {
      var url = _ref3.url,
        sameOrigin = _ref3.sameOrigin,
        request = _ref3.request,
        event = _ref3.event;
      var routes = this._routes.get(request.method) || [];
      var _iterator = createForOfIteratorHelper_createForOfIteratorHelper(routes),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var route = _step.value;
          var params = void 0;
          // route.match returns type any, not possible to change right now.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          var matchResult = route.match({
            url: url,
            sameOrigin: sameOrigin,
            request: request,
            event: event
          });
          if (matchResult) {
            if (false) {}
            // See https://github.com/GoogleChrome/workbox/issues/2079
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            params = matchResult;
            if (Array.isArray(params) && params.length === 0) {
              // Instead of passing an empty array in as params, use undefined.
              params = undefined;
            } else if (matchResult.constructor === Object &&
            // eslint-disable-line
            Object.keys(matchResult).length === 0) {
              // Instead of passing an empty object in as params, use undefined.
              params = undefined;
            } else if (typeof matchResult === 'boolean') {
              // For the boolean value true (rather than just something truth-y),
              // don't set params.
              // See https://github.com/GoogleChrome/workbox/pull/2134#issuecomment-513924353
              params = undefined;
            }
            // Return early if have a match.
            return {
              route: route,
              params: params
            };
          }
        }
        // If no match was found above, return and empty object.
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return {};
    }
    /**
     * Define a default `handler` that's called when no routes explicitly
     * match the incoming request.
     *
     * Each HTTP method ('GET', 'POST', etc.) gets its own default handler.
     *
     * Without a default handler, unmatched requests will go against the
     * network as if there were no service worker present.
     *
     * @param {workbox-routing~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     * @param {string} [method='GET'] The HTTP method to associate with this
     * default handler. Each method has its own default.
     */
  }, {
    key: "setDefaultHandler",
    value: function setDefaultHandler(handler) {
      var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultMethod;
      this._defaultHandlerMap.set(method, normalizeHandler(handler));
    }
    /**
     * If a Route throws an error while handling a request, this `handler`
     * will be called and given a chance to provide a response.
     *
     * @param {workbox-routing~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     */
  }, {
    key: "setCatchHandler",
    value: function setCatchHandler(handler) {
      this._catchHandler = normalizeHandler(handler);
    }
    /**
     * Registers a route with the router.
     *
     * @param {workbox-routing.Route} route The route to register.
     */
  }, {
    key: "registerRoute",
    value: function registerRoute(route) {
      if (false) {}
      if (!this._routes.has(route.method)) {
        this._routes.set(route.method, []);
      }
      // Give precedence to all of the earlier routes by adding this additional
      // route to the end of the array.
      this._routes.get(route.method).push(route);
    }
    /**
     * Unregisters a route with the router.
     *
     * @param {workbox-routing.Route} route The route to unregister.
     */
  }, {
    key: "unregisterRoute",
    value: function unregisterRoute(route) {
      if (!this._routes.has(route.method)) {
        throw new WorkboxError_WorkboxError('unregister-route-but-not-found-with-method', {
          method: route.method
        });
      }
      var routeIndex = this._routes.get(route.method).indexOf(route);
      if (routeIndex > -1) {
        this._routes.get(route.method).splice(routeIndex, 1);
      } else {
        throw new WorkboxError_WorkboxError('unregister-route-route-not-registered');
      }
    }
  }]);
  return Router;
}();

;// CONCATENATED MODULE: ./node_modules/workbox-routing/utils/getOrCreateDefaultRouter.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


var defaultRouter;
/**
 * Creates a new, singleton Router instance if one does not exist. If one
 * does already exist, that instance is returned.
 *
 * @private
 * @return {Router}
 */
var getOrCreateDefaultRouter_getOrCreateDefaultRouter = function getOrCreateDefaultRouter() {
  if (!defaultRouter) {
    defaultRouter = new Router();
    // The helpers that use the default Router assume these listeners exist.
    defaultRouter.addFetchListener();
    defaultRouter.addCacheListener();
  }
  return defaultRouter;
};
;// CONCATENATED MODULE: ./node_modules/workbox-routing/registerRoute.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/






/**
 * Easily register a RegExp, string, or function with a caching
 * strategy to a singleton Router instance.
 *
 * This method will generate a Route for you if needed and
 * call {@link workbox-routing.Router#registerRoute}.
 *
 * @param {RegExp|string|workbox-routing.Route~matchCallback|workbox-routing.Route} capture
 * If the capture param is a `Route`, all other arguments will be ignored.
 * @param {workbox-routing~handlerCallback} [handler] A callback
 * function that returns a Promise resulting in a Response. This parameter
 * is required if `capture` is not a `Route` object.
 * @param {string} [method='GET'] The HTTP method to match the Route
 * against.
 * @return {workbox-routing.Route} The generated `Route`.
 *
 * @memberof workbox-routing
 */
function registerRoute(capture, handler, method) {
  var route;
  if (typeof capture === 'string') {
    var captureUrl = new URL(capture, location.href);
    if (false) { var wildcards, valueToCheck; }
    var matchCallback = function matchCallback(_ref) {
      var url = _ref.url;
      if (false) {}
      return url.href === captureUrl.href;
    };
    // If `capture` is a string then `handler` and `method` must be present.
    route = new Route(matchCallback, handler, method);
  } else if (capture instanceof RegExp) {
    // If `capture` is a `RegExp` then `handler` and `method` must be present.
    route = new RegExpRoute(capture, handler, method);
  } else if (typeof capture === 'function') {
    // If `capture` is a function then `handler` and `method` must be present.
    route = new Route(capture, handler, method);
  } else if (capture instanceof Route) {
    route = capture;
  } else {
    throw new WorkboxError_WorkboxError('unsupported-route-type', {
      moduleName: 'workbox-routing',
      funcName: 'registerRoute',
      paramName: 'capture'
    });
  }
  var defaultRouter = getOrCreateDefaultRouter_getOrCreateDefaultRouter();
  defaultRouter.registerRoute(route);
  return route;
}

;// CONCATENATED MODULE: ./node_modules/workbox-precaching/utils/removeIgnoredSearchParams.js

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/**
 * Removes any URL search parameters that should be ignored.
 *
 * @param {URL} urlObject The original URL.
 * @param {Array<RegExp>} ignoreURLParametersMatching RegExps to test against
 * each search parameter name. Matches mean that the search parameter should be
 * ignored.
 * @return {URL} The URL with any ignored search parameters removed.
 *
 * @private
 * @memberof workbox-precaching
 */
function removeIgnoredSearchParams(urlObject) {
  var ignoreURLParametersMatching = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var _loop = function _loop() {
    var paramName = _arr[_i];
    if (ignoreURLParametersMatching.some(function (regExp) {
      return regExp.test(paramName);
    })) {
      urlObject.searchParams.delete(paramName);
    }
  };
  // Convert the iterable into an array at the start of the loop to make sure
  // deletion doesn't mess up iteration.
  for (var _i = 0, _arr = toConsumableArray_toConsumableArray(urlObject.searchParams.keys()); _i < _arr.length; _i++) {
    _loop();
  }
  return urlObject;
}
;// CONCATENATED MODULE: ./node_modules/workbox-precaching/utils/generateURLVariations.js


/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


/**
 * Generator function that yields possible variations on the original URL to
 * check, one at a time.
 *
 * @param {string} url
 * @param {Object} options
 *
 * @private
 * @memberof workbox-precaching
 */
function generateURLVariations(url) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$ignoreURLParamet = _ref.ignoreURLParametersMatching,
    ignoreURLParametersMatching = _ref$ignoreURLParamet === void 0 ? [/^utm_/, /^fbclid$/] : _ref$ignoreURLParamet,
    _ref$directoryIndex = _ref.directoryIndex,
    directoryIndex = _ref$directoryIndex === void 0 ? 'index.html' : _ref$directoryIndex,
    _ref$cleanURLs = _ref.cleanURLs,
    cleanURLs = _ref$cleanURLs === void 0 ? true : _ref$cleanURLs,
    urlManipulation = _ref.urlManipulation;
  return /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee() {
    var urlObject, urlWithoutIgnoredParams, directoryURL, cleanURL, additionalURLs, _iterator, _step, urlToAttempt;
    return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          urlObject = new URL(url, location.href);
          urlObject.hash = '';
          _context.next = 4;
          return urlObject.href;
        case 4:
          urlWithoutIgnoredParams = removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching);
          _context.next = 7;
          return urlWithoutIgnoredParams.href;
        case 7:
          if (!(directoryIndex && urlWithoutIgnoredParams.pathname.endsWith('/'))) {
            _context.next = 12;
            break;
          }
          directoryURL = new URL(urlWithoutIgnoredParams.href);
          directoryURL.pathname += directoryIndex;
          _context.next = 12;
          return directoryURL.href;
        case 12:
          if (!cleanURLs) {
            _context.next = 17;
            break;
          }
          cleanURL = new URL(urlWithoutIgnoredParams.href);
          cleanURL.pathname += '.html';
          _context.next = 17;
          return cleanURL.href;
        case 17:
          if (!urlManipulation) {
            _context.next = 36;
            break;
          }
          additionalURLs = urlManipulation({
            url: urlObject
          });
          _iterator = createForOfIteratorHelper_createForOfIteratorHelper(additionalURLs);
          _context.prev = 20;
          _iterator.s();
        case 22:
          if ((_step = _iterator.n()).done) {
            _context.next = 28;
            break;
          }
          urlToAttempt = _step.value;
          _context.next = 26;
          return urlToAttempt.href;
        case 26:
          _context.next = 22;
          break;
        case 28:
          _context.next = 33;
          break;
        case 30:
          _context.prev = 30;
          _context.t0 = _context["catch"](20);
          _iterator.e(_context.t0);
        case 33:
          _context.prev = 33;
          _iterator.f();
          return _context.finish(33);
        case 36:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[20, 30, 33, 36]]);
  })();
}
;// CONCATENATED MODULE: ./node_modules/workbox-precaching/PrecacheRoute.js





/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/





/**
 * A subclass of {@link workbox-routing.Route} that takes a
 * {@link workbox-precaching.PrecacheController}
 * instance and uses it to match incoming requests and handle fetching
 * responses from the precache.
 *
 * @memberof workbox-precaching
 * @extends workbox-routing.Route
 */
var PrecacheRoute = /*#__PURE__*/function (_Route) {
  _inherits(PrecacheRoute, _Route);
  var _super = _createSuper(PrecacheRoute);
  /**
   * @param {PrecacheController} precacheController A `PrecacheController`
   * instance used to both match requests and respond to fetch events.
   * @param {Object} [options] Options to control how requests are matched
   * against the list of precached URLs.
   * @param {string} [options.directoryIndex=index.html] The `directoryIndex` will
   * check cache entries for a URLs ending with '/' to see if there is a hit when
   * appending the `directoryIndex` value.
   * @param {Array<RegExp>} [options.ignoreURLParametersMatching=[/^utm_/, /^fbclid$/]] An
   * array of regex's to remove search params when looking for a cache match.
   * @param {boolean} [options.cleanURLs=true] The `cleanURLs` option will
   * check the cache for the URL with a `.html` added to the end of the end.
   * @param {workbox-precaching~urlManipulation} [options.urlManipulation]
   * This is a function that should take a URL and return an array of
   * alternative URLs that should be checked for precache matches.
   */
  function PrecacheRoute(precacheController, options) {
    classCallCheck_classCallCheck(this, PrecacheRoute);
    var match = function match(_ref) {
      var request = _ref.request;
      var urlsToCacheKeys = precacheController.getURLsToCacheKeys();
      var _iterator = createForOfIteratorHelper_createForOfIteratorHelper(generateURLVariations(request.url, options)),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var possibleURL = _step.value;
          var cacheKey = urlsToCacheKeys.get(possibleURL);
          if (cacheKey) {
            var integrity = precacheController.getIntegrityForCacheKey(cacheKey);
            return {
              cacheKey: cacheKey,
              integrity: integrity
            };
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (false) {}
      return;
    };
    return _super.call(this, match, precacheController.strategy);
  }
  return createClass_createClass(PrecacheRoute);
}(Route);

;// CONCATENATED MODULE: ./node_modules/workbox-precaching/addRoute.js
/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




/**
 * Add a `fetch` listener to the service worker that will
 * respond to
 * [network requests]{@link https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Custom_responses_to_requests}
 * with precached assets.
 *
 * Requests for assets that aren't precached, the `FetchEvent` will not be
 * responded to, allowing the event to fall through to other `fetch` event
 * listeners.
 *
 * @param {Object} [options] See the {@link workbox-precaching.PrecacheRoute}
 * options.
 *
 * @memberof workbox-precaching
 */
function addRoute(options) {
  var precacheController = getOrCreatePrecacheController_getOrCreatePrecacheController();
  var precacheRoute = new PrecacheRoute(precacheController, options);
  registerRoute(precacheRoute);
}

;// CONCATENATED MODULE: ./node_modules/workbox-precaching/utils/deleteOutdatedCaches.js


/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

var SUBSTRING_TO_FIND = '-precache-';
/**
 * Cleans up incompatible precaches that were created by older versions of
 * Workbox, by a service worker registered under the current scope.
 *
 * This is meant to be called as part of the `activate` event.
 *
 * This should be safe to use as long as you don't include `substringToFind`
 * (defaulting to `-precache-`) in your non-precache cache names.
 *
 * @param {string} currentPrecacheName The cache name currently in use for
 * precaching. This cache won't be deleted.
 * @param {string} [substringToFind='-precache-'] Cache names which include this
 * substring will be deleted (excluding `currentPrecacheName`).
 * @return {Array<string>} A list of all the cache names that were deleted.
 *
 * @private
 * @memberof workbox-precaching
 */
var deleteOutdatedCaches_deleteOutdatedCaches = /*#__PURE__*/(/* unused pure expression or super */ null && (function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(currentPrecacheName) {
    var substringToFind,
      cacheNames,
      cacheNamesToDelete,
      _args = arguments;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          substringToFind = _args.length > 1 && _args[1] !== undefined ? _args[1] : SUBSTRING_TO_FIND;
          _context.next = 3;
          return self.caches.keys();
        case 3:
          cacheNames = _context.sent;
          cacheNamesToDelete = cacheNames.filter(function (cacheName) {
            return cacheName.includes(substringToFind) && cacheName.includes(self.registration.scope) && cacheName !== currentPrecacheName;
          });
          _context.next = 7;
          return Promise.all(cacheNamesToDelete.map(function (cacheName) {
            return self.caches.delete(cacheName);
          }));
        case 7:
          return _context.abrupt("return", cacheNamesToDelete);
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function deleteOutdatedCaches(_x) {
    return _ref.apply(this, arguments);
  };
}()));

;// CONCATENATED MODULE: ./node_modules/workbox-precaching/cleanupOutdatedCaches.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




/**
 * Adds an `activate` event listener which will clean up incompatible
 * precaches that were created by older versions of Workbox.
 *
 * @memberof workbox-precaching
 */
function cleanupOutdatedCaches() {
  // See https://github.com/Microsoft/TypeScript/issues/28357#issuecomment-436484705
  self.addEventListener('activate', function (event) {
    var cacheName = cacheNames.getPrecacheName();
    event.waitUntil(deleteOutdatedCaches(cacheName).then(function (cachesDeleted) {
      if (false) {}
    }));
  });
}

;// CONCATENATED MODULE: ./node_modules/workbox-precaching/createHandlerBoundToURL.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


/**
 * Helper function that calls
 * {@link PrecacheController#createHandlerBoundToURL} on the default
 * {@link PrecacheController} instance.
 *
 * If you are creating your own {@link PrecacheController}, then call the
 * {@link PrecacheController#createHandlerBoundToURL} on that instance,
 * instead of using this function.
 *
 * @param {string} url The precached URL which will be used to lookup the
 * `Response`.
 * @param {boolean} [fallbackToNetwork=true] Whether to attempt to get the
 * response from the network if there's a precache miss.
 * @return {workbox-routing~handlerCallback}
 *
 * @memberof workbox-precaching
 */
function createHandlerBoundToURL(url) {
  var precacheController = getOrCreatePrecacheController_getOrCreatePrecacheController();
  return precacheController.createHandlerBoundToURL(url);
}

;// CONCATENATED MODULE: ./node_modules/workbox-precaching/getCacheKeyForURL.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


/**
 * Takes in a URL, and returns the corresponding URL that could be used to
 * lookup the entry in the precache.
 *
 * If a relative URL is provided, the location of the service worker file will
 * be used as the base.
 *
 * For precached entries without revision information, the cache key will be the
 * same as the original URL.
 *
 * For precached entries with revision information, the cache key will be the
 * original URL with the addition of a query parameter used for keeping track of
 * the revision info.
 *
 * @param {string} url The URL whose cache key to look up.
 * @return {string} The cache key that corresponds to that URL.
 *
 * @memberof workbox-precaching
 */
function getCacheKeyForURL(url) {
  var precacheController = getOrCreatePrecacheController();
  return precacheController.getCacheKeyForURL(url);
}

;// CONCATENATED MODULE: ./node_modules/workbox-precaching/matchPrecache.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


/**
 * Helper function that calls
 * {@link PrecacheController#matchPrecache} on the default
 * {@link PrecacheController} instance.
 *
 * If you are creating your own {@link PrecacheController}, then call
 * {@link PrecacheController#matchPrecache} on that instance,
 * instead of using this function.
 *
 * @param {string|Request} request The key (without revisioning parameters)
 * to look up in the precache.
 * @return {Promise<Response|undefined>}
 *
 * @memberof workbox-precaching
 */
function matchPrecache(request) {
  var precacheController = getOrCreatePrecacheController();
  return precacheController.matchPrecache(request);
}

;// CONCATENATED MODULE: ./node_modules/workbox-precaching/precache.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


/**
 * Adds items to the precache list, removing any duplicates and
 * stores the files in the
 * {@link workbox-core.cacheNames|"precache cache"} when the service
 * worker installs.
 *
 * This method can be called multiple times.
 *
 * Please note: This method **will not** serve any of the cached files for you.
 * It only precaches files. To respond to a network request you call
 * {@link workbox-precaching.addRoute}.
 *
 * If you have a single array of files to precache, you can just call
 * {@link workbox-precaching.precacheAndRoute}.
 *
 * @param {Array<Object|string>} [entries=[]] Array of entries to precache.
 *
 * @memberof workbox-precaching
 */
function precache(entries) {
  var precacheController = getOrCreatePrecacheController_getOrCreatePrecacheController();
  precacheController.precache(entries);
}

;// CONCATENATED MODULE: ./node_modules/workbox-precaching/precacheAndRoute.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/



/**
 * This method will add entries to the precache list and add a route to
 * respond to fetch events.
 *
 * This is a convenience method that will call
 * {@link workbox-precaching.precache} and
 * {@link workbox-precaching.addRoute} in a single call.
 *
 * @param {Array<Object|string>} entries Array of entries to precache.
 * @param {Object} [options] See the
 * {@link workbox-precaching.PrecacheRoute} options.
 *
 * @memberof workbox-precaching
 */
function precacheAndRoute(entries, options) {
  precache(entries);
  addRoute(options);
}

;// CONCATENATED MODULE: ./node_modules/workbox-precaching/PrecacheFallbackPlugin.js


/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


/**
 * `PrecacheFallbackPlugin` allows you to specify an "offline fallback"
 * response to be used when a given strategy is unable to generate a response.
 *
 * It does this by intercepting the `handlerDidError` plugin callback
 * and returning a precached response, taking the expected revision parameter
 * into account automatically.
 *
 * Unless you explicitly pass in a `PrecacheController` instance to the
 * constructor, the default instance will be used. Generally speaking, most
 * developers will end up using the default.
 *
 * @memberof workbox-precaching
 */
var PrecacheFallbackPlugin = /*#__PURE__*/(/* unused pure expression or super */ null && (_createClass(
/**
 * Constructs a new PrecacheFallbackPlugin with the associated fallbackURL.
 *
 * @param {Object} config
 * @param {string} config.fallbackURL A precached URL to use as the fallback
 *     if the associated strategy can't generate a response.
 * @param {PrecacheController} [config.precacheController] An optional
 *     PrecacheController instance. If not provided, the default
 *     PrecacheController will be used.
 */
function PrecacheFallbackPlugin(_ref) {
  var _this = this;
  var fallbackURL = _ref.fallbackURL,
    precacheController = _ref.precacheController;
  _classCallCheck(this, PrecacheFallbackPlugin);
  /**
   * @return {Promise<Response>} The precache response for the fallback URL.
   *
   * @private
   */
  this.handlerDidError = function () {
    return _this._precacheController.matchPrecache(_this._fallbackURL);
  };
  this._fallbackURL = fallbackURL;
  this._precacheController = precacheController || getOrCreatePrecacheController();
})));

;// CONCATENATED MODULE: ./node_modules/workbox-precaching/_types.js
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

// * * * IMPORTANT! * * *
// ------------------------------------------------------------------------- //
// jdsoc type definitions cannot be declared above TypeScript definitions or
// they'll be stripped from the built `.js` files, and they'll only be in the
// `d.ts` files, which aren't read by the jsdoc generator. As a result we
// have to put declare them below.
/**
 * @typedef {Object} InstallResult
 * @property {Array<string>} updatedURLs List of URLs that were updated during
 * installation.
 * @property {Array<string>} notUpdatedURLs List of URLs that were already up to
 * date.
 *
 * @memberof workbox-precaching
 */
/**
 * @typedef {Object} CleanupResult
 * @property {Array<string>} deletedCacheRequests List of URLs that were deleted
 * while cleaning up the cache.
 *
 * @memberof workbox-precaching
 */
/**
 * @typedef {Object} PrecacheEntry
 * @property {string} url URL to precache.
 * @property {string} [revision] Revision information for the URL.
 * @property {string} [integrity] Integrity metadata that will be used when
 * making the network request for the URL.
 *
 * @memberof workbox-precaching
 */
/**
 * The "urlManipulation" callback can be used to determine if there are any
 * additional permutations of a URL that should be used to check against
 * the available precached files.
 *
 * For example, Workbox supports checking for '/index.html' when the URL
 * '/' is provided. This callback allows additional, custom checks.
 *
 * @callback ~urlManipulation
 * @param {Object} context
 * @param {URL} context.url The request's URL.
 * @return {Array<URL>} To add additional urls to test, return an Array of
 * URLs. Please note that these **should not be strings**, but URL objects.
 *
 * @memberof workbox-precaching
 */
;// CONCATENATED MODULE: ./node_modules/workbox-precaching/index.js
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/













/**
 * Most consumers of this module will want to use the
 * {@link workbox-precaching.precacheAndRoute}
 * method to add assets to the cache and respond to network requests with these
 * cached assets.
 *
 * If you require more control over caching and routing, you can use the
 * {@link workbox-precaching.PrecacheController}
 * interface.
 *
 * @module workbox-precaching
 */


;// CONCATENATED MODULE: ./node_modules/workbox-precaching/index.mjs

;// CONCATENATED MODULE: ./node_modules/workbox-routing/NavigationRoute.js





/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




/**
 * NavigationRoute makes it easy to create a
 * {@link workbox-routing.Route} that matches for browser
 * [navigation requests]{@link https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests}.
 *
 * It will only match incoming Requests whose
 * {@link https://fetch.spec.whatwg.org/#concept-request-mode|mode}
 * is set to `navigate`.
 *
 * You can optionally only apply this route to a subset of navigation requests
 * by using one or both of the `denylist` and `allowlist` parameters.
 *
 * @memberof workbox-routing
 * @extends workbox-routing.Route
 */
var NavigationRoute = /*#__PURE__*/function (_Route) {
  _inherits(NavigationRoute, _Route);
  var _super = _createSuper(NavigationRoute);
  /**
   * If both `denylist` and `allowlist` are provided, the `denylist` will
   * take precedence and the request will not match this route.
   *
   * The regular expressions in `allowlist` and `denylist`
   * are matched against the concatenated
   * [`pathname`]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/pathname}
   * and [`search`]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search}
   * portions of the requested URL.
   *
   * *Note*: These RegExps may be evaluated against every destination URL during
   * a navigation. Avoid using
   * [complex RegExps](https://github.com/GoogleChrome/workbox/issues/3077),
   * or else your users may see delays when navigating your site.
   *
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {Object} options
   * @param {Array<RegExp>} [options.denylist] If any of these patterns match,
   * the route will not handle the request (even if a allowlist RegExp matches).
   * @param {Array<RegExp>} [options.allowlist=[/./]] If any of these patterns
   * match the URL's pathname and search parameter, the route will handle the
   * request (assuming the denylist doesn't match).
   */
  function NavigationRoute(handler) {
    var _this;
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$allowlist = _ref.allowlist,
      allowlist = _ref$allowlist === void 0 ? [/./] : _ref$allowlist,
      _ref$denylist = _ref.denylist,
      denylist = _ref$denylist === void 0 ? [] : _ref$denylist;
    classCallCheck_classCallCheck(this, NavigationRoute);
    if (false) {}
    _this = _super.call(this, function (options) {
      return _this._match(options);
    }, handler);
    _this._allowlist = allowlist;
    _this._denylist = denylist;
    return _this;
  }
  /**
   * Routes match handler.
   *
   * @param {Object} options
   * @param {URL} options.url
   * @param {Request} options.request
   * @return {boolean}
   *
   * @private
   */
  createClass_createClass(NavigationRoute, [{
    key: "_match",
    value: function _match(_ref2) {
      var url = _ref2.url,
        request = _ref2.request;
      if (request && request.mode !== 'navigate') {
        return false;
      }
      var pathnameAndSearch = url.pathname + url.search;
      var _iterator = createForOfIteratorHelper_createForOfIteratorHelper(this._denylist),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var regExp = _step.value;
          if (regExp.test(pathnameAndSearch)) {
            if (false) {}
            return false;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (this._allowlist.some(function (regExp) {
        return regExp.test(pathnameAndSearch);
      })) {
        if (false) {}
        return true;
      }
      if (false) {}
      return false;
    }
  }]);
  return NavigationRoute;
}(Route);

;// CONCATENATED MODULE: ./node_modules/workbox-routing/setCatchHandler.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


/**
 * If a Route throws an error while handling a request, this `handler`
 * will be called and given a chance to provide a response.
 *
 * @param {workbox-routing~handlerCallback} handler A callback
 * function that returns a Promise resulting in a Response.
 *
 * @memberof workbox-routing
 */
function setCatchHandler(handler) {
  var defaultRouter = getOrCreateDefaultRouter();
  defaultRouter.setCatchHandler(handler);
}

;// CONCATENATED MODULE: ./node_modules/workbox-routing/setDefaultHandler.js
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


/**
 * Define a default `handler` that's called when no routes explicitly
 * match the incoming request.
 *
 * Without a default handler, unmatched requests will go against the
 * network as if there were no service worker present.
 *
 * @param {workbox-routing~handlerCallback} handler A callback
 * function that returns a Promise resulting in a Response.
 *
 * @memberof workbox-routing
 */
function setDefaultHandler(handler) {
  var defaultRouter = getOrCreateDefaultRouter();
  defaultRouter.setDefaultHandler(handler);
}

;// CONCATENATED MODULE: ./node_modules/workbox-routing/index.js
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/








/**
 * @module workbox-routing
 */

;// CONCATENATED MODULE: ./node_modules/workbox-routing/index.mjs

;// CONCATENATED MODULE: ./node_modules/workbox-strategies/utils/messages.js
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/



var utils_messages_messages = {
  strategyStart: function strategyStart(strategyName, request) {
    return "Using ".concat(strategyName, " to respond to '").concat(getFriendlyURL(request.url), "'");
  },
  printFinalResponse: function printFinalResponse(response) {
    if (response) {
      logger_logger.groupCollapsed("View the final response here.");
      logger_logger.log(response || '[No response returned]');
      logger_logger.groupEnd();
    }
  }
};
;// CONCATENATED MODULE: ./node_modules/workbox-strategies/CacheFirst.js







/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/






/**
 * An implementation of a [cache-first](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache-first-falling-back-to-network)
 * request strategy.
 *
 * A cache first strategy is useful for assets that have been revisioned,
 * such as URLs like `/styles/example.a8f5f1.css`, since they
 * can be cached for long periods of time.
 *
 * If the network request fails, and there is no cache match, this will throw
 * a `WorkboxError` exception.
 *
 * @extends workbox-strategies.Strategy
 * @memberof workbox-strategies
 */
var CacheFirst = /*#__PURE__*/function (_Strategy) {
  _inherits(CacheFirst, _Strategy);
  var _super = _createSuper(CacheFirst);
  function CacheFirst() {
    classCallCheck_classCallCheck(this, CacheFirst);
    return _super.apply(this, arguments);
  }
  createClass_createClass(CacheFirst, [{
    key: "_handle",
    value:
    /**
     * @private
     * @param {Request|string} request A request to run this strategy for.
     * @param {workbox-strategies.StrategyHandler} handler The event that
     *     triggered the request.
     * @return {Promise<Response>}
     */
    function () {
      var _handle2 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee(request, handler) {
        var logs, response, error, _iterator, _step, log;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              logs = [];
              if (false) {}
              _context.next = 4;
              return handler.cacheMatch(request);
            case 4:
              response = _context.sent;
              error = undefined;
              if (response) {
                _context.next = 20;
                break;
              }
              if (false) {}
              _context.prev = 8;
              _context.next = 11;
              return handler.fetchAndCachePut(request);
            case 11:
              response = _context.sent;
              _context.next = 17;
              break;
            case 14:
              _context.prev = 14;
              _context.t0 = _context["catch"](8);
              if (_context.t0 instanceof Error) {
                error = _context.t0;
              }
            case 17:
              if (false) {}
              _context.next = 21;
              break;
            case 20:
              if (false) {}
            case 21:
              if (false) {}
              if (response) {
                _context.next = 24;
                break;
              }
              throw new WorkboxError_WorkboxError('no-response', {
                url: request.url,
                error: error
              });
            case 24:
              return _context.abrupt("return", response);
            case 25:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[8, 14]]);
      }));
      function _handle(_x, _x2) {
        return _handle2.apply(this, arguments);
      }
      return _handle;
    }()
  }]);
  return CacheFirst;
}(Strategy);

;// CONCATENATED MODULE: ./node_modules/workbox-strategies/CacheOnly.js






/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/






/**
 * An implementation of a [cache-only](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache-only)
 * request strategy.
 *
 * This class is useful if you want to take advantage of any
 * [Workbox plugins](https://developer.chrome.com/docs/workbox/using-plugins/).
 *
 * If there is no cache match, this will throw a `WorkboxError` exception.
 *
 * @extends workbox-strategies.Strategy
 * @memberof workbox-strategies
 */
var CacheOnly = /*#__PURE__*/function (_Strategy) {
  _inherits(CacheOnly, _Strategy);
  var _super = _createSuper(CacheOnly);
  function CacheOnly() {
    classCallCheck_classCallCheck(this, CacheOnly);
    return _super.apply(this, arguments);
  }
  createClass_createClass(CacheOnly, [{
    key: "_handle",
    value:
    /**
     * @private
     * @param {Request|string} request A request to run this strategy for.
     * @param {workbox-strategies.StrategyHandler} handler The event that
     *     triggered the request.
     * @return {Promise<Response>}
     */
    function () {
      var _handle2 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee(request, handler) {
        var response;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (false) {}
              _context.next = 3;
              return handler.cacheMatch(request);
            case 3:
              response = _context.sent;
              if (false) {}
              if (response) {
                _context.next = 7;
                break;
              }
              throw new WorkboxError_WorkboxError('no-response', {
                url: request.url
              });
            case 7:
              return _context.abrupt("return", response);
            case 8:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function _handle(_x, _x2) {
        return _handle2.apply(this, arguments);
      }
      return _handle;
    }()
  }]);
  return CacheOnly;
}(Strategy);

;// CONCATENATED MODULE: ./node_modules/workbox-strategies/plugins/cacheOkAndOpaquePlugin.js


/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

var cacheOkAndOpaquePlugin = {
  /**
   * Returns a valid response (to allow caching) if the status is 200 (OK) or
   * 0 (opaque).
   *
   * @param {Object} options
   * @param {Response} options.response
   * @return {Response|null}
   *
   * @private
   */
  cacheWillUpdate: function () {
    var _cacheWillUpdate = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee(_ref) {
      var response;
      return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            response = _ref.response;
            if (!(response.status === 200 || response.status === 0)) {
              _context.next = 3;
              break;
            }
            return _context.abrupt("return", response);
          case 3:
            return _context.abrupt("return", null);
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function cacheWillUpdate(_x) {
      return _cacheWillUpdate.apply(this, arguments);
    }
    return cacheWillUpdate;
  }()
};
;// CONCATENATED MODULE: ./node_modules/workbox-strategies/NetworkFirst.js







/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/







/**
 * An implementation of a
 * [network first](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#network-first-falling-back-to-cache)
 * request strategy.
 *
 * By default, this strategy will cache responses with a 200 status code as
 * well as [opaque responses](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#opaque-responses).
 * Opaque responses are are cross-origin requests where the response doesn't
 * support [CORS](https://enable-cors.org/).
 *
 * If the network request fails, and there is no cache match, this will throw
 * a `WorkboxError` exception.
 *
 * @extends workbox-strategies.Strategy
 * @memberof workbox-strategies
 */
var NetworkFirst = /*#__PURE__*/function (_Strategy) {
  _inherits(NetworkFirst, _Strategy);
  var _super = _createSuper(NetworkFirst);
  /**
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {Object} [options.matchOptions] [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
   * @param {number} [options.networkTimeoutSeconds] If set, any network requests
   * that fail to respond within the timeout will fallback to the cache.
   *
   * This option can be used to combat
   * "[lie-fi]{@link https://developers.google.com/web/fundamentals/performance/poor-connectivity/#lie-fi}"
   * scenarios.
   */
  function NetworkFirst() {
    var _this;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck_classCallCheck(this, NetworkFirst);
    _this = _super.call(this, options);
    // If this instance contains no plugins with a 'cacheWillUpdate' callback,
    // prepend the `cacheOkAndOpaquePlugin` plugin to the plugins list.
    if (!_this.plugins.some(function (p) {
      return 'cacheWillUpdate' in p;
    })) {
      _this.plugins.unshift(cacheOkAndOpaquePlugin);
    }
    _this._networkTimeoutSeconds = options.networkTimeoutSeconds || 0;
    if (false) {}
    return _this;
  }
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  createClass_createClass(NetworkFirst, [{
    key: "_handle",
    value: function () {
      var _handle2 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee2(request, handler) {
        var logs, promises, timeoutId, _this$_getTimeoutProm, id, promise, networkPromise, response, _iterator, _step, log;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              logs = [];
              if (false) {}
              promises = [];
              if (this._networkTimeoutSeconds) {
                _this$_getTimeoutProm = this._getTimeoutPromise({
                  request: request,
                  logs: logs,
                  handler: handler
                }), id = _this$_getTimeoutProm.id, promise = _this$_getTimeoutProm.promise;
                timeoutId = id;
                promises.push(promise);
              }
              networkPromise = this._getNetworkPromise({
                timeoutId: timeoutId,
                request: request,
                logs: logs,
                handler: handler
              });
              promises.push(networkPromise);
              _context2.next = 8;
              return handler.waitUntil(asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee() {
                return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
                  while (1) switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return handler.waitUntil(Promise.race(promises));
                    case 2:
                      _context.t0 = _context.sent;
                      if (_context.t0) {
                        _context.next = 7;
                        break;
                      }
                      _context.next = 6;
                      return networkPromise;
                    case 6:
                      _context.t0 = _context.sent;
                    case 7:
                      return _context.abrupt("return", _context.t0);
                    case 8:
                    case "end":
                      return _context.stop();
                  }
                }, _callee);
              }))());
            case 8:
              response = _context2.sent;
              if (false) {}
              if (response) {
                _context2.next = 12;
                break;
              }
              throw new WorkboxError_WorkboxError('no-response', {
                url: request.url
              });
            case 12:
              return _context2.abrupt("return", response);
            case 13:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function _handle(_x, _x2) {
        return _handle2.apply(this, arguments);
      }
      return _handle;
    }()
    /**
     * @param {Object} options
     * @param {Request} options.request
     * @param {Array} options.logs A reference to the logs array
     * @param {Event} options.event
     * @return {Promise<Response>}
     *
     * @private
     */
  }, {
    key: "_getTimeoutPromise",
    value: function _getTimeoutPromise(_ref2) {
      var _this2 = this;
      var request = _ref2.request,
        logs = _ref2.logs,
        handler = _ref2.handler;
      var timeoutId;
      var timeoutPromise = new Promise(function (resolve) {
        var onNetworkTimeout = /*#__PURE__*/function () {
          var _ref3 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee3() {
            return regeneratorRuntime_regeneratorRuntime().wrap(function _callee3$(_context3) {
              while (1) switch (_context3.prev = _context3.next) {
                case 0:
                  if (false) {}
                  _context3.t0 = resolve;
                  _context3.next = 4;
                  return handler.cacheMatch(request);
                case 4:
                  _context3.t1 = _context3.sent;
                  (0, _context3.t0)(_context3.t1);
                case 6:
                case "end":
                  return _context3.stop();
              }
            }, _callee3);
          }));
          return function onNetworkTimeout() {
            return _ref3.apply(this, arguments);
          };
        }();
        timeoutId = setTimeout(onNetworkTimeout, _this2._networkTimeoutSeconds * 1000);
      });
      return {
        promise: timeoutPromise,
        id: timeoutId
      };
    }
    /**
     * @param {Object} options
     * @param {number|undefined} options.timeoutId
     * @param {Request} options.request
     * @param {Array} options.logs A reference to the logs Array.
     * @param {Event} options.event
     * @return {Promise<Response>}
     *
     * @private
     */
  }, {
    key: "_getNetworkPromise",
    value: function () {
      var _getNetworkPromise2 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee4(_ref4) {
        var timeoutId, request, logs, handler, error, response;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              timeoutId = _ref4.timeoutId, request = _ref4.request, logs = _ref4.logs, handler = _ref4.handler;
              _context4.prev = 1;
              _context4.next = 4;
              return handler.fetchAndCachePut(request);
            case 4:
              response = _context4.sent;
              _context4.next = 10;
              break;
            case 7:
              _context4.prev = 7;
              _context4.t0 = _context4["catch"](1);
              if (_context4.t0 instanceof Error) {
                error = _context4.t0;
              }
            case 10:
              if (timeoutId) {
                clearTimeout(timeoutId);
              }
              if (false) {}
              if (!(error || !response)) {
                _context4.next = 17;
                break;
              }
              _context4.next = 15;
              return handler.cacheMatch(request);
            case 15:
              response = _context4.sent;
              if (false) {}
            case 17:
              return _context4.abrupt("return", response);
            case 18:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this, [[1, 7]]);
      }));
      function _getNetworkPromise(_x3) {
        return _getNetworkPromise2.apply(this, arguments);
      }
      return _getNetworkPromise;
    }()
  }]);
  return NetworkFirst;
}(Strategy);

;// CONCATENATED MODULE: ./node_modules/workbox-strategies/NetworkOnly.js






/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/







/**
 * An implementation of a
 * [network-only](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#network-only)
 * request strategy.
 *
 * This class is useful if you want to take advantage of any
 * [Workbox plugins](https://developer.chrome.com/docs/workbox/using-plugins/).
 *
 * If the network request fails, this will throw a `WorkboxError` exception.
 *
 * @extends workbox-strategies.Strategy
 * @memberof workbox-strategies
 */
var NetworkOnly = /*#__PURE__*/function (_Strategy) {
  _inherits(NetworkOnly, _Strategy);
  var _super = _createSuper(NetworkOnly);
  /**
   * @param {Object} [options]
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {number} [options.networkTimeoutSeconds] If set, any network requests
   * that fail to respond within the timeout will result in a network error.
   */
  function NetworkOnly() {
    var _this;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck_classCallCheck(this, NetworkOnly);
    _this = _super.call(this, options);
    _this._networkTimeoutSeconds = options.networkTimeoutSeconds || 0;
    return _this;
  }
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  createClass_createClass(NetworkOnly, [{
    key: "_handle",
    value: function () {
      var _handle2 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee(request, handler) {
        var error, response, promises, timeoutPromise;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (false) {}
              error = undefined;
              _context.prev = 2;
              promises = [handler.fetch(request)];
              if (this._networkTimeoutSeconds) {
                timeoutPromise = timeout_timeout(this._networkTimeoutSeconds * 1000);
                promises.push(timeoutPromise);
              }
              _context.next = 7;
              return Promise.race(promises);
            case 7:
              response = _context.sent;
              if (response) {
                _context.next = 10;
                break;
              }
              throw new Error("Timed out the network response after " + "".concat(this._networkTimeoutSeconds, " seconds."));
            case 10:
              _context.next = 15;
              break;
            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](2);
              if (_context.t0 instanceof Error) {
                error = _context.t0;
              }
            case 15:
              if (false) {}
              if (response) {
                _context.next = 18;
                break;
              }
              throw new WorkboxError_WorkboxError('no-response', {
                url: request.url,
                error: error
              });
            case 18:
              return _context.abrupt("return", response);
            case 19:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[2, 12]]);
      }));
      function _handle(_x, _x2) {
        return _handle2.apply(this, arguments);
      }
      return _handle;
    }()
  }]);
  return NetworkOnly;
}(Strategy);

;// CONCATENATED MODULE: ./node_modules/workbox-strategies/StaleWhileRevalidate.js







/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/







/**
 * An implementation of a
 * [stale-while-revalidate](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#stale-while-revalidate)
 * request strategy.
 *
 * Resources are requested from both the cache and the network in parallel.
 * The strategy will respond with the cached version if available, otherwise
 * wait for the network response. The cache is updated with the network response
 * with each successful request.
 *
 * By default, this strategy will cache responses with a 200 status code as
 * well as [opaque responses](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#opaque-responses).
 * Opaque responses are cross-origin requests where the response doesn't
 * support [CORS](https://enable-cors.org/).
 *
 * If the network request fails, and there is no cache match, this will throw
 * a `WorkboxError` exception.
 *
 * @extends workbox-strategies.Strategy
 * @memberof workbox-strategies
 */
var StaleWhileRevalidate = /*#__PURE__*/function (_Strategy) {
  _inherits(StaleWhileRevalidate, _Strategy);
  var _super = _createSuper(StaleWhileRevalidate);
  /**
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {Object} [options.matchOptions] [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
   */
  function StaleWhileRevalidate() {
    var _this;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck_classCallCheck(this, StaleWhileRevalidate);
    _this = _super.call(this, options);
    // If this instance contains no plugins with a 'cacheWillUpdate' callback,
    // prepend the `cacheOkAndOpaquePlugin` plugin to the plugins list.
    if (!_this.plugins.some(function (p) {
      return 'cacheWillUpdate' in p;
    })) {
      _this.plugins.unshift(cacheOkAndOpaquePlugin);
    }
    return _this;
  }
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  createClass_createClass(StaleWhileRevalidate, [{
    key: "_handle",
    value: function () {
      var _handle2 = asyncToGenerator_asyncToGenerator( /*#__PURE__*/regeneratorRuntime_regeneratorRuntime().mark(function _callee(request, handler) {
        var logs, fetchAndCachePromise, response, error, _iterator, _step, log;
        return regeneratorRuntime_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              logs = [];
              if (false) {}
              fetchAndCachePromise = handler.fetchAndCachePut(request).catch(function () {
                // Swallow this error because a 'no-response' error will be thrown in
                // main handler return flow. This will be in the `waitUntil()` flow.
              });
              void handler.waitUntil(fetchAndCachePromise);
              _context.next = 6;
              return handler.cacheMatch(request);
            case 6:
              response = _context.sent;
              if (!response) {
                _context.next = 11;
                break;
              }
              if (false) {}
              _context.next = 21;
              break;
            case 11:
              if (false) {}
              _context.prev = 12;
              _context.next = 15;
              return fetchAndCachePromise;
            case 15:
              response = _context.sent;
              _context.next = 21;
              break;
            case 18:
              _context.prev = 18;
              _context.t0 = _context["catch"](12);
              if (_context.t0 instanceof Error) {
                error = _context.t0;
              }
            case 21:
              if (false) {}
              if (response) {
                _context.next = 24;
                break;
              }
              throw new WorkboxError_WorkboxError('no-response', {
                url: request.url,
                error: error
              });
            case 24:
              return _context.abrupt("return", response);
            case 25:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[12, 18]]);
      }));
      function _handle(_x, _x2) {
        return _handle2.apply(this, arguments);
      }
      return _handle;
    }()
  }]);
  return StaleWhileRevalidate;
}(Strategy);

;// CONCATENATED MODULE: ./node_modules/workbox-strategies/index.js
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/








/**
 * There are common caching strategies that most service workers will need
 * and use. This module provides simple implementations of these strategies.
 *
 * @module workbox-strategies
 */

;// CONCATENATED MODULE: ./node_modules/workbox-strategies/index.mjs

;// CONCATENATED MODULE: ./src/service-worker.ts
/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */ // This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.
clientsClaim();// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute([{'revision':'fe6717ae9a9181f06de63850bcff2fa7','url':'/Remote-QA-Web-App/index.html'},{'revision':null,'url':'/Remote-QA-Web-App/static/css/main.55ec9ec3.css'},{'revision':null,'url':'/Remote-QA-Web-App/static/js/787.8f91223b.chunk.js'},{'revision':null,'url':'/Remote-QA-Web-App/static/js/main.98708df2.js'}]);// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
var fileExtensionRegexp=new RegExp('/[^/?]+\\.[^/]+$');registerRoute(// Return false to exempt requests from being fulfilled by index.html.
function(_ref){var request=_ref.request,url=_ref.url;// If this isn't a navigation, skip.
if(request.mode!=='navigate'){return false;}// If this is a URL that starts with /_, skip.
if(url.pathname.startsWith('/_')){return false;}// If this looks like a URL for a resource, because it contains
// a file extension, skip.
if(url.pathname.match(fileExtensionRegexp)){return false;}// Return true to signal that we want to use the handler.
return true;},createHandlerBoundToURL("/Remote-QA-Web-App"+'/index.html'));// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(// Add in any other file extensions or routing criteria as needed.
function(_ref2){var url=_ref2.url;return url.origin===self.location.origin&&url.pathname.endsWith('.png');},// Customize this strategy as needed, e.g., by changing to CacheFirst.
new StaleWhileRevalidate({cacheName:'images',plugins:[// Ensure that once this runtime cache reaches a maximum size the
// least-recently used images are removed.
new ExpirationPlugin({maxEntries:50})]}));// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message',function(event){if(event.data&&event.data.type==='SKIP_WAITING'){self.skipWaiting();}});// Any other custom service worker logic can go here.
}();
/******/ })()
;
//# sourceMappingURL=service-worker.js.map