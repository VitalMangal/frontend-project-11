import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import {
  renderFeeds,
  renderPosts,
  renderFeedback,
  renderModal,
  renderProcess,
  renderLinkView,
} from './view.js';
import ru from './locales/dictionary_i18next.js';
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
  })
    .then(() => {
      yup.setLocale({
        string: {
          url: 'validError',
        },
        mixed: {
          notOneOf: 'duplicationError',
          required: 'notEmpty',
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
          renderFeeds(value, previouseValue, i18nextInstance, elements);
        }
        if (path === 'posts') {
          renderPosts(value, previouseValue, i18nextInstance, elements);
        }
        if (path === 'feedback') {
          renderFeedback(elements, value, i18nextInstance);
        }
        if (path === 'processState') {
          renderProcess(value, elements);
        }
      });

      const validateURL = (url, feeds) => {
        const schema = yup.string().url().trim().required()
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
            const newFeedAndPosts = parseResponse(response, elements.input.value);
            watchedState.feeds = [...state.feeds, ...newFeedAndPosts.feed];
            watchedState.posts = [...state.posts, ...newFeedAndPosts.posts];
          })
          .then(() => {
            watchedState.feedback = 'Completed';
            watchedState.processState = 'editing';
            elements.form.reset();
            elements.input.focus();
          })
          .then(() => {
            const viewButtons = document.querySelectorAll('button[data-id]');
            viewButtons.forEach((btn) => {
              btn.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');
                const necessaryPost = _.find(watchedState.posts, { itemId: id });
                necessaryPost.itemRead = 'read';

                renderModal(necessaryPost, elements);
                renderLinkView(id);
              });
            });
          })
          .then(() => {
            const links = document.querySelectorAll('a[data-id]');
            links.forEach((link) => {
              link.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');
                const necessaryPost = _.find(watchedState.posts, { itemId: id });
                necessaryPost.itemRead = 'read';

                renderLinkView(id);
              });
            });
          })
          .catch((error) => {
            watchedState.feedback = error.message;
            watchedState.processState = 'editing';
          });
      });

      const watchNewPosts = () => {
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
                }
              });
            })
            .catch((error) => {
              console.log(error.message);
            });
        });
      };

      setTimeout(function check() {
        watchNewPosts();
        setTimeout(check, 5000);
      }, 5000);
    });
};
