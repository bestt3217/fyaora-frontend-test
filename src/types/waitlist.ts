export interface WaitlistRow {
  id: string
  name: string
  email: string
  phoneNumber: string
  type: 'service-providers' | 'customers'
  registrationStatus: string
  dateRegistered: string
  postcode: string
  vendorType: string
  serviceOffering: string
}
