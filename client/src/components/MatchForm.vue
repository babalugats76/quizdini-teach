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
      <match-editor
        :initial-values="blankMatch"
        :matches="values.matches"
        @save="(match) => values.matches.push(match)"
      />
    </template>
  </ui-form>
</template>
<script>
import { reactive } from "vue";
import { array, number, object, string, ref as yupRef } from "yup";
import { UiForm } from "@ui";
import MatchEditor from "./MatchEditor";

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

/* Disposition once more of the code has been migrated */
const matchToString = (matches) => {
  return matches.reduce((accum, vals) => {
    return accum + vals.term + ", " + vals.definition + "\n";
  }, "");
};

export default {
  name: "MatchForm",
  components: {
    MatchEditor,
    UiForm,
  },
  props: {
    game: {
      type: Object,
      default: () => ({}),
      required: true,
    },
  },
  setup(props) {
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

    const handleSubmit = async ({ errors, setSubmitting, setSubmitted, values }) => {
      if (errors) return;
    };

    return {
      blankMatch,
      handleSubmit,
      initialValues,
      matchValidation,
    };
  },
};
</script>
<style lang="scss" scoped></style>
