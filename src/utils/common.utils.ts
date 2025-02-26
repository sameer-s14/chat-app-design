import { parsePhoneNumberFromString } from "libphonenumber-js/mobile";

export function isValidMobile(phoneNumber: string, countryCode: string) {
  const phone = parsePhoneNumberFromString(`${countryCode} ${phoneNumber}`);
  return phone && phone.isValid() && phone.getType() === "MOBILE";
}
