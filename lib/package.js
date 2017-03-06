/**
 * package.js 加载模块的路径管理
 *
 * @author guojunlong@kaulware.com (Allen Guo)
 * @copyright Copyright &copy; 2017 Kaulware.com
 */
'use strict';

module.exports = function(searchPaths) {
    let regExp = /^\/$/;
    searchPaths = searchPaths.map(item => {
        return regExp.test(item) ? item : item += '/';
    });
    return {
        import: function(classIdentifer) {
            let result = false;
            let exp = null;
            let classPath = classIdentifer.replace(/\./g, '/');
            classPath = classPath.replace(/\*$/, 'index');
            classPath = classPath.replace(/\/js$/, '.js');
            for (var i = 0; i < searchPaths.length; i++) {
                try {
                    result = require(searchPaths[i] + classPath);
                    break;
                } catch (e) {
                    // do nothing
                    exp = e;
                }
            }
            if (result) return result;
            throw exp;
        },
        loadView: function(identifer) {
            let fs = require('fs');
            let result = '';
            let exp = null;
            let path = identifer.replace(/\./g, '/');
            path = path.replace(/\/(ejs|html)$/, '.$1');
            for (var i = 0; i < searchPaths.length; i++) {
                try {
                    result = fs.readFileSync(searchPaths + path);
                    result = result.toString();
                    break;
                } catch (e) {
                    // do nothing
                }
            }
            return result;
        }
    }
}