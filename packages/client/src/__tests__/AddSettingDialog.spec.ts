import { mount } from '@vue/test-utils';
import AddSettingDialog from '@/components/AddSettingDialog.vue';

describe('AddSettingDialog', () => {
  it('renders dialog with title', () => {
    const wrapper = mount(AddSettingDialog, {
      props: {
        title: 'テストダイアログ',
        isLoading: false,
        isEditMode: false,
      },
    });

    expect(wrapper.text()).toContain('テストダイアログ');
  });

  it('renders all required form fields', () => {
    const wrapper = mount(AddSettingDialog, {
      props: {
        title: '新規削除ルール追加',
        isLoading: false,
        isEditMode: false,
      },
    });

    const formText = wrapper.text();
    expect(formText).toContain('抜き記');
    expect(formText).toContain('Gmailラベル');
    expect(formText).toContain('保有期間');
    expect(formText).toContain('スター付きメール');
    expect(formText).toContain('接吻時マーク付きメール');
  });

  it('has required input fields', () => {
    const wrapper = mount(AddSettingDialog, {
      props: {
        title: '新規削除ルール追加',
        isLoading: false,
        isEditMode: false,
      },
    });

    const requiredInputs = wrapper.findAll('input[required]');
    expect(requiredInputs.length).toBeGreaterThanOrEqual(3); // notes, label, retentionPeriod
  });

  it('has checkbox inputs for boolean flags', () => {
    const wrapper = mount(AddSettingDialog, {
      props: {
        title: '新規削除ルール追加',
        isLoading: false,
        isEditMode: false,
      },
    });

    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(2); // leaveStarredEmail, leaveImportantEmail
  });

  it('disables submit button when form is invalid', async () => {
    const wrapper = mount(AddSettingDialog, {
      props: {
        title: '新規削除ルール追加',
        isLoading: false,
        isEditMode: false,
      },
    });

    // Initially, submit button should be disabled (empty form)
    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.attributes('disabled')).toBeDefined();
  });

  it('enables submit button when form is valid', async () => {
    const wrapper = mount(AddSettingDialog, {
      props: {
        title: '新規削除ルール追加',
        isLoading: false,
        isEditMode: false,
      },
    });

    // Fill in form fields
    const inputs = wrapper.findAll('input[type="text"]');
    if (inputs.length >= 2) {
      await inputs[0].setValue('Test Notes');
      await inputs[1].setValue('TestLabel');
    }

    const numberInput = wrapper.find('input[type="number"]');
    if (numberInput.exists()) {
      await numberInput.setValue('30');
    }

    await wrapper.vm.$nextTick();

    const submitButton = wrapper.find('button[type="submit"]');
    // Submit button should be enabled now
    expect(submitButton.attributes('disabled')).toBeUndefined();
  });

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(AddSettingDialog, {
      props: {
        title: '新規削除ルール追加',
        isLoading: false,
        isEditMode: false,
      },
    });

    // Find modal backdrop (close button)
    const backdrop = wrapper.find('.modal-backdrop');
    if (backdrop.exists()) {
      await backdrop.trigger('click');
    }

    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('emits save event with form data when form is submitted', async () => {
    const wrapper = mount(AddSettingDialog, {
      props: {
        title: '新規削除ルール追加',
        isLoading: false,
        isEditMode: false,
      },
    });

    // Fill in form fields
    const inputs = wrapper.findAll('input[type="text"]');
    if (inputs.length >= 2) {
      await inputs[0].setValue('Test Notes');
      await inputs[1].setValue('TestLabel');
    }

    const numberInput = wrapper.find('input[type="number"]');
    if (numberInput.exists()) {
      await numberInput.setValue('30');
    }

    await wrapper.vm.$nextTick();

    // Submit form
    const form = wrapper.find('form');
    if (form.exists()) {
      await form.trigger('submit.prevent');
    }

    const emitted = wrapper.emitted('save');
    expect(emitted).toBeTruthy();
    if (emitted && emitted.length > 0) {
      const savedData = emitted[0][0];
      expect(savedData).toHaveProperty('notes', 'Test Notes');
      expect(savedData).toHaveProperty('label', 'TestLabel');
      expect(savedData).toHaveProperty('retentionPeriod', 30);
    }
  });

  it('validates retention period is greater than 0', async () => {
    const wrapper = mount(AddSettingDialog, {
      props: {
        title: '新規削除ルール追加',
        isLoading: false,
        isEditMode: false,
      },
    });

    // Fill in form fields with invalid retention period
    const inputs = wrapper.findAll('input[type="text"]');
    if (inputs.length >= 2) {
      await inputs[0].setValue('Test Notes');
      await inputs[1].setValue('TestLabel');
    }

    const numberInput = wrapper.find('input[type="number"]');
    if (numberInput.exists()) {
      await numberInput.setValue('0'); // Invalid
    }

    await wrapper.vm.$nextTick();

    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.attributes('disabled')).toBeDefined();
  });

  it('shows correct button label for create mode', () => {
    const wrapper = mount(AddSettingDialog, {
      props: {
        title: '新規削除ルール追加',
        isLoading: false,
        isEditMode: false,
      },
    });

    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.text()).toContain('作成');
  });

  it('shows correct button label for edit mode', () => {
    const wrapper = mount(AddSettingDialog, {
      props: {
        title: 'ルール編集',
        isLoading: false,
        isEditMode: true,
      },
    });

    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.text()).toContain('更新');
  });

  it('disables form inputs when loading', () => {
    const wrapper = mount(AddSettingDialog, {
      props: {
        title: '新規削除ルール追加',
        isLoading: true,
        isEditMode: false,
      },
    });

    const inputs = wrapper.findAll('input');
    inputs.forEach((input) => {
      expect(input.attributes('disabled')).toBeDefined();
    });
  });

  it('populates form with initial data in edit mode', async () => {
    const initialData = {
      rowId: 0,
      Notes: 'Existing Note',
      label: 'ExistingLabel',
      'Retention period': 45,
      'Leave starred email': 'TRUE',
      'Leave important email': false,
    };

    const wrapper = mount(AddSettingDialog, {
      props: {
        title: 'ルール編集',
        isLoading: false,
        isEditMode: true,
        initialData,
      },
    });

    await wrapper.vm.$nextTick();

    const textInputs = wrapper.findAll('input[type="text"]');
    const numberInput = wrapper.find('input[type="number"]');

    if (textInputs.length >= 2) {
      expect((textInputs[0].element as HTMLInputElement).value).toBe('Existing Note');
      expect((textInputs[1].element as HTMLInputElement).value).toBe('ExistingLabel');
    }

    if (numberInput.exists()) {
      expect((numberInput.element as HTMLInputElement).value).toBe('45');
    }
  });

  it('emits close event on escape key', async () => {
    const wrapper = mount(AddSettingDialog, {
      props: {
        title: '新規削除ルール追加',
        isLoading: false,
        isEditMode: false,
      },
    });

    // Find modal backdrop
    const backdrop = wrapper.find('.modal-backdrop');
    if (backdrop.exists()) {
      await backdrop.trigger('keydown.escape');
    }

    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('validates required fields are not empty', async () => {
    const wrapper = mount(AddSettingDialog, {
      props: {
        title: '新規削除ルール追加',
        isLoading: false,
        isEditMode: false,
      },
    });

    // Fill in some fields but leave notes empty
    const inputs = wrapper.findAll('input[type="text"]');
    if (inputs.length >= 2) {
      await inputs[0].setValue(''); // Empty notes
      await inputs[1].setValue('TestLabel');
    }

    const numberInput = wrapper.find('input[type="number"]');
    if (numberInput.exists()) {
      await numberInput.setValue('30');
    }

    await wrapper.vm.$nextTick();

    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.attributes('disabled')).toBeDefined();
  });

  it('handles checkbox state changes', async () => {
    const wrapper = mount(AddSettingDialog, {
      props: {
        title: '新規削除ルール追加',
        isLoading: false,
        isEditMode: false,
      },
    });

    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    if (checkboxes.length > 0) {
      await checkboxes[0].setValue(true);
      expect((checkboxes[0].element as HTMLInputElement).checked).toBe(true);
    }
  });
});
