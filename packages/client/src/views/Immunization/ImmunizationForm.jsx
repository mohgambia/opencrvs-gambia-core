import React, { useState } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import './ImmunizationForm.css'
import { getToken } from '@client/utils/authUtils'

import 'react-datepicker/dist/react-datepicker.css'

const ImmunizationForm = () => {
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
  const [aefiSeverity, setAefiSeverity] = useState('')
  const [aefiDescription, setAefiDescription] = useState('')

  const savePatient = e => {
    e.preventDefault()
    const url = `${window.config.RESOURCES_URL}/immunization/`

    axios.post(
      url,
      {
        firstName,
        lastName,
        middleName,
        firstDoseDate,
        nameOfTheVaccine,
        batchNumber,
        expirydate,
        dateOfNextVisit,
        vaccinatorFullName,
        aefi: [{ aefiSeverity, aefiDescription }]
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }
    )
  }

  return (
    <div className="container">
      <form className="register-form">
        <div className="form-row">
          <div class="form-group">
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
          <div class="form-group">
            <label>Middle Name</label>
            <input
              type="text"
              name="last-name"
              value={middleName}
              onChange={e => setMiddleName(e.target.value)}
              placeholder="Middle Name"
            />
          </div>
          <div class="form-group">
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
        <div className="form-row">
          <div className="form-group">
            <label>Date of giving (1st dose)</label>
            <div className="datepicker-full">
              <DatePicker
                selected={firstDoseDate}
                onChange={date => setFirstDoseDate(date)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Date of Next Visit (2nd Dose)</label>
            <div className="datepicker-full">
              <DatePicker
                selected={dateOfNextVisit}
                onChange={date => setDateOfNextVisit(date)}
              />
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Name of the vaccine</label>
            <select
              name="last-name"
              value={nameOfTheVaccine}
              required
              onChange={e => setNameOfTheVaccine(e.target.value)}
              placeholder="Name of the vaccine"
            >
              <option>Astrazeneca</option>
              <option>Pfizer</option>
            </select>
          </div>

          <div className="form-group">
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
          <div className="form-group">
            <label>Expiry Date</label>
            <div className="datepicker-full">
              <DatePicker
                selected={expirydate}
                onChange={date => setExpirydate(date)}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Vaccinator Full Name</label>
          <input
            type="text"
            name="last-name"
            value={vaccinatorFullName}
            required
            onChange={e => setVaccinatorFullName(e.target.value)}
            placeholder="Last Name"
          />
        </div>

        <div className="form-group">
          <label>Vaccinator Full Name</label>
          <input
            type="text"
            name="last-name"
            value={vaccinatorFullName}
            required
            onChange={e => setVaccinatorFullName(e.target.value)}
            placeholder="Last Name"
          />
        </div>
        <div className="form-group">
          <div className="two fields">
            <div className="form-group">
              <input
                type="checkbox"
                checked={aefi}
                onChange={e => setAefi(e.target.value)}
              ></input>{' '}
              Adverse Event Following Immunization
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="two fields">
            <div className="form-group">
              <label>Severity</label>
              <select
                value={aefiSeverity}
                onChange={e => setAefiSeverity(e.target.value)}
              >
                <option>Severe</option>
                <option>Minor</option>
              </select>
            </div>
            <div className="form-group">
              <label>AEFI description</label>
              <input
                type="text"
                value={aefiDescription}
                onChange={e => setAefiDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button class="ui button" onClick={savePatient}>
          Submit
        </button>
      </form>
    </div>
  )
}

export default ImmunizationForm
