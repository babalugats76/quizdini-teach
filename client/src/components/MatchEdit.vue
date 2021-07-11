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
    <p>Content of the Modal goes here</p>
    <button @click.prevent="$emit('close')">Close (X)</button>
  </ui-modal>
</template>

<script>
import { UiModal } from "@ui";
import { getMatch } from "@api";
import { useLoader } from "@hooks";

export default {
  name: "MatchEdit",
  components: {
    UiModal,
  },
  props: {
    matchId: {
      type: String,
    },
    showModal: {
      type: Boolean,
    },
  },
  emits: ["close", "exited"],
  setup(props) {
    const { data: match, error, failed, initialized, loaded, loading } = useLoader({
      callback: () => getMatch(props.matchId),
      immediate: true,
      deps: [() => props.matchId],
    });

    return {
      match,
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
