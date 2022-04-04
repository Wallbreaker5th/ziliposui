<template>
  <v-bottom-sheet v-model="OpenHelp">
    <template v-slot:activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">
        <v-icon>mdi-help-circle</v-icon>帮助
      </v-btn>
    </template>
    <v-sheet>
      <div
        class="py-3 mx-6"
        style="max-height: 500px; overflow-y: scroll; text-align: center"
      >
        <p>你有十五次的机会猜一个<b>四字成语</b>。</p>

        <p>每次猜测后，汉字与其部件的颜色将会标识其与正确答案的区别。</p>

        <p>
          （为什么叫“部件”而非“偏旁”呢？因为本游戏中字的拆法不一定符合偏旁的拆法。）
        </p>

        <p>
          有时字的拆法会比较反直觉，为了预知实际拆法与预期不一致，在输入框中输入汉字时会实时标注其结构。没有在任何成语中出现的字不会被标注。
        </p>

        <SingleIdiom :Answer="'艰难困苦'" :Guess="'指桑骂槐'" />

        <p>
          <b>桑</b>字中包含三个<b>又</b>：
          第一个是绿色，表示第二个字包含一个<b>又</b>；
          第二个是橙色，表示还有一个<b>又</b>出现在成语中，但不在第二个字的位置；
          第三个是灰色，表示整个成语中没有更多<b>又</b>。
        </p>

        <p>
          类似地，成语中包含恰好一个<b>口</b>、恰好一个<b>木</b>，
          但不包含<b>日</b>、<b>扌</b>等部件。
        </p>

        <p>
          <b>⿱</b>、<b>⿰</b>等字符是“表意文字描述字符”（Ideographic
          Description
          Characters），用来描述字的结构。它们在本游戏中没有实际意义。
        </p>

        <SingleIdiom :Answer="'艰难困苦'" :Guess="'艰苦卓绝'" />

        <p>
          <b>艰</b>字是绿色，表示第一个字就是<b>艰</b>；
          <b>苦</b>字是橙色，表示成语中有<b>苦</b>字，但不在第二个位置。
        </p>

        <SingleIdiom :Answer="'艰难困苦'" :Guess="'艰难困苦'" />

        <p>当四个格子都为青色时，你便赢得了游戏！</p>

        <v-btn dark color="green" @click="OpenHelp = !OpenHelp" class="mb-4">
          开始游戏
        </v-btn>

        <p>新题目每日零时更新</p>
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import SingleIdiom from "./SingleIdiom";

export default {
  name: "TheBottomHelp",
  components: {
    SingleIdiom,
  },
  data() {
    return {
      OpenHelp: false,
    };
  },
};
</script>
