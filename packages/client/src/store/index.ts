import { createStore } from 'vuex';

/**
 * 削除設定の行オブジェクト型定義
 */
export interface ConfigRow {
  rowId: number;
  Notes: string;
  label: string;
  'Retention period': number;
  'Leave starred email': string | boolean;
  'Leave important email': string | boolean;
}

/**
 * トリガー情報型定義
 */
export interface TriggerInfo {
  enabled: boolean;
  functionName: string;
  triggerSource: string;
  eventType: string;
}

/**
 * Store State型定義
 */
export interface AppState {
  settings: ConfigRow[];
  currentSetting: ConfigRow | null;
  loading: boolean;
  error: string | null;
  triggerInfo: TriggerInfo | null;
}

export default createStore<AppState>({
  state: {
    settings: [],
    currentSetting: null,
    loading: false,
    error: null,
    triggerInfo: null,
  },

  getters: {
    /**
     * すべての削除設定を取得
     */
    allSettings: (state) => state.settings,

    /**
     * 現在の編集中の設定を取得
     */
    currentSetting: (state) => state.currentSetting,

    /**
     * ローディング状態を取得
     */
    isLoading: (state) => state.loading,

    /**
     * エラーメッセージを取得
     */
    errorMessage: (state) => state.error,

    /**
     * トリガー情報を取得
     */
    triggerStatus: (state) => state.triggerInfo,
  },

  mutations: {
    /**
     * 削除設定一覧をセット
     */
    setSettings(state, settings: ConfigRow[]) {
      state.settings = settings;
    },

    /**
     * 単一の削除設定をセット
     */
    setSetting(state, setting: ConfigRow) {
      state.currentSetting = setting;
    },

    /**
     * ローディング状態をセット
     */
    setLoading(state, isLoading: boolean) {
      state.loading = isLoading;
    },

    /**
     * エラーメッセージをセット
     */
    setError(state, error: string | null) {
      state.error = error;
    },

    /**
     * トリガー情報をセット
     */
    setTriggerInfo(state, triggerInfo: TriggerInfo | null) {
      state.triggerInfo = triggerInfo;
    },

    /**
     * 削除設定を追加（ローカルのみ）
     */
    addSettingLocal(state, setting: ConfigRow) {
      state.settings.push(setting);
    },

    /**
     * 削除設定を更新（ローカルのみ）
     */
    updateSettingLocal(state, setting: ConfigRow) {
      const index = state.settings.findIndex((s) => s.rowId === setting.rowId);
      if (index > -1) {
        state.settings[index] = setting;
      }
    },

    /**
     * 削除設定を削除（ローカルのみ）
     */
    deleteSettingLocal(state, rowId: number) {
      state.settings = state.settings.filter((s) => s.rowId !== rowId);
    },
  },

  actions: {
    /**
     * サーバーからすべての削除設定を取得
     */
    async fetchSettings({ commit }) {
      commit('setLoading', true);
      commit('setError', null);

      return new Promise((resolve) => {
        const gasWindow = window as any;
        gasWindow.google.script.run
          .withSuccessHandler((settings: ConfigRow[]) => {
            commit('setSettings', settings);
            commit('setLoading', false);
            resolve(settings);
          })
          .withFailureHandler((error: Error) => {
            commit('setError', error.message || 'Failed to fetch settings');
            commit('setLoading', false);
            resolve(null);
          })
          .getSettings();
      });
    },

    /**
     * サーバーから単一の削除設定を取得
     */
    async fetchSetting({ commit }, rowId: number) {
      commit('setLoading', true);
      commit('setError', null);

      return new Promise((resolve) => {
        const gasWindow = window as any;
        gasWindow.google.script.run
          .withSuccessHandler((setting: ConfigRow) => {
            commit('setSetting', setting);
            commit('setLoading', false);
            resolve(setting);
          })
          .withFailureHandler((error: Error) => {
            commit('setError', error.message || 'Failed to fetch setting');
            commit('setLoading', false);
            resolve(null);
          })
          .getSetting(rowId);
      });
    },

    /**
     * 新しい削除設定をサーバーに保存
     */
    async createSetting({ commit, dispatch }, configRow: Partial<ConfigRow>) {
      commit('setLoading', true);
      commit('setError', null);

      return new Promise((resolve) => {
        const gasWindow = window as any;
        gasWindow.google.script.run
          .withSuccessHandler((result: any) => {
            commit('setLoading', false);
            if (result.success) {
              commit('setError', null);
              dispatch('fetchSettings'); // Refresh settings from server
              resolve(result);
            } else {
              commit('setError', result.error || 'Failed to create setting');
              resolve(result);
            }
          })
          .withFailureHandler((error: Error) => {
            commit('setError', error.message || 'Failed to create setting');
            commit('setLoading', false);
            resolve(null);
          })
          .addSetting(configRow);
      });
    },

    /**
     * 削除設定をサーバーに保存（更新）
     */
    async updateSetting({ commit, dispatch }, configRow: ConfigRow) {
      commit('setLoading', true);
      commit('setError', null);

      return new Promise((resolve) => {
        const gasWindow = window as any;
        gasWindow.google.script.run
          .withSuccessHandler((result: string) => {
            commit('setLoading', false);
            if (result === 'success') {
              commit('setError', null);
              commit('updateSettingLocal', configRow);
              resolve(true);
            } else {
              commit('setError', 'Failed to update setting');
              resolve(false);
            }
          })
          .withFailureHandler((error: Error) => {
            commit('setError', error.message || 'Failed to update setting');
            commit('setLoading', false);
            resolve(false);
          })
          .saveConfig(configRow);
      });
    },

    /**
     * 削除設定をサーバーから削除
     */
    async deleteSetting({ commit, dispatch }, rowId: number) {
      commit('setLoading', true);
      commit('setError', null);

      return new Promise((resolve) => {
        const gasWindow = window as any;
        gasWindow.google.script.run
          .withSuccessHandler((result: any) => {
            commit('setLoading', false);
            if (result.success) {
              commit('setError', null);
              commit('deleteSettingLocal', rowId);
              resolve(true);
            } else {
              commit('setError', result.error || 'Failed to delete setting');
              resolve(false);
            }
          })
          .withFailureHandler((error: Error) => {
            commit('setError', error.message || 'Failed to delete setting');
            commit('setLoading', false);
            resolve(false);
          })
          .deleteSetting(rowId);
      });
    },

    /**
     * purgeEmail処理をサーバーで実行
     */
    async purgeEmails({ commit }) {
      commit('setLoading', true);
      commit('setError', null);

      return new Promise((resolve) => {
        const gasWindow = window as any;
        gasWindow.google.script.run
          .withSuccessHandler(() => {
            commit('setError', null);
            commit('setLoading', false);
            resolve(true);
          })
          .withFailureHandler((error: Error) => {
            commit('setError', error.message || 'Failed to purge emails');
            commit('setLoading', false);
            resolve(false);
          })
          .purgeEmail();
      });
    },

    /**
     * サーバーからトリガー情報を取得
     */
    async fetchTriggerInfo({ commit }) {
      commit('setLoading', true);

      return new Promise((resolve) => {
        const gasWindow = window as any;
        gasWindow.google.script.run
          .withSuccessHandler((triggerInfo: TriggerInfo | null) => {
            commit('setTriggerInfo', triggerInfo);
            commit('setLoading', false);
            resolve(triggerInfo);
          })
          .withFailureHandler((error: Error) => {
            commit('setError', error.message || 'Failed to fetch trigger info');
            commit('setLoading', false);
            resolve(null);
          })
          .getTriggerInfo();
      });
    },
  },

  modules: {},
});
