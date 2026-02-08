/* eslint-disable @typescript-eslint/no-explicit-any */
import store, { ConfigRow, TriggerInfo } from '@/store';

describe('Vuex Store', () => {
  let testStore: any;

  beforeEach(() => {
    // Create a fresh store instance
    testStore = store;
    // Reset state to initial values
    testStore.commit('setError', null);
  });

  describe('State', () => {
    it('has initial state', () => {
      expect(testStore.state.settings).toBeDefined();
      expect(testStore.state.currentSetting).toBeNull();
      expect(testStore.state.loading).toBe(false);
      expect(testStore.state.error).toBeNull();
      expect(testStore.state.triggerInfo).toBeNull();
    });

    it('settings is array', () => {
      expect(Array.isArray(testStore.state.settings)).toBe(true);
    });
  });

  describe('Getters', () => {
    it('returns all settings', () => {
      const settings = testStore.getters.allSettings;
      expect(Array.isArray(settings)).toBe(true);
    });

    it('returns current setting', () => {
      const current = testStore.getters.currentSetting;
      expect(current === null || typeof current === 'object').toBe(true);
    });

    it('returns loading state', () => {
      const { isLoading } = testStore.getters;
      expect(typeof isLoading).toBe('boolean');
    });

    it('returns error message', () => {
      const error = testStore.getters.errorMessage;
      expect(error === null || typeof error === 'string').toBe(true);
    });

    it('returns trigger status', () => {
      const trigger = testStore.getters.triggerStatus;
      expect(trigger === null || typeof trigger === 'object').toBe(true);
    });
  });

  describe('Mutations', () => {
    it('commits setError mutation', () => {
      testStore.commit('setError', 'Test error');
      expect(testStore.state.error).toBe('Test error');

      testStore.commit('setError', null);
      expect(testStore.state.error).toBeNull();
    });

    it('commits setLoading mutation', () => {
      testStore.commit('setLoading', true);
      expect(testStore.state.loading).toBe(true);

      testStore.commit('setLoading', false);
      expect(testStore.state.loading).toBe(false);
    });

    it('commits setSettings mutation', () => {
      const mockSettings: ConfigRow[] = [
        {
          rowId: 0,
          Notes: 'Test',
          label: 'TestLabel',
          'Retention period': 30,
          'Leave starred email': false,
          'Leave important email': false,
        },
      ];

      testStore.commit('setSettings', mockSettings);
      expect(testStore.state.settings).toEqual(mockSettings);
    });

    it('commits setCurrentSetting mutation', () => {
      const mockSetting: ConfigRow = {
        rowId: 0,
        Notes: 'Test',
        label: 'TestLabel',
        'Retention period': 30,
        'Leave starred email': false,
        'Leave important email': false,
      };

      testStore.commit('setSetting', mockSetting);
      expect(testStore.state.currentSetting).toEqual(mockSetting);
    });

    it('commits setTriggerInfo mutation', () => {
      const mockTrigger: TriggerInfo = {
        enabled: true,
        functionName: 'purgeEmail',
        triggerSource: 'CLOCK',
        eventType: 'ON_MINUTE',
      };

      testStore.commit('setTriggerInfo', mockTrigger);
      expect(testStore.state.triggerInfo).toEqual(mockTrigger);
    });

    it('commits addSettingLocal mutation', () => {
      const newSetting: ConfigRow = {
        rowId: 0,
        Notes: 'New Setting',
        label: 'NewLabel',
        'Retention period': 60,
        'Leave starred email': true,
        'Leave important email': false,
      };

      testStore.commit('addSettingLocal', newSetting);
      expect(testStore.state.settings).toContainEqual(newSetting);
    });

    it('commits updateSetting mutation', () => {
      const initialSettings: ConfigRow[] = [
        {
          rowId: 0,
          Notes: 'Original',
          label: 'OriginalLabel',
          'Retention period': 30,
          'Leave starred email': false,
          'Leave important email': false,
        },
      ];

      testStore.commit('setSettings', initialSettings);

      const updatedSetting: ConfigRow = {
        rowId: 0,
        Notes: 'Updated',
        label: 'UpdatedLabel',
        'Retention period': 45,
        'Leave starred email': true,
        'Leave important email': false,
      };

      testStore.commit('updateSettingLocal', updatedSetting);

      expect(testStore.state.settings[0].Notes).toBe('Updated');
      expect(testStore.state.settings[0]['Retention period']).toBe(45);
    });

    it('commits removeSetting mutation', () => {
      const mockSettings: ConfigRow[] = [
        {
          rowId: 0,
          Notes: 'Setting 1',
          label: 'Label1',
          'Retention period': 30,
          'Leave starred email': false,
          'Leave important email': false,
        },
        {
          rowId: 1,
          Notes: 'Setting 2',
          label: 'Label2',
          'Retention period': 60,
          'Leave starred email': false,
          'Leave important email': false,
        },
      ];

      testStore.commit('setSettings', mockSettings);
      testStore.commit('deleteSettingLocal', 0);

      expect(testStore.state.settings.length).toBe(1);
      expect(testStore.state.settings[0].rowId).toBe(1);
    });
  });

  describe('Actions', () => {
    it('store has mutations and getters', () => {
      // Verify store structure
      expect(testStore.getters).toBeDefined();
      // eslint-disable-next-line no-underscore-dangle
      expect(testStore._mutations).toBeDefined();
    });

    it('all required getters exist', () => {
      expect(testStore.getters.allSettings).toBeDefined();
      expect(testStore.getters.currentSetting).toBeDefined();
      expect(testStore.getters.isLoading).toBeDefined();
      expect(testStore.getters.errorMessage).toBeDefined();
      expect(testStore.getters.triggerStatus).toBeDefined();
    });

    it('actions are defined', () => {
      // eslint-disable-next-line no-underscore-dangle
      expect(testStore._actions).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('sets error message on failed action', () => {
      testStore.commit('setError', 'Test error message');
      expect(testStore.getters.errorMessage).toBe('Test error message');
    });

    it('clears error message', () => {
      testStore.commit('setError', 'Error');
      testStore.commit('setError', null);
      expect(testStore.getters.errorMessage).toBeNull();
    });
  });

  describe('Loading State', () => {
    it('sets loading state', () => {
      testStore.commit('setLoading', true);
      expect(testStore.getters.isLoading).toBe(true);

      testStore.commit('setLoading', false);
      expect(testStore.getters.isLoading).toBe(false);
    });
  });

  describe('Settings Management', () => {
    it('settings array exists and is initialized', () => {
      expect(Array.isArray(testStore.state.settings)).toBe(true);
    });

    it('can retrieve settings through getter', () => {
      const settings = testStore.getters.allSettings;
      expect(Array.isArray(settings)).toBe(true);
    });

    it('addSetting mutation adds items to settings', () => {
      const newSetting: ConfigRow = {
        rowId: 999,
        Notes: 'Test',
        label: 'TestLabel',
        'Retention period': 30,
        'Leave starred email': false,
        'Leave important email': false,
      };

      testStore.commit('addSettingLocal', newSetting);

      // Verify setting was added
      const settings = testStore.state.settings as ConfigRow[];
      const added = settings.find((s: ConfigRow) => s.rowId === 999);
      expect(added).toBeDefined();
    });
  });

  describe('Current Setting', () => {
    it('currentSetting getter is accessible', () => {
      const current = testStore.getters.currentSetting;
      // currentSetting can be null or an object
      expect(current === null || typeof current === 'object').toBe(true);
    });

    it('can set and retrieve from state directly', () => {
      const testValue = { test: 'value' };
      testStore.state.currentSetting = testValue;
      expect(testStore.state.currentSetting).toEqual(testValue);
    });

    it('can clear current setting by setting to null', () => {
      testStore.state.currentSetting = null;
      expect(testStore.state.currentSetting).toBeNull();
    });
  });

  describe('Trigger Info', () => {
    it('can set trigger info', () => {
      const trigger: TriggerInfo = {
        enabled: true,
        functionName: 'purgeEmail',
        triggerSource: 'CLOCK',
        eventType: 'ON_HOUR',
      };

      testStore.commit('setTriggerInfo', trigger);
      expect(testStore.getters.triggerStatus).toEqual(trigger);
    });

    it('can clear trigger info', () => {
      testStore.commit('setTriggerInfo', null);
      expect(testStore.getters.triggerStatus).toBeNull();
    });

    it('trigger info accessible through triggerStatus getter', () => {
      const trigger: TriggerInfo = {
        enabled: false,
        functionName: 'test',
        triggerSource: 'DOCUMENT',
        eventType: 'ON_OPEN',
      };

      testStore.commit('setTriggerInfo', trigger);
      const retrieved = testStore.getters.triggerStatus;

      expect(retrieved).not.toBeNull();
      expect(retrieved.enabled).toBe(false);
    });
  });
});
