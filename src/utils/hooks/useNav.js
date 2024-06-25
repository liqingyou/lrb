import router from "@/router/index.js";
import {cloneDeep} from '@/utils'
import {useBaseStore} from '@/store/pinia'

export function useNav() {
    const store = useBaseStore()
    return (path, query = {}, data) => {
        if (data) {
            store.routeData = cloneDeep(data)
        }
        router.push({path, query}).then(r => {
        });
    }
}
