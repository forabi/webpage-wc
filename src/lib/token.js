import fs from 'fs';
import promisify from 'promisify-es6';

const saveFile = promisify(fs.saveFile);
const readFile = promisify(fs.readFile);
const deleteFile = promisify(fs.unlink);

export async function getStoredToken(path) {
  return String(await fs.readFileSync(path));
}

export function storeToken(token, path) {
  return saveFile(path, token);
}

export function deleteStoredToken(path) {
  return deleteFile(path);
}
