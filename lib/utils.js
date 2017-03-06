/**
 * utils.js 常用工具方法.
 *
 * @author guojunlong@kaulware.com (Allen Guo)
 * @copyright Copyright &copy; 2017 Kaulware.com
 */
'use strict';

const os = require('os');

function safeRequire(jsFile) {
    let result = null;
    try {
        result = require(jsFile);
    } catch (e) {
        console.error(e.stack);
    }
    return result;
}

function dump(obj, indentation, excludes) {
    if (!obj) return;
    if (!indentation) indentation = '';

    let result = "";
    let sep_begin = '{';
    let sep_end = '}';
    if (obj && obj.constructor == Array) {
        sep_begin = '[';
    }
    result += indentation + sep_begin + "\r\n";
    let indent = "    " + indentation;
    if (obj && (obj.constructor == Array || obj.constructor == Object)) {
        Object.keys(obj).forEach(function(key) {
            // console.log(indent + key);
        });
        let isExcluded = false;
        if (excludes instanceof Array) {
            excludes.forEach(function(item) {
                if (isExcluded) return;
                if (item === obj) isExcluded = true;
            });
        } 
        if (isExcluded) {
            result += indent +  " /* Circular Reference */ " + "\r\n";
        } else {
            for (let p in obj) {
                if (obj[p] && (obj[p].constructor == Array)) {
                    result += indent +  p + " : array" + "\r\n";;
                    result += dump(obj[p], indent, excludes);
                } else if (obj[p] && obj[p].constructor == Object) {
                    result += indent + "" + p + " : " + typeof(obj) + "" + "\r\n";
                    result += dump(obj[p], indent, excludes);
                } else if (obj[p] && obj[p].constructor == String) {
                    result += indent + "" + p + " : '" + obj[p] + "'" + "\r\n";;
                } else {
                    result += indent + "" + p + " : " + obj[p] + "\r\n";;
                }
            }
        }
    }
    if (obj && obj.constructor == Array) {
        sep_end = ']';
    }
    result += indentation + sep_end + "\r\n";
    return result;
}



function walk(path, routerJs, result) {
    let fs = require('fs');
    if (result == undefined) {
        let result = [];
    }
    let stats = fs.statSync(path);
    if (stats.isDirectory()) {
        let dir = fs.readdirSync(path);
        dir.forEach(function(item) {
            walk(path + '/' + item, routerJs, result);
        });
    } else {
        let filename = path.replace(/.*\//g, '');
        if(routerJs) {
            if (filename == routerJs) {
                result.push(path);
            }
        } else {
            result.push(path);
        }
    }
    return result;
}

// Web表单校验错误的errors数据组装为更有效的错误数据格式.
function formatWebErrors(errors) {
    let errs = {};
    if (errors && errors.constructor == Array) {
        errors.forEach(function(item) {
            if (!errs[item.param]) errs[item.param] = [];
            errs[item.param].push(item.msg);
        });
    }
    return errs;
}

function assembleError(param, msg, value) {
    return {
        param: param,
        value: value,
        msg: msg
    };
}

module.exports = {
    walk: walk,
    dump: dump,
    assembleError: assembleError,
    formatWebErrors:  formatWebErrors,
    replaceParams: function(path, params) {
        if (typeof params !== 'object') return path;
        for (let key in params) {
            let reg = new RegExp('\{' + key + '\}', 'g')
            path = path.replace(reg, params[key]);
        }
        return path;
    },
    hasCompileError: function(e) {
        let hasError = false;
        if (e instanceof ReferenceError ||
            e instanceof TypeError ||
            e instanceof SyntaxError) {
            hasError = true;
        }
        return hasError;
    },
    getServerIps: function() {
        let addresses = [];
        let interfaces = os.networkInterfaces();
        for (let k in interfaces) {
            for (let k2 in interfaces[k]) {
                let address = interfaces[k][k2];
                if (address.family === 'IPv4' && !address.internal) {
                    addresses.push(address.address);
                }
            }
        }
        return addresses;
    },
    safeRequire: safeRequire,
    objToBase64: function(object) {
        if (typeof object !== 'string') {
            object = JSON.stringify(object);
        }
        return (new Buffer(object)).toString('base64');
    },
    base64ToObj: function(string) {
        return JSON.parse((new Buffer(string, 'base64')).toString());
    },
    jsonParse(msg) {
        if (isNull(msg)) {
            return {};
        }
        let tmp = {};
        try {
            tmp = JSON.parse(msg);
        } catch (e) {
        }
        return tmp;
    }
}