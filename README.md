webpage-wc
=============
Prints number of words in one or more webpages using the [Mercury Web Parser API](https://mercury.postlight.com/web-parser/)

## Installation

```shell
npm install -g webpage-wc
```

## Usage

```shell
webpage-wc url1 url2 ... [--token <api_key>]
```

You only need to pass the API key on the first run. It will be saved to your configuration directory and automatically read on subsequent runs.

You can get your key at https://mercury.postlight.com/web-parser/.

## Caveats
Although the Mercury Web Parser API reports the total word count in the parsed article, this number is not accurate as it includes the number of words in code blocks, `webpage-wc` _does not_ include code blocks in the total word count, so only normal paragraphs are considered.