import BaseHeader from '../components/BaseHeader.vue'
import Back from '../components/Back.vue'
import BaseFooter from '../components/BaseFooter.vue'
import BaseMask from '../components/BaseMask.vue'
import NoMore from '../components/NoMore.vue'
import CONST_VAR from './const_var'

export default {
    components: {
        BaseHeader,
        'dy-back': Back,
        BaseFooter,
        BaseMask,
        NoMore,
    },
    data() {
        return {
            SUCCESS: 200,
            RELATE_ENUM: CONST_VAR.RELATE_ENUM
        }
    },
}