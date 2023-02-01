<template>
    <div>
        Hello World!!!
        {{ setting }}
    </div>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';

export default class SettingView extends Vue {
    // Declared as component data
    setting = {};

    // Declare mounted lifecycle hook
    mounted() {
      // eslint-disable-next-line
      google.script.run.withSuccessHandler((setting) => {
        console.log('test');
        this.setting = setting;
        console.log(this.setting);
      }).getSetting(Number(this.$route.params.id));
    }
}
</script>
