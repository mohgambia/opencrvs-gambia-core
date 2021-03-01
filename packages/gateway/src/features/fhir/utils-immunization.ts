import { v4 as uuid } from 'uuid'
import { ITemplatedBundle } from '@gateway/features/registration/fhir-builders'
import {
  findCompositionSectionInBundle,
  selectOrCreateEncounterResource
} from './utils'

/**
 * Vaccionation resource
 * Alfonso Tienda <afoone@hotmail.com>
 */
export function selectOrCreateInmunizationResource(
  sectionCode: string,
  vaccinationDate: string,
  fhirBundle: ITemplatedBundle,
  context: any
): fhir.Immunization {
  console.log("fhirBundle", )
  let immunization = fhirBundle.entry.find(entry => {
    if (
      !entry ||
      !entry.resource ||
      entry.resource.resourceType !== 'Immunization'
    ) {
      return false
    }
    const immunizationEntry = entry.resource as fhir.Immunization
    const imCoding =
      immunizationEntry.date &&
      immunizationEntry.date === vaccinationDate
    if (imCoding) {
      return true
    }
    return false
  })

  if (immunization) {
    return immunization.resource as fhir.Immunization
  }
  /* Existing obseration not found for given type */
  immunization = createImmunizationResource(
    sectionCode,
    fhirBundle,
    context
  )
  return updateImmunizationInfo(
    immunization as fhir.Immunization,
    vaccinationDate,
  )
}

export function createImmunizationResource(
  sectionCode: string,
  fhirBundle: ITemplatedBundle,
  context: any
): fhir.Immunization {
  const encounter = selectOrCreateEncounterResource(fhirBundle, context)
  console.log("encounter", encounter)
  const section = findCompositionSectionInBundle(sectionCode, fhirBundle)
  console.log("section", section)

  const ref = uuid()
  const immunizationEntry = createImmunizationEntryTemplate(ref)
  if (!section || !section.entry || !section.entry[0]) {
    throw new Error('Expected encounter section to exist and have an entry')
  }
  const encounterSectionEntry = section.entry[0]
  const encounterEntry = fhirBundle.entry.find(
    entry => entry.fullUrl === encounterSectionEntry.reference
  )
  //  COVID19 VACCINE
  const covid19Coding = {
    coding: [
      {
        system: 'http://snomed.info/sct',
        code: '840534001',
        display: 'Severe acute respiratory syndrome coronavirus 2 vaccination'
      },
      {
        system: 'http://www.whocc.no/atc',
        code: 'J07B',
        display: 'VIRAL VACCINES'
      }
    ]
  }
  immunizationEntry.resource.vaccineCode = covid19Coding

  if (encounterEntry && encounter) {
    immunizationEntry.resource.encounter = encounterEntry
  }
  fhirBundle.entry.push(immunizationEntry)

  return immunizationEntry.resource
}

export function createImmunizationEntryTemplate(refUuid: string) {
  return {
    fullUrl: `urn:uuid:${refUuid}`,
    resource: {
      resourceType: 'Immunization',
      status: 'final'
    } as fhir.Immunization
  }
}

export function updateImmunizationInfo(
  immunization: fhir.Immunization,
  vaccinationDate: string,
): fhir.Immunization {
  const covid19Coding = {
    coding: [
      {
        system: 'http://snomed.info/sct',
        code: '840534001',
        display: 'Severe acute respiratory syndrome coronavirus 2 vaccination'
      }
    ]
  }

  immunization.date = vaccinationDate
  immunization.vaccinationProtocol = [
    {
      seriesDoses: 2,
      targetDisease: [covid19Coding],
      doseStatus: {
        coding: [
          {
            code: 'valid'
          }
        ]
      }
    }
  ]

  // setArrayPropInResourceObject(immunization, 'code', coding, 'coding')
  return immunization
}
