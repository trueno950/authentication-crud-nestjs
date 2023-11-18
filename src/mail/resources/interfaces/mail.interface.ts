export interface EmailData {
  fullName?: string
  firstName?: string;
  lastName?: string;
  age?: string;
  email?: string;
  phone?: string;
  token?: string;
  url?: string;
  code? : string;
  amount? : string;
  id? : string
  message?: string;
  logo? : string;
}
export interface Mail {
  to?: string;
  from?: string;
  subject?: string;
  emailData?: EmailData;
  templateId?: string;
  html?: string;
}