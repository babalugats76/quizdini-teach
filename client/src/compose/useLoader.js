import { reactive, toRefs, watch } from "vue";

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
      const response = await callback();
      const { data = null, error = null } = response;
      state.data = data;
      state.error = error;
      state.executions += 1;
      state.initialized = !!state.executions;

      if (data) {
        state.loaded = true;
        state.failed = false;
      }
      if (error) {
        state.loaded = false;
        state.failed = true;
      }
      state.loading = false;
    },
    { immediate }
  );

  return { ...toRefs(state) };
}
