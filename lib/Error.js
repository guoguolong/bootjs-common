/**
 * Error.js 错误码处理类.
 *
 * @author guojunlong@kaulware.com (Allen Guo)
 * @copyright Copyright &copy; 2017 Kaulware.com
 */
'use strict';

function Error() {
}

Error.codes =  {
    'OK': 0,
    'GENERAL': 10000,
    'USER_NOT_LOGIN': 10001,
    'NO_PERMISSION': 10002,
    'USER_NOT_FOUND': 10023,
    'FATAL': 999999
};

Error.messages = {};
Error.messages[Error.codes['OK']] = '请求成功';
Error.messages[Error.codes['GENERAL']] = '一般性错误';
Error.messages[Error.codes['FATAL']] = '严重错误';
Error.messages[Error.codes['NO_PERMISSION']] = '没有权限';
Error.messages[Error.codes['USER_NOT_LOGIN']] = '用户未登录';

Error.getMessage = function(code) {
    return Error.messages[code] || code;
};

module.exports = Error;
