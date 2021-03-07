import { v4 as uuid } from 'uuid'
import { ITemplatedBundle } from '@gateway/features/registration/fhir-builders'

/**
 * Organization resource
 * Alfonso Tienda <afoone@hotmail.com>
 */
export function selectOrCreateOrganizationResource(
  manufacturer: string,
  fhirBundle: ITemplatedBundle,
  context: any
): fhir.Organization {
  let organization = fhirBundle.entry.find(entry => {
    if (
      !entry ||
      !entry.resource ||
      entry.resource.resourceType !== 'Organization'
    ) {
      return false
    }
    const organizationEntry = entry.resource as fhir.Organization
    const imCoding =
      organizationEntry.name && organizationEntry.name === manufacturer
    if (imCoding) {
      return true
    }
    return false
  })

  if (organization) {
    return organization.resource as fhir.Organization
  }
  organization = createOrganizationResource(manufacturer, fhirBundle, context)
  return updateOrganizationInfo(organization as fhir.Organization, manufacturer)
}

export function createOrganizationResource(
  manufacturer: string,
  fhirBundle: ITemplatedBundle,
  context: any
): fhir.Organization {
  const ref = uuid()
  const organizationEntry = createOrganizationEntryTemplate(ref)
  organizationEntry.resource.name = manufacturer
  fhirBundle.entry.push(organizationEntry)
  return organizationEntry.resource
}

export function createOrganizationEntryTemplate(refUuid: string) {
  return {
    fullUrl: `urn:uuid:${refUuid}`,
    resource: {
      resourceType: 'Organization',
      status: 'final',
      id:refUuid
    } as fhir.Organization
  }
}

export function updateOrganizationInfo(
  organization: fhir.Organization,
  manufacturer: string
): fhir.Organization {
  organization.name = manufacturer
  return organization
}
