import React, { useEffect, useState } from 'react'
import { getToken } from '@client/utils/authUtils'
import axios from 'axios'
import './styles/table.css'
import './styles/buttons.css'
import './styles/form.css'
import './styles/icons.css'

export const getFullName = patient => {
  return `${patient.firstName}  ${patient.middleName} ${patient.lastName}`
}

export const getIdentifiers = patient => {
  return (
    <div>
      {patient.NIN && <div>{`NIN: ${patient.NIN}`}</div>}
      {patient.myChildId && <div>{`myChildId: ${patient.myChildId}`}</div>}
    </div>
  )
}

const PatientRow = ({ patient }) => {
  return (
    <tr>
      <td>{getFullName(patient)}</td>
      <td>
        {patient.dateOfBirth &&
          new Date(patient.dateOfBirth).toLocaleDateString()}
      </td>
      <td>{patient.gender === 'M' ? 'Male' : 'Female'}</td>
      <td>{getIdentifiers(patient)}</td>
      <td>
        <a href={`/immunization/${patient._id}`}>
          <button className="primary mini ui button">Edit</button>
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
  const [count, setCount] = useState(25)
  const [searchGiven, setSearchGiven] = useState('')
  const [searchLast, setSearchLast] = useState('')
  const [searchNIN, setSearchNIN] = useState('')
  const [searchToday, setSearchToday] = useState(false)

  const getPatientsWithParams = params => {
    let url = `${window.config.RESOURCES_URL}/patients/?_count=${count}&_getpagesoffset=${offset}`
    if (params) {
      url += params
    }

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
      .then(res => {
        setPatients(res.data)
        // setTotal(res.data.data && res.data.data.total ? res.data.data.total : 0)
      })
  }

  useEffect(() => {
    getPatientsWithParams()
  }, [count])

  const searchPatients = () => {
    let url = ''
    if (searchGiven) {
      url += `&firstName=${searchGiven}`
    }
    if (searchLast) {
      url += `&lastName=${searchLast}`
    }
    if (searchNIN) {
      url += `&NIN=${searchNIN}`
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
        <div className="four fields">
          <div className="ui field ">
            <input
              type="text"
              placeholder="Given name..."
              value={searchGiven}
              onChange={e => setSearchGiven(e.target.value)}
            />
          </div>
          <div className="ui field">
            <input
              type="text"
              placeholder="Last name..."
              value={searchLast}
              onChange={e => setSearchLast(e.target.value)}
            />
          </div>
          <div className="ui field">
            <input
              type="text"
              placeholder="ID (NIN)"
              value={searchNIN}
              onChange={e => setSearchNIN(e.target.value)}
            />
          </div>
          <div className="inline fields">
            <button className="ui button positive" onClick={searchPatients}>
              Search
            </button>
            <button className="ui button negative" onClick={resetSearch}>
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="ui form">
        <div className="two fields">
          <div className="field">
            <h3>Patient List</h3>
          </div>
          <div className="ui field">
            <label>Number of results</label>
            <select
              className="ui fluid dropdown"
              value={count}
              onChange={e => setCount(parseInt(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
      <table className="ui green striped table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Birth Date</th>
            <th>Gender</th>
            <th>Identifiers</th>
            <th>
              <a href={`/immunization/new/`}>
                <button className="positive mini ui button">New Patient</button>
              </a>
            </th>
          </tr>
        </thead>
        <tbody>
          {patients.map(i => (
            <PatientRow key={i._id} patient={i} />
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
