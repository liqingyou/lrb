import { defineStore } from 'pinia'
import { friends, panel } from '@/api/user'
import enums from '@/utils/enums'
import resource from '@/assets/data/resource'

export const useBaseStore = defineStore('base', {
    state: () => {
        return {
            bodyHeight: document.body.clientHeight,
            bodyWidth: document.body.clientWidth,
            maskDialog: false,
            maskDialogMode: 'dark',
            version: '17.1.0',
            excludeNames: [],
            judgeValue: 20,
            homeRefresh: 60,
            loading: false,
            routeData: null,
            users: [],
            user: {},
            userinfo: {
                avatar: "https://d1wreqdqr6ieyc.cloudfront.net/upload%2F20240606%2F1798528699914731521-200x200.png",
                uid: "1801437297166729217",
                nickname: '',
                desc: '',
                user_age: '',
                signature: '',
                unique_id: '',
                province: '',
                city: '',
                gender: '',
                school: {
                    name: '',
                    department: null,
                    joinTime: null,
                    education: null,
                    displayType: enums.DISPLAY_TYPE.ALL
                },
                avatar_168x168: {
                    url_list: []
                },
                avatar_300x300: {
                    url_list: []
                },
                cover_url: [
                    {
                        url_list: []
                    }
                ],
                white_cover_url: [
                    {
                        url_list: []
                    }
                ]
            },
            friends: resource.users
        }
    },
    getters: {
        selectFriends() {
            return this.friends.all.filter((v) => v.select)
        }
    },
    actions: {
        async init() {
            const r = await panel()
            if (r.success) {
                this.userinfo = Object.assign(this.userinfo, r.data)
            }
            const r2 = await friends()
            if (r2.success) {
                this.users = r2.data
            }
        },
        setUserinfo(val) {
            this.userinfo = val
        },
        setUser(val) {
            this.user = val
        },
        setMaskDialog(val) {
            this.maskDialog = val.state
            if (val.mode) {
                this.maskDialogMode = val.mode
            }
        },
        updateExcludeNames(val) {
            if (val.type === 'add') {
                if (!this.excludeNames.find((v) => v === val.value)) {
                    this.excludeNames.push(val.value)
                }
            } else {
                const resIndex = this.excludeNames.findIndex((v) => v === val.value)
                if (resIndex !== -1) {
                    this.excludeNames.splice(resIndex, 1)
                }
            }
        }
    }
})
