const STATUS = {
  INIT: 0,
  LOADING: 1,
  FAILURE: 2,
  SUCCESS: 3,
};

const state = {
  status: STATUS.INIT,
  data: null,
  error: null,
};

const getters = {
  all: (state) => state.data,
  count: (state) =>
    Array.isArray(state.data)
      ? state.data.length
      : state.data
      ? +!!state.data
      : null,
  hasData: (state) => !!state.data,
  initialized: (state) => !!state.data || !!state.error,
  inError: (state) => !!state.error,
  loading: (state) => state.status === STATUS.LOADING,
  reloading: (state) =>
    state.status === STATUS.LOADING && (!!state.data || !!state.error),
};

const mutations = {
  load() {},
  process() {},
  setStatus(state, status) {
    state.status = status;
  },
};

const plugin = (store) => {
  // state is passed as 2nd arg (if needed)
  store.subscribe((mutation /*, state */) => {
    const { payload } = mutation;
    const [type, ...module] = mutation.type.split("/").reverse();
    const namespace = module ? module.join("/") : "";
    const getMutation = (name) => `${namespace}${namespace ? "/" : ""}${name}`;

    // const { status: prevStatus } = module
    //   ? module.split("/").reduce((acc, part) => acc && acc[part], state)
    //   : state;

    if (type === "load") {
      store.commit(getMutation("setStatus"), STATUS.LOADING);
    }

    if (type === "process") {
      if (Object.prototype.hasOwnProperty.call(mutation.payload, "error")) {
        store.commit(getMutation("failure"), payload);
        store.commit(getMutation("setStatus"), STATUS.FAILURE);
      } else {
        store.commit(getMutation("success"), payload);
        store.commit(getMutation("setStatus"), STATUS.SUCCESS);
      }
    }
  });
};

export {
  STATUS,
  state as apiState,
  getters as apiGetters,
  mutations as apiMutations,
  plugin as apiHelperPlugin,
};
