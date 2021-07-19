<template>
  <ui-form
    class="match__form"
    :initial-values="initialValues"
    :schema="matchValidation"
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
        input,
        submitting,
        touched,
        values,
      }"
    >
      <ui-tabs>
        <ui-tab title="Matches">
          <match-editor
            :initial-values="blankMatch"
            :matches="values.matches"
            @save="(match) => values.matches.push(match)"
          />
        </ui-tab>
        <ui-tab title="Bulk">
          <match-bulk
            :bulk-matches="bulkMatches"
            :options="{
              lineNumbers: true,
              mode: 'htmlmixed',
              theme: 'material',
              autoCloseTags: true,
              allowDropFileTypes: null,
              gutters: ['CodeMirror-linenumbers', 'CodeMirror-lint-markers'],
              lint: {
                getAnnotations: bulkMatchValidator,
                lintOnChange: true,
                async: true,
              },
              /* viewportMargin: Infinity, */
            }"
            :matches="values.matches"
            @change="handleBulkChange"
            @save="handleBulkSave"
            @upload="handleBulkUpload"
          />
        </ui-tab>
      </ui-tabs>
    </template>
  </ui-form>
</template>
<script>
import { reactive, toRefs } from "vue";
import { array, number, object, string, ref as yupRef } from "yup";
import { UiForm, UiTab, UiTabs } from "@ui";
import MatchBulk from "./MatchBulk";
import MatchEditor from "./MatchEditor";

import { bulkMatchValidator, matchToString, parseMatch } from "@utils/match";

const itemsPerBoardOptions = [
  { text: "4", value: 4 },
  { text: "6", value: 6 },
  { text: "9", value: 9 },
];

const durationOptions = [
  { text: "10", value: 10 },
  { text: "60", value: 60 },
  { text: "90", value: 90 },
  { text: "120", value: 120 },
  { text: "180", value: 180 },
  { text: "240", value: 240 },
  { text: "300", value: 300 },
];

const colorSchemeOptions = [
  { text: "Basic", value: "Basic" },
  { text: "Rainbow", value: "Rainbow" },
];

export default {
  name: "MatchForm",
  components: {
    MatchBulk,
    MatchEditor,
    UiForm,
    UiTab,
    UiTabs,
  },
  props: {
    game: {
      type: Object,
      default: () => ({}),
      required: true,
    },
  },
  setup(props) {
    // Disposition piece by piece using UiForm, etc.
    const state = reactive({
      bulkMatches: matchToString(props.game.matches || []),
      matches: props.game.matches,
      showDialog: false,
    });

    const initialValues = reactive({
      matchId: props.game.matchId || null,
      title: props.game.title || "",
      instructions: props.game.instructions || "",
      itemsPerBoard: (props.game.options && props.game.options.itemsPerBoard) || 9,
      duration: (props.game.options && props.game.options.duration) || 90,
      colorScheme: (props.game.options && props.game.options.colorScheme) || "Basic",
      matches: props.game.matches || [],
      bulkMatches: matchToString(props.game.matches || []),
    });

    /* eslint-disable no-template-curly-in-string */
    const matchValidation = object().shape({
      title: string()
        .min(2, "Title is too short. ${min} characters are required.")
        .max(50, "Title is too long. ${max} characters are allowed.")
        .required("Title is required."),
      instructions: string().max(50, "Instructions are too long. ${max} characters are allowed."),
      itemsPerBoard: number()
        .integer()
        .positive()
        .required("Game Tiles is required.")
        .oneOf(
          itemsPerBoardOptions.map((i) => i.value),
          "Pick a valid number of game tiles."
        ),
      duration: number()
        .integer()
        .positive()
        .required("Duration is required.")
        .oneOf(
          durationOptions.map((i) => i.value),
          "Pick a valid game duration."
        ),
      colorScheme: string()
        .required("Color Scheme is required.")
        .oneOf(
          colorSchemeOptions.map((i) => i.value),
          "Pick a valid color scheme."
        ),
      matches: array().test({
        name: "min-matches",
        params: {
          itemsPerBoard: yupRef("itemsPerBoard"),
        },
        message: "${itemsPerBoard} matches required in bank.",
        test: function (value) {
          return value.length >= this.parent.itemsPerBoard;
        },
      }),
    });

    // imagine these were coming from an external source, e.g., API
    const initialTerm = "";
    const initialDefinition = "";

    // mimicks how forms will work
    const blankMatch = {
      definition: `<p>${initialDefinition}</p>`,
      term: `<p>${initialTerm}</p>`,
    };

    const handleBulkChange = ({ value }) => (state.bulkMatches = value);

    const handleBulkSave = ({ setValue }) => {
      state.matches = parseMatch(state.bulkMatches, 500);
      state.bulkMatches = matchToString(state.matches);
      setValue(state.bulkMatches);
    };

    const handleBulkUpload = ({ event, append }) => {
      if (event.target.files.length) {
        const file = event.target.files[0]; // Assumes single file processing
        const contents = event.target.files[0].slice(0, file.size, ""); // 0, size, '' are defaults
        const reader = new FileReader(); // To read file from disk

        reader.onload = (function (file) {
          // Closure run upon read completion
          return function (event) {
            console.log(`Loaded ${file.size} bytes from ${file.name}...`);
            if (event.target.result) {
              // If results are returned
              const parsed = parseMatch(event.target.result, 500); // Split, Sanitize, Dedup -> array of matches
              const bulk = matchToString(parsed); // Flatten parsed matches
              append(bulk); // append to editor
              event.target.value = null;
            }
          };
        })(file);

        reader.readAsText(contents, "UTF-8"); // Initiate file read, assuming UTF-8 encoding
      }
    };

    const handleSubmit = async ({ errors, setSubmitting, setSubmitted, values }) => {
      if (errors) return;
    };

    return {
      ...toRefs(state),
      blankMatch,
      bulkMatchValidator,
      handleBulkChange,
      handleBulkSave,
      handleBulkUpload,
      handleSubmit,
      initialValues,
      matchValidation,
    };
  },
};
</script>
<style lang="scss" scoped>
.match__form {
  width: 100%;
}
</style>
