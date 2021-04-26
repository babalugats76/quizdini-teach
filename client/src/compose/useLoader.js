import { reactive, toRefs, watch } from "vue";
import { callApi } from "@api";

export default function useLoader({ callback, immediate = true, deps = [] }) {
  const state = reactive({
    data: null,
    error: null,
    executions: 0,
    failed: false,
    initialized: false,
    loaded: false,
    loading: false,
  });

  watch(
    deps,
    async () => {
      state.loading = true;
      ({
        data: state.data,
        error: state.error,
        failed: state.failed,
        loaded: state.loaded,
      } = await callApi(callback)());
      state.executions += 1;
      state.initialized = !!state.executions;
      state.loading = false;
    },
    { immediate }
  );

  return { ...toRefs(state) };
}
