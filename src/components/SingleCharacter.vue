<template>
  <div style="width: 4.5rem; font-size: 18px; text-align: center">
    <div
      style="font-size: 3.5rem; width=100%"
      :class="'han-character ' + Status + (Hide ? ' hide' : '')"
    >
      {{ Char }}
    </div>
    <div>
      <div
        v-for="component in Ids"
        :key="component.index"
        :class="'han-component ' + component.status + (Hide ? ' hide' : '')"
      >
        {{ component.component }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SingleCharacter",
  props: {
    Char: {
      type: String,
      default: "？",
    },
    Status: {
      type: String,
      default: "unknown",
    },
    Ids: {
      type: Array,
      default: () => [
        {
          component: "？",
          index: 0,
          status: "unknown",
        },
      ],
    },
    Hide: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.han-component {
  width: 1em;
  font-weight: bold;
}
</style>
