<template>
  <div class="center">
    <h1>dash board</h1>
    <codemirror
      ref="myCm"
      :value="code"
      :options="cmOptions"
      @ready="onCmReady"
      @focus="onCmFocus"
      @input="onCmCodeChange"
    >
    </codemirror>
  </div>
</template>
 
<script>
// language js
import "codemirror/mode/javascript/javascript.js";

// more codemirror resources
// import 'codemirror/some-resource...'
export default {
  name: "Dash",

  data() {
    return {
      code: "const a = 10",
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: "text/javascript",
        theme: "base16-dark",
        lineNumbers: true,
        line: true,

        collapseIdentical: false,

        autoRefresh: true,
        // more codemirror options, 更多 codemirror 的高级配置...
      },
    };
  },
  methods: {
    onCmReady(cm) {
      console.log("the editor is readied!", cm);
    },
    onCmFocus(cm) {
      console.log("the editor is focus!", cm);
    },
    onCmCodeChange(newCode) {
      console.log("this is new code", newCode);
      this.code = newCode;
    },
  },
  computed: {
    codemirror() {
      return this.$refs.myCm.codemirror;
    },
  },
  mounted() {
    console.log("this is current codemirror object", this.codemirror);
    // you can use this.codemirror to do something...
  },
};
</script>
