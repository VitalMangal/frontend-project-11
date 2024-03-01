export const renderErrors = (feedback, value) => {
    feedback.textContent = value.message;
    if (value === '') {
      feedback.classList.remove('is-invalid');
    } else {
      feedback.classList.add('is-invalid');
    }
}