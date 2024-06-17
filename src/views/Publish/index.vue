<template>
    <div>
        <h3>发布</h3>
        <form class="input-group" enctype="multipart/form-data">
            <div class="custom-file">
                <input name="inputFile" type="file" class="custom-file-input" id="inputFile">
                <label class="custom-file-label" for="inputFile">选择文件</label>
            </div>
            <div class="input-group-append">
                <button class="btn btn-primary" id="upload" @click="upload()">上传</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import axios from "axios";

async function getFromData() {
    let fromData = axios.get();
}

function upload() {
    // 首先获取用户选择的文件
    var $input = $('#inputFile');
    var file = $input[0].files[0];

    // 生成一个随机文件名
    var key = uuid() + file.name;

    // 获取密钥
    var form = s3_upload_form(ACCESS_KEY, SECRET_KEY, REGION, BUCKET, key);

    // 新建一个formdata 对象
    let data = new FormData();

    // 为formdata 对象赋值
    data.append('acl', form['acl']);
    data.append('key', form['key']);
    data.append('policy', form['policy']);
    data.append('success_action_status', form['success_action_status']);
    data.append('x-amz-algorithm', form['x-amz-algorithm']);
    data.append('x-amz-credential', form['x-amz-credential']);
    data.append('x-amz-date', form['x-amz-date']);
    data.append('x-amz-signature', form['x-amz-signature']);
    data.append('file', file);

    // 通过axios向s3 直接post上传文件
    axios.post(form.action, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(function (response) {
            // 上传成功，获取存储的地址
        })
        .catch(function (error) {
            console.error('Error uploading file:', error);
        });
}
</script>

<style lang="scss" scoped>


</style>