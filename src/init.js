import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import { renderErrors } from './view.js';

export default () => {
  const state = {
    feeds: [],
    error: '',
  };
  const form = document.querySelector('.rss-form');
  const input = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');

  const watchedState = onChange(state, (path, value) => {
    if (path === 'feeds') {
      // код обработки при обновлении списка подписок
    }
    if (path === 'error') {
      renderErrors(feedback, value);
    }
  });

  const validateURL = (url, feeds) => {
    const schema = yup.string().url().trim()
      .notOneOf(feeds);
    //console.log(feeds);
    return schema.validate(url);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
     //console.log(state);
     //console.log(input.value);

    validateURL(input.value, watchedState.feeds)
      .then(() => {
        watchedState.error = '';
        watchedState.feeds.push(input.value);
      })
      .catch((validError) => {
        //console.log(validError);
        if (validError.message === 'this must be a valid URL') {
          watchedState.error = 'validError';
          return;
        }
        watchedState.error = 'duplicationError';
        //console.log(state);
      })
      .then(() => {
        console.log(state.feeds);
        input.value = '';
        console.log(state.feeds);
      });
  });
};
