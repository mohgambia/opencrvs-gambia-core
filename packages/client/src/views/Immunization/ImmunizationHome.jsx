import React from 'react'
import { SysAdminContentWrapper } from '@client/views/SysAdmin/SysAdminContentWrapper'
import { Header } from '@client/views/SysAdmin/Performance/utils'
import ImmunizationForm from './ImmunizationForm'
import ImmunizationList from './ImmunizationList'
import { useParams } from 'react-router'

const ImmunizationHome = () => {
  const { id } = useParams()

  return (
    <SysAdminContentWrapper>
      <Header>The Gambia COVID-19 Vaccination Form</Header>
      {!id && <ImmunizationList></ImmunizationList>}
      {id && <ImmunizationForm id={id}></ImmunizationForm>}
    </SysAdminContentWrapper>
  )
}

export default ImmunizationHome
