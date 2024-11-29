// As peculiaridades nesse arquivo só existem para suportar usuários criados com um sistema em PHP

import * as bcrypt from 'bcrypt';

let PASSWORD_BCRYPT = 1;

export async function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string) {
  let info = getHashInfo(hash);

  if (info.algo === PASSWORD_BCRYPT) {
    hash = '$2a$' + hash.substring(4);
  }

  return bcrypt.compare(password, hash);
}

function getHashInfo(hash: string) {
  const info = {
    algo: 0,
    algoName: 'unknown',
    options: {} as any,
  };

  const bcryptStarts = ['$2a$', '$2x$', '$2y$'];

  if (bcryptStarts.includes(hash.substring(0, 4)) && hash.length === 60) {
    info.algo = PASSWORD_BCRYPT;
    info.algoName = 'bcrypt';
    info.options.cost = parseInt(hash.substring(4, 2), 10);
  }

  return info;
}
