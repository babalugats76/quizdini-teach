// import { getCountries } from "@/api/country";
// import { apiState, apiGetters, apiMutations } from "../util";

// const state = () => ({ ...apiState });

// const getters = { ...apiGetters };

// const actions = {
//   async fetch({ commit }) {
//     commit("load");
//     commit("process", await getCountries());
//   },
// };

// const mutations = {
//   ...apiMutations,
//   success(state, { data }) {
//     state.data = data;
//     state.error = null;
//   },
//   failure(state, { error }) {
//     state.error = error;
//     state.data = null;
//   },
// };

// export default {
//   namespaced: true,
//   state,
//   getters,
//   actions,
//   mutations,
// };
