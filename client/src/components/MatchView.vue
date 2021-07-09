<template>
  <div class="matches">
    <nav-button :to="{ path: `/match/new` }" :disabled="credits <= 0">Press Me</nav-button>
    <match-list :matches="matches" class="matches__list" @edit="openEditModal" />
    <ui-modal
      class="matches__modal--edit"
      :appear="true"
      :duration="500"
      :fade-type="referrer === 'loader' ? 'dark-to-light' : 'light-to-dark'"
      :show="showModal"
      @exited="handleModalExit"
    >
      <p>Content of the Modal goes here</p>
      <button @click.prevent="closeModal">Close (X)</button>
    </ui-modal>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { NavButton, UiModal } from "@ui";
import MatchList from "./MatchList";

export default {
  name: "MatchView",
  components: {
    MatchList,
    NavButton,
    UiModal,
  },
  props: {
    credits: {
      type: Number,
      required: true,
      default: 0,
    },
    matches: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  emits: ["close"],
  setup() {
    const state = reactive({
      showModal: false,
    });

    // launch the match edit modal
    const openEditModal = (payload) => {
      console.log(payload);
      state.showModal = true;
    };

    const handleModalExit = () => {
      console.log("Modal exited...");
    };

    const closeModal = () => {
      state.showModal = false;
    };

    return {
      closeModal,
      openEditModal,
      handleModalExit,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped></style>
