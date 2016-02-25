import got from 'got';

export const API_URL = 'https://www.readability.com';

export function fetchReadablePage(url, token, _options) {
  return got(
    `${API_URL}/api/content/v1/parser`, {
      query: { url, token },
      json: true, retries: 1, ..._options,
    }
  );
}
