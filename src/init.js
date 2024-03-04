import * as yup from 'yup';
// import _ from 'lodash';
import onChange from 'on-change';
import i18next from 'i18next';
import { renderErrors } from './view.js';
import ru from './dictionary_i18next.js';

export default () => {
  const state = {
    feeds: [],
    error: '',
  };

  const i18nextInstance = i18next.createInstance();

  i18nextInstance.init({
    lng: 'ru',
    resources: {
      ru,
    },
  });

  yup.setLocale({
    string: {
      url: 'validError',
    },
    mixed: {
      notOneOf: 'duplicationError',
    },
  });

  const form = document.querySelector('.rss-form');
  const input = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');

  const watchedState = onChange(state, (path, value) => {
    if (path === 'feeds') {
      // код обработки при обновлении списка подписок
    }
    if (path === 'error') {
      renderErrors(feedback, value, i18nextInstance);
    }
  });

  const validateURL = (url, feeds) => {
    const schema = yup.string().url().trim()
      .notOneOf(feeds);
    // console.log(feeds);
    return schema.validate(url);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log(state);
    // console.log(input.value);

    validateURL(input.value, watchedState.feeds)
      .then(() => {
        watchedState.error = '';
        watchedState.feeds.push(input.value);
        console.log(state);
        form.reset();
        input.focus();
      })
      .catch((validError) => {
        watchedState.error = validError.errors;
        console.log(state);
      });
    /* .then(() => {
        console.log(state.feeds);
        console.log(state);
        input.value = '';
        console.log(state.feeds);
        console.log(state);
      }); */
  });
};
