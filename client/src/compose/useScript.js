import { reactive, ref, watch, toRefs } from "vue";
export default function useScript(src, attributes = {}) {
  const srcRef = ref(src); // fully-qualified path for the script to load
  const attributesRef = ref(attributes); // used to avoid infinite loop, i.e., object in dependency list
  const state = reactive({ loaded: false, error: null }); // local state

  watch(
    [srcRef, attributesRef],
    ([src, attribs], [prevSrc, prevAttribs], onInvalidate) => {
      //   console.log("watch fired with", src, attribs);

      if (document.querySelector(`script[src="${src}"]`)) {
        console.log("script already loaded...");
        state.loaded = true;
        return;
      }

      //   console.log("loading script...");
      let script = document.createElement("script");
      script.src = src;

      Object.keys(attribs).forEach((key) => {
        // console.log("setting", key, attribs[key], "on script...");
        script[key] = attribs[key];
      });

      const onScriptLoad = () => {
        // console.log("on script load fired...");
        state.loaded = true;
      };

      const onScriptError = (err) => {
        // console.log("on script error fired...");
        state.error = err;
      };

      script.addEventListener("load", onScriptLoad);
      script.addEventListener("error", onScriptError);

      document.body.appendChild(script);

      onInvalidate(() => {
        // console.log("unloading script...");
        script.removeEventListener("load", onScriptLoad);
        script.removeEventListener("error", onScriptError);
      });
    },
    { immediate: true }
  );

  return {
    ...toRefs(state),
  };
}
