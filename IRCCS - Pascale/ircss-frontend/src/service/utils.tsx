import Client from 'fhir-kit-client';

export const fhirBaseUrl = 'http://hapi.fhir.org/baseR4';

export const fhirClient = new Client({ baseUrl: fhirBaseUrl });

