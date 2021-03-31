import React from 'react'
import { storage } from '@client/storage'
import { countries } from '../extraData/countries'

storage.getItem('USER_DETAILS').then(res => console.log(JSON.parse(res)))
export let facilities = []
export let provinces = []
export let districts = []

const filterLocations = locationsObject => {
  const locationsArray = Object.keys(locationsObject).map(k => ({
    id: locationsObject[k].id,
    name: locationsObject[k].name,
    partOf: locationsObject[k].partOf
  }))
  provinces = locationsArray.filter(l => l.partOf === 'Location/0')
  districts = locationsArray.filter(l => l.partOf !== 'Location/0')
}

export const getProvincesOptions = () =>
  provinces
    .sort((i, j) => (i.name > j.name ? 1 : -1))
    .map(f => (
      <option key={f.id} value={f.id}>
        {f.name}
      </option>
    ))

export const getDistrictOptions = province =>
  districts
    .filter(d => d.partOf === `Location/${province}`)
    .sort((i, j) => (i.name > j.name ? 1 : -1))
    .map(f => (
      <option key={f.id} value={f.id}>
        {f.name}
      </option>
    ))

export const getNationalityOptions = () =>
  countries.map(i => (
    <option key={i.code} value={i.code}>
      {i.name}
    </option>
  ))

export const getFacilitiesOptions = () => {
  return facilities
    .sort((i, j) => (i.name > j.name ? 1 : -1))
    .map(f => (
      <option key={f.id} value={f.id}>
        {f.name}
      </option>
    ))
}

const getFromStorage = () => {
  storage.getItem('offline').then(res => {
    const offlineData = JSON.parse(res)
    console.log(offlineData)
    facilities = Object.keys(offlineData.facilities).map(k => ({
      id: offlineData.facilities[k].id,
      name: offlineData.facilities[k].name,
      partOf: offlineData.facilities[k].partOf
    }))
    filterLocations(offlineData.locations)
  })
}

getFromStorage()
