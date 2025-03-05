import { computed, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, email, minValue, helpers } from '@vuelidate/validators';

export const useFormValidation = (form) => {
    const requiredMsg = helpers.withMessage('Поле обязательно для заполнения', required);
    const minLengthMsg = (min) => helpers.withMessage(`Минимальная длина - ${min} символов`, minLength(min));
    const emailMsg = helpers.withMessage('Введите корректный email адрес', email);
    const minValueMsg = (min) => helpers.withMessage(`Минимальное значение - ${min}`, minValue(min));
    const requiredOptionsMsg = helpers.withMessage('Выберите хотя бы одно помещение', (value) => {
        if (['Квартира', 'Дом', 'Офис'].includes(form.selectedType)) {
            return Object.values(value).some(count => count > 0);
        }
        return true;
    });
    
    const rules = computed(() => ({
        city: { required: requiredMsg },
        address: { required: requiredMsg },
        selectedType: { required: requiredMsg },
        date: { required: requiredMsg },
        area: {},
        clientName: {},
        clientPhone: { required: requiredMsg, minLength: minLengthMsg(10) },
        distance: {},
        firmName: { required: requiredMsg },
        managerEmail: { required: requiredMsg, email: emailMsg },
        managerPhone: { required: requiredMsg, minLength: minLengthMsg(10) },
        selectedOptions: {
            requiredIfType: requiredOptionsMsg,
        },
    }));

    const v$ = useVuelidate(rules, form);
    const validationErrors = ref({});

    const validateStep = async (step) => {
        let stepFields = {
            1: ['city', 'address', 'selectedType', 'date'],
            2: ['clientPhone'],
            3: ['firmName', 'managerEmail', 'managerPhone']
        }[step] || [];

        if (['Квартира', 'Дом', 'Офис'].includes(form.selectedType) && step === 1) {
            stepFields.push('selectedOptions');
        }

        let isValid = true;
        validationErrors.value = {};

        for (const field of stepFields) {
            const fieldIsValid = await v$.value[field].$validate();
            isValid = isValid && fieldIsValid;
            if (!fieldIsValid) {
                validationErrors.value[field] = v$.value[field].$errors.map(e => e.$message);
            }
        }

        return { isValid, errors: validationErrors.value };
    };

    return { validateStep, validationErrors, v$ };
};