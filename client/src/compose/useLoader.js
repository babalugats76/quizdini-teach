import { computed, reactive, ref, toRefs, watch } from "vue";
import { API_STATUS } from "@/enums";

export default function useLoader({ callback, immediate = true, deps = [] }) {
  const status = ref(API_STATUS.INIT); // track api interaction status

  const state = reactive({
    changed: 0,
    data: null,
    error: null,
    executions: 0,
    hasData: (state) => !!state.data,
    initialized: computed(() => !!state.data || !!state.error),
    inError: computed(() => !!state.error),
    loading: computed(() => status.value === API_STATUS.LOADING),
    reloading: computed(
      () =>
        status.value === API_STATUS.LOADING && (!!state.data || !!state.error)
    ),
  });

  watch(
    deps,
    async () => {
      status.value = API_STATUS.LOADING;
      const response = await callback();
      const { data = null, error = null } = response;
      state.data = data;
      state.error = error;
      state.executions += 1;
      if (data) return (status.value = API_STATUS.SUCCESS);
      if (error) return (status.value = API_STATUS.FAILURE);
    },
    { immediate }
  );

  return { ...toRefs(state) };
}
