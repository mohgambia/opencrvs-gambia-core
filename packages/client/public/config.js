// window.config = {
//   BACKGROUND_SYNC_BROADCAST_CHANNEL: 'backgroundSynBroadCastChannel',
//   COUNTRY: 'gmb',
//   COUNTRY_LOGO_FILE: 'logo.png',
//   DESKTOP_TIME_OUT_MILLISECONDS: 900000, // 15 mins
//   HEALTH_FACILITY_FILTER: "",
//   LANGUAGES: 'en',
//   LOGIN_URL: 'http://login.crvs.gm',
//   AUTH_URL: 'http://auth.crvs.gm',
//   API_GATEWAY_URL: '/',
//   RESOURCES_URL: 'https://resources.crvs.gm',
//   CERTIFICATE_PRINT_CHARGE_FREE_PERIOD: 45, // days
//   CERTIFICATE_PRINT_CHARGE_UP_LIMIT: 1825, // 5 years =  (5 * 365) days
//   CERTIFICATE_PRINT_LOWEST_CHARGE: 25, // taka
//   CERTIFICATE_PRINT_HIGHEST_CHARGE: 50, // taka
//   UI_POLLING_INTERVAL: 5000,
//   FIELD_AGENT_AUDIT_LOCATIONS:
//     'WARD,UNION,CITY_CORPORATION,MUNICIPALITY,UPAZILA',
//   APPLICATION_AUDIT_LOCATIONS: 'WARD,UNION',
//   EXTERNAL_VALIDATION_WORKQUEUE: true, // this flag will decide whether to show external validation workqueue on registrar home
//   SENTRY: 'https://2ed906a0ba1c4de2ae3f3f898ec9df0b@sentry.io/1774551',
//   LOGROCKET: 'opencrvs-foundation/opencrvs-gambia'
// }

window.config = {
  BACKGROUND_SYNC_BROADCAST_CHANNEL: 'backgroundSynBroadCastChannel',
  COUNTRY: 'gmb',
  COUNTRY_LOGO_FILE: 'logo.png',
  DESKTOP_TIME_OUT_MILLISECONDS: 900000, // 15 mins
  HEALTH_FACILITY_FILTER: "",
  LANGUAGES: 'en,bn',
  LOGIN_URL: 'http://localhost:3020/',
  AUTH_URL: 'http://localhost:4040/',
  API_GATEWAY_URL: 'http://localhost:7070/',
  RESOURCES_URL: 'http://localhost:3040/gmb',
  CERTIFICATE_PRINT_CHARGE_FREE_PERIOD: 45, // days
  CERTIFICATE_PRINT_CHARGE_UP_LIMIT: 1825, // 5 years =  (5 * 365) days
  CERTIFICATE_PRINT_LOWEST_CHARGE: 25, // taka
  CERTIFICATE_PRINT_HIGHEST_CHARGE: 50, // taka
  UI_POLLING_INTERVAL: 5000,
  FIELD_AGENT_AUDIT_LOCATIONS:
    'WARD,UNION,CITY_CORPORATION,MUNICIPALITY,UPAZILA',
  APPLICATION_AUDIT_LOCATIONS: 'WARD,UNION',
  EXTERNAL_VALIDATION_WORKQUEUE: true, // this flag will decide whether to show external validation workqueue on registrar home
  SENTRY: 'https://2ed906a0ba1c4de2ae3f3f898ec9df0b@sentry.io/1774551',
  LOGROCKET: 'opencrvs-foundation/opencrvs-gambia'
}