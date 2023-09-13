import { SelectItem } from "./SelectItem"

export interface Authority {
  id: number
  name: string
  capabilities: string[]
}
export interface ProfileData {
  login: string,
  firstName: string,
  lastName: string,
}
export interface UserData extends ProfileData {
  authorities: string | string[] | SelectItem[]
}
export interface User extends Omit<UserData, 'authorities'> {
  id: number
  createdBy: string
  createdDate: string
  lastModifiedBy: string
  lastModifiedDate: string
  authorities: Authority[]
  capabilities: string[]
}

export interface PasswordData {
  currentPassword: string,
  newPassword: string,
  email: string
}