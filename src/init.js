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
      form.reset();
    }
    if (path === 'error') {
      renderErrors(feedback, value);
    }
  });

  const validateURL = (url, feeds) => {
    const schema = yup.string().url().trim()
      .notOneOf(feeds);
    return schema.validate(url)
      .then(() => 'completed')
      .catch((err) => {
        console.log(err);
        if (err.message === 'this must be a valid URL') {
          return 'validError';
        }
        return 'duplicationError';
      });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
     console.log(state);
     console.log(input.value);

    validateURL(input.value, watchedState.feeds)
      .then((validError) => {
        console.log(validError);
        watchedState.error = validError;
        if (validError === 'completed') {
          watchedState.feeds.push(input.value);
        }
        //console.log(state);
      });
  });
};
