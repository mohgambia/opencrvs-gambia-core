import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import './styles/form.css'
import { getToken } from '@client/utils/authUtils'
import './styles/datepicker-full.css'
import 'react-datepicker/dist/react-datepicker.css'
import './styles/custom.css'
import PatientData from './PatientData'
import { storage } from '@client/storage'
import './styles/header.css'
import { Redirect } from 'react-router'

const ImmunizationForm = ({ id }) => {
  const [patient, setPatient] = useState({})
  const [redirect, setRedirect] = useState(false)
  const [user, setUser] = useState({})
  const [facilities, setFacilities] = useState([])

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [firstDoseDate, setFirstDoseDate] = useState(new Date())
  const [nameOfTheVaccine, setNameOfTheVaccine] = useState('')
  const [batchNumber, setBatchNumber] = useState('')
  const [expirydate, setExpirydate] = useState(new Date())
  const [dateOfNextVisit, setDateOfNextVisit] = useState(new Date())
  const [vaccinatorFullName, setVaccinatorFullName] = useState('')
  const [aefi, setAefi] = useState(false)
  const [aefiSeverity, setAefiSeverity] = useState('severe')
  const [aefiDescription, setAefiDescription] = useState('')
  const [addressType, setAddressType] = useState('facility')
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [facility, setFacility] = useState('')
  const [place, setPlace] = useState('')

  const setLocationsOnState = locationsObject => {
    const locationsArray = Object.keys(locationsObject).map(k => ({
      id: locationsObject[k].id,
      name: locationsObject[k].name,
      partOf: locationsObject[k].partOf
    }))
    console.log(locationsArray)
    setProvinces(locationsArray.filter(l => l.partOf === 'Location/0'))
    setDistricts(locationsArray.filter(l => l.partOf !== 'Location/0'))
    console.log(provinces, districts)
  }

  useEffect(() => {
    axios
      .get(`http://localhost:3040/patients/${id}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
      .then(res => {
        setPatient(res.data)
        setFirstName(
          res.data.name[0] && res.data.name[0].given
            ? res.data.name[0].given[0]
            : ''
        )
        setMiddleName(
          res.data.name[0] &&
            res.data.name[0].given &&
            res.data.name[0].length > 1
            ? res.data.name[0].given[1]
            : ''
        )
        setLastName(
          res.data.name[0] && res.data.name[0].family
            ? res.data.name[0].family[0]
            : ''
        )

        storage
          .getItem('USER_DETAILS')
          .then(res => console.log(JSON.parse(res)))
        storage.getItem('offline').then(res => {
          const offlineData = JSON.parse(res)
          console.log(offlineData)
          setFacilities(
            Object.keys(offlineData.facilities).map(k => ({
              id: offlineData.facilities[k].id,
              name: offlineData.facilities[k].name
            }))
          )
          setLocationsOnState(offlineData.locations)
        })
      })
  }, [])

  const radioButtonHandler = e => {
    setAddressType(e.target.value)
  }

  const savePatient = e => {
    e.preventDefault()
    const url = `${window.config.RESOURCES_URL}/immunization/`

    axios
      .post(
        url,
        {
          patient: patient.id,
          firstName,
          lastName,
          middleName,
          firstDoseDate,
          nameOfTheVaccine,
          batchNumber,
          expirydate,
          dateOfNextVisit,
          vaccinatorFullName,
          aefi: [{ aefiSeverity, aefiDescription }],
          placeofVaccination: {
            facility,
            province,
            district,
            place
          }
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      )
      .then(setRedirect(true))
  }

  return (
    <div className="container two-columns">
      {redirect && <Redirect to="/immunization" />}
      <PatientData patient={patient} />
      <div className="register-form ui form">
        <h4 className="ui dividing header">Patient Data</h4>
        <div className="three fields">
          <div className="ui field">
            <label>First Name</label>
            <input
              type="text"
              name="first-name"
              value={firstName}
              required
              onChange={e => setFirstName(e.target.value)}
              placeholder="First Name"
            />
          </div>
          <div className="ui field">
            <label>Middle Name</label>
            <input
              type="text"
              name="last-name"
              value={middleName}
              onChange={e => setMiddleName(e.target.value)}
              placeholder="Middle Name"
            />
          </div>
          <div className="ui field">
            <label>Last Name</label>
            <input
              type="text"
              name="last-name"
              value={lastName}
              required
              onChange={e => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>
        </div>
        <h4 className="ui dividing header">Vaccination Data</h4>
        <div className="two fields">
          <div className="ui field">
            <label>Date of giving (1st dose)</label>
            <div className="datepicker-full">
              <DatePicker
                selected={firstDoseDate}
                onChange={date => setFirstDoseDate(date)}
              />
            </div>
          </div>
          <div className="ui field">
            <label>Date of Next Visit (2nd Dose)</label>
            <div className="datepicker-full">
              <DatePicker
                selected={dateOfNextVisit}
                onChange={date => setDateOfNextVisit(date)}
              />
            </div>
          </div>
        </div>
        <div className="three fields">
          <div className="ui field">
            <label>Name of the vaccine</label>
            <select
              name="last-name"
              value={nameOfTheVaccine}
              className="ui dropdown"
              required
              onChange={e => setNameOfTheVaccine(e.target.value)}
              placeholder="Name of the vaccine"
            >
              <option></option>
              <option>Astrazeneca</option>
              <option>Pfizer-BioNTech</option>
              <option>Moderna</option>
              <option>NovaVax</option>
              <option>Jhonson&Jhonson - Jansen</option>
            </select>
          </div>

          <div className="ui field">
            <label>Batch Number</label>
            <input
              type="text"
              name="last-name"
              value={batchNumber}
              required
              onChange={e => setBatchNumber(e.target.value)}
              placeholder="Batch Number"
            ></input>
          </div>
          <div className="ui field">
            <label>Expiry Date</label>
            <div className="datepicker-full">
              <DatePicker
                selected={expirydate}
                onChange={date => setExpirydate(date)}
              />
            </div>
          </div>
        </div>
        <div className="ui field">
          <label>Vaccinator Full Name</label>
          <input
            type="text"
            name="last-name"
            value={vaccinatorFullName}
            required
            onChange={e => setVaccinatorFullName(e.target.value)}
            placeholder="Vaccinator FullName"
          />
        </div>
        <h4 className="ui dividing header">Place of vaccination</h4>
        <div className="inline fields">
          <div className="field">
            <div className="ui radio checkbox">
              <input
                type="radio"
                name="address"
                value="facility"
                className="hidden"
                checked={addressType === 'facility'}
                onChange={radioButtonHandler}
              />
              <label>Facility</label>
            </div>
          </div>
          <div className="field">
            <div className="ui radio checkbox">
              <input
                type="radio"
                name="address"
                value="address"
                className="hidden"
                checked={addressType === 'address'}
                onChange={radioButtonHandler}
              />
              <label>Other Address</label>
            </div>
          </div>
        </div>
        {addressType === 'facility' && (
          <div className="fields">
            <div className="six wide field">
              <select
                className="ui fluid dropdown"
                value={facility}
                onChange={e => setFacility(e.target.value)}
              >
                <option></option>
                {facilities
                  .sort((i, j) => (i.name > j.name ? 1 : -1))
                  .map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}{' '}
        {addressType !== 'facility' && (
          <div className="fields">
            <div className="four wide field">
              <label>Province</label>
              <select
                className="ui fluid dropdown"
                value={province}
                onChange={e => setProvince(e.target.value)}
              >
                <option></option>
                {provinces
                  .sort((i, j) => (i.name > j.name ? 1 : -1))
                  .map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
              </select>
            </div>
            {province && (
              <div className="four wide field">
                <label>District</label>
                <select
                  className="ui fluid dropdown"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                >
                  <option></option>
                  {districts
                    .filter(d => d.partOf === `Location/${province}`)
                    .sort((i, j) => (i.name > j.name ? 1 : -1))
                    .map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
            {district && (
              <div className="eight wide field">
                <label>Place</label>
                <input
                  type="text"
                  value={place}
                  onChange={e => setPlace(e.target.value)}
                />
              </div>
            )}
          </div>
        )}{' '}
        <h4 className="ui dividing header">Adverse effect</h4>
        <div className="ui field">
          <div className="two fields">
            <div className="ui field">
              <input
                type="checkbox"
                checked={aefi}
                onChange={e => setAefi(!aefi)}
              ></input>{' '}
              Adverse Event Following Immunization
            </div>
          </div>
        </div>
        {aefi && (
          <div className="fields">
            <div className="three wide field">
              <label>Severity</label>
              <select
                className="ui fluid dropdown"
                value={aefiSeverity}
                onChange={e => setAefiSeverity(e.target.value)}
              >
                <option value="severe">Severe</option>
                <option value="minor">Minor</option>
              </select>
            </div>
            <div className="thirteen wide field">
              <label>AEFI description</label>
              <input
                type="text"
                value={aefiDescription}
                onChange={e => setAefiDescription(e.target.value)}
              />
            </div>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <button className="ui button positive" onClick={savePatient}>
            Save
          </button>
          <a href="/immunization">
            <button className="ui button negative">Cancel</button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default ImmunizationForm
