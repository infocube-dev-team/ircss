import Client from 'fhir-kit-client';

export const fhirBaseUrl = 'http://localhost:8181';

export const fhirClient = new Client({ baseUrl: fhirBaseUrl });

