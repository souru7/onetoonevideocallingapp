class Api {
    constructor(baseURL) {
        this.seq = new Date().getTime();
        if (baseURL) {
            axios.defaults.baseURL = baseURL;
        } else {
            axios.defaults.baseURL = EduCloudKitDomain;
        }
        axios.defaults.timeout = 15000;
        axios.interceptors.response.use(
            response => {
                const res = commonTranslator(response.data);
                if (res.ret) {
                    if (res.ret.code) {
                        return Promise.reject(res);
                    } else {
                        return res.data;
                    }
                } else if (res.code) {
                    return Promise.reject(res);
                } else {
                    return res;
                }
            },
            error => {
                return Promise.reject(error);
            },
        );
        this.get = (url, params) => {
            return axios.get(url, { params: params });
        };
        this.post = (url, params) => {
            return axios.post(url, params);
        };
    }
    static getInstance(type) {
        if (!this.instance) {
            this.instance = new Api(type);
        }
        return this.instance;
    }
}
// 将下划线换成驼峰
function commonTranslator(obj) {
    const underline2Hump = s => {
        return s.replace(/_(\w)/g, function(all, letter) {
            return letter.toUpperCase();
        });
    };
    if (obj instanceof Array) {
        obj.forEach(function(v, i) {
            commonTranslator(v);
        });
    } else if (obj instanceof Object) {
        Object.keys(obj).forEach(function(key) {
            const newKey = underline2Hump(key);
            if (newKey !== key) {
                obj[newKey] = obj[key];
                delete obj[key];
            }
            commonTranslator(obj[newKey]);
        });
    }
    return obj;
}
