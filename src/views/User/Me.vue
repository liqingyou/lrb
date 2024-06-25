<template>
    <div class="edit">
        <BaseHeader>
            <template v-slot:center>
                <div class="title">
                    <span class="f16">编辑资料</span>
                    <span class="sub f10">已完成85%</span>
                </div>
            </template>
        </BaseHeader>
        <div class="userinfo">
            <div class="change-avatar">
                <div class="avatar-ctn" @click="showAvatarDialog">
                    <img class="avatar"
                         :src="avatarUrl"
                         alt="头像"/>
                    <img class="change" src="@/assets/img/icon/me/camera-light.png" alt=""/>
                </div>
                <span>点击更换头像</span>
                <input type="file" id="upload-input" multiple accept="*/*" ref="uploadInputRef" style="display: none">
            </div>
            <div class="row" @click="nav('/me/edit-userinfo-item', { type: 1 })">
                <div class="left">名字</div>
                <div class="right">
                    <span>{{ isEmpty(store.userinfo.nickname) }}</span>
                    <dy-back scale=".8" direction="right"></dy-back>
                </div>
            </div>
            <div class="row">
                <div class="left">抖音号</div>
                <div class="right">
                    <span>123456</span>
                    <dy-back scale=".8" direction="right"></dy-back>
                </div>
            </div>
            <div class="row">
                <div class="left">简介</div>
                <div class="right">
                    <span>我的简介</span>
                    <dy-back scale=".8" direction="right"></dy-back>
                </div>
            </div>
            <div class="row">
                <div class="left">性别</div>
                <div class="right">
                    <span>男</span>
                    <dy-back scale=".8" direction="right"></dy-back>
                </div>
            </div>
            <div class="row">
                <div class="left">生日</div>
                <div class="right">
                    <span>2023-05-05</span>
                    <div v-show="false" id="trigger1"></div>
                    <dy-back scale=".8" direction="right"></dy-back>
                </div>
            </div>
            <div class="row">
                <div class="left">所在地</div>
                <div class="right">
                    <span>河北 - 秦皇岛</span>
                    <dy-back scale=".8" direction="right"></dy-back>
                </div>
            </div>
            <div class="row" @click="nav('/me/add-school')">
                <div class="left">学校</div>
                <div class="right">
                    <span>南开大学</span>
                    <dy-back scale=".8" direction="right"></dy-back>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {onMounted, ref, toRefs} from 'vue'
import {useNav} from '@/utils/hooks/useNav'
import {useBaseStore} from "@/store/pinia.js";
import {getOssUrl, ossUploadApi} from "@/utils/oss.js";
import {update} from '@/api/user'

const store = useBaseStore()
const nav = useNav()

const userInfo = ref({})
userInfo.value = {
    "nick": "昵称"
}

let avatarUrl = ref(store.user.avatar)
let uploadInputRef = ref(null)

function showAvatarDialog() {
    // 选中文件时
    uploadInputRef.value.addEventListener('change', function (e) {
        // console.log(e.target.files)
        // 图片显示
        uploadPicture(e.target.files)
    })
    uploadInputRef.value.click()
}

function uploadPicture(files) {
    for (let index = 0; index < files.length; index++) {
        uploadFile(files[index]);
    }
}

async function uploadFile(file) {

    let fileType = file.type;

    if (fileType.startsWith('image/')) {

        let url = await getOssUrl(file)
        ossUploadApi(url, file, (progressEvent) => {
            console.log(progressEvent)
        }).then(async r => {
            if (r.status === 200) {
                avatarUrl.value = url.split('?')[0]
                // 更新数据
                let res = await update({}, {
                    "avatar": avatarUrl.value
                })
                store.user.avatar = res.data.result.avatar
                store.setUser(store.user)
            }
        })

    } else {
        console.log('Unsupported file type');
        alert("不支持的格式")
    }

}

function isEmpty(val) {
    if (val && val !== -1) return val
    return '点击设置'
}

onMounted(() => {
    // 获取用户信息
})
</script>

<style scoped lang="less">
@import '@/assets/less/index';

.edit {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    overflow: auto;
    font-size: 0.875rem;

    background: var(--main-bg);
}

.title {
    display: flex;
    flex-direction: column;
    align-items: center;

    .sub {
        color: var(--second-text-color);
    }
}

.preview-img {
    z-index: 9;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: black;
    display: flex;
    align-items: center;
    justify-content: center;

    .resource {
        width: 100%;
        max-height: 90%;
    }

    .download {
        position: absolute;
        bottom: 1.25rem;
        right: 1.25rem;
        padding: 0.1875rem;
        background: var(--second-btn-color-tran);
        width: 1.25rem;
    }
}

.userinfo {
    padding-top: 3.75rem;
    color: white;

    .change-avatar {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin: 1.875rem 0;
        @avatar-width: 5rem;

        .avatar-ctn {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 0.625rem;

            width: @avatar-width;
            height: @avatar-width;

            .avatar {
                opacity: 0.5;
                position: absolute;
                width: @avatar-width;
                height: @avatar-width;
                border-radius: 50%;
            }

            .change {
                width: 1.75rem;
                z-index: 9;
                position: relative;
            }
        }
    }
}

.change-dialog {
    z-index: 10;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #000000bb;
    display: flex;
    justify-content: center;
    align-items: center;

    .content {
        background: white;
        width: 80%;
        padding: 0.3125rem 0;
        border-radius: 2px;
        box-sizing: border-box;

        .item {
            font-size: 0.9375rem;
            padding: 0.9375rem 1.25rem;
            transition: all 0.2s;

            &:active {
                background: darkgray;
            }
        }
    }
}
</style>
