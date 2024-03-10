import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import {
  primaryRender, renderFeeds, renderPosts, renderFeedback, renderModal, renderProcess,
} from './view.js';
import ru from './dictionary_i18next.js';
import parseResponse from './parseResponse.js';

export default () => {
  const state = {
    processState: 'editing',
    feeds: [],
    posts: [],
    feedback: '',
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

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    submitButton: document.querySelector('[type="submit"]'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modalHeader: document.querySelector('.modal-header > h5'),
    modalBody: document.querySelector('.modal-body'),
    modalLink: document.querySelector('.modal-footer > a'),
  };

  const watchedState = onChange(state, (path, value, previouseValue) => {
    if (path === 'feeds') {
      console.log('Изменение фидов');
      if (!elements.feedsContainer.innerHTML) {
        primaryRender(elements.feedsContainer, 'Фиды');
      }
      renderFeeds(value, previouseValue);
    }
    if (path === 'posts') {
      console.log('Изменение постов');
      if (!elements.postsContainer.innerHTML) {
        primaryRender(elements.postsContainer, ' Посты');
      }
      renderPosts(value, previouseValue, i18nextInstance);
    }
    if (path === 'feedback') {
      renderFeedback(elements, value, i18nextInstance);
    }
    if (path === 'processState') {
      renderProcess(value, elements);
    }
  });

  const validateURL = (url, feeds) => {
    const schema = yup.string().url().trim()
      .notOneOf(feeds);
    return schema.validate(url);
  };

  const allOriginsUrl = (url) => {
    const originsUrl = new URL('https://allorigins.hexlet.app/get');
    originsUrl.searchParams.set('disableCache', 'true');
    originsUrl.searchParams.set('url', url);
    return originsUrl;
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.processState = 'send';

    const ressRequests = _.map(state.feeds, 'rssRequest');
    validateURL(elements.input.value, ressRequests)
      .then((validUrl) => {
        watchedState.feedback = '';
        const parsedUrl = allOriginsUrl(validUrl);
        return axios.get(parsedUrl);
      })
      .then((response) => {
        // console.log(response);
        const newFeedAndPosts = parseResponse(response, elements.input.value);
        watchedState.feeds = [...state.feeds, ...newFeedAndPosts.feed];
        watchedState.posts = [...state.posts, ...newFeedAndPosts.posts];
        console.log(state, 'UPDATE state');
      })
      .then(() => {
        watchedState.feedback = 'Completed';
        watchedState.processState = 'editing';
        elements.form.reset();
        elements.input.focus();
      })
      .then(() => {
        const viewButtons = document.querySelectorAll('[data-bs-target="#modal"]');
        // console.log(viewButtons);
        viewButtons.forEach((btn) => {
          btn.addEventListener('click', (event) => {
            renderModal(event.target, state.posts, elements);
          });
        });
      })
      .catch((error) => {
        watchedState.feedback = error.message;
        watchedState.processState = 'editing';
        console.log(state, 'ERROR');
      });
  });

  const watchNewPosts = () => {
    console.log('watchNewPosts');
    watchedState.feeds.forEach((feed) => {
      const parsedUrl = allOriginsUrl(feed.rssRequest);
      axios.get(parsedUrl)
        .then((response) => {
          const newRequestResult = parseResponse(response, 'feed', feed.feedId);
          const existingPostsLinks = watchedState.posts
            .filter((post) => post.feedId === feed.feedId)
            .map((post) => post.itemLink);
          const reverseNewPosts = newRequestResult.posts.reverse();
          reverseNewPosts.forEach((post) => {
            if (!existingPostsLinks.includes(post.itemLink)) {
              watchedState.posts.push(post);
              console.log(state, 'period UPDATE state');
            }
          });
        })
        .catch((error) => {
          watchedState.feedback = error.message;
          console.log(state, 'Period ERROR');
        });
    });
  };

  setTimeout(function check() {
    watchNewPosts();
    setTimeout(check, 5000);
  }, 5000);
};
