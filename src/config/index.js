export default {
    baseUrl: 'https://api.bameiapp.com',
    imgPath: '/imgs/',
    filePreview: 'http://192.168.0.103/static/uploads/'
}

const BASE_URL_MAP = {
    DEV: '',
    PROD: '',
    GP_PAGES: '',
    GITEE_PAGES: '/douyin',
    UNI: 'https://dy.ttentau.top'
}

// Assuming `import.meta.env.VITE_ENV` is replaced with a global variable or environment variable in JavaScript.
const VITE_ENV = 'DEV'

export const IS_SUB_DOMAIN = ['GITEE_PAGES', 'GP_PAGES'].includes(VITE_ENV)
export const IS_GITEE_PAGES = ['GITEE_PAGES'].includes(VITE_ENV)
export const BASE_URL = BASE_URL_MAP[VITE_ENV]
export const IMG_URL = BASE_URL + '/images/'
export const FILE_URL = BASE_URL + '/data/'
export const IS_DEV = 'DEV' !== 'production'
