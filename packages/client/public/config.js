/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * OpenCRVS is also distributed under the terms of the Civil Registration
 * & Healthcare Disclaimer located at http://opencrvs.org/license.
 *
 * Copyright (C) The OpenCRVS Authors. OpenCRVS and the OpenCRVS
 * graphic logo are (registered/a) trademark(s) of Plan International.
 */
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
