<template>
  <UiSlidedown :show="showWarning" @exited="onWarningExited">
    <template #icon><span class="icon-warning"></span></template>
    <template #message>
      <div :style="{ padding: '0.5rem 0', fontWeight: 600 }">You have invalid matches!</div>
      <div>Continue and lose bad rows?</div>
    </template>
    <template #footer>
      <input
        type="button"
        name="bulk-match__confirm"
        @click.prevent="onConfirm"
        value="OK"
        :style="{ float: 'right' }"
        class="bulk-match__confirm positive"
      />
      <input
        type="button"
        name="bulk-match__deny"
        @click.prevent="onDeny"
        value="Cancel"
        :style="{ float: 'right', marginRight: '0.5rem' }"
        class="bulk-match__deny negative"
      />
    </template>
  </UiSlidedown>
  <div class="bulk-match">
    <div class="bulk-match__debug">
      <div>Change: {{ generation }}</div>
      <div>isDirty: {{ dirty }}</div>
    </div>
    <input
      type="button"
      name="bulk-match__save"
      @click="onSave"
      value="Save"
      :disabled="!dirty"
      class="bulk-match__save primary"
    />
    <input
      type="button"
      for="bulk-match__file"
      name="bulk-match__upload"
      @click.prevent="onUpload"
      value="Upload"
      class="bulk-match__upload"
    />
    <input
      hidden
      id="bulk-match__file"
      name="bulk-match__file"
      :accept="'.csv, .txt'"
      type="file"
      ref="fileRef"
      @change.prevent="onFileChange"
    />
    <textarea
      placeholder="term, definition"
      class="bulk-match__editor"
      ref="textareaRef"
    ></textarea>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from "vue";
import { UiSlidedown } from "@ui";
import { useCodeMirror } from "@hooks";

export default {
  name: "MatchBulk",
  components: {
    UiSlidedown,
  },
  props: ["bulkMatches", "matches", "options"],
  emits: ["change", "save", "upload"],
  setup(props, { emit }) {
    const state = reactive({
      showWarning: false,
      confirm: false,
    });

    const textareaRef = ref();

    const fileRef = ref();

    const { append, editor, dirty, generation, hasErrors, setValue } = useCodeMirror({
      emit,
      options: props.options || {},
      initialValue: props.bulkMatches,
      textareaRef,
    });

    const onConfirm = () => {
      state.confirm = true;
      state.showWarning = false;
    };

    const onDeny = () => {
      state.confirm = false;
      state.showWarning = false;
    };

    const onFileChange = (event) => {
      emit("upload", { event, append });
    };

    const onSave = () => {
      if (hasErrors() && !state.confirm) {
        return (state.showWarning = true);
      }
      emit("save", { setValue });
    };

    const onUpload = () => {
      fileRef.value.value = null;
      fileRef.value.click(); // Clear file input (to allow file re-select)
    };

    const onWarningExited = () => {
      if (state.confirm) {
        emit("save", { setValue });
        state.confirm = false;
      }
    };

    return {
      ...toRefs(state),
      editor,
      dirty,
      fileRef,
      generation,
      onConfirm,
      onDeny,
      onFileChange,
      onSave,
      onUpload,
      onWarningExited,
      textareaRef,
    };
  },
};
</script>

<style lang="scss">
input[type="button"],
button {
  border-width: 0px;
  outline: none;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 1.125rem;
  line-height: 1;
  font-weight: 500;
  transition: all 50ms ease-in-out;
  cursor: pointer;
  &.negative {
    background-color: #e15554 !important;
    color: white;
  }
  &.positive {
    background-color: #3bb273 !important;
    color: white;
  }
  &.primary {
    background-color: #0971f1 !important;
    color: white;
  }
}

input[type="button"]:disabled,
button:disabled {
  background-color: #eeeeee !important;
  color: #999999;
  transition: all 50ms ease-in-out;
}

.bulk-match {
  box-sizing: border-box;
  display: block;
  position: relative;
  width: 100%;
  padding: 1rem;
  margin: 0 auto;
  font-family: "Inter", "Ubuntu Mono", monospace;

  &__debug {
    position: absolute;
    right: 0;
    margin-right: 1rem;
    z-index: 1000;
  }

  &__upload {
    margin-left: 0.75rem;
  }

  .CodeMirror {
    width: 100%;
    /* border: 1px solid #cad3dc; */
    border-radius: 0.5rem;
    margin: 1rem 0;
    font-size: 1.0625rem;
    line-height: 1.5;
    text-align: left;
    font-family: "Inter", "Ubuntu Mono", monospace;
    /* color: #171c20;
    background-color: #e6f0ff; */
    z-index: 1;

    &-focused {
      border-color: rgba(23, 28, 32, 0.4);
      transition: all 300ms ease;
    }

    .CodeMirror-lines {
      padding: 8px 0;
    }

    pre {
      &.CodeMirror-line,
      &.CodeMirror-line-like {
        padding: 0 0 0 1rem;
      }
    }
  }

  .CodeMirror-vscrollbar,
  .CodeMirror-hscrollbar {
    outline: none;
  }

  .CodeMirror-gutter {
    &.CodeMirror-lint-markers {
      width: 28px;
    }
  }

  .CodeMirror-lint-marker-warning {
    width: 16px;
    height: 16px;
    top: -1px;
  }

  .CodeMirror-lint-mark-warning,
  .CodeMirror-lint-marker-warning,
  .CodeMirror-lint-message-warning {
    background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgZGF0YS1uYW1lPSJMYXllciAxIiBpZD0iTGF5ZXJfMSIgdmlld0JveD0iMCAwIDY0IDY0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDojZWZjYzAwO30uY2xzLTJ7ZmlsbDojMzUzNTM1O308L3N0eWxlPjwvZGVmcz48dGl0bGUvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTMwLjE2LDExLjUxLDYuODQsNTEuOWEyLjEzLDIuMTMsMCwwLDAsMS44NCwzLjE5SDU1LjMyYTIuMTMsMi4xMywwLDAsMCwxLjg0LTMuMTlMMzMuODQsMTEuNTFBMi4xMywyLjEzLDAsMCwwLDMwLjE2LDExLjUxWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTI5LDQ2YTMsMywwLDEsMSwzLDNBMi44OCwyLjg4LDAsMCwxLDI5LDQ2Wm0xLjA5LTQuNjYtLjc2LTE1aDUuMjZsLS43MywxNVoiLz48L3N2Zz4=");
  }
}

.CodeMirror-lint-tooltip {
  font-family: "Inter", "Ubuntu Mono", monospace;
  background-color: #ffe !important;
}
</style>
