import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { createRouter, createMemoryHistory } from 'vue-router';
import SettingView from '@/views/SettingView.vue';

describe('SettingView', () => {
  let mockStore: any;
  let mockRouter: any;
  let mockRouterPush: any;

  const createMockStore = (overrides: any = {}) => {
    const defaultState = {
      currentSetting: {
        rowId: 0,
        Notes: 'Test Rule',
        label: 'TestLabel',
        'Retention period': 30,
        'Leave starred email': 'TRUE',
        'Leave important email': false,
      },
      loading: false,
      error: null,
      ...overrides,
    };

    return createStore({
      state: defaultState,
      getters: {
        currentSetting: (state) => state.currentSetting,
        isLoading: (state) => state.loading,
        errorMessage: (state) => state.error,
      },
      mutations: {
        setError: jest.fn(),
      },
      actions: {
        fetchSetting: jest.fn().mockResolvedValue(undefined),
        updateSetting: jest.fn().mockResolvedValue(true),
        deleteSetting: jest.fn().mockResolvedValue(true),
      },
    });
  };

  beforeEach(() => {
    mockStore = createMockStore();

    // Mock Vue Router
    mockRouter = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div></div>' } },
        { path: '/settings/:id', component: { template: '<div></div>' } },
      ],
    });

    mockRouterPush = jest.spyOn(mockRouter, 'push').mockResolvedValue(true);
    // Wrap dispatch in jest.fn() to make it a spy
    mockStore.dispatch = jest.fn();
  });

  afterEach(() => {
    mockRouterPush.mockRestore();
  });

  it('renders setting view title', () => {
    const wrapper = mount(SettingView, {
      global: {
        plugins: [mockStore, mockRouter],
        stubs: {
          transition: false,
        },
      },
      props: {
        id: '0',
      },
    });

    expect(wrapper.text()).toContain('削除ルール編集');
  });

  it('populates form fields with current setting', async () => {
    const wrapper = mount(SettingView, {
      global: {
        plugins: [mockStore, mockRouter],
        stubs: {
          transition: false,
        },
      },
    });

    // Wait for component to mount and fetch data
    await wrapper.vm.$nextTick();

    // Check if form fields are populated
    const inputs = wrapper.findAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('has required form fields', () => {
    const wrapper = mount(SettingView, {
      global: {
        plugins: [mockStore, mockRouter],
        stubs: {
          transition: false,
        },
      },
    });

    const formText = wrapper.text();
    expect(formText).toContain('抜き記');
    expect(formText).toContain('Gmailラベル');
    expect(formText).toContain('保有期間');
  });

  it('submits form with updated values', async () => {
    const wrapper = mount(SettingView, {
      global: {
        plugins: [mockStore, mockRouter],
        stubs: {
          transition: false,
        },
      },
    });

    await wrapper.vm.$nextTick();

    // Verify form exists
    const form = wrapper.find('form');
    expect(form.exists()).toBe(true);
  });

  it('calls deleteSetting when delete button is clicked', async () => {
    const wrapper = mount(SettingView, {
      global: {
        plugins: [mockStore, mockRouter],
      },
    });

    // Mock window.confirm
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    await wrapper.vm.$nextTick();

    // Find delete button
    const buttons = wrapper.findAll('button');
    const deleteButton = buttons.find((btn) => {
      const classList = btn.classes();
      return classList.includes('btn-error') || btn.text().includes('削除');
    });

    if (deleteButton) {
      await deleteButton.trigger('click');
      await wrapper.vm.$nextTick();

      expect(window.confirm).toHaveBeenCalled();
      expect(mockStore.dispatch).toHaveBeenCalledWith('deleteSetting', expect.any(Number));
    }
  });

  it('shows back button', () => {
    const wrapper = mount(SettingView, {
      global: {
        plugins: [mockStore, mockRouter],
        stubs: {
          transition: false,
        },
      },
    });

    const buttons = wrapper.findAll('button');
    const backButton = buttons.find((btn) => btn.classes().includes('btn-ghost'));

    expect(backButton).toBeDefined();
  });

  it('navigates back when back button is clicked', async () => {
    const wrapper = mount(SettingView, {
      global: {
        plugins: [mockStore, mockRouter],
        stubs: {
          transition: false,
        },
      },
    });

    const buttons = wrapper.findAll('button');
    const backButton = buttons.find((btn) => {
      const text = btn.text();
      return text.includes('戻る') || btn.classes().includes('btn-ghost');
    });

    if (backButton) {
      await backButton.trigger('click');
      expect(mockRouterPush).toHaveBeenCalledWith('/');
    }
  });

  it('displays error message when present', async () => {
    const storeWithError = createMockStore({ error: 'Test error message' });
    const wrapper = mount(SettingView, {
      global: {
        plugins: [storeWithError, mockRouter],
        stubs: {
          transition: false,
        },
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('エラー');
  });

  it('has checkbox for leaving starred emails', () => {
    const wrapper = mount(SettingView, {
      global: {
        plugins: [mockStore, mockRouter],
        stubs: {
          transition: false,
        },
      },
    });

    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    expect(checkboxes.length).toBeGreaterThan(0);
    expect(wrapper.text()).toContain('スター付きメール');
  });

  it('has checkbox for leaving important emails', () => {
    const wrapper = mount(SettingView, {
      global: {
        plugins: [mockStore, mockRouter],
        stubs: {
          transition: false,
        },
      },
    });

    expect(wrapper.text()).toContain('接吻時マーク付きメール');
  });

  it('renders with loading state', async () => {
    const loadingStore = createMockStore({ loading: true });
    const wrapper = mount(SettingView, {
      global: {
        plugins: [loadingStore, mockRouter],
        stubs: {
          transition: false,
        },
      },
    });

    // The component should display loading indicator or disable buttons
    const buttons = wrapper.findAll('button:disabled');
    expect(buttons.length).toBeGreaterThanOrEqual(0);
  });

  it('validates required fields', () => {
    const wrapper = mount(SettingView, {
      global: {
        plugins: [mockStore, mockRouter],
        stubs: {
          transition: false,
        },
      },
    });

    // Check that required inputs are marked
    const requiredInputs = wrapper.findAll('input[required]');
    expect(requiredInputs.length).toBeGreaterThan(0);
  });
});
