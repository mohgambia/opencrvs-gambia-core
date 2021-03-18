import { v4 as uuid } from 'uuid'
import { ITemplatedBundle } from '@gateway/features/registration/fhir-builders'

/**
 * Practitioner resource
 * Alfonso Tienda <afoone@hotmail.com>
 */
export function selectOrCreatePractitionerResource(
  practitionerName: string,
  fhirBundle: ITemplatedBundle,
  context: any
): fhir.ImmunizationPractitioner {
  let Practitioner = fhirBundle.entry.find(entry => {
    if (
      !entry ||
      !entry.resource ||
      entry.resource.resourceType !== 'Practitioner'
    ) {
      return false
    }
    const PractitionerEntry = entry.resource as fhir.ImmunizationPractitioner
    const imCoding =
      PractitionerEntry.role &&
      PractitionerEntry.role.text &&
      PractitionerEntry.role.text === practitionerName
    if (imCoding) {
      return true
    }
    return false
  })

  if (Practitioner) {
    return Practitioner.resource as fhir.ImmunizationPractitioner
  }
  Practitioner = createPractitionerResource(
    practitionerName,
    fhirBundle,
    context
  )
  return updatePractitionerInfo(
    Practitioner as fhir.ImmunizationPractitioner,
    practitionerName
  )
}

export function createPractitionerResource(
  practitionerName: string,
  fhirBundle: ITemplatedBundle,
  context: any
): fhir.Practitioner {
  const ref = uuid()
  const PractitionerEntry = createPractitionerEntryTemplate(ref)
  PractitionerEntry.resource.role = {
    text: practitionerName
  }

  fhirBundle.entry.push(PractitionerEntry)
  return PractitionerEntry.resource
}

export function createPractitionerEntryTemplate(refUuid: string) {
  return {
    fullUrl: `urn:uuid:${refUuid}`,
    resource: {
      resourceType: 'ImmunizationPractitioner',
      status: 'final',
      id: refUuid,
      actor: '',
      role: {
      }
    } as fhir.ImmunizationPractitioner
  }
}

export function updatePractitionerInfo(
  Practitioner: fhir.ImmunizationPractitioner,
  practitionerName: string
): fhir.ImmunizationPractitioner {
  Practitioner.role = {
    text: practitionerName
  }
  return Practitioner
}
