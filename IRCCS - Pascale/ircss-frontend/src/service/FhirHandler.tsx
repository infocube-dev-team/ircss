import Client from 'fhir-kit-client';

const client = new Client({ baseUrl: 'http://hapi.fhir.org/baseR4' });

export async function getOrganizations() {

  const searchParams = {
    _count: 10
  };

  try {
    const response = await client.search({ resourceType: 'Organization', searchParams });

    if (response && response.entry) {
      const organizations = response.entry.map((entry: any) => ({
        id: entry.resource?.id,
        name: entry.resource?.name,
        code: entry.resource?.identifier?.[0]?.value,
        city: entry.resource?.address?.[0]?.city,
        responsible: (entry.resource?.contact?.[0]?.name?.given?.[0] ?? '') + ' ' + (entry.resource?.contact?.[0]?.name?.family ?? ''),
        country: entry.resource?.address?.[0]?.country
      }));

      return organizations;
    }

    return [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getPatientFromId() {

  const searchParams = {
    _count: 10
  };

  try {
    const response = await client.search({ resourceType: 'Patient', searchParams });

    if (response && response.entry) {
      const organizations = response.entry.map((entry: any) => ({
        id: entry.resource?.id,
        name: entry.resource?.name,
        code: entry.resource?.identifier?.[0]?.value,
        city: entry.resource?.address?.[0]?.city,
        responsible: (entry.resource?.contact?.[0]?.name?.given?.[0] ?? '') + ' ' + (entry.resource?.contact?.[0]?.name?.family ?? ''),
        country: entry.resource?.address?.[0]?.country
      }));

      return organizations;
    }

    return [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}