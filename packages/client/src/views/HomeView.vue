<template>
  <div class="container mx-auto p-4">
    <!-- Header with actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold">自動削除ルール一覧</h1>
        <p class="text-gray-600 mt-1" v-if="triggerStatus">
          スケジュール実行: <span
            class="font-semibold"
            :class="triggerStatus.enabled ? 'text-green-600' : 'text-red-600'"
          >
            {{ triggerStatus.enabled ? '有効' : '無効' }}
          </span>
        </p>
      </div>

      <div class="flex gap-2 flex-wrap">
        <button class="btn btn-success" @click="showAddDialog = true" :disabled="isLoading">
          <span class="material-icons mr-2 text-sm">add</span>
          新規追加
        </button>
        <button class="btn btn-warning" @click="handlePurgeEmail" :disabled="isLoading">
          <span class="material-icons mr-2 text-sm" v-if="isLoading">
            hourglass_empty
          </span>
          {{ isLoading ? '実行中...' : 'メール削除実行' }}
        </button>
      </div>
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
      <button class="btn btn-sm" @click="showSuccessMessage = false">✕</button>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading && !allSettings.length" class="text-center py-8">
      <div class="loading loading-spinner loading-lg"></div>
      <p class="text-gray-600 mt-4">データを読み込み中...</p>
    </div>

    <!-- Rules table -->
    <div v-else-if="allSettings.length > 0" class="overflow-x-auto">
      <table class="table table-compact w-full">
        <thead>
          <tr>
            <th>抜き記</th>
            <th>Gmailラベル</th>
            <th>期間(日)</th>
            <th>スター保持</th>
            <th>重要保持</th>
            <th colspan="3" class="text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(elem) in allSettings"
            :key="elem.rowId"
            :class="{ 'opacity-50': isDeleting === elem.rowId }"
          >
            <td>{{ elem['Notes'] }}</td>
            <td class="font-mono text-sm">{{ elem['label'] }}</td>
            <td class="text-center">{{ elem['Retention period'] }}</td>
            <td class="text-center">
              <span
                class="badge"
                :class="
                  formatBoolean(elem['Leave starred email'])
                    ? 'badge-success'
                    : 'badge-error'
                "
              >
                {{ formatBoolean(elem['Leave starred email']) ? 'はい' : 'いいえ' }}
              </span>
            </td>
            <td class="text-center">
              <span
                class="badge"
                :class="formatBoolean(elem['Leave important email']) ?
                  'badge-success' : 'badge-error'"
              >
                {{
                  formatBoolean(elem['Leave important email']) ? 'はい' : 'いいえ'
                }}
              </span>
            </td>
            <td>
              <button
                class="btn btn-primary btn-sm"
                @click="linkToSettings(elem.rowId)"
                :disabled="isLoading"
              >
                編集
              </button>
            </td>
            <td>
              <button
                class="btn btn-error btn-sm"
                @click="handleDelete(elem.rowId)"
                :disabled="isLoading || isDeleting === elem.rowId"
              >
                <span
                  v-if="isDeleting === elem.rowId"
                  class="loading loading-spinner loading-xs"
                ></span>
                <span v-else>削除</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <p class="text-gray-600 mb-4">削除ルール設定はまだありません</p>
      <button class="btn btn-success" @click="showAddDialog = true">
        最初のルールを作成
      </button>
    </div>

    <!-- Add Setting Dialog -->
    <AddSettingDialog
      v-if="showAddDialog"
      @close="showAddDialog = false"
      @save="handleAddSetting"
      :is-loading="isLoading"
      title="新規削除ルール追加"
    />
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref,
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import AddSettingDialog from '@/components/AddSettingDialog.vue';
import { ConfigRow } from '@/store';

export default defineComponent({
  name: 'HomeView',
  components: {
    AddSettingDialog,
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const showAddDialog = ref(false);
    const showSuccessMessage = ref(false);
    const successMessage = ref('');
    const isDeleting = ref<number | null>(null);

    // Helper function to show success message with auto-dismiss
    const showSuccess = (message: string) => {
      successMessage.value = message;
      showSuccessMessage.value = true;
      setTimeout(() => {
        showSuccessMessage.value = false;
      }, 3000);
    };

    // Computed properties from store
    const allSettings = computed(() => store.getters.allSettings);
    const isLoading = computed(() => store.getters.isLoading);
    const errorMessage = computed(() => store.getters.errorMessage);
    const triggerStatus = computed(() => store.getters.triggerStatus);

    // Lifecycle: fetch data on mount
    const loadData = async () => {
      await store.dispatch('fetchSettings');
      await store.dispatch('fetchTriggerInfo');
    };

    loadData();

    // Methods
    const linkToSettings = (rowId: number) => {
      router.push({ path: `/settings/${rowId}` });
    };

    const handleDelete = async (rowId: number) => {
      // eslint-disable-next-line no-restricted-globals, no-alert
      if (!confirm('このルールを削除しますか？')) {
        return;
      }

      isDeleting.value = rowId;
      const success = await store.dispatch('deleteSetting', rowId);
      isDeleting.value = null;

      if (success) {
        showSuccess('ルールを削除しました');
      }
    };

    const handleAddSetting = async (configRow: Partial<ConfigRow>) => {
      const result = await store.dispatch('createSetting', configRow);
      if (result && result.success) {
        showAddDialog.value = false;
        showSuccess('新しいルールを追加しました');
      }
    };

    const handlePurgeEmail = async () => {
      // eslint-disable-next-line no-restricted-globals, no-alert
      if (!confirm('メール削除処理を開始しますか？')) {
        return;
      }

      const success = await store.dispatch('purgeEmails');
      if (success) {
        showSuccess('メール削除処理が完了しました');
      }
    };

    const clearError = () => {
      store.commit('setError', null);
    };

    const formatBoolean = (value: string | boolean): boolean => {
      if (typeof value === 'boolean') {
        return value;
      }
      return (value as string) === 'TRUE' || (value as string) === '1';
    };

    return {
      allSettings,
      isLoading,
      errorMessage,
      triggerStatus,
      showAddDialog,
      showSuccessMessage,
      successMessage,
      isDeleting,
      linkToSettings,
      handleDelete,
      handleAddSetting,
      handlePurgeEmail,
      clearError,
      formatBoolean,
    };
  },
});
</script>

<style scoped>
.loading {
  display: inline-block;
}
</style>
