<template>
    <div class="upload-container" ref="uploadCRef">
        <h3 style="width:100%">发布</h3>
        <div class="container" ref="containerRef">
            <!-- <img src="./1.gif" alt="" class="picture"><img src="./1.gif" alt="" class="picture"><img src="./1.gif" alt="" class="picture"> -->
            <div class="upload-dragger" ref="uploadDraggerRef" v-show="!loading">
                <!-- 阿里巴巴矢量图标库复制 -->
                <svg class="upload-icon" viewBox="0 0 1024 1024" width="65" height="65">
                    <path
                        d="M815.104 363.008a307.2 307.2 0 0 0-606.72 0A256 256 0 0 0 256 870.4h204.8v-204.8H358.4l153.6-204.8 153.6 204.8h-102.4v204.8h204.8a256 256 0 0 0 47.104-507.392z"
                        fill="#8a8a8a"></path>
                </svg>
                <span class="upload-text">点击上传</span>
                <span class="upload-text">或将文件拖到此处</span>
            </div>
            <input type="file" id="upload-input" multiple accept="*/*" ref="uploadInputRef">

            <div class="content" style="width: 100vw;display: block;">
                <div>
                    <input v-model="title" type="text" placeholder="输入标题" style="width: 100%;height: 2rem"/>
                </div>
                <div style="margin-top: 2px;">
                    <textarea v-model="content" placeholder="输入内容" style="width: 100%;height: 3rem"></textarea>
                </div>
                <div>
                    <button v-show="!loading" @click="push">发布</button>
                </div>
                <div id="jin-du" v-show="loading">
                    Loading! 正在上传文件...
                </div>
                <div>
                    <button @click="sendNotification">发送通知</button>
                </div>
            </div>
        </div>
    </div>
    <canvas id="canvas-element" style="display:none;"></canvas>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import axios from "axios";
import {CONFIG} from "@/utils/global.js";
import router from "@/router/index.js";

const title = ref('')
const content = ref('')
let imageUrlList = ref([])
let videoUrlList = ref([])
let loading = ref(false)

let containerRef = ref(null)
let uploadDraggerRef = ref(null)
let uploadInputRef = ref(null)
onMounted(() => {
    uploadDraggerRef.value.addEventListener('click', function (e) {
        uploadInputRef.value.click()
    })
    // 选中文件时
    uploadInputRef.value.addEventListener('change', function (e) {
        // console.log(e.target.files)
        // 图片显示
        uploadPicture(e.target.files)
    })

    // 注册
    // if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker.register('sw.js').then(registration => {
    //         console.log('ServiceWorker registration successful with scope: ', registration.scope);
    //     }, err => {
    //         console.log('ServiceWorker registration failed: ', err);
    //     });
    // }
})

const sendNotification = () => {
    if (!('Notification' in window)) {
        console.error('This browser does not support notifications.');
        return;
    }

    if (Notification.permission === 'granted') {
        showNotification();
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showNotification();
            }
        });
    } else {
        console.log("333333")
    }
};

const showNotification = async () => {
    const options = {
        body: '视频上传完毕,等待发布!',
        icon: 'icons/android-chrome-192x192.png',
        badge: 'icons/android-chrome-192x192.png',
        actions: [
            {action: 'explore', title: 'Explore this new world', icon: 'icons/android-chrome-192x192.png'}
        ]
    };

    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
        await registration.showNotification('Hello World!', options);
    } else {
        console.error('Service Worker registration not found');
    }
};


function uploadPicture(files) {
    for (let index = 0; index < files.length; index++) {
        // 检查是否为图片
        // if (!/\.(png|jpg|jpeg|gif|PNG|JPG|JPEG|GIF)$/.test(files[index].name)) {
        //     alert('文件 ' + files[index].name + ' 上传错误, 文件格式必须为png|jpg|jpeg|gif')
        //     continue
        // }
        /**
         * 上传操作(接口) 可以写在这里
         */
        uploadFile(files[index]);

        //  创建 img 元素
        let newImg = document.createElement('img')
        newImg.src = window.URL.createObjectURL(files[index])
        newImg.className = 'picture'
        newImg.style.width = '6rem'
        newImg.style.height = '6rem'
        newImg.style.objectFit = 'cover'
        newImg.style.margin = '1px'
        // 在 container 的子元素 uploadDragger 前面插入 newimg 元素
        containerRef.value.insertBefore(newImg, uploadDraggerRef.value)

        // 获取所有 img 元素
        // var imgs = document.querySelectorAll('img');

        // 如果图片数量大于 1，则移除第一个 img 元素
        // if (imgs.length > 1) {
        //     imgs[0].parentNode.removeChild(imgs[0]);
        // }
    }
}

async function uploadFile(file) {

    loading.value = true;

    // let fileInput = document.getElementById('upload-input');
    // let file = fileInput.files[0];
    let fileType = file.type;

    if (fileType.startsWith('video/')) {
        extractVideoFrame(file);
    } else if (fileType.startsWith('image/')) {
        let sign = await getSign(file)
        await uploadByApi(file, sign, false)
        loading.value = false;
    } else {
        console.log('Unsupported file type');
        alert("不支持的格式")
        loading.value = false;
    }

}

function extractVideoFrame(file) {

    let video = document.createElement('video');
    let canvas = document.getElementById('canvas-element');
    let context = canvas.getContext('2d');

    video.addEventListener('loadeddata', function () {
        video.currentTime = 0;  // Seek to the start
    });

    video.addEventListener('seeked', async function () {

        let imageFile = null;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        await new Promise((resolve) => {
            canvas.toBlob(function (blob) {
                imageFile = new File([blob], 'frame.png', {type: 'image/png'});
                resolve();
            }, 'image/png');
        });

        URL.revokeObjectURL(video.src);

        let sign = await getSign(imageFile);
        await uploadByApi(imageFile, sign, false)
        console.log("封面上传完成")

        let signVideo = await getSign(file);
        await uploadByApi(file, signVideo, true)
        console.log("视频上传完成")

        sendNotification()

        loading.value = false;

    });

    video.src = URL.createObjectURL(file);
    video.load();
}

async function getSign(file) {
    try {
        let fileExtension = file.name.split('.').pop();
        let token = localStorage.getItem("adv_token");
        if (null == token || "" === token) {
            await router.push({"path": "/login"})
        }
        const result = await axios.get(`${CONFIG.base}/dy/source/sign?type=${fileExtension}`, {
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
}

function loadImage(file) {
    return new Promise((resolve, reject) => {
        try {
            let reader = new FileReader();
            reader.onload = function (e) {
                let img = new Image();
                img.onload = function () {
                    let width = img.width;
                    let height = img.height;
                    console.log('Width:', width, 'Height:', height);
                    resolve({width, height});
                };
                img.onerror = function (err) {
                    reject(err);
                };
                img.src = e.target.result;
            };
            reader.onerror = function (err) {
                reject(err);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.log(error)
        }
    });
}

async function uploadByApi(file, sign, isVideo) {

    try {

        let form = sign.params
        let data = new FormData();
        data.append('acl', form['acl'])
        data.append('key', form['key'])
        data.append('policy', form['policy'])
        data.append('success_action_status', form['success_action_status'])
        data.append('x-amz-algorithm', form['x-amz-algorithm'])
        data.append('x-amz-credential', form['x-amz-credential'])
        data.append('x-amz-date', form['x-amz-date'])
        data.append('x-amz-signature', form['x-amz-signature'])
        data.append('file', file)

        // 通过axios向s3 直接post上传文件
        const response = await axios.post(sign.url, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        // Parse the XML string
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "application/xml");
        const keyElement = xmlDoc.getElementsByTagName("Location")[0];
        const keyValue = keyElement.textContent;

        if (isVideo) {
            videoUrlList.value.push({
                "title": "",
                "content": "",
                "url": keyValue,
                "width": 0,
                "height": 0
            });
        } else {
            let {width, height} = await loadImage(file);
            imageUrlList.value.push({
                "title": "",
                "content": "",
                "url": keyValue,
                "width": width,
                "height": height
            });
        }

        console.log(videoUrlList.value)
        console.log(imageUrlList.value)

    } catch (error) {

        console.log("错误", error)

    }


}

function push() {
    axios.post(`${CONFIG.base}/dy/source/save`, {
        "type": videoUrlList.value.length > 0 ? "v" : "i",
        "title": title.value,
        "content": content.value,
        "videos": videoUrlList.value,
        "images": imageUrlList.value,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        if (response.data.code === 200) {
            alert("发布成功")
        }
    }).catch(function (error) {
        console.error('Error uploading file:', error);
        alert("发布错误")
    });
}
</script>

<style lang="scss" scoped>
.upload-container {
    body {
        margin: 0;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #000;
    }
}

.container {
    width: 485px;
    height: 85vh;
    display: flex;
    /*换行  */
    flex-wrap: wrap;
    /* flex容器在交叉轴上有多行, 该属性生效, 默认值为stretch,
            导致flex容器将交叉轴上的多余空间按行数平均分给每行, 所以修改为 flex-start */
    align-content: flex-start;
    /* 滚动 */
    overflow-y: scroll;
}

/* 图片 */
.picture {
    width: 140px;
    height: 140px;
    margin: 10px;
    /* 图片无法选中 */
    user-select: none;
}

/* 上传框 */
.upload-dragger {
    width: 140px;
    height: 140px;
    margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 3px dashed orange;
    border-radius: 10px;
    box-sizing: border-box;
    /* 游标 */
    cursor: pointer;
}

.upload-text {
    color: orange;
    font-size: 13px;
    /* 文字无法选中 */
    user-select: none;
}

.upload-icon path {
    fill: orange
}

/* 隐藏文件选择按钮 */
#upload-input {
    display: none;
}

/* 鼠标移入上传框 */
.upload-dragger:hover {
    border: 3px dashed orange;
}

/* 拖拽时的样式 */
.upload-dragger.drag {
    border: 3px dashed orange;
}

.upload-dragger.drag .upload-text {
    color: orange;
}

.upload-dragger.drag .upload-icon path {
    fill: orange;
}

/* 拖拽时子元素禁用指针事件 (因为子元素会继承父元素的拖拽响应) */
.upload-dragger.drag * {
    pointer-events: none;
}

/* 滚动条样式 */
.container::-webkit-scrollbar {
    width: 5px;
    background-color: transparent;
}

/* 滑块 */
.container::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(196, 196, 196);
}
</style>