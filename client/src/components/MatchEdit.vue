<template>
  <ui-modal
    class="match-edit__modal"
    :appear="true"
    :duration="500"
    fade-type="light-to-dark"
    :show="showModal"
    @close="$emit('close')"
    @exited="$emit('exited')"
  >
    <button @click.prevent="$emit('close')">Close (X)</button>
    <match-form :v-if="initialized && !loading && !error" :game="game" />
  </ui-modal>
</template>

<script>
import { UiModal } from "@ui";
import { getMatch } from "@api";
import { useLoader } from "@hooks";
import MatchForm from "./MatchForm";

export default {
  name: "MatchEdit",
  components: {
    MatchForm,
    UiModal,
  },
  props: {
    matchId: {
      type: String,
      default: "",
    },
    showModal: {
      type: Boolean,
    },
  },
  emits: ["close", "exited"],
  setup(props) {
    const { data: game, error, failed, initialized, loaded, loading } = useLoader({
      callback: () => getMatch(props.matchId),
      immediate: true,
      deps: [() => props.matchId],
    });

    return {
      game,
      error,
      failed,
      initialized,
      loaded,
      loading,
    };
  },
};
</script>

<style lang="scss" scoped></style>
