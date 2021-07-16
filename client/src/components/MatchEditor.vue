<template>
  <ui-form
    class="match-editor__form"
    :initial-values="initialValues"
    :schema="matchEditorSchema"
    tag="form"
    @submit="handleSubmit"
  >
    <template
      #default="{
        blur,
        dirty,
        errors,
        handleSubmit,
        hasErrors,
        // input,
        submitting,
        touched,
        //validateField,
        validateForm,
        values,
      }"
    >
      <input
        type="button"
        name="match-editor__submit"
        tabindex="3"
        value="Add"
        :disabled="!dirty || submitting || hasErrors"
        class="match-editor__submit primary"
        @click="handleSubmit"
      />
      <rich-text
        id="term"
        ref="termRef"
        :extensions="extensions"
        :autofocus="true"
        name="term"
        placeholder="Enter term..."
        tabindex="1"
        :value="values.term"
        @blur="({ event: e }) => blur(e)"
        @update="
          ({ html }) => {
            values.term = html;
            validateForm();
          }
        "
      />
      <rich-text
        id="definition"
        ref="definitionRef"
        :extensions="extensions"
        :autofocus="false"
        name="definition"
        placeholder="Enter definition..."
        tabindex="2"
        :value="values.definition"
        @blur="({ event: e }) => blur(e)"
        @update="
          ({ html }) => {
            values.definition = html;
            validateForm();
          }
        "
      />
      <pre>matches: {{ JSON.stringify(matches, null, 2) }}</pre>
      <!-- <pre>errors: {{ JSON.stringify(errors, null, 2) }}</pre>
      <pre>initialValues: {{ JSON.stringify(initialValues, null, 2) }}</pre>
      <pre>values: {{ JSON.stringify(values, null, 2) }}</pre>
      <pre>touched: {{ JSON.stringify(touched, null, 2) }}</pre>
      <pre>dirty: {{ JSON.stringify(dirty, null, 2) }}</pre>
      <pre>submitting: {{ JSON.stringify(submitting, null, 2) }}</pre>
      <pre>hasErrors: {{ JSON.stringify(hasErrors, null, 2) }}</pre> -->
    </template>
  </ui-form>
</template>

<script>
import { ref, toRefs, unref } from "vue";
import { object, string } from "yup";
import { UiForm } from "@ui";
import RichText from "./RichText";
import { extensions, serializeToHtml, toJSON } from "@utils/match";
export default {
  name: "MatchEditor",
  components: {
    RichText,
    UiForm,
  },
  props: ["initialValues", "matches"],
  emits: ["save"],
  setup(props, { emit }) {
    // Used to set focus and the like on editors, etc.
    const termRef = ref();
    const definitionRef = ref();

    const { matches } = toRefs(props);

    const matchEditorSchema = object({
      /* eslint-disable no-template-curly-in-string */
      term: string().test("term-required", "term required", (value) => value !== "<p></p>"),
      definition: string().test(
        "definition-required",
        "definition required",
        (value) => value !== "<p></p>"
      ),
    });

    const setTermFocus = (position = "start", ms = 100) => {
      setTimeout(() => {
        termRef.value.editor.commands.focus("start");
      }, ms);
    };

    // const setDefinitionFocus = (position = "start", ms = 100) => {
    //   setTimeout(() => {
    //     definitionRef.value.editor.commands.focus();
    //   }, ms);
    // };

    const addMatch = (values) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const term = serializeToHtml(toJSON(values.term));
          const definition = serializeToHtml(toJSON(values.definition));
          if (unref(matches).some((m) => m.term === term)) {
            setTermFocus();
            return reject(new Error("duplicate term"));
          }
          emit("save", { term, definition });
          setTermFocus();
          return resolve({ term, definition });
        }, 200);
      });
    };

    const handleSubmit = ({ errors, resetForm, setSubmitting, setSubmitted, values }) => {
      if (errors) return;
      setSubmitting();
      addMatch(values)
        .then(({ term, definition }) => {
          resetForm();
        })
        .catch((err) => {
          // handle form level error here
          console.log(err.message);
        })
        .finally(() => {
          setSubmitted();
        });
    };

    return {
      handleSubmit,
      matchEditorSchema,
      extensions,
      termRef,
      definitionRef,
    };
  },
  /* for debugging */
  computed: {
    console: () => console,
    window: () => window,
  },
};
</script>

<style lang="scss">
pre {
  margin: 0.5rem 1rem;
  font-size: 90%;
  font-family: "Ubuntu Mono", monospace;
}

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

.match-editor {
  box-sizing: border-box;
  display: block;
  position: relative;
  width: 100%;
  padding: 1rem;
  margin: 0 auto;
  font-family: "Inter", "Ubuntu Mono", monospace;
  &__submit {
    &:focus {
      /* added to test tabindex order */
      outline: thick double #32a1ce;
    }
  }
}
</style>
