export const renderErrors = (feedback, value) => {
  feedback.textContent = value; // i18next
  if (value === '') {
    feedback.classList.remove('is-invalid');
  } else {
    feedback.classList.add('is-invalid');
  }
};
