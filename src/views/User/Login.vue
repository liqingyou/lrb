<template>
    <div class="login-container">
        <div class="my-form">
            <div class="login-welcome-row">
                <a href="#" title="Logo">
                    <img src="../../assets/image/logo.svg" alt="Logo" class="logo">
                </a>
                <h2>登录</h2>
                <!--                <p>请输入信息! &#x1F44F;</p>-->
            </div>
            <div class="input__wrapper">
                <input v-model="email"
                       type="email" id="email" name="email" class="input__field"
                       placeholder="Your Email" required autocomplete="off">
                <label for="email" class="input__label">账号:</label>
                <!-- svg email -->
            </div>
            <div class="input__wrapper">
                <input v-model="password" id="password" type="password" class="input__field" placeholder="Your Password"
                       title="Minimum 6 characters at least 1 Alphabet and 1 Number"
                       required autocomplete="off">
                <label for="password" class="input__label">
                    密码
                </label>
                <!-- svg password -->
            </div>
            <!--   type="submit"   -->
            <button class="my-form__button" @click="loginAction">
                登录
            </button>
            <!--            <div class="socials-row">-->
            <!--                <a href="#" title="Use Google">-->
            <!--                    <img src="../assets/image/google.png" alt="Google">-->
            <!--                    Log in with Google-->
            <!--                </a>-->
            <!--            </div>-->
            <div class="my-form__actions">
                <div class="my-form__row">
                    <span>你还没有账号?</span>
                    <a title="Create Account" @click="goSignUp">
                        点击注册
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import router from "@/router/index.js";
import axios from "axios";
import {CONFIG} from "@/utils/global.js";
import useHooks from "@/hooks/useHooks.js";

const {changeRefresh} = useHooks

let email = ref('')
let password = ref('')

async function loginAction() {
    console.log("signupAction", email.value, password.value)
    const data = {
        "email": email.value,
        "password": password.value
    }
    try {
        const result = await axios.post(`${CONFIG.base}/dy/people/login`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (result.data.success) {
            let token = result.data.result.token
            localStorage.setItem('adv_token', token);
            let people = result.data.result.people
            localStorage.setItem('adv_people', people);
            await router.push({"path": "/"})
            changeRefresh(true)
        } else {
            alert("请求错误")
        }
    } catch (error) {
        alert("服务器错误,联系管理员")
    }
}

function goSignUp() {
    router.push({path: "/signup"})
}
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.login-container {
    position: fixed;
    z-index: 999;
    font-size: 16px;
    font-family: 'Work Sans', sans-serif;
    height: 100vh;
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--violet);
    background: -webkit-linear-gradient(to right, var(--violet), var(--primary-dark));
    background: linear-gradient(to right, var(--violet), var(--primary-dark));
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.socials-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.socials-row img {
    width: 1.5rem;
    height: 1.5rem;
}

.socials-row > a {
    padding: 0.5rem;
    border-radius: 10rem;
    width: 100%;
    min-height: 3rem;
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    font-size: 1.1rem;
    color: var(--text);
    background: var(--social-background);
    font-weight: 700;
}

.socials-row > a:hover {
    background: var(--social-background-hover);
}

.login-welcome-row {
    margin-bottom: 1rem;
    text-align: center;
}

.welcome-message {
    max-width: 24rem;
}

.logo {
    height: 4rem;
    margin: 0 auto;
    color: var(--primary);
}

.my-form {
    display: flex;
    flex-direction: column;
    justify-content: start;
    position: relative;
    gap: 1rem;
    background: var(--white);
    width: 100%;
    max-width: 32rem;
    padding: 3rem 2rem;
    border-radius: 2rem;
    height: fit-content;
}

.my-form__button {
    background: var(--primary);
    color: white;
    white-space: nowrap;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    line-height: 3.125rem;
    outline: none;
    font-size: 1.125rem;
    letter-spacing: 0.025rem;
    text-decoration: none;
    cursor: pointer;
    font-weight: 800;
    min-height: 3.125rem;
    width: 100%;
    border-radius: 10rem;
    transition: all 0.3s ease;
    -webkit-transition: all 0.3s ease;
}

.my-form__button:hover {
    background: var(--primary-dark);
}

.input__wrapper {
    position: relative;
    padding: 0.9375rem 0 0;
    margin-bottom: 0.5rem;
}

.input__field {
    font-size: 1.5rem;
    color: var(--text);
    padding: 0.375rem 0;
    line-height: 2rem;
    height: 2rem;
    outline: 0;
    border: 0;
    width: 100%;
    vertical-align: middle;
    border-bottom: 3px solid var(--secondary);
    background: transparent;
    transition: border-color 0.2s;
}

.input__field::placeholder {
    color: transparent;
}

.input__label {
    user-select: none;
}

.input__field:placeholder-shown ~ .input__label {
    cursor: text;
    color: var(--text);
    top: 0.8rem;
    font-size: 1.2rem;
}

.input__label,
.input__field:focus ~ .input__label {
    position: absolute;
    top: -0.8rem;
    display: block;
    font-size: 1.2rem;
    color: var(--text);
    transition: 0.3s;
}

.input__field:focus ~ .input__label {
    color: var(--primary);
}

.input__field:focus {
    border-bottom: 3px solid var(--primary);
}

.input__field:focus ~ svg {
    stroke: var(--primary);
}

.input__icon {
    position: absolute;
    right: -0.875rem;
    bottom: -0.6875rem;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0.125rem;
    transform: translate(-50%, -50%);
    transform-origin: center;
    cursor: pointer;
}

.input__icon:hover {
    border-radius: 50%;
}

.my-form__actions {
    display: flex;
    flex-direction: column;
    align-self: center;
    color: var(--secondary);
    gap: 1rem;
    margin-top: 0.5rem;
}

.my-form__actions a {
    color: var(--secondary);
    font-weight: 600;
    text-decoration: none;
}

.my-form__actions a:hover {
    text-decoration: underline;
}

.my-form__row {
    display: flex;
    gap: 0.5rem;
    justify-content: space-between;
}
</style>