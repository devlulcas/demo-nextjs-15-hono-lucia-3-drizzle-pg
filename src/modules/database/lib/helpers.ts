export function getFirst<T>(it: T[]): T {
  const el = it.at(0);
  if (typeof el === 'undefined' || el === null) throw new Error('Elemento não encontrado');
  return el;
}

export function safeGetFirst<T>(it: T[]): T | undefined {
  return it.at(0);
}
