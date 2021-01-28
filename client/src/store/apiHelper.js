const STATUS = {
  INIT: 0,
  LOADING: 1,
  ERROR: 2,
  LOADED: 3,
};

const state = {
  status: STATUS.INIT,
  data: null,
  error: null,
};

const getters = {
  count: (state) => (Array.isArray(state.data) ? state.data.length : 0),
  getAll: (state) => state.data,
  initialized: (state) => state.status !== STATUS.INIT,
  inError: (state) => state.status === STATUS.ERROR,
  loaded: (state) => state.status === STATUS.LOADED,
  loading: (state) => state.status === STATUS.LOADING,
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
  store.subscribe((mutation) => {
    const { payload } = mutation;
    const [type, ...mod] = mutation.type.split("/").reverse();
    const module = mod ? mod.join("/") : "";
    const getMutation = (name) => `${module}${module ? "/" : ""}${name}`;

    // const { status: prevStatus } = module
    //   ? module.split("/").reduce((acc, part) => acc && acc[part], state)
    //   : state;

    if (type === "load") {
      store.commit(getMutation("setStatus"), STATUS.LOADING);
    }

    if (type === "process") {
      if (Object.prototype.hasOwnProperty.call(mutation.payload, "error")) {
        store.commit(getMutation("failure"), payload);
        store.commit(getMutation("setStatus"), STATUS.ERROR);
      } else {
        store.commit(getMutation("success"), payload);
        store.commit(getMutation("setStatus"), STATUS.LOADED);
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
