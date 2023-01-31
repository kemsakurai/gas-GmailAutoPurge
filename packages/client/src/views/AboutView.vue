<template>
  <div class="markdown-body">
    <span v-html="rawHtml"></span>
  </div>
</template>

<script lang="ts">
import { marked } from 'marked';
import AboutMarkdown from '../About.md';

export default {
  data() {
    return {
      rawHtml: marked(AboutMarkdown.source),
    };
  },
};
</script>
