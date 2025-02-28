import { computed, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, email, minValue } from '@vuelidate/validators';

export const useFormValidation = (form) => {
    const rules = computed(() => ({
        city: { required },
        address: { required },
        selectedType: { required },
        date: { required },
        area: {
            required: form.selectedType === 'Обмер' ? { required } : {},
            minValue: form.selectedType === 'Обмер' ? { minValue: minValue(1) } : {}
        },
        selectedTimeInterval: {
            required: form.urgent ? { required } : {}
        },
        clientName: { required },
        clientPhone: { required, minLength: minLength(10) },
        distance: {
            required: form.city === "МО" ? { required } : {},
            minValue: form.city === "МО" ? { minValue: minValue(1) } : {}
        },
        firmName: { required },
        managerEmail: { required, email },
        managerPhone: { required, minLength: minLength(10) },
        selectedOptions: {
            requiredIfType: (value) => {
                if (['Квартира', 'Дом', 'Офис'].includes(form.selectedType)) {
                    return Object.values(value).some(count => count > 0);
                }
                return true;
            },
        },
    }));

    const v$ = useVuelidate(rules, form);
    const validationErrors = ref({});

    const validateStep = async (step) => {
        let stepFields = {
            1: ['city', 'address', 'selectedType', 'date', 'selectedTimeInterval'],
            2: ['clientName', 'clientPhone'],
            3: ['firmName', 'managerEmail', 'managerPhone']
        }[step] || [];

        if (form.city === "МО" && step === 1) {
          stepFields.push('distance')
        }

        if (['Квартира', 'Дом', 'Офис'].includes(form.selectedType) && step === 1) {
            stepFields.push('selectedOptions');
        }
         if (form.selectedType === "Обмер" && step === 1) {
            stepFields.push('area');
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