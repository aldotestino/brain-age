import { createSearchParamsCache, parseAsInteger, parseAsString } from 'nuqs/parsers';

export const patientParser = {
  predId: parseAsInteger
};

export const patientParamsCache = createSearchParamsCache(patientParser);