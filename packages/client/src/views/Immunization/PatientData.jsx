import React from 'react'
import './styles/card.css'
import './styles/icons.css'
import { getFullName, getIdentifiers } from './ImmunizationList'

const PatientData = ({ patient }) => {
  console.log('patient', patient)
  return (
    <div>
      <div className="ui card">
        <div className="image">
          <img
            src={
              patient.gender === 'male'
                ? 'http://www.multimediaenglish.org/wp-content/uploads/2011/11/MysteryMan.jpg'
                : 'https://www.citycentrerecruitment.co.uk/wp-content/uploads/2019/03/mystery-woman.jpg'
            }
          />
        </div>
        <div className="content">
          <a className="header">{patient.name && getFullName(patient.name)}</a>
          <div className="meta">
            <span className="date">Birth Date: {patient.birthDate}</span>
          </div>
          <div className="description"></div>
        </div>
        <div className="extra content">
          {patient && getIdentifiers(patient.identifier)}
        </div>
      </div>
    </div>
  )
}

export default PatientData
