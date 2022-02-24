<template>
  <codemirror :merge="true" :options="cmOption" @scroll="onCmScroll"></codemirror>
</template>
 
<script>
import Vue from 'vue'
import VueCodemirror from 'vue-codemirror'
 
// require styles
import 'codemirror/lib/codemirror.css'
Vue.use(VueCodemirror)
  // merge js
  import 'codemirror/addon/merge/merge.js'
  // merge css
  import 'codemirror/addon/merge/merge.css'
  // google DiffMatchPatch
  import DiffMatchPatch from 'diff-match-patch'
  // DiffMatchPatch config with global
  window.diff_match_patch = DiffMatchPatch
  window.DIFF_DELETE = -1
  window.DIFF_INSERT = 1
  window.DIFF_EQUAL = 0
  export default {
    data() {
      return {
        cmOption: {
          value: '<p>hello</p>',
          origLeft: null,
          orig: '<p>hello world</p>',
          connect: 'align',
          mode: 'text/html',
          lineNumbers: true,
          collapseIdentical: false,
          highlightDifferences: true
        }
      }
    },
    methods: {
      onCmScroll() {
        console.log('onCmScroll')
      }
    }
  }
</script>