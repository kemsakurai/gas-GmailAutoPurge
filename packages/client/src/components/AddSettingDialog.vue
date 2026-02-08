<template>
  <div class="modal modal-open">
    <div class="modal-box w-11/12 max-w-md">
      <h3 class="font-bold text-lg mb-4">{{ title }}</h3>

      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <!-- Notes field -->
        <div class="form-control w-full mb-4">
          <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
          <label class="label" for="dialog-notes-input">
            <span class="label-text">抜き記</span>
            <span class="label-text-alt text-error">*</span>
          </label>
          <input
            id="dialog-notes-input"
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
        <div class="form-control w-full mb-4">
          <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
          <label class="label" for="dialog-label-input">
            <span class="label-text">Gmailラベル</span>
            <span class="label-text-alt text-error">*</span>
          </label>
          <input
            id="dialog-label-input"
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
        <div class="form-control w-full mb-4">
          <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
          <label class="label" for="dialog-retention-input">
            <span class="label-text">保有期間（日数）</span>
            <span class="label-text-alt text-error">*</span>
          </label>
          <input
            id="dialog-retention-input"
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
        <div class="form-control mb-4">
          <label class="label cursor-pointer justify-start gap-3" for="dialog-starred-checkbox">
            <input
              id="dialog-starred-checkbox"
              v-model="form.leaveStarredEmail"
              type="checkbox"
              class="checkbox checkbox-sm"
              :disabled="isLoading"
            />
            <span class="label-text">スター付きメールは保有する</span>
          </label>
        </div>

        <!-- Leave important email -->
        <div class="form-control mb-6">
          <label class="label cursor-pointer justify-start gap-3" for="dialog-important-checkbox">
            <input
              id="dialog-important-checkbox"
              v-model="form.leaveImportantEmail"
              type="checkbox"
              class="checkbox checkbox-sm"
              :disabled="isLoading"
            />
            <span class="label-text">接吻時マーク付きメールは保有する</span>
          </label>
        </div>

        <!-- Button actions -->
        <div class="modal-action">
          <button
            type="button"
            class="btn btn-ghost"
            @click="$emit('close')"
            :disabled="isLoading"
          >
            キャンセル
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isLoading || !isFormValid"
          >
            <span v-if="isLoading" class="loading loading-spinner loading-xs"></span>
            {{ isLoading ? '保存中...' : isEditMode ? '更新' : '作成' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Overlay to close modal -->
    <div
      class="modal-backdrop"
      role="button"
      tabindex="0"
      @click="$emit('close')"
      @keydown.escape="$emit('close')"
    ></div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, reactive,
} from 'vue';
import { ConfigRow } from '@/store';

interface SettingForm {
  notes: string;
  label: string;
  retentionPeriod: number | string;
  leaveStarredEmail: boolean;
  leaveImportantEmail: boolean;
}

export default defineComponent({
  name: 'AddSettingDialog',
  props: {
    title: {
      type: String,
      default: '新規削除ルール追加',
    },
    initialData: {
      type: Object as PropType<ConfigRow | null>,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close', 'save'],

  setup(props, { emit }) {
    const form = reactive<SettingForm>({
      notes: props.initialData?.Notes || '',
      label: props.initialData?.label || '',
      retentionPeriod: props.initialData?.['Retention period'] || '',
      leaveStarredEmail: props.initialData?.['Leave starred email'] === 'TRUE' || props.initialData?.['Leave starred email'] === true,
      leaveImportantEmail: props.initialData?.['Leave important email'] === 'TRUE' || props.initialData?.['Leave important email'] === true,
    });

    // Validation
    const isFormValid = computed(() => (
      form.notes.trim() !== ''
        && form.label.trim() !== ''
        && form.retentionPeriod > 0
    ));

    const handleSubmit = () => {
      if (!isFormValid.value) {
        return;
      }

      const submittedData = {
        notes: form.notes.trim(),
        label: form.label.trim(),
        retentionPeriod: Number(form.retentionPeriod),
        leaveStarredEmail: form.leaveStarredEmail,
        leaveImportantEmail: form.leaveImportantEmail,
      };

      emit('save', submittedData);
    };

    return {
      form,
      isFormValid,
      handleSubmit,
    };
  },
});
</script>

<style scoped>
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
