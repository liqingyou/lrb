import router from "@/router/index.js";
import axios from "axios";
import {CONFIG} from "@/utils/global.js";

// 获取签名
const getOssUrl = async (file) => {
    try {
        let fileExtension = file.name.split('.').pop();
        let token = localStorage.getItem("adv_token");
        if (null == token || "" === token) {
            await router.push({"path": "/login"})
        }
        const result = await axios.get(`${CONFIG.base}/dy/source/oss/url?type=${fileExtension}`, {
            headers: {
                'Authorization': token,
            }
        })
        if (result.data.code === 200) {
            return result.data.result
        } else {
            if (result.data.code === 401) {
                await router.push({"path": "/login"})
            } else if (result.data.code === 500) {
                alert(result.data.message)
            }
        }
    } catch (error) {
        console.error('Error:', error)
        return null;
    }
};

// 获取签名
const ossUploadApi = async (url, file, progressEvent) => {
    return axios({
        url: url,
        method: 'put',
        headers: {
            "Content-Type": "application/octet-stream"
        },
        data: file,
        onUploadProgress: progressEvent,
    });
};

export {getOssUrl, ossUploadApi};