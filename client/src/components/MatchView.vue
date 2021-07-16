<template>
  <div class="matches">
    <nav-button :to="{ path: `/match/new` }" :disabled="credits <= 0">Press Me</nav-button>
    <match-list :matches="matches" class="matches__list" @edit="openEdit" />
    <match-edit
      v-if="matchId"
      :match-id="matchId"
      class="matches__edit"
      :show-modal="showEdit"
      @close="closeEdit"
      @exited="exitEdit"
    />
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { NavButton } from "@ui";
import MatchList from "./MatchList";
import MatchEdit from "./MatchEdit";

export default {
  name: "MatchView",
  components: {
    MatchEdit,
    MatchList,
    NavButton,
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
  setup() {
    const state = reactive({
      matchId: "",
      showEdit: false,
    });

    // launch the match edit modal
    const openEdit = (payload) => {
      const { id: matchId } = payload;
      console.log("requesting to open", matchId);
      state.matchId = matchId;
      state.showEdit = true;
    };

    const exitEdit = () => {
      state.matchId = "";
      console.log("Edit exited...");
    };

    const closeEdit = () => {
      state.showEdit = false;
    };

    return {
      closeEdit,
      exitEdit,
      openEdit,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped></style>
