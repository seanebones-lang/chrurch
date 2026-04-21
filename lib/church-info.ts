/**
 * Public church details — sourced from https://harvestfbc.org/
 * (Sanity “Site Settings” overrides some of this when configured.)
 */

export const CHURCH_NAME = 'Harvest Fellowship Baptist Church'

/** Shorter label for compact UI (e.g. nav). */
export const CHURCH_NAME_SHORT = 'Harvest Fellowship'

export const CHURCH_TAGLINE =
  'A multigenerational church made up of people from different backgrounds, joined together to lead people to trust and obey Jesus.'

export const CHURCH_ADDRESS_STREET = '2021 N. Hampton Rd., Ste. 130'
export const CHURCH_ADDRESS_CITY = 'DeSoto, TX 75115'
export const CHURCH_ADDRESS_LINES = [CHURCH_ADDRESS_STREET, CHURCH_ADDRESS_CITY] as const

export const CHURCH_ADDRESS_SINGLE_LINE = `${CHURCH_ADDRESS_STREET}, ${CHURCH_ADDRESS_CITY}`

export const CHURCH_PHONE_DISPLAY = '972-920-6701'
export const CHURCH_PHONE_TEL = '+19729206701'

/** Contact page lists phone only; use /about form for written messages. */
export const CHURCH_CONTACT_ABOUT_PATH = '/about'

export const CHURCH_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('2021 N. Hampton Rd. Ste 130, DeSoto, TX 75115')

export const DEFAULT_SERVICE_TIMES: { name: string; day: string; time: string }[] = [
  { day: 'Sunday', time: '10:00 AM', name: 'Worship Service' },
  { day: 'Tuesday', time: '7:00 PM', name: 'Bible Study' },
]

export const CHURCH_SERVICE_TIMES_SUMMARY =
  'Sunday Worship: 10:00 AM · Tuesday Bible Study: 7:00 PM'

export const LEAD_PASTOR = 'Dr. Ed Johnson, III'

/** Mailing address for checks — from harvestfbc.org/give/ */
export const CHURCH_GIVING_MAIL_ADDRESS = 'P.O. Box 2076, DeSoto, TX 75123'

/** Text-to-give — from harvestfbc.org/give/ (text your donation amount to this number). */
export const CHURCH_TEXT_TO_GIVE_DISPLAY = '877-745-9985'
export const CHURCH_TEXT_TO_GIVE_TEL = '+18777459985'
