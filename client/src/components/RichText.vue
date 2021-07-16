<template>
  <div :class="classes">
    <rich-menu v-if="editor" :buttons="buttons" :editor="editor" />
    <editor-content class="rich-text__editor" :editor="editor" :name="id" />
  </div>
</template>

<script>
import { computed, unref, toRefs } from "vue";
import { EditorContent, BubbleMenu } from "@tiptap/vue-3";
import { useTipTap } from "@hooks";

const RichButton = ({ label, ...rest }, { emit }) => {
  return (
    <button {...rest} type="button" onClick={() => emit("click")}>
      {label}
    </button>
  );
};

const RichMenu = ({ editor, buttons = [], toggleMark, ...rest }) => {
  return (
    <BubbleMenu editor={editor}>
      {buttons.map((b) => {
        const { action, ...btnProps } = b;
        return <RichButton tabIndex="-1" {...btnProps} onClick={() => action()} />;
      })}
    </BubbleMenu>
  );
};

RichButton.emits = ["click"];

export default {
  name: "RichText",
  components: {
    EditorContent,
    RichMenu,
  },
  props: ["autofocus", "extensions", "id", "name", "placeholder", "tabindex", "value"],
  emits: ["blur", "update"],
  setup(props, { emit }) {
    const { value: content } = toRefs(props);
    const { editor } = useTipTap({
      autofocus: props.autofocus,
      content,
      emit,
      extensions: props.extensions(props),
      id: props.id,
      name: props.name,
      tabindex: props.tabindex,
    });

    const classes = computed(() => ({
      "rich-text": true,
      [`rich-text--${props.id}`]: props.id,
    }));

    const insertText = (text) => unref(editor).commands.insertContent(text);
    const clearFormatting = () => unref(editor).commands.unsetAllMarks();

    const buttons = [
      {
        name: "code",
        class: "rich-text__code",
        label: "Code",
        action: () => unref(editor).chain().focus().toggleCode().run(),
      },
      {
        name: "subscript",
        class: "rich-text__sub",
        label: "Subscript",
        action: () => unref(editor).chain().focus().toggleSubscript().run(),
      },
      {
        name: "superscript",
        class: "rich-text__sup",
        label: "Superscript",
        action: () => unref(editor).chain().focus().toggleSuperscript().run(),
      },
      {
        name: "underline",
        class: "rich-text__u",
        label: "Underline",
        action: () => unref(editor).chain().focus().toggleUnderline().run(),
      },
      {
        name: "pi",
        class: "rich-text__pi",
        label: "Pi",
        action: () => insertText("\u03C0"),
      },
      {
        name: "clear",
        class: "rich-text__clear",
        label: "Clear",
        action: () => clearFormatting(),
      },
    ];

    return {
      buttons,
      classes,
      editor,
    };
  },
};
</script>

<style lang="scss">
code {
  font-family: "Ubuntu Mono", monospace;
}

.rich-text {
  box-sizing: border-box;
  display: block;
  position: relative;
  width: 100%;
  margin: 0 auto;
  font-family: "Inter", "Ubuntu Mono", monospace;
  .ProseMirror {
    width: 100%;
    padding: 1rem;
    border: 1px solid #cad3dc;
    border-radius: 0.5rem;
    margin: 0.5rem 0 0.5rem;
    font-family: "Inter", "Ubuntu Mono", monospace;
    font-size: 1.0625rem;
    line-height: 1.5;
    background-color: #263238;
    color: #eeffff;
    outline: none;

    > * + * {
      margin: 0.25em 0;
    }

    .is-editor-empty::before,
    .is-empty::before {
      content: attr(data-placeholder);
      float: left;
      color: #ced4da;
      pointer-events: none;
      height: 0;
    }

    &:active,
    &:focus {
      border-color: rgba(23, 28, 32, 0.4);
      transition: all 300ms ease;
    }
  }
}
</style>
