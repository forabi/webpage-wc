import cheerio from 'cheerio';

export const wordRegExp = /[0-9A-Z_a-z\u017F\u212A]+/ig;

function assertString(input) {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }
}

export function getWords(text) {
  assertString(text);
  return text.match(wordRegExp);
}

export default function countWords(text) {
  assertString(text);
  return getWords(text).length;
}

export function countWordsInHTML(html, _options) {
  const options = Object.assign({ removeCodeBlocks: true }, _options);
  const $ = cheerio.load(html.content);
  if (options.removeCodeBlocks) {
    $('pre').remove();
  }
  return countWords($.root().text());
}
