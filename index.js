#!/bin/env node

'use strict';
const fs = require('fs');
const mkdirp = require('mkdirp');
const pkg = require('./package.json');
const got = require('got');
const Table = require('easy-table');
const cheerio = require('cheerio');
const pluralize = require('pluralize');

const USER_DIR = require('appdirs').userDataDir();
const CONFIG_DIR = `${USER_DIR}/${pkg.name}`;
const CONFIG_FILE = `${USER_DIR}/${pkg.name}/token.txt`;

const API_URL = 'https://mercury.postlight.com/parser';
const wordRegExp = /[0-9A-Z_a-z\u017F\u212A]+/ig; // Like /\w+/ig, but includes Unicode characters

const fetchPage = token => url => {
  const query = {
    url,
  };
  return got(API_URL, {
    query, json: true, retries: 1,
    headers: {
      'x-api-key': token,
    },
  });
};

function recalculateWordCount(_article) {
  const article = Object.assign({ }, _article);
  const $ = cheerio.load(article.content);
  $('pre').remove(); // Remove all code blocks
  const words = $.root().text().match(wordRegExp);
  article.word_count = words.length;
  return article;
}

const argv = require('minimist')(process.argv.slice(2), {
  string: ['token'],
  aliases: {
    t: 'token',
  },
});

const urls = argv._;

if (!urls.length) {
  process.stderr.write('You need to pass at least one URL.\n');
  process.exit(1);
}

let token = argv.token;
let tokenIsNew = true;

if (!token) {
  try {
    token = String(fs.readFileSync(CONFIG_FILE)).trim();
    tokenIsNew = false;
  } catch (e) {
    process.stderr.write('Couldn\'t find a stored access token. ' +
      'Pass a valid access token as --token\n');
    process.stderr.write('Get your API token at ${API_URL}\n');
    process.exit(1);
  }
}

Promise.all(urls.map(fetchPage(token)))
  .then(articles => articles.map(a => a.body))
  .then(articles => articles.map(recalculateWordCount))
  .then(articles => {
    process.stdout.write(
      Table.print(
        articles.map((a, i) => ({
          '#': i + 1,
          Title: a.title,
          Count: a.word_count,
          URL: a.url,
        }))
      ).toString()
    );
    return articles;
  })
  .then(articles => {
    const total = articles.reduce((m, article) => article.word_count + m, 0);
    process.stdout.write('\n--------------------\n');
    process.stdout.write(
      `Total: ${total} ${pluralize('word', total)} in ` +
        `${articles.length} ${pluralize('article', articles.legnth)}.\n`
      );
    return articles;
  })
  .then(articles => new Promise((resolve, reject) => {
    if (!tokenIsNew) return resolve(articles);
    mkdirp.sync(CONFIG_DIR);
    return fs.writeFile(CONFIG_FILE, token, err => {
      if (err) return reject(err);
      process.stdout.write(
        `Token saved to ${CONFIG_FILE}, you do not need to pass it next time.\n`
      );
      return resolve(articles);
    });
  }))
  .catch(e => {
    if (e.response && e.response.body && e.response.body.messages) {
      const message = `${e.message}: ${e.response.body.messages}`;
      process.stderr.write(`Error: ${message}\n`);
      if (!tokenIsNew && e.statusCode === 403 || e.statusCode === 401) {
        fs.unlinkSync(CONFIG_FILE);
        process.stdout.write('Token file was removed. ' +
          'Rerun the program with a valid token as --token\n');
      }
    } else {
      process.stderr.write(`Error: ${e.message}\n`);
    }
    process.exit(1);
  });
