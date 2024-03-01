import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import {renderErrors} from './view.js';

export default () => {
  const state = {
    feeds: [],
    error: '',
  };
  const form = document.querySelector('.rss-form');
  const input = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');

	const watchedState = onChange(state, (path, value) => {
    if (path === 'state.feeds') {
      // код обработки при обновлении списка подписок
      form.reset();
    }
    if (path === 'error') {
			renderErrors(feedback, value);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
		console.log(state);
		console.log(input.value);
    const schema = yup.string().url();
    schema.validate(input.value)
      .catch(() => {
				watchedState.error = 'Ссылка должна быть валидным URL';
				throw new Error('Ссылка должна быть валидным URL'); // откорректировать вывод ошибки
			})
      .then((feed) => {
        watchedState.error = '';
        if (_.includes(watchedState.feeds, feed)) {
          throw new Error('RSS уже существует'); // откорректировать вывод ошибки
        } else {
          watchedState.feeds.push(feed);
          watchedState.error = '';
        }
      })
      .catch((uniqueErr) => {
				console.log(uniqueErr);
				watchedState.error = uniqueErr;
			});
  });

  
};
