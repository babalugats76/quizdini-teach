// // import { ref } from "vue";

// export default function useAPI() {
//   // const data = ref(null);
//   // const error = ref(null);
//   // const failed = ref(false);
//   // const loaded = ref(false);
//   // const loading = ref(false);

//   async function callApi(cb) {
//     // loading.value = true;

//     try {
//       const { data, error } =
//       return await cb;
//     } catch (err) {
//       console.log(JSON.stringify(err, null, 4));
//       return err;
//       // store.commit(types.FAILURE, err);
//     }

//     // const { data, error } = await cb();
//     // if (error) {
//     //   data.value = null;
//     //   error.value = error;
//     //   failed.value = true;
//     //   loaded.value = false;
//     // } else {
//     //   data.value = data;
//     //   error.value = null;
//     //   failed.value = false;
//     //   loaded.value = true;
//     // }
//     // loading.value = false;
//   }

//   return {
//     callApi,
//     // data,
//     // error,
//     // failed,
//     // loaded,
//     // loading,
//   };
// }
