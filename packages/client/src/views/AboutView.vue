<template>
  <div class="flex justify-center">
    <article class="prose text-left">
      <span v-html="rawHtml"></span>
    </article>
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
