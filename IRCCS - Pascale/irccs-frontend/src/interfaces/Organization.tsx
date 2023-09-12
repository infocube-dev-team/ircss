import { FhirResource } from "fhir-kit-client";

// Definiamo l'interfaccia per il tipo Organization
export interface Organization  {
    id: string;
    name?: string;
    code?: string;
    city?: string;
    responsible?: string;
    country?: string;
    description?: string;
    address?: string;
    postalCode?: string;
    province?: string;
    telephoneNumber?: string;
    fax?: string;
    referent?: string;
    ethicsCommittee?: string;
    group?: string;
    osscCode?: string;
    administrativeReferences?: string;
    notes?: string;
}
