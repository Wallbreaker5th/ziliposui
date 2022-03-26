<template>
  <v-bottom-sheet v-model="BottomTable">
    <template v-slot:activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">
        <v-icon>mdi-dots-grid</v-icon>速查表
      </v-btn>
    </template>
    <v-sheet>
      <div class="py-3 mx-6" style="max-height: 500px; overflow-y: scroll">
        <div v-for="component in hanComponents"
          :key="component.frequency*10000+component.index"
          :class="'han-component '+component.status">
          {{ component.component }}
        </div>
      </div>
      <div class="pb-6 text-center">
        <v-btn color="green" dark @click="BottomTable = !BottomTable">
          关闭
        </v-btn>
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
export default {
  name: "TheBottomTable",
  data() {
    return {
      BottomTable: false,
    };
  },
  props: {
    hanComponents: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.han-component {
  width: 2em;
  font-size: 1.5rem;
  font-weight: bold;
}

.han-component.not-exist {
  font-weight: normal;
}
</style>
