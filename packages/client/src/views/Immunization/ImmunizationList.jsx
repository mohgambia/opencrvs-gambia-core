import React, { useEffect, useState } from 'react'
import { getToken } from '@client/utils/authUtils'
import axios from 'axios'
import './styles/table.css'
import './styles/buttons.css'
import './styles/icons.css'

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

const Pagination = ({ size, position, setOffset }) => {
  const getPages = (size, position) => {
    const pages = []
    for (let index = 0; index < Math.min(size, 10); index++) {
      pages.push(
        <div
          onClick={() => setOffset(index * 10)}
          key={`page-${index}`}
          className={`ui button basic mini ${
            index === position ? 'blue' : 'grey'
          }`}
        >
          {index + 1}
        </div>
      )
    }
    return pages
  }

  return <div className="ui buttons">{getPages(size, position)}</div>
}

const ImmunizationList = () => {
  const [patients, setPatients] = useState([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [count, setCount] = useState(10)
  const [searchGiven, setSearchGiven] = useState('')
  const [searchLast, setSearchLast] = useState('')
  const [searchNIN, setSearchNIN] = useState('')
  const [searchToday, setSearchToday] = useState(false)

  const getPatientsWithParams = params => {
    console.log('parmas', params)
    let url = `http://localhost:3040/patients/?_count=${count}&_getpagesoffset=${offset}`
    if (params) {
      url += params
    }

    console.log(url)
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
      .then(res => {
        setPatients(
          res.data.data && res.data.data.entry ? res.data.data.entry : []
        )
        setTotal(res.data.data && res.data.data.total ? res.data.data.total : 0)
      })
  }

  useEffect(() => {
    getPatientsWithParams()
  }, [count, offset])

  const searchPatients = () => {
    let url = ''
    if (searchGiven) {
      url += `&given:contains=${searchGiven}`
    }
    if (searchLast) {
      url += `&family:contains=${searchLast}`
    }
    if (searchNIN) {
      url += `&identifier=${searchNIN}`
    }
    if (searchToday) {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      url += `&_lastUpdated=gt${date.getFullYear()}-${
        date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`
    }
    console.log(url)

    getPatientsWithParams(url)
  }

  const resetSearch = () => {
    setSearchGiven('')
    setSearchLast('')
    setSearchNIN('')
    getPatientsWithParams()
  }

  console.log(patients)

  return (
    <div className="immunization-list">
      <div className="ui small form">
        <div className="three fields">
          <div className="ui field ">
            <input
              type="text"
              placeholder="Given or middle name..."
              value={searchGiven}
              onChange={e => setSearchGiven(e.target.value)}
            />
          </div>
          <div className="ui field">
            <input
              type="text"
              placeholder="Lastname..."
              value={searchLast}
              onChange={e => setSearchLast(e.target.value)}
            />
          </div>
          <div className="ui field">
            <input
              type="text"
              placeholder="ID (NIN or MyChild, Full ID)"
              value={searchNIN}
              onChange={e => setSearchNIN(e.target.value)}
            />
          </div>
        </div>
        <div className="inline fields">
          {/* <div className="ui field">
            <input
              type="text"
              placeholder="MyChildId..."
              value={searchMyChildId}
              onChange={e => setSearchMyChildId(e.target.value)}
            />
          </div> */}
          <div className="ui field">
            <input
              type="checkbox"
              placeholder="ID (NIN or MyChild, Full ID)"
              value={searchToday}
              onChange={e => setSearchToday(!searchToday)}
            />
            <label>Only registered today</label>
          </div>
          <button className="ui button positive" onClick={searchPatients}>
            Search
          </button>
          <button className="ui button negative" onClick={resetSearch}>
            Reset
          </button>
        </div>
      </div>

      <h3>Patient List</h3>
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
      <Pagination
        size={Math.ceil(total / 10)}
        position={Math.floor(offset / 10)}
        setOffset={setOffset}
      />
    </div>
  )
}

export default ImmunizationList
