import React from 'react'
import { SysAdminContentWrapper } from '@client/views/SysAdmin/SysAdminContentWrapper'
import { Header } from '@client/views/SysAdmin/Performance/utils'
import ImmunizationForm from './ImmunizationForm'

const ImmunizationHome = () => {
  return (
    <SysAdminContentWrapper>
      <Header>COVID19 Immunization Campaign</Header>
      <ImmunizationForm></ImmunizationForm>
    </SysAdminContentWrapper>
  )
}

export default ImmunizationHome
