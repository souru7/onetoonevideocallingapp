/* eslint-disable @typescript-eslint/explicit-function-return-type */
class Toast {
    static getInstance() {
        if (!Toast.instance) {
            Toast.instance = new Toast();
            Toast.toastEl = document.createElement('div');
            Toast.toastEl.style = `position: fixed;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            padding: 0 20px;
            height: 26px;
            border-radius: 13px;
            font-size: 12px;
            line-height: 26px;
            text-align: center;`;
            Toast.toastEl.innerHTML = `<div class="icon"></div>
            <div class="text"></div>`;
            document.body.appendChild(Toast.toastEl);
        }
        return Toast.instance;
    }
    success(msg, delay) {
        delay = delay || 1500;
        if (Toast.time) clearTimeout(Toast.time);
        Toast.toastEl.style.backgroundColor = '#2953FF';
        Toast.toastEl.style.color = '#fff';
        Toast.toastEl.style.opacity = '0.96';
        Toast.toastEl.children[1].textContent = msg;
        Toast.time = setTimeout(() => {
            this.hide();
        }, delay);
    }
    error(msg, delay) {
        delay = delay || 1500;
        if (Toast.time) clearTimeout(Toast.time);
        Toast.toastEl.style.backgroundColor = '#ff0101';
        Toast.toastEl.style.color = '#fff';
        Toast.toastEl.style.opacity = '0.96';
        Toast.toastEl.children[1].textContent = msg;
        Toast.time = setTimeout(() => {
            this.hide();
        }, delay);
    }
    hide() {
        if (Toast.time) clearTimeout(Toast.time);
        Toast.toastEl.style.backgroundColor = '';
        Toast.toastEl.style.color = 'none';
        Toast.toastEl.children[1].textContent = '';
    }
}

/* 
https://developer.mozilla.org/en-US/docs/DOM/document.cookie
|*|  * Cookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * Cookies.getItem(name)
|*|  * Cookies.removeItem(name[, path], domain)
|*|  * Cookies.hasItem(name)
|*|  * Cookies.keys() 
*/
class Cookies {
    getItem(sKey) {
        return (
            decodeURIComponent(
                document.cookie.replace(
                    new RegExp(
                        '(?:(?:^|.*;)\\s*' +
                            encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') +
                            '\\s*\\=\\s*([^;]*).*$)|^.*$',
                    ),
                    '$1',
                ),
            ) || null
        );
    }
    setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        let sExpires = '';
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
                    break;
                case String:
                    sExpires = '; expires=' + vEnd;
                    break;
                case Date:
                    sExpires = '; expires=' + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie =
            encodeURIComponent(sKey) +
            '=' +
            encodeURIComponent(sValue) +
            sExpires +
            (sDomain ? '; domain=' + sDomain : '') +
            (sPath ? '; path=' + sPath : '') +
            (bSecure ? '; secure' : '');
        return true;
    }
    removeItem(sKey, sPath, sDomain) {
        if (!sKey || !this.hasItem(sKey)) {
            return false;
        }
        document.cookie =
            encodeURIComponent(sKey) +
            '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
            (sDomain ? '; domain=' + sDomain : '') +
            (sPath ? '; path=' + sPath : '');
        return true;
    }
    hasItem(sKey) {
        return new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\=').test(
            document.cookie,
        );
    }
    keys() {
        const aKeys = document.cookie
            .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '')
            .split(/\s*(?:\=[^;]*)?;\s*/);
        for (let nIdx = 0; nIdx < aKeys.length; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    }
}

async function getSDKToken(userId) {
    const cookies = new Cookies();
    if (cookies.getItem(`sdkToken-${userId}`)) {
        return cookies.getItem(`sdkToken-${userId}`);
    }
    const timestamp = Math.floor(new Date().getTime() / 1000) + 3600 * 24; //过期时间（秒）一天
    const deviceId = ZegoRoomKit.deviceID();
    const verifyType = 3;
    const version = 1;
    const signStr = `${SecretSign.substr(0, 32)}${deviceId}${verifyType}${version}${timestamp}`;
    const sign = md5(signStr);
    console.log('signStr', signStr, sign);
    const res = await axios({
        method: 'post',
        url: `${Domain}/auth/get_sdk_token`,
        data: {
            common_data: {
                platform: 32,
            },
            sign: sign,
            secret_id: SecretID,
            device_id: deviceId,
            timestamp: timestamp,
        },
    });
    console.log(res);
    cookies.setItem(
        `sdkToken-${userId}`,
        res.sdkToken,
        new Date(new Date().getTime() + (res.expiresIn - 60 * 60 * 3) * 1000),
    );
    return res.sdkToken;
}

function getPid(classType, env, lowDelayStatus) {
    if (lowDelayStatus && classType === 5) {
        return productIdList[env]['low'];
    } else {
        return productIdList[env][classType];
    }
}
function getUid(userName) {
    const sign = md5(userName).slice(-6);
    return parseInt(sign, 16);
}
