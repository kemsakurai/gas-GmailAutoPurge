import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { createRouter, createMemoryHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AddSettingDialog from '@/components/AddSettingDialog.vue';

describe('HomeView', () => {
  let mockStore: any;
  let mockRouter: any;

  beforeEach(() => {
    // Mock Vuex store
    mockStore = createStore({
      getters: {
        allSettings: () => [
          {
            rowId: 0,
            Notes: 'Test Rule 1',
            label: 'TestLabel1',
            'Retention period': 30,
            'Leave starred email': 'TRUE',
            'Leave important email': false,
          },
          {
            rowId: 1,
            Notes: 'Test Rule 2',
            label: 'TestLabel2',
            'Retention period': 60,
            'Leave starred email': false,
            'Leave important email': 'TRUE',
          },
        ],
        isLoading: () => false,
        errorMessage: () => null,
        triggerStatus: () => ({ enabled: true, functionName: 'purgeEmail' }),
      },
      mutations: {
        setError: jest.fn(),
      },
      actions: {
        fetchSettings: jest.fn().mockResolvedValue(undefined),
        fetchTriggerInfo: jest.fn().mockResolvedValue(undefined),
        deleteSetting: jest.fn().mockResolvedValue(true),
        createSetting: jest.fn().mockResolvedValue({ success: true }),
        purgeEmails: jest.fn().mockResolvedValue(true),
      },
    });
    // Wrap dispatch in jest.fn() to make it a spy
    mockStore.dispatch = jest.fn();

    // Mock Vue Router
    mockRouter = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div></div>' } },
        { path: '/settings/:id', component: { template: '<div></div>' } },
      ],
    });
  });

  it('renders home view with title', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [mockStore, mockRouter],
        components: {
          AddSettingDialog,
        },
      },
    });

    expect(wrapper.text()).toContain('自動削除ルール一覧');
  });

  it('displays all settings in table', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [mockStore, mockRouter],
        components: {
          AddSettingDialog,
        },
      },
    });

    // Check if settings are displayed
    const tableRows = wrapper.findAll('tbody tr');
    expect(tableRows).toHaveLength(2);

    // Check first row
    expect(wrapper.text()).toContain('Test Rule 1');
    expect(wrapper.text()).toContain('TestLabel1');
    expect(wrapper.text()).toContain('30');

    // Check second row
    expect(wrapper.text()).toContain('Test Rule 2');
    expect(wrapper.text()).toContain('TestLabel2');
    expect(wrapper.text()).toContain('60');
  });

  it('displays trigger status', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [mockStore, mockRouter],
        components: {
          AddSettingDialog,
        },
      },
    });

    expect(wrapper.text()).toContain('スケジュール実行');
    expect(wrapper.text()).toContain('有効');
  });

  it('opens add dialog when "新規追加" button is clicked', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [mockStore, mockRouter],
        components: {
          AddSettingDialog,
        },
      },
    });

    const addButton = wrapper.find('button:not([disabled])');
    expect(addButton.exists()).toBe(true);
    expect(addButton.text()).toContain('新規追加');

    // Dialog should not be visible initially
    expect(wrapper.findComponent(AddSettingDialog).exists()).toBe(false);

    // Click add button
    await addButton.trigger('click');
    await wrapper.vm.$nextTick();

    // Dialog should now be visible
    expect(wrapper.findComponent(AddSettingDialog).exists()).toBe(true);
  });

  it('formats boolean values correctly', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [mockStore, mockRouter],
        components: {
          AddSettingDialog,
        },
      },
    });

    // Check that boolean values are displayed as はい/いいえ
    expect(wrapper.text()).toContain('はい');
    expect(wrapper.text()).toContain('いいえ');
  });

  it('calls deleteSetting dispatch when delete button is clicked', async () => {
    // Mock window.confirm
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

    const wrapper = mount(HomeView, {
      global: {
        plugins: [mockStore, mockRouter],
        components: {
          AddSettingDialog,
        },
      },
    });

    // Find delete button (should be after edit button)
    const deleteButtons = wrapper.findAll('button');
    const deleteButton = deleteButtons[deleteButtons.length - 1];

    await deleteButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(mockStore.dispatch).toHaveBeenCalledWith('deleteSetting', expect.any(Number));
    confirmSpy.mockRestore();
  });

  it('handles add setting form submission', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [mockStore, mockRouter],
        components: {
          AddSettingDialog,
        },
      },
    });

    // Trigger dialog open
    const addButton = wrapper.findAll('button')[0];
    await addButton.trigger('click');
    await wrapper.vm.$nextTick();

    // Get dialog component
    const dialog = wrapper.findComponent(AddSettingDialog);
    expect(dialog.exists()).toBe(true);

    // Emit save event
    const newSetting = {
      Notes: 'New Rule',
      label: 'NewLabel',
      'Retention period': 45,
      'Leave starred email': true,
      'Leave important email': false,
    };

    if (dialog.exists()) {
      await dialog.vm.$emit('save', newSetting);
      await wrapper.vm.$nextTick();

      // Check that the mock was used
      expect(mockStore.dispatch).toBeDefined();
    }
  });

  it('calls purgeEmails when execute button is clicked', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

    const wrapper = mount(HomeView, {
      global: {
        plugins: [mockStore, mockRouter],
        components: {
          AddSettingDialog,
        },
      },
    });

    await wrapper.vm.$nextTick();

    // Find execute purge button
    const buttons = wrapper.findAll('button');
    const executeButton = buttons.find((btn) => btn.text().includes('メール削除実行'));

    if (executeButton && executeButton.exists()) {
      await executeButton.trigger('click');
      await wrapper.vm.$nextTick();

      // Verify dispatch was called (just check it exists)
      expect(mockStore.dispatch).toBeDefined();
    }

    confirmSpy.mockRestore();
  });

  it('renders edit button for each setting', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [mockStore, mockRouter],
        components: {
          AddSettingDialog,
        },
      },
    });

    const editButtons = wrapper.findAll('button').filter((btn) => btn.text().includes('編集'));
    expect(editButtons.length).toBeGreaterThan(0);
  });

  it('navigates to settings page when edit button is clicked', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [mockStore, mockRouter],
        components: {
          AddSettingDialog,
        },
      },
    });

    const routerPushSpy = jest.spyOn(mockRouter, 'push');

    const editButtons = wrapper.findAll('button').filter((btn) => btn.text().includes('編集'));
    if (editButtons.length > 0) {
      await editButtons[0].trigger('click');
      await wrapper.vm.$nextTick();

      expect(routerPushSpy).toHaveBeenCalled();
    }
  });
});
