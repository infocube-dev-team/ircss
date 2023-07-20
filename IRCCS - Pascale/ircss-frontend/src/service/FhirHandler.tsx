import { fhirClient } from './utils';

export async function getOrganizations() {

  const searchParams = {
    _count: 30
  };

  try {
    const response = await fhirClient.search({ resourceType: 'Organization', searchParams });

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

export async function getOrganizationById(id: string) {
  try {
    const response = await fhirClient.read({ resourceType: 'Organization', id });

    if (response) {

      const organization = ({

        id: response.id ?? '',
        name: response.name ?? '',
        code: response.identifier?.[0]?.value ?? '',
        city: response.address?.[0]?.city ?? '',
        responsible: ((response.contact?.[0]?.name?.given?.[0] ?? '') + ' ' + (response.contact?.[0]?.name?.family ?? '')) ?? '',
        country: response.address?.[0]?.country ?? '',
        description: response.description ?? '',
        address: response.address?.[0]?.line ?? '',
        postalCode: response.address?.[0]?.postalCode ?? '',
        province: response.province ?? '',
        telephoneNumber: response.telephoneNumber ?? '',
        fax: response.fax ?? '',
        referent: response.referent ?? '',
        ethicsCommittee: response.ethicsCommittee ?? '',
        group: response.group ?? '',
        osscCode: response.osscCode ?? '',
        administrativeReferences: response.administrativeReferences ?? '',
        notes: response.notes ?? '',

      });

      return organization;

    }

    const organization = {
      id: '',
      name: '',
      code: '',
      city: '',
      responsible: '',
      country: '',
      description: '',
      address: '',
      postalCode: '',
      province: '',
      telephoneNumber: '',
      fax: '',
      referent: '',
      ethicsCommittee: '',
      group: '',
      osscCode: '',
      administrativeReferences: '',
      notes: '',
    }

    return organization;

  } catch (error) {
    console.error('Errore durante la lettura dell\'organizzazione', error);
    throw error;
  }
}

export async function getPatientFromId(id: string) {
  try {
    const response = await fhirClient.read({ resourceType: 'Patient', id });

    if (response) {
      const patientData = {
        id: response.id ?? '',
        name: response.name ?? [],
        identifier: response.identifier ?? [],
      };

      return patientData;
    }

    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function getStudies(id: string) {
  try {
    const response = await fhirClient.search({ resourceType: 'ResearchStudy' });

    if (response && response.entry) {

      const studiesId = response.entry.filter((entry: any) => entry.resource.resourceType === 'ResearchStudy' && entry.resource.sponsor?.reference?.includes(id));

      const studies = await Promise.all(studiesId.map(async (entry: any) => {

        const resource = entry.resource;

        const investigator = await getPractitionerFromId(resource?.principalInvestigator?.reference.split('/')[1])

        return {
          id: resource?.id,
          title: resource?.title,
          status: resource?.status,
          sponsor: resource?.sponsor?.reference,
          principalInvestigator: investigator?.name,
          documentsLink: "Visualizza documenti",
          numberOfPatientsEnrolled: resource?.meta?.versionId,
        };
      }));

      console.log(studies);
      
      return studies;
    }

    return [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function getPractitionerFromId(id: string) {
  try {
    const response = await fhirClient.read({ resourceType: 'Practitioner', id });

    if (response) {
      const practitionerData = {
        id: response.id ?? '',
        name: response.name?.[0]?.text ?? '',
        identifier: response.identifier?.[0]?.value ?? '',
      };

      return practitionerData;
    }

    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
