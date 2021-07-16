import { onBeforeUnmount, onMounted, reactive, toRefs, unref, watch } from "vue";

import { Editor } from "@tiptap/vue-3";

export default function useTipTap({
  autofocus = false,
  content,
  emit,
  extensions = [],
  id,
  name,
  ...rest
}) {
  const state = reactive({
    tt: null,
  });

  onMounted(() => {
    state.tt = new Editor({
      autofocus,
      content: unref(content),
      extensions,
      editorProps: {
        attributes: {
          id,
          name,
          ...rest,
        },
      },
      onBlur({ event }) {
        event.target.name = name;
        emit("blur", { event });
      },
      onCreate({ editor }) {
        // console.log("editor created...");
        // use to examine the custom schema as it is developed
        // console.log(editor.schema);
      },
      onUpdate({ editor }) {
        // emit or incorporate v-model
        // emit("update:modelValue", editor.getHTML());
        emit("update", { html: editor.getHTML(), json: editor.getJSON() });
      },
    });
  });

  onBeforeUnmount(() => {
    state.tt.destroy();
  });

  watch(content, (content) => {
    const isSame = content === state.tt.getHTML();
    if (isSame) {
      return;
    }
    state.tt.commands.setContent(content, false);
  });

  /* eslint-disable no-unused-vars */
  const { tt: editor } = toRefs(state);

  return { editor };
}
