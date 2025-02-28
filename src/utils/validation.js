export function validateForm(form, currentStep) {
    const errors = {}
    if (currentStep === 1) {
      if (!form.city) {
        errors.city = 'Поле "Город" обязательно для заполнения'
      }
      if (!form.address) {
        errors.address = 'Поле "Адрес замера" обязательно для заполнения'
      }
      if (!form.selectedType) {
        errors.selectedType = 'Выберите тип замера'
      }
    } else if (currentStep === 2) {
      if (!form.clientPhone) {
        errors.clientPhone = 'Введите номер телефона клиента'
     }
    } else if (currentStep === 3) {
      if (!form.managerEmail) {
        errors.managerEmail = 'Введите email менеджера'
      }
      if (!form.managerPhone) {
        errors.managerPhone = 'Введите телефон менеджера'
      }
    }
    return errors
  }