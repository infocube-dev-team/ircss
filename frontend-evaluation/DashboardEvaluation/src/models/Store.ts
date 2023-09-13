import { Attribute } from "./Attribute";
import { Hierarchy } from "./Hierarchy";


export type Store = {
    id: string,
    creationDate: number,
    lastModified: number,
    code: string,
    syncCode: string,
    description: string,
    address: string,
    hierarchy: Hierarchy,
    storeType: string,
    attributes: Array<Attribute>,
    externalCode: string,
    activationDate: any,
    activationPending: any
}
