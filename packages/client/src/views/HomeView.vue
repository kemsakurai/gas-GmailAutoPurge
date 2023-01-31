<template>
<div class="overflow-x-auto">
  <table class="table table-compact w-full">
      <thead>
        <th>Leave important email</th>
        <th>Leave starred email</th>
        <th>Notes</th>
        <th>Retention period</th>
        <th>label</th>
      </thead>
      <tbody>
        <tr v-for='(setting , index) in settings' v-bind:key="index">
          <td>{{ setting['Leave important email'] }}</td>
          <td>{{ setting['Leave starred email'] }}</td>
          <td>{{ setting['Notes'] }}</td>
          <td>{{ setting['Retention period'] }}</td>
          <td>{{ setting['label'] }}</td>
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
}
</script>
