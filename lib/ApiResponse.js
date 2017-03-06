/**
 * 该类规范了http接口返回数据的结构
 *
 * @author guojunlong@kaulware.com (Allen Guo)
 * @copyright Copyright &copy; 2017 Kaulware.com
 */
'use strict';

const Error =  require('./Error');
class ApiResponse {
   constructor(data) {
        this.code    = 0;
        this.success = true;
        this.message = '请求成功';
        this.errors  = null;
        this.data    = data || null;
    }

    encode(format) {
        if (this.errors === null) {
            delete this.errors;
        }
        if(!format) {
            format = 'json';
        }
        if(format === 'json') {
            return JSON.stringify(this);
        }
        return null;
    }

    wrap(rpcResult) {
        if(rpcResult.success) {
            this.code = Error.codes['OK'];
        }
        if(rpcResult.msg) {
            this.msg = rpcResult.msg;
        }
        if(rpcResult.data) {
            this.msg = rpcResult.data;
        }
        return this;
    }


    getMessage(code) {
        if(Error.messages[code]) {
            return Error.messages[code];
        } 
        return code;
    }

    setMessage(message) {
        this.message = message;
        return this;
    }

    setCode(code , message) {
        this.code = code;
        if (typeof this.code === 'undefined') {
            this.code = Error.codes['GENERAL'];
        }
        if (this.code != Error.codes['OK']) {
            this.success = false;
        }
        if(!message) {
            if(Error.messages[code]) {
                this.message = Error.messages[code];
            } 
        } else {
            this.message = message;
        }
        return this;
    }

    /**
     * Web表单校验错误的errors数据通过该方法组装为Web Api规范定义的errors格式.
     *
     * @param errors = [
     *    {
     *        param: "fullName",
     *        msg: "名字不能为空",
     *        value: undefined,
     *    },
     *    {
     *        param: "email",
     *        msg: "EMAIL必须填写",
     *        value: undefined,
     *    },
     *    {
     *        param: "email",
     *        msg: "必须是合法的EMAIL",
     *        value: undefined,
     *    },
     * ]
     */
    assembleErrors(errors) {
        if (errors && errors.constructor == Array) {
            let errs = {};
            errors.forEach(function(item) {
                if (!errs[item.param]) errs[item.param] = [];
                errs[item.param].push(item.msg);
            });
            this.errors = errs;            
        }
        return this;
    }
}
module.exports = ApiResponse;