import minimist from 'minimist';

export default function parseArgs(args) {
  return minimist(args)({
    string: ['token'],
    aliases: {
      t: 'token',
    },
  });
}
