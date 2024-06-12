import { reactive } from "vue";

const useHooks = () => {
  const state = reactive({
    isRefresh: false,
    isOpenDetail: false,
    popPara: {
      x:0,
      y:0,
      width: 0,
      height: 0,
      imgH: 0,
      imgW: 0,
      info: {
        imageUrl:[],
      }
    }
  });

  const changeRefresh = (val) => {
    state.isRefresh = val;
    console.log(state.isRefresh);
  };

  const changeOpenStatus = (val) => {
    state.isOpenDetail = val;
  }

  return {
    state,
    changeRefresh,
    changeOpenStatus
  };
};

export default useHooks();
