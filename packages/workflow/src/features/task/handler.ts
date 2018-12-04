import * as Hapi from 'hapi'
import fetch from 'node-fetch'
import { fhirUrl } from 'src/constants'
import { modifyTaskBundle } from './fhir/fhir-bundle-modifier'
import { getEntryId } from 'src/features/registration/fhir/fhir-utils'
import { getToken } from 'src/utils/authUtils'
import { logger } from 'src/logger'

export default async function updateTaskHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  try {
    const payload = modifyTaskBundle(
      request.payload as fhir.Bundle,
      getToken(request)
    )
    const taskId = getEntryId(payload)
    if (
      !payload ||
      !payload.entry ||
      !payload.entry[0] ||
      !payload.entry[0].resource
    ) {
      throw new Error('Task has no entry')
    }
    const res = await fetch(`${fhirUrl}/Task/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(payload.entry[0].resource),
      headers: {
        'Content-Type': 'application/fhir+json'
      }
    })
    if (!res.ok) {
      throw new Error(
        `FHIR put to /fhir failed with [${
          res.status
        }] body: ${await res.text()}`
      )
    }
    /* returning the newly created tracking id */
    return { taskId }
  } catch (error) {
    logger.error(`Workflow/updateTaskHandler: error: ${error}`)
    throw new Error(error)
  }
}
