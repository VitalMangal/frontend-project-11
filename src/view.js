import _ from 'lodash';

export const primaryRender = (container, name) => {
  const divCardEl = document.createElement('div');
  divCardEl.classList.add('card', 'border-0');

  const divCardBodyEl = document.createElement('div');
  divCardBodyEl.classList.add('card-body');
  divCardEl.append(divCardBodyEl);

  const h2El = document.createElement('h2');
  h2El.classList.add('card-title', 'h4');
  h2El.textContent = name;
  divCardBodyEl.append(h2El);

  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');
  divCardEl.append(ulEl);
  container.append(divCardEl);
};

export const renderFeedback = (elements, value, i18next) => {
  const oldError = elements.feedback.firstChild;
  if (oldError) {
    oldError.remove();
  }
  const textNode = document.createTextNode(i18next.t(value));
  elements.feedback.append(textNode);

  switch (value) {
    case '':
      elements.input.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.remove('text-success');
      break;

    case 'Completed':
      elements.feedback.classList.add('text-success');
      break;

    default:
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.add('text-danger');
      break;
  }
};

export const renderFeeds = (value, previouseValue) => {
  const liEl = document.createElement('li');
  liEl.classList.add('list-group-item', 'border-0', 'border-end-0');

  const h3El = document.createElement('h3');
  h3El.classList.add('h6', 'm-0');

  const diff = _.difference(value, previouseValue);
  h3El.textContent = diff[0].feedTitle;
  liEl.append(h3El);

  const pEl = document.createElement('p');
  pEl.classList.add('m-0', 'small', 'text-black-50');
  pEl.textContent = diff[0].feedDescription;
  liEl.append(pEl);

  const ulFeedsEl = document.querySelector('.feeds > .card > ul');
  ulFeedsEl.append(liEl);
};

export const renderPosts = (value, previouseValue, i18next) => {
  const newPosts = _.difference(value, previouseValue);
  const sortNewPosts = newPosts.reverse();
  // console.log(newPosts);
  sortNewPosts.forEach((post) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const ulPostsEl = document.querySelector('.posts > .card > ul');
    ulPostsEl.prepend(liEl);

    const aEl = document.createElement('a');
    aEl.setAttribute('href', post.itemLink);
    aEl.setAttribute('data-id', post.itemId);
    aEl.setAttribute('target', '_blank');
    aEl.setAttribute('rel', 'noopener noreferrer');
    aEl.classList.add('fw-bold');
    aEl.textContent = post.itemTitle;
    liEl.append(aEl);

    const btnEl = document.createElement('button');
    btnEl.setAttribute('type', 'button');
    btnEl.setAttribute('data-id', post.itemId);
    btnEl.setAttribute('data-bs-toggle', 'modal');
    btnEl.setAttribute('data-bs-target', '#modal');
    btnEl.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btnEl.textContent = i18next.t('buttons.viewer');
    liEl.append(btnEl);
  });
};

export const renderModal = (target, posts, elements) => {
  const id = target.getAttribute('data-id');
  const necessaryPost = _.find(posts, { itemId: id });

  elements.modalHeader.textContent = necessaryPost.itemTitle;
  elements.modalBody.textContent = necessaryPost.itemDescription;
  elements.modalLink.setAttribute('href', necessaryPost.itemLink);
};

export const renderProcess = (value, elements) => {
  switch (value) {
    case 'editing':
      elements.submitButton.removeAttribute('disabled');
      break;
    case 'send':
      elements.submitButton.setAttribute('disabled', 'disabled');
      break;
    default:
      break;
  }
};
