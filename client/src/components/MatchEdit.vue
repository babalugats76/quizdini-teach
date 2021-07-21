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
    <button class="match-edit__close" @click.prevent="$emit('close')">X</button>
    <!-- <pre>loaded: {{ loaded }} </pre>
    <pre>initialized: {{ initialized }} </pre>
    <pre>loading: {{ loading }} </pre>
    <pre>error: {{ error }} </pre> -->
    <div v-if="loading">Loader goes here...</div>
    <match-form v-if="!loading && !error" :game="game" />
    <!-- <pre v-if="game" :style="{ overflow: 'scroll' }">matches: {{ JSON.stringify(game.matches, null, 2) }}</pre> -->
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
    console.log("matchId inside MatchEdit", props.matchId);
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

<style lang="scss">
.match-edit {
  &__modal {
    flex-direction: column;
    width: 85vw !important;
    max-width: 800px !important;
  }
  &__close {
    position: absolute;
    right: 0;
  }
}
</style>
