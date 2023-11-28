<template>
  <v-app>
    <v-app-bar app>
      <div class="d-flex align-center" style="font-size: 1.5rem">字离破碎</div>
    </v-app-bar>

    <v-main>
      <v-col class="text-center">
        <SingleIdiom
          v-for="guess in Guesses"
          :key="guess.index"
          :Guess="guess.s"
          :Answer="Answer"
          :Hide="Hide"
          v-on:new-known="NewKnown"
        ></SingleIdiom>
        <div v-if="(!Win && !Lose) || ShowInput" style="width: 320px" class="mx-auto">
          <SingleIdiom :Guess="Guessing" Answer=""></SingleIdiom>
          <v-text-field
            v-model="Guessing"
            label="输入四字成语"
            append-outer-icon="mdi-send"
            @keyup.enter="MakeGuess"
            @click:append-outer="MakeGuess"
            :error-messages="InvalidInput ? '请输入四字成语' : ''"
            ref="Guessing"
          ></v-text-field>
        </div>
        <div style="text-align: center">
          {{ Guesses.length }} 次<span v-if="Win || Lose"
            >：{{ Win ? "成功" : "失败" }}</span
          >
          <span v-if="Lose">，答案：{{ Hide ? "？？？？" : Answer }}</span>
          <br />
          <span style="color: grey"
            >字离破碎 | ziliposui.netlify.app | {{ new Date().getFullYear() }}/{{
              new Date().getMonth() + 1
            }}/{{ new Date().getDate() }}</span
          >
        </div>

        <div style="text-align: center" v-if="Win || Lose">
          <div class="row justify-space-around">
            <v-switch v-model="Hide" label="开启/关闭遮罩"></v-switch>
          </div>
          分享时建议开启遮罩<span @click="ShowInput = true;">，</span>避免剧透
        </div>
        <TheBottomHelp />
        <TheBottomTable :han-components="HanComponents" />
        <div style="text-align: center">
          By <a href="https://www.wallbreaker5th.top">破壁人五号</a> |
          <a href="https://metro.wallbreaker5th.top">地铁换城</a> |
          <a @click="Credits = !Credits">Credits</a>
        </div>
        <v-bottom-sheet v-model="Credits">
          <v-sheet style="text-align: center">
            <div class="py-3 mx-6">
              灵感来自：<a href="https://www.nytimes.com/games/wordle/index.html"
                >Wordle</a
              >
              和 <a href="https://handle.antfu.me/">汉兜</a>
              <br />
              字形数据魔改自
              <a href="https://babelstone.co.uk/CJK/IDS.TXT">IDS.TXT</a>
              <br />
              偏旁部首字体魔改自思源宋体
              <br />
              成语数据来自 <a href="https://github.com/antfu/handle">汉兜</a>
            </div>
          </v-sheet>
        </v-bottom-sheet>
      </v-col>
    </v-main>
  </v-app>
</template>

<script>
import TheBottomHelp from "./components/TheBottomHelp";
import TheBottomTable from "./components/TheBottomTable";
import SingleIdiom from "./components/SingleIdiom";

import "./assets/style.css";

export default {
  name: "App",

  components: {
    TheBottomHelp,
    TheBottomTable,
    SingleIdiom,
  },

  data: () => ({
    HanComponents: [
      {
        component: "甲",
        frequency: 1,
        status: "unknown",
      },
    ],
    Guesses: [],
    Guessing: "",
    Answer: "沧海桑田",
    Win: false,
    Lose: false,
    Idioms: new Set(),
    InvalidInput: false,
    Hide: false,
    Credits: false,
    IdsData: require("../static/ids.json"),
    ShowInput: false,
  }),

  mounted() {
    var HanComponents = require("../static/components.json");
    this.HanComponents = [];
    for (var i = 0; i < HanComponents.length; i++) {
      this.HanComponents.push({
        component: HanComponents[i].component,
        frequency: HanComponents[i].frequency,
        index: i,
        status: "unknown",
      });
    }
    this.Idioms = new Set(require("../static/idioms.json"));
    var all_answers = require("../static/answers.json");

    var today = new Date();
    var day_for_answer = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
    var sdate =
      day_for_answer.getFullYear() +
      "/" +
      (day_for_answer.getMonth() + 1) +
      "/" +
      day_for_answer.getDate();

    var rec = this.$cookies.get("game_today");
    if (rec) {
      this.Guesses = JSON.parse(rec);
    }

    // try {
    //   // fetch("http://geo.crox.net/djia/" + sdate, { metthod:'GET',mode: "no-cors" })
    //   //   .then(function (response) {
    //   //     console.log(response,"http://geo.crox.net/djia/" + sdate);
    //   //     return response.text();
    //   //   })
    //   //   .then((text) => {
    //   //     var md5 = this.$md5(sdate + " " + text);
    //   //     console.log(sdate + " " + text);
    //   //     var len = all_answers.length;
    //   //     var idx = 0;
    //   //     for (var i = 0; i < md5.length; i++) {
    //   //       idx = (idx * 16 + parseInt(md5[i], 16)) % len;
    //   //     }
    //   //     this.Answer = all_answers[idx];
    //   //     if (this.Guesses.length > 0) {
    //   //       if (this.Guesses[this.Guesses.length - 1].s == this.Answer) {
    //   //         this.Win = true;
    //   //       } else if (this.Guesses.length >= 20) {
    //   //         this.Lose = true;
    //   //       }
    //   //     }
    //   //   });
    // } catch (error) {
    //   alert("您的本地时间可能有误");
    //   this.Answer = all_answers[0];
    //   if (this.Guesses.length > 0) {
    //     if (this.Guesses[this.Guesses.length - 1] === this.Answer) {
    //       this.Win = true;
    //     } else if (this.Guesses.length >= 20) {
    //       this.Lose = true;
    //     }
    //   }
    // }

    var md5 = sdate;
    // eslint-disable-next-line
    while (true) {
      md5 = this.$md5(md5);
      var len = all_answers.length;
      var idx = 0;
      for (i = 0; i < md5.length; i++) {
        idx = (idx * 16 + parseInt(md5[i], 16)) % len;
      }
      this.Answer = all_answers[idx];
      var sum_len = 0;
      for (i = 0; i < this.Answer.length; i++) {
        sum_len += Math.ceil(this.IdsData[this.Answer[i]].length / 2);
      }
      if (new Date() <= new Date("2022/03/27 23:59:59") || sum_len >= 8) {
        break;
      }
    }
    if (this.Guesses.length > 0) {
      if (this.Guesses[this.Guesses.length - 1].s == this.Answer) {
        this.Win = true;
      } else if (this.Guesses.length >= 15) {
        this.Lose = true;
      }
    }
  },

  methods: {
    MakeGuess() {
      if (this.Guessing == "FORCE_NEW_GAME") {
        this.ForceNewGame();
        return;
      }
      if (!this.Idioms.has(this.Guessing)) {
        this.InvalidInput = true;
        return;
      }
      this.InvalidInput = false;
      this.Guesses.push({ s: this.Guessing, index: this.Guesses.length });
      this.$hmt.push([
        "_trackEvent",
        "Game",
        "Operation",
        "Guess",
        this.Guessing.length,
      ]);
      if (this.Guessing == this.Answer) {
        this.Win = true;
        this.$hmt.push([
          "_trackEvent",
          "Game",
          "Result",
          "Win",
          this.Guessing.length,
        ]);
      } else if (this.Guesses.length >= 15) {
        this.Lose = true;
        this.$hmt.push([
          "_trackEvent",
          "Game",
          "Result",
          "Lose",
          this.Guesses.length,
        ]);
      }
      this.Guessing = "";
      var end_of_today = new Date();
      end_of_today.setHours(23, 59, 59, 999);
      this.$cookies.set(
        "game_today",
        JSON.stringify(this.Guesses),
        end_of_today
      );
    },
    NewKnown(res) {
      for (var i = 0; i < res.length; i++) {
        for (var j = 0; j < res[i].ids.length; j++) {
          var c = res[i].ids[j].component,
            sta = res[i].ids[j].status;
          for (var k = 0; k < this.HanComponents.length; k++) {
            if (
              this.HanComponents[k].component == c &&
              this.HanComponents[k].status != "right-position"
            ) {
              this.HanComponents[k].status = sta;
              break;
            }
          }
        }
      }
    },
    ForceNewGame() {
      this.Guesses = [];
      this.Guessing = "";
      // Choose an answer randomly
      var all_answers = require("../static/answers.json");
      this.Answer = all_answers[Math.floor(Math.random() * all_answers.length)];
      this.Win = false;
      this.Lose = false;
      this.$cookies.remove("game_today");
    }
  },
};
</script>
