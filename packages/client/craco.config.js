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
const path = require('path')
const { ESLINT_MODES } = require('@craco/craco')

process.env.REACT_APP_RESOURCES_URL =
  process.env.RESOURCES_URL || 'http://localhost:3040'
// process.env.RESOURCES_URL || 'https://resources.crvs.gm'

console.log(process.env.REACT_APP_RESOURCES_URL)

module.exports = {
  eslint: {
    mode: ESLINT_MODES.file
  },
  webpack: {
    alias: {
      '@client': path.resolve(__dirname, 'src/')
    }
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@client(.*)$': '<rootDir>/src/$1'
      }
    }
  }
}
