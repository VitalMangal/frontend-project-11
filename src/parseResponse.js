import _ from 'lodash';

export default (response, rssRequest) => {
  const result = {
    feed: {},
    posts: [],
  };
  try{
  const parser = new DOMParser();
  const doc = parser.parseFromString(response.data.contents, 'application/xml');
  console.log(doc);

  const feedTitle = (doc.querySelector('channel > title')).textContent;
  const feedDescription = (doc.querySelector('channel > description')).textContent;
  const feedId = _.uniqueId();
  const newFeed = {
    feedTitle, feedDescription, feedId, rssRequest,
  };
  // console.log(newFeed, 'newFeed');
  result.feed = newFeed;

  const items = doc.querySelectorAll('channel > item');
  items.forEach((item) => {
    // console.log(item);
    const itemDescription = (item.querySelector('description')).textContent;
    const itemTitle = (item.querySelector('title')).textContent;
    const itemLink = (item.querySelector('link')).textContent;
    const itemId = _.uniqueId();
    result.posts.push({
      itemTitle, itemLink, itemId, feedId, itemDescription,
    });
  });
  return result;
} catch (error) {
  throw new Error('notConteinRSS');
}
};
