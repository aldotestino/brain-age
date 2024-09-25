import { parseAsInteger, parseAsString, createSearchParamsCache } from 'nuqs/server';

export const tableParser = {
  q: parseAsString.withDefault(''),
  p: parseAsInteger.withDefault(1),
  n: parseAsInteger.withDefault(8),
};

export const tableParamsCache = createSearchParamsCache(tableParser);