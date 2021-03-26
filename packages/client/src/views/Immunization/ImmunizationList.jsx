import React, { useEffect, useState } from 'react'
import { getToken } from '@client/utils/authUtils'
import axios from 'axios'
import './styles/table.css'
import './styles/buttons.css'

export const getFullName = name => {
  return `${name[0].given ? name[0].given.join(' ') : ''}  ${
    name[0].family ? name[0].family.join(' ') : ''
  }`
}

export const getIdentifiers = identifiers => {
  return (
    <div>
      {(identifiers || []).map(i => (
        <div key={i.type}>
          <em>{i.type}</em>: {i.value}{' '}
        </div>
      ))}
    </div>
  )
}

const PatientRow = ({ patient }) => {
  return (
    <tr>
      <td>{getFullName(patient.name)}</td>
      <td>{patient.birthDate}</td>
      <td>{patient.gender}</td>
      <td>{getIdentifiers(patient.identifier)}</td>
      <td>
        <a href={`/immunization/${patient.id}`}>
          <button className="primary mini ui button">1st Dose</button>
        </a>
      </td>
    </tr>
  )
}

const ImmunizationList = () => {
  const [patients, setPatients] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:3040/patients/', {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
      .then(res =>
        setPatients(
          res.data.data && res.data.data.entry ? res.data.data.entry : []
        )
      )
  }, [])

  console.log(patients)

  return (
    <div className="immunization-list">
      <table className="ui green striped table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Birth Date</th>
            <th>Gender</th>
            <th>Identifiers</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {patients.map(i => (
            <PatientRow key={i.fullUrl} patient={i.resource} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ImmunizationList
