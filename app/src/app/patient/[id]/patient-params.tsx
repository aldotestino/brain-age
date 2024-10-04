import { createSearchParamsCache, parseAsInteger } from 'nuqs/server';

export const patientParser = {
  predId: parseAsInteger
};

export const patientParamsCache = createSearchParamsCache(patientParser);