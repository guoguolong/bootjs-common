/**
 * HtmlResponse.js
 *
 * @author guojunlong@kaulware.com (Allen Guo)
 * @copyright Copyright &copy; 2017 Kaulware.com
 */
'use strict';

class HtmlResponse {
    constructor(data, layout, viewPath) {
        this.layout = true;
        this.data = {};
        this.viewPath = null;
        this.result = {};
        // this.prototype.name = 'HtmlResponse';

        this.layout = layout || this.layout;
        if (typeof data === 'object') {
            this.data = data;
        }
        this.viewPath = viewPath;
    }

    merge() {
        this.result = this.data;
        if (typeof this.layout === 'string' || typeof this.layout === 'boolean') {
            this.result.layout = this.layout;
        } else if (typeof this.layout === 'object' && typeof this.layout.layout === 'string') { //  组装成express-partials格式的结果集
            this.result.layout = this.layout.layout;
        }
        return this;
    }
}

module.exports = HtmlResponse;