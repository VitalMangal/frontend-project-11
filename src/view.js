export const renderErrors = (feedback, value, i18next) => {
  feedback.textContent = i18next.t(value);
  if (value === '') {
    feedback.classList.remove('is-invalid');
  } else {
    feedback.classList.add('is-invalid');
  }
};
