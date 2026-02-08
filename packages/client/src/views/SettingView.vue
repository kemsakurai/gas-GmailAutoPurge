<template>
  <div class="container mx-auto p-4 max-w-md">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <button class="btn btn-ghost btn-sm" @click="goBack">
        <span class="material-icons">arrow_back</span>
      </button>
      <h1 class="text-2xl font-bold">削除ルール編集</h1>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading && !currentSetting" class="text-center py-8">
      <div class="loading loading-spinner loading-lg"></div>
      <p class="text-gray-600 mt-4">データを読み込み中...</p>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="alert alert-error mb-4">
      <div class="flex-1">
        <h3 class="font-bold">エラー</h3>
        <div class="text-sm">{{ errorMessage }}</div>
      </div>
      <button class="btn btn-sm" @click="clearError">✕</button>
    </div>

    <!-- Success message -->
    <div v-if="showSuccessMessage" class="alert alert-success mb-4">
      <div class="flex-1">
        <h3 class="font-bold">成功</h3>
        <div class="text-sm">{{ successMessage }}</div>
      </div>
    </div>

    <!-- Edit Form -->
    <form v-if="currentSetting" @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Notes field -->
      <div class="form-control w-full">
        <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
        <label class="label" for="notes-input">
          <span class="label-text">抜き記</span>
          <span class="label-text-alt text-error">*</span>
        </label>
        <input
          id="notes-input"
          v-model="form.notes"
          type="text"
          placeholder="例: 古いメール"
          class="input input-bordered w-full"
          required
          :disabled="isLoading"
        />
        <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
        <label class="label">
          <span class="label-text-alt">このルールの説明を入力してください</span>
        </label>
      </div>

      <!-- Label field -->
      <div class="form-control w-full">
        <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
        <label class="label" for="label-input">
          <span class="label-text">Gmailラベル</span>
          <span class="label-text-alt text-error">*</span>
        </label>
        <input
          id="label-input"
          v-model="form.label"
          type="text"
          placeholder="例: Inbox"
          class="input input-bordered w-full"
          required
          :disabled="isLoading"
        />
        <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
        <label class="label">
          <span class="label-text-alt">削除対象のラベル名を入力してください</span>
        </label>
      </div>

      <!-- Retention period field -->
      <div class="form-control w-full">
        <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
        <label class="label" for="retention-input">
          <span class="label-text">保有期間（日数）</span>
          <span class="label-text-alt text-error">*</span>
        </label>
        <input
          id="retention-input"
          v-model.number="form.retentionPeriod"
          type="number"
          min="1"
          placeholder="例: 30"
          class="input input-bordered w-full"
          required
          :disabled="isLoading"
        />
        <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
        <label class="label">
          <span class="label-text-alt">指定日数以前のメールを削除します</span>
        </label>
      </div>

      <!-- Leave starred email -->
      <div class="form-control">
        <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
        <label class="label cursor-pointer justify-start gap-3" for="starred-checkbox">
          <input
            id="starred-checkbox"
            v-model="form.leaveStarredEmail"
            type="checkbox"
            class="checkbox checkbox-sm"
            :disabled="isLoading"
          />
          <span class="label-text">スター付きメールは保有する</span>
        </label>
      </div>

      <!-- Leave important email -->
      <div class="form-control">
        <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
        <label class="label cursor-pointer justify-start gap-3" for="important-checkbox">
          <input
            id="important-checkbox"
            v-model="form.leaveImportantEmail"
            type="checkbox"
            class="checkbox checkbox-sm"
            :disabled="isLoading"
          />
          <span class="label-text">接吻時マーク付きメールは保有する</span>
        </label>
      </div>

      <!-- Submit buttons -->
      <div class="flex gap-2 mt-6">
        <button
          type="button"
          class="btn btn-ghost flex-1"
          @click="goBack"
          :disabled="isLoading"
        >
          戻る
        </button>
        <button
          type="submit"
          class="btn btn-primary flex-1"
          :disabled="isLoading || !isFormValid"
        >
          <span v-if="isLoading" class="loading loading-spinner loading-xs"></span>
          {{ isLoading ? '保存中...' : '保存' }}
        </button>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Danger zone -->
      <div class="form-control">
        <button
          type="button"
          class="btn btn-outline btn-error w-full"
          @click="handleDelete"
          :disabled="isLoading"
        >
          このルールを削除
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, reactive, ref,
} from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { ConfigRow } from '@/store';

interface EditForm {
  notes: string;
  label: string;
  retentionPeriod: number | string;
  leaveStarredEmail: boolean;
  leaveImportantEmail: boolean;
}

export default defineComponent({
  name: 'SettingView',

  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const showSuccessMessage = ref(false);
    const successMessage = ref('');

    const form = reactive<EditForm>({
      notes: '',
      label: '',
      retentionPeriod: '',
      leaveStarredEmail: false,
      leaveImportantEmail: false,
    });

    // Computed properties
    const isLoading = computed(() => store.getters.isLoading);
    const errorMessage = computed(() => store.getters.errorMessage);
    const currentSetting = computed(() => store.getters.currentSetting);

    // Validation
    const isFormValid = computed(() => (
      form.notes.trim() !== ''
        && form.label.trim() !== ''
        && form.retentionPeriod > 0
    ));

    // Lifecycle
    const loadSetting = async () => {
      const rowId = Number(route.params.id);
      const setting = await store.dispatch('fetchSetting', rowId);

      if (setting) {
        form.notes = setting.Notes;
        form.label = setting.label;
        form.retentionPeriod = setting['Retention period'];
        form.leaveStarredEmail = setting['Leave starred email'] === 'TRUE' || setting['Leave starred email'] === true;
        form.leaveImportantEmail = setting['Leave important email'] === 'TRUE' || setting['Leave important email'] === true;
      }
    };

    loadSetting();

    // Methods
    const handleSubmit = async () => {
      if (!isFormValid.value) {
        return;
      }

      const data: ConfigRow = {
        rowId: Number(route.params.id),
        Notes: form.notes.trim(),
        label: form.label.trim(),
        'Retention period': Number(form.retentionPeriod),
        'Leave starred email': form.leaveStarredEmail,
        'Leave important email': form.leaveImportantEmail,
      };

      const success = await store.dispatch('updateSetting', data);
      if (success) {
        successMessage.value = 'ルールを更新しました';
        showSuccessMessage.value = true;
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    };

    const handleDelete = async () => {
      // eslint-disable-next-line no-restricted-globals, no-alert
      if (!confirm('このルールを削除しますか？削除後は取り消せません。')) {
        return;
      }

      const success = await store.dispatch('deleteSetting', Number(route.params.id));
      if (success) {
        successMessage.value = 'ルールを削除しました';
        showSuccessMessage.value = true;
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    };

    const goBack = () => {
      router.push('/');
    };

    const clearError = () => {
      store.commit('setError', null);
    };

    return {
      form,
      isLoading,
      errorMessage,
      currentSetting,
      isFormValid,
      showSuccessMessage,
      successMessage,
      handleSubmit,
      handleDelete,
      goBack,
      clearError,
    };
  },
});
</script>
