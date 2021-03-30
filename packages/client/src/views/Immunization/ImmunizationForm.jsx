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
import { validate } from './validators/validator'
import countries from './extraData/countries.json'
import Select from 'react-select'
import { priorityGroups, preexistingConditions } from './extraData/multiselect'
import { v4 as uuid } from 'uuid'

const ImmunizationForm = ({ id }) => {
  // utils
  const [redirect, setRedirect] = useState(false)

  // locations
  const [facilities, setFacilities] = useState([])
  // user
  const [user, setUser] = useState({})
  // Is born in Gambia
  const [bornInGambia, setBornInGambia] = useState(true)
  // Application
  // const [informant, setInformant] = useState('self')
  // const [informantRelationship, setinformantRelationship] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  // Patient
  const [patient, setPatient] = useState({})
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [baptismalName, setBaptismalName] = useState('')
  const [NIN, setNIN] = useState('')
  const [myChildId, setMyChildId] = useState('')
  const [nationality, setNationality] = useState('GM')
  const [gender, setGender] = useState('M')
  const [dateOfBirth, setDateOfBirth] = useState(new Date())
  const [placeOfWork, setPlaceOfWork] = useState('')
  const [patientPriorityGroups, setPatientPriorityGroups] = useState([])
  const [
    patientPreexistingConditions,
    setPatientPreexistingConditions
  ] = useState([])
  const [
    patientPreviousCovid19Infection,
    setpatientPreviousCovid19Infection
  ] = useState(null)
  const [
    patientPreviousAllergicReaction,
    setPatientPreviousAllergicReaction
  ] = useState('')
  const [attendantAtBirth, setAttendantAtBirth] = useState('')
  const [typeofBirth, setTypeofBirth] = useState('single')
  const [orderOfBirth, setOrderOfBirth] = useState(1)
  const [weightAtBirth, setWeightAtBirth] = useState('')
  const [heightAtBirth, setHeightAtBirth] = useState('')
  const [placeOfDelivery, setPlaceOfDelivery] = useState({})
  const [patientAddress, setPatientAddress] = useState({})
  const [patientOccupation, setPatientOccupation] = useState('')

  // Applicant (if other)
  const [applicantNationality, setApplicantNationality] = useState('GM')
  const [applicantNIN, setApplicantNIN] = useState('')
  const [applicantFirstName, setApplicantFirstName] = useState('')
  const [applicantMiddleName, setApplicantMiddleName] = useState('')
  const [applicantLastName, setApplicantLastName] = useState('')
  const [
    applicantResidentialAddress,
    setApplicantResidentialAddress
  ] = useState({})
  const [
    reasonNotApplyingMotherOrFather,
    setReasonNotApplyingMotherOrFather
  ] = useState('')
  const [primaryCaregiver, setPrimaryCaregiver] = useState('')

  // Mother
  const [motherFirstName, setMotherFirstName] = useState('')
  const [motherMiddleName, setMotherMiddleName] = useState('')
  const [motherLastName, setMotherLastName] = useState('')
  const [motherNationality, setMotherNationality] = useState('GM')
  const [motherNIN, setMotherNIN] = useState('')
  const [motherDateOfBirth, setMotherDateOfBirth] = useState(new Date())
  const [motherMaritalStatuts, setMotherMaritalStatuts] = useState('')
  const [motherOccupation, setMotherOccupation] = useState('')
  const [motherLevelOfEducation, setMotherLevelOfEducation] = useState('')
  const [motherChildrenBorn, setMotherChildrenBorn] = useState(1)
  const [motherFetalDeaths, setMotherFetalDeaths] = useState(0)
  const [motherPreviousLiveBirth, setMotherPreviousLiveBirth] = useState(
    new Date()
  )
  const [motherResidentialAddress, setMotherResidentialAddress] = useState('')
  const [motherCurrentAddress, setMotherCurrentAddress] = useState({})

  // Father
  const [fatherFirstName, setFatherFirstName] = useState('')
  const [fatherMiddleName, setFatherMiddleName] = useState('')
  const [fatherLastName, setFatherLastName] = useState('')
  const [fatherNationality, setFatherNationality] = useState('GM')
  const [fatherDateOfBirth, setFatherDateOfBirth] = useState(new Date())
  const [fatherMaritalStatus, setFatherMaritalStatus] = useState('')
  const [fatherOccupation, setFatherOccupation] = useState('')
  const [fatherLevelOfEducation, setFatherLevelOfEducation] = useState('')
  const [fatherResidentialAddress, setFatherResidentialAddress] = useState('')
  const [fatherNIN, setFatherNIN] = useState('')

  // Vaccination
  const [firstDoseDate, setFirstDoseDate] = useState(new Date())
  const [nameOfTheVaccine, setNameOfTheVaccine] = useState('')
  const [batchNumber, setBatchNumber] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
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

  // Errors
  const [errors, setErrors] = useState({})

  const validations = {
    // lastName: { required: true },
    // batchNumber: { required: true },
    // vaccinatorFullName: { required: true },
    // nameOfTheVaccine: { required: true }
  }

  const getProvincesOptions = () =>
    provinces
      .sort((i, j) => (i.name > j.name ? 1 : -1))
      .map(f => (
        <option key={f.id} value={f.id}>
          {f.name}
        </option>
      ))

  const getDistrictOptions = province =>
    districts
      .filter(d => d.partOf === `Location/${province}`)
      .sort((i, j) => (i.name > j.name ? 1 : -1))
      .map(f => (
        <option key={f.id} value={f.id}>
          {f.name}
        </option>
      ))

  const getNationalityOptions = () =>
    countries.map(i => <option value={i.code}>{i.name}</option>)

  const setLocationsOnState = locationsObject => {
    const locationsArray = Object.keys(locationsObject).map(k => ({
      id: locationsObject[k].id,
      name: locationsObject[k].name,
      partOf: locationsObject[k].partOf
    }))
    setProvinces(locationsArray.filter(l => l.partOf === 'Location/0'))
    setDistricts(locationsArray.filter(l => l.partOf !== 'Location/0'))
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
              name: offlineData.facilities[k].name,
              partOf: offlineData.facilities[k].partOf
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
    const object = {
      patient: patient.id ? patient.id : uuid(),
      bornInGambia,
      // informant,
      phoneNumber,
      firstName,
      lastName,
      middleName,
      baptismalName,
      NIN,
      myChildId,
      nationality,
      gender,
      dateOfBirth,
      placeOfWork,
      priorityGroups: patientPriorityGroups,
      preexistingConditions: patientPreexistingConditions,
      previousCovid19Infection: patientPreviousCovid19Infection,
      attendantAtBirth,
      placeOfDelivery,
      address: patientAddress,
      occupation: patientOccupation,
      vaccination: [
        {
          firstDoseDate,
          nameOfTheVaccine,
          batchNumber,
          serialNumber,
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
        }
      ],
      mother: {
        firstName: motherFirstName,
        middleName: motherMiddleName,
        lastName: motherLastName,
        dateOfBirth: motherDateOfBirth,
        nationality: motherNationality,
        NIN: motherNIN,
        residentialAddress: motherResidentialAddress
      },
      father: {
        firstName: fatherFirstName,
        middleName: fatherMiddleName,
        lastName: fatherLastName,
        dateOfBirth: fatherDateOfBirth,
        nationality: fatherNationality,
        NIN: fatherNIN,
        residentialAddress: fatherResidentialAddress
      }
    }

    const validationErrors = validate(object, validations)

    if (Object.keys(validationErrors).length < 1) {
      axios
        .post(url, object, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        })
        .then(setRedirect(true))
    }
    setErrors(validationErrors)
  }

  return (
    <div className="container two-columns">
      {redirect && <Redirect to="/immunization" />}
      <PatientData patient={patient} />
      <div className="register-form ui form">
        <h4 className="ui dividing header">Patient Born in Gambia</h4>
        <div className="inline fields">
          <div className="field">
            <div className="ui radio checkbox">
              <input
                type="radio"
                name="born-in-gambia"
                value={true}
                className="hidden"
                checked={bornInGambia}
                onChange={() => setBornInGambia(!bornInGambia)}
              />
              <label>Patient was born in The Gambia</label>
            </div>
          </div>
          <div className="field">
            <div className="ui radio checkbox">
              <input
                type="radio"
                name="born-in-gambia"
                value={false}
                className="hidden"
                checked={!bornInGambia}
                onChange={() => setBornInGambia(!bornInGambia)}
              />
              <label>Patient was NOT born in The Gambia</label>
            </div>
          </div>
        </div>
        <div className="two fields">
          <div className="ui field">
            <label>Contact Phone Number:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
        <h4 className="ui dividing header">Patient Data</h4>
        <div className="field">
          <label>Nationality</label>
          <select
            value={nationality}
            onChange={e => setNationality(e.target.value)}
          >
            {countries.map(i => (
              <option value={i.code}>{i.name}</option>
            ))}
          </select>
        </div>
        <div className="three fields">
          <div className="field">
            <label>National ID Number (NIN)</label>
            <input
              type="text"
              value={NIN}
              onChange={e => setNIN(e.target.value)}
            />
          </div>
          <div className="field">
            <label>MyChild ID</label>
            <input
              type="text"
              value={myChildId}
              onChange={e => setMyChildId(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Gender</label>
            <select value={gender} onChange={e => setGender(e.target.value)}>
              <option value={'M'}>Male</option>
              <option value={'F'}>Female</option>
              <option value="U">Unknown</option>
            </select>
          </div>
        </div>
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
            {errors.firstName && (
              <div className="error">{errors.firstName}</div>
            )}
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
            {errors.middleName && (
              <div className="error">{errors.middleName}</div>
            )}
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
            {errors.lastName && <div className="error">{errors.lastName}</div>}
          </div>
        </div>
        <div className="two fields">
          <div className="ui field">
            <label>Baptismal Name (if applicable)</label>
            <input
              type="text"
              value={baptismalName}
              onChange={e => setBaptismalName(e.target.value)}
            />
          </div>
        </div>
        <h5>Address</h5>
        <div className="two fields">
          <div className=" field">
            <label>Region</label>
            <select
              className="ui fluid dropdown"
              value={patientAddress.province}
              onChange={e =>
                setPatientAddress({
                  ...patientAddress,
                  province: e.target.value
                })
              }
            >
              <option></option>
              {getProvincesOptions()}
            </select>
            {errors.province && <div className="error">{errors.province}</div>}
          </div>
          {patientAddress.province && (
            <div className="field">
              <label>District</label>
              <select
                className="ui fluid dropdown"
                value={patientAddress.district}
                onChange={e =>
                  setPatientAddress({
                    ...patientAddress,
                    district: e.target.value
                  })
                }
              >
                <option></option>
                {getDistrictOptions(patientAddress.province)}
              </select>
              {errors.patientAddress && (
                <div className="error">{errors.patientAddress}</div>
              )}
            </div>
          )}
        </div>
        <div className="two fields">
          {patientAddress.district && (
            <div className="eight wide field">
              <label>City</label>
              <input
                type="text"
                value={patientAddress.city}
                onChange={e =>
                  setPatientAddress({
                    ...patientAddress,
                    city: e.target.value
                  })
                }
              />
              {errors.patientAddress && (
                <div className="error">{errors.patientAddress}</div>
              )}
            </div>
          )}
          {patientAddress.district && (
            <div className="eight wide field">
              <label>Compound</label>
              <input
                type="text"
                value={patientAddress.compound}
                onChange={e =>
                  setPatientAddress({
                    ...patientAddress,
                    compound: e.target.value
                  })
                }
              />
              {errors.patientAddress && (
                <div className="error">{errors.patientAddress}</div>
              )}
            </div>
          )}{' '}
        </div>
        {patientAddress.district && (
          <div className=" field">
            <label>Physical Address</label>
            <input
              type="text"
              value={patientAddress.address}
              onChange={e =>
                setPatientAddress({
                  ...patientAddress,
                  address: e.target.value
                })
              }
            />
          </div>
        )}{' '}
        <div className="two fields">
          <div className="ui field">
            <label>Date of Birth</label>
            <div className="datepicker-full">
              <DatePicker
                selected={dateOfBirth}
                onChange={date => setDateOfBirth(date)}
              />
            </div>
            {errors.dateOfBirth && (
              <div className="error">{errors.dateOfBirth}</div>
            )}
          </div>
        </div>
        <h5>Place of delivery</h5>
        <div className="inline fields">
          <div className="field">
            <div className="ui radio checkbox">
              <input
                type="radio"
                name="patient-address"
                value="facility"
                className="hidden"
                checked={placeOfDelivery.addressType === 'facility'}
                onChange={e =>
                  setPlaceOfDelivery({
                    ...placeOfDelivery,
                    addressType: e.target.value
                  })
                }
              />
              <label>Facility</label>
            </div>
          </div>
          <div className="field">
            <div className="ui radio checkbox">
              <input
                type="radio"
                name="patient-address"
                value="address"
                className="hidden"
                checked={placeOfDelivery.addressType === 'address'}
                onChange={e =>
                  setPlaceOfDelivery({
                    ...placeOfDelivery,
                    addressType: e.target.value
                  })
                }
              />
              <label>Other Address</label>
            </div>
          </div>
        </div>
        <div className="fields">
          <div className="four wide field">
            <label>Region</label>
            <select
              className="ui fluid dropdown"
              value={placeOfDelivery.province}
              onChange={e =>
                setPlaceOfDelivery({
                  ...placeOfDelivery,
                  province: e.target.value
                })
              }
            >
              <option></option>
              {getProvincesOptions()}
            </select>
            {errors.placeOfDelivery && (
              <div className="error">{errors.placeOfDelivery}</div>
            )}
          </div>
          {placeOfDelivery.province && (
            <div className="four wide field">
              <label>District</label>
              <select
                className="ui fluid dropdown"
                value={placeOfDelivery.district}
                onChange={e =>
                  setPlaceOfDelivery({
                    ...placeOfDelivery,
                    district: e.target.value
                  })
                }
              >
                <option></option>
                {getDistrictOptions(placeOfDelivery.province)}
              </select>
            </div>
          )}
          {placeOfDelivery.district &&
            placeOfDelivery.addressType !== 'facility' && (
              <div className="eight wide field">
                <label>Place</label>
                <input
                  type="text"
                  value={placeOfDelivery.place}
                  onChange={e =>
                    setPlaceOfDelivery({
                      ...placeOfDelivery,
                      place: e.target.value
                    })
                  }
                />
                {errors.place && <div className="error">{errors.place}</div>}
              </div>
            )}
          {placeOfDelivery.district &&
            placeOfDelivery.addressType === 'facility' && (
              <div className="eight wide field">
                <label>Facility</label>
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
            )}
        </div>
        <div className="two fields">
          <div className="field">
            <label>Place of Work</label>
            <input
              type="text"
              value={placeOfWork}
              onChange={e => setPlaceOfWork(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Occupation</label>
            <input
              type="text"
              value={patientOccupation}
              onChange={e => setPatientOccupation(e.target.value)}
            />
          </div>
        </div>
        <div className="two fields">
          <div className="field">
            <label>
              COVID19 Priority group, select one or more of the Following
            </label>
            <Select
              defaultValue={[]}
              isMulti
              name="priority-group"
              options={priorityGroups}
              value={patientPriorityGroups}
              onChange={sel => setPatientPriorityGroups(sel)}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
          <div className="field">
            <label>
              Pre-existing conditions, select one or more of the Following
            </label>
            <Select
              defaultValue={[]}
              isMulti
              value={patientPreexistingConditions}
              onChange={sel => setPatientPreexistingConditions(sel)}
              name="priority-group"
              options={preexistingConditions}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
        </div>
        <div className="two fields">
          <div className="field">
            <label>History of COVID19 Infection (Date, if infection)</label>
            <DatePicker
              selected={patientPreviousCovid19Infection}
              onChange={date => setpatientPreviousCovid19Infection(date)}
            />
          </div>
          <div className="field">
            <label>Previous Allergic Reaction</label>
            <select
              selected={patientPreviousAllergicReaction}
              onChange={e => setPatientPreviousAllergicReaction(e.target.value)}
            >
              <option value="minor">Yes, minor</option>
              <option value="severe">Yes, severe (anaphylaxis)</option>
              <option value="">No</option>
            </select>
          </div>
        </div>
        <h4 className="ui dividing header">Mother's data</h4>
        <div className="three fields">
          <div className="ui field">
            <label>First Name</label>
            <input
              type="text"
              name="first-name"
              value={motherFirstName}
              required
              onChange={e => setMotherFirstName(e.target.value)}
              placeholder="First Name"
            />
            {errors.motherFirstName && (
              <div className="error">{errors.motherFirstName}</div>
            )}
          </div>
          <div className="ui field">
            <label>Middle Name</label>
            <input
              type="text"
              name="last-name"
              value={motherMiddleName}
              onChange={e => setMotherMiddleName(e.target.value)}
              placeholder="Middle Name"
            />
            {errors.motherMiddleName && (
              <div className="error">{errors.motherMiddleName}</div>
            )}
          </div>
          <div className="ui field">
            <label>Last Name</label>
            <input
              type="text"
              name="last-name"
              value={motherLastName}
              required
              onChange={e => setMotherLastName(e.target.value)}
              placeholder="Last Name"
            />
            {errors.motherLastName && (
              <div className="error">{errors.motherLastName}</div>
            )}
          </div>
        </div>
        <div className="two fields">
          <div className="ui field">
            <label>Date of Birth</label>
            <div className="datepicker-full">
              <DatePicker
                selected={motherDateOfBirth}
                onChange={date => setMotherDateOfBirth(date)}
              />
            </div>
            {errors.motherDateOfBirth && (
              <div className="error">{errors.motherDateOfBirth}</div>
            )}
          </div>
        </div>
        <div className="two fields">
          <div className="field">
            <label>Nationality</label>
            <select
              value={motherNationality}
              onChange={e => setMotherNationality(e.target.value)}
            >
              {getNationalityOptions()}
            </select>
          </div>
          <div className="field">
            <label>NIN</label>
            <input
              type="text"
              value={motherNIN}
              onChange={e => setMotherNIN(e.target.value)}
            />
          </div>
        </div>
        <div class="field">
          <label>Place of usual residence</label>
          <textarea
            value={motherResidentialAddress}
            onChange={e => setMotherResidentialAddress(e.target.value)}
          ></textarea>
        </div>
        <h4 className="ui dividing header">Father's data</h4>
        <div className="three fields">
          <div className="ui field">
            <label>First Name</label>
            <input
              type="text"
              name="first-name"
              value={fatherFirstName}
              required
              onChange={e => setFatherFirstName(e.target.value)}
              placeholder="First Name"
            />
            {errors.fatherFirstName && (
              <div className="error">{errors.fatherFirstName}</div>
            )}
          </div>
          <div className="ui field">
            <label>Middle Name</label>
            <input
              type="text"
              name="last-name"
              value={fatherMiddleName}
              onChange={e => setFatherMiddleName(e.target.value)}
              placeholder="Middle Name"
            />
            {errors.fatherMiddleName && (
              <div className="error">{errors.fatherMiddleName}</div>
            )}
          </div>
          <div className="ui field">
            <label>Last Name</label>
            <input
              type="text"
              name="last-name"
              value={fatherLastName}
              required
              onChange={e => setFatherLastName(e.target.value)}
              placeholder="Last Name"
            />
            {errors.fatherLastName && (
              <div className="error">{errors.fatherLastName}</div>
            )}
          </div>
        </div>
        <div className="two fields">
          <div className="ui field">
            <label>Date of Birth</label>
            <div className="datepicker-full">
              <DatePicker
                selected={fatherDateOfBirth}
                onChange={date => setFatherDateOfBirth(date)}
              />
            </div>
            {errors.fatherDateOfBirth && (
              <div className="error">{errors.fatherDateOfBirth}</div>
            )}
          </div>
        </div>
        <div className="two fields">
          <div className="field">
            <label>Nationality</label>
            <select
              value={fatherNationality}
              onChange={e => setFatherNationality(e.target.value)}
            >
              {getNationalityOptions()}
            </select>
          </div>
          <div className="field">
            <label>NIN</label>
            <input
              type="text"
              value={fatherNIN}
              onChange={e => setFatherNIN(e.target.value)}
            />
          </div>
        </div>
        <div class="field">
          <label>Place of usual residence</label>
          <textarea
            value={fatherResidentialAddress}
            onChange={e => setFatherResidentialAddress(e.target.value)}
          ></textarea>
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
            {errors.firstDoseDate && (
              <div className="error">{errors.firstDoseDate}</div>
            )}
          </div>
          <div className="ui field">
            <label>Date of Next Visit (2nd Dose)</label>
            <div className="datepicker-full">
              <DatePicker
                selected={dateOfNextVisit}
                onChange={date => setDateOfNextVisit(date)}
              />
            </div>
            {errors.dateOfNextVisit && (
              <div className="error">{errors.dateOfNextVisit}</div>
            )}
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
            {errors.nameOfTheVaccine && (
              <div className="error">{errors.nameOfTheVaccine}</div>
            )}
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
            {errors.batchNumber && (
              <div className="error">{errors.batchNumber}</div>
            )}
          </div>
          <div className="ui field">
            <label>Serial Number</label>
            <input
              type="text"
              name="last-name"
              value={serialNumber}
              required
              onChange={e => setSerialNumber(e.target.value)}
              placeholder="Serial Number"
            ></input>
            {errors.serialNumber && (
              <div className="error">{errors.serialNumber}</div>
            )}
          </div>
          <div className="ui field">
            <label>Expiry Date</label>
            <div className="datepicker-full">
              <DatePicker
                selected={expirydate}
                onChange={date => setExpirydate(date)}
              />
            </div>
            {errors.expirydate && (
              <div className="error">{errors.expirydate}</div>
            )}
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
          {errors.vaccinatorFullName && (
            <div className="error">{errors.vaccinatorFullName}</div>
          )}
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
        <div className="fields">
          <div className="four wide field">
            <label>Region</label>
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
            {errors.province && <div className="error">{errors.province}</div>}
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
              {errors.district && (
                <div className="error">{errors.district}</div>
              )}
            </div>
          )}
          {district && addressType !== 'facility' && (
            <div className="eight wide field">
              <label>Place</label>
              <input
                type="text"
                value={place}
                onChange={e => setPlace(e.target.value)}
              />
              {errors.place && <div className="error">{errors.place}</div>}
            </div>
          )}
          {district && addressType === 'facility' && (
            <div className="eight wide field">
              <label>Facility</label>
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
              {errors.facility && (
                <div className="error">{errors.facility}</div>
              )}
            </div>
          )}
        </div>
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
