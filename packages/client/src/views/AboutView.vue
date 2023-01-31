<template>
  <div class="about">
    <span v-html="rawHtml"></span>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line
//import md from '../About.md';
export default {
  data() {
    return {
      // eslint-disable-next-line
      // sourceで Rawデータが取得できます
      // md,
      rawHtml: 'Test',
    };
  },
};

</script>
