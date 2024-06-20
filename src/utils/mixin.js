import BaseHeader from '../components/BaseHeader.vue'
import Back from '../components/Back.vue'
import CONST_VAR from './const_var'

export default {
    components: {
        BaseHeader,
        'dy-back': Back,
    },
    data() {
        return {
            SUCCESS: 200,
            RELATE_ENUM: CONST_VAR.RELATE_ENUM
        }
    },
}