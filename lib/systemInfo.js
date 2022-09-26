class SystemInfo {
    constructor() {
        this.ua = navigator.userAgent.toLowerCase();
        this.system = '';
        this.systemVs = '';
        this.browser = '';
        this.browserVs = '';
        this.shell = '';
        this.shellVs = '';
    }
    testUa(regexp) {
        return regexp.test(this.ua);
    }
    testVs(regexp) {
        const vs = this.ua.match(regexp);
        if (vs) {
            return vs
                .toString()
                .replace(/[^0-9|_.]/g, '')
                .replace(/_/g, '.');
        } else {
            return false;
        }
    }
    // 获取操作系统
    getSystem() {
        if (this.testUa(/windows|win32|win64|wow32|wow64/g)) {
            this.system = 'windows'; // windows系统
        } else if (this.testUa(/macintosh|macintel/g)) {
            this.system = 'macOS'; // macos系统
        } else if (this.testUa(/x11/g)) {
            this.system = 'linux'; // linux系统
        } else if (this.testUa(/android|adr/g)) {
            this.system = 'android'; // android系统
        } else if (this.testUa(/ios|iphone|ipad|ipod|iwatch/g)) {
            this.system = 'iOS'; // ios系统
        }
        return this.system;
    }
    // 操作系统版本
    getSystemVersion() {
        if (this.system === 'windows') {
            if (this.testUa(/windows nt 5.0|windows 2000/g)) {
                this.systemVs = '2000';
            } else if (this.testUa(/windows nt 5.1|windows xp/g)) {
                this.systemVs = 'xp';
            } else if (this.testUa(/windows nt 5.2|windows 2003/g)) {
                this.systemVs = '2003';
            } else if (this.testUa(/windows nt 6.0|windows vista/g)) {
                this.systemVs = 'vista';
            } else if (this.testUa(/windows nt 6.1|windows 7/g)) {
                this.systemVs = '7';
            } else if (this.testUa(/windows nt 6.2|windows 8/g)) {
                this.systemVs = '8';
            } else if (this.testUa(/windows nt 6.3|windows 8.1/g)) {
                this.systemVs = '8.1';
            } else if (this.testUa(/windows nt 10.0|windows 10/g)) {
                this.systemVs = '10';
            }
        } else if (this.system === 'macOS') {
            this.systemVs = this.testVs(/os x [\d._]+/g);
        } else if (this.system === 'android') {
            this.systemVs = this.testVs(/android [\d._]+/g);
        } else if (this.system === 'iOS') {
            this.systemVs = this.testVs(/os [\d._]+/g);
        }
        return this.systemVs;
    }
    // 浏览器类型
    getBrowser() {
        if (this.testUa(/applewebkit/g)) {
            if (this.testUa(/edg/g)) {
                this.browser = 'edge'; // edge浏览器
            } else if (this.testUa(/opr/g)) {
                this.browser = 'opera'; // opera浏览器
            } else if (this.testUa(/chrome/g)) {
                this.browser = 'chrome'; // chrome浏览器
            } else if (this.testUa(/safari/g)) {
                this.browser = 'safari'; // safari浏览器
            }
        } else if (this.testUa(/gecko/g) && this.testUa(/firefox/g)) {
            this.browser = 'firefox'; // firefox浏览器
        } else if (this.testUa(/presto/g)) {
            this.browser = 'opera'; // opera浏览器
        } else if (this.testUa(/trident|compatible|msie/g)) {
            this.browser = 'ie'; // iexplore浏览器
        }
        return this.browser;
    }
    //浏览器版本
    getBrowserVersion() {
        if (this.browser === 'chrome') {
            this.browserVs = this.testVs(/chrome\/[\d._]+/g);
        } else if (this.browser === 'safari') {
            this.browserVs = this.testVs(/version\/[\d._]+/g);
        } else if (this.browser === 'firefox') {
            this.browserVs = this.testVs(/firefox\/[\d._]+/g);
        } else if (this.browser === 'opera') {
            this.browserVs = this.testVs(/opr\/[\d._]+/g);
        } else if (this.browser === 'iexplore') {
            this.browserVs = this.testVs(/(msie [\d._]+)|(rv:[\d._]+)/g);
        } else if (this.browser === 'edge') {
            this.browserVs = this.testVs(/edg\/[\d._]+/g);
        }
        return this.browserVs;
    }
    // 外壳浏览器
    getShell() {
        if (this.testUa(/micromessenger/g)) {
            this.shell = 'wechat'; // 微信浏览器
            this.shellVs = this.testVs(/micromessenger\/[\d._]+/g);
        } else if (this.testUa(/qqbrowser/g)) {
            this.shell = 'qq'; // QQ浏览器
            this.shellVs = this.testVs(/qqbrowser\/[\d._]+/g);
        } else if (this.testUa(/ucbrowser/g)) {
            this.shell = 'uc'; // UC浏览器
            this.shellVs = this.testVs(/ucbrowser\/[\d._]+/g);
        } else if (this.testUa(/qihu 360se/g)) {
            this.shell = '360'; // 360浏览器(无版本)
        } else if (this.testUa(/2345explorer/g)) {
            this.shell = '2345'; // 2345浏览器
            this.shellVs = this.testVs(/2345explorer\/[\d._]+/g);
        } else if (this.testUa(/metasr/g)) {
            this.shell = 'sougou'; // 搜狗浏览器(无版本)
        } else if (this.testUa(/lbbrowser/g)) {
            this.shell = 'liebao'; // 猎豹浏览器(无版本)
        } else if (this.testUa(/maxthon/g)) {
            this.shell = 'maxthon'; // 遨游浏览器
            this.shellVs = this.testVs(/maxthon\/[\d._]+/g);
        }
        return this.shell;
    }
    // 获取所有信息
    getInfo() {
        return {
            system: this.getSystem() || '',
            systemVs: this.getSystemVersion() || '',
            browser: this.getBrowser() || '',
            browserVs: this.getBrowserVersion() || '',
            shell: this.getShell() || '',
            shellVs: this.shellVs || '',
        };
    }
}
