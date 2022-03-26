<template>
  <v-row justify="center" class="my-3 mx-0">
    <v-card v-for="i in ShowIds" :key="i.index" class="mx-1">
      <SingleCharacter
        :Char="i.char"
        :Status="i.status"
        :Ids="i.ids"
        :Hide="Hide"
      />
    </v-card>
  </v-row>
</template>

<script>
import SingleCharacter from "./SingleCharacter";

export default {
  name: "SingleIdiom",
  components: {
    SingleCharacter,
  },
  props: {
    Answer: {
      type: String,
      default: "",
    },
    Guess: {
      type: String,
      default: "",
    },
    Hide: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      IdsData: require("../../static/ids.json"),
    };
  },
  computed: {
    ShowIds: function () {
      var idc = new Set([
        "⿱",
        "⿰",
        "⿲",
        "⿳",
        "⿴",
        "⿵",
        "⿶",
        "⿷",
        "⿸",
        "⿹",
        "⿺",
        "⿻",
        "〾",
        "↔",
        "↷",
        "⊖",
      ]);
      var res = [];
      for (var i = 0; i < 4; i++) {
        var c = this.Guess.length > i ? this.Guess[i] : "？";
        var s = c in this.IdsData ? this.IdsData[c] : ["？"];
        var t = [];
        for (var j = 0; j < s.length; j++) {
          t.push({
            component: s[j],
            index: j,
            status: idc.has(s[j]) ? "idc" : "unknown",
          });
        }
        res.push({
          char: c,
          index: i,
          status: "unknown",
          ids: t,
        });
      }
      if (this.Answer == "") {
        return res;
      }
      var occ = new Map();
      for (i = 0; i < this.Answer.length; i++) {
        c = this.Answer[i];
        occ[c] = (occ[c] || 0) + 1;
      }
      for (i = 0; i < res.length; i++) {
        if (res[i].char == this.Answer[i]) {
          res[i].status = "right-position";
          if (res[i].char in occ) {
            occ[res[i].char]--;
          }
        }
      }
      for (i = 0; i < res.length; i++) {
        if (res[i].status == "unknown") {
          if (res[i].char in occ && occ[res[i].char] > 0) {
            occ[res[i].char]--;
            res[i].status = "wrong-position";
          } else {
            res[i].status = "not-exist";
          }
        }
      }
      occ = new Map();
      var occ_each = [new Map(), new Map(), new Map(), new Map()];
      for (i = 0; i < res.length; i++) {
        c = this.Answer.length > i ? this.IdsData[this.Answer[i]] : [];
        for (j in c) {
          if (!idc.has(c[j])) {
            occ_each[i][c[j]] = (occ_each[i][c[j]] || 0) + 1;
          }
        }
      }
      for (i = 0; i < res.length; i++) {
        for (j in res[i].ids) {
          c = res[i].ids[j].component;
          if (occ_each[i][c] > 0) {
            occ_each[i][c]--;
            res[i].ids[j].status = "right-position";
          }
        }
      }
      for (i = 0; i < res.length; i++) {
        for (j in occ_each[i]) {
          occ[j] = (occ[j] || 0) + occ_each[i][j];
        }
      }
      for (i = 0; i < res.length; i++) {
        for (j in res[i].ids) {
          c = res[i].ids[j].component;
          if (res[i].ids[j].status == "unknown") {
            if (occ[c] > 0) {
              occ[c]--;
              res[i].ids[j].status = "wrong-position";
            } else {
              res[i].ids[j].status = "not-exist";
            }
          }
        }
      }
      return res;
    },
  },
  mounted() {
    this.$emit("new-known", this.ShowIds);
  },
};
</script>
