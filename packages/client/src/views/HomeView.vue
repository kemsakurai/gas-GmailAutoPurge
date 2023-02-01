<template>
<div class="overflow-x-auto">
  <table class="table table-compact w-full">
      <thead>
        <th>Leave important email</th>
        <th>Leave starred email</th>
        <th>Notes</th>
        <th>Retention period</th>
        <th>label</th>
        <th></th>
        <th></th>
      </thead>
      <tbody>
        <tr v-for='(elem, index) in settings' v-bind:key="index">
          <td>{{ elem['Leave important email'] }}</td>
          <td>{{ elem['Leave starred email'] }}</td>
          <td>{{ elem['Notes'] }}</td>
          <td>{{ elem['Retention period'] }}</td>
          <td>{{ elem['label'] }}</td>
          <td>
            <button class="btn btn-active" aria-pressed="true" @click="linkToSettings(index)">
              編集
            </button>
          </td>
          <td>
            <button class="btn btn-primary btn-active" aria-pressed="true">-</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';

export default class HomeView extends Vue {
  // Declared as component data
  settings = [];

  // Declare mounted lifecycle hook
  mounted() {
    // eslint-disable-next-line
    google.script.run.withSuccessHandler((settings) => {
      this.settings = settings;
      console.log(this.settings);
    }).getSettings();
  }

  linkToSettings(index : number) {
    this.$router.push({ path: `/settings/${index}` });
  }
}
</script>
