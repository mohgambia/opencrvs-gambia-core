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
import * as React from 'react'
import { createTestComponent, userDetails } from '@register/tests/util'
import { createStore } from '@register/store'
import { SettingsPage } from '@register/views/Settings/SettingsPage'
import { getStorageUserDetailsSuccess } from '@opencrvs/register/src/profile/profileActions'
import { DataSection } from '@opencrvs/components/lib/interface'
import { ReactWrapper } from 'enzyme'

describe('Settings page tests', () => {
  const { store } = createStore()
  let component: ReactWrapper
  beforeEach(async () => {
    store.dispatch(getStorageUserDetailsSuccess(JSON.stringify(userDetails)))

    const testComponent = await createTestComponent(
      // @ts-ignore
      <SettingsPage />,
      store
    )
    component = testComponent.component
  })
  it('shows nothing', async () => {
    const { store } = createStore()
    store.dispatch(
      getStorageUserDetailsSuccess(
        JSON.stringify({
          language: 'en',
          catchmentArea: []
        })
      )
    )
    const comp = (await createTestComponent(
      // @ts-ignore
      <SettingsPage />,
      store
    )).component
    expect(
      comp
        .find('#English-name')
        .first()
        .text()
    ).toBe('English nameChange')
    expect(
      comp
        .find('#Phone-number')
        .first()
        .text()
    ).toBe('Phone numberChange')
  })

  it('it checks component has loaded', () => {
    // @ts-ignore
    expect(component.containsMatchingElement(DataSection)).toBe(true)
  })
  it('it checks modal is open when button clicked', () => {
    component
      .find('#BtnChangeLanguage')
      .hostNodes()
      .simulate('click')

    expect(component.find('#ChangeLanguageModal').hostNodes()).toHaveLength(1)
  })
  it('it checks cancel button clicked', () => {
    component
      .find('#BtnChangeLanguage')
      .hostNodes()
      .simulate('click')

    const modal = component.find('#ChangeLanguageModal').hostNodes()

    modal
      .find('#modal_cancel')
      .hostNodes()
      .simulate('click')
  })
  it('it checks cancel button clicked', () => {
    component
      .find('#BtnChangeLanguage')
      .hostNodes()
      .simulate('click')

    const modal = component.find('#ChangeLanguageModal').hostNodes()

    modal
      .find('#apply_change')
      .hostNodes()
      .simulate('click')
  })
  it('Should display password change modal', () => {
    component
      .find('#BtnChangePassword')
      .hostNodes()
      .simulate('click')

    const modal = component.find('#ChangePasswordModal').hostNodes()
    expect(modal.length).toEqual(1)

    modal
      .find('#confirm-button')
      .hostNodes()
      .simulate('click')
  })
})
