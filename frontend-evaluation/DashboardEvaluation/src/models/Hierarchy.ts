export type Hierarchy = {
  id: string,
  code: string,
  description?: string,
  creationDate: number,
  lastModified: number,
  parent?: Hierarchy,
}