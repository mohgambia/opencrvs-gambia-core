import {
  ExecutorKey,
  IEventWiseKey,
  Condition,
  ConditionOperation
} from '@client/pdfRenderer/transformer/types'
import {
  Event,
  IFormData,
  IFormSectionData,
  IFormFieldValue
} from '@opencrvs/client/src/forms'
import { IApplication } from '@client/applications'
import { MessageDescriptor } from 'react-intl'

const eventMessageDescriptor = {
  [Event.BIRTH]: {
    defaultMessage: 'Birth',
    description: 'A label from the birth event',
    id: 'constants.birth'
  },
  [Event.DEATH]: {
    defaultMessage: 'Death',
    description: 'A label from the death event',
    id: 'constants.death'
  }
}
export function getValueFromApplicationDataByKey(
  data: IFormData,
  valueKey: string
) {
  const keyTree: string[] = valueKey.split('.')

  let valueObject: IFormSectionData | IFormFieldValue | null = null

  try {
    keyTree.forEach(keyNode => {
      valueObject =
        valueObject === null
          ? data[keyNode]
          : (valueObject as IFormSectionData)[keyNode]
    })
  } catch (error) {
    throw new Error(`Given value key structure is not valid: ${valueKey}`)
  }
  if (valueObject === null) {
    throw new Error(`Given value key structure is not valid: ${valueKey}`)
  }
  return valueObject
}

export function getEventMessageDescription(event: Event): MessageDescriptor {
  return eventMessageDescriptor[event]
}

export function getExecutorKeyValue(key: ExecutorKey) {
  if (key === 'CURRENT_DATE') {
    return Date.now()
  }
  throw new Error('Invalid executor key found')
}

export function getExecutorFieldValue(
  key: ExecutorKey | IEventWiseKey,
  application: IApplication
) {
  let value = null
  if (typeof key === 'string') {
    value = getExecutorKeyValue(key as ExecutorKey)
  } else {
    value = getValueFromApplicationDataByKey(
      application.data,
      (key as IEventWiseKey)[application.event]
    )
  }
  return value
}

function executeConditionalOperation(
  operation: ConditionOperation,
  conditionInputs: string[],
  value: string
) {
  switch (operation) {
    case ConditionOperation.DOES_NOT_MATCH:
      return !conditionInputs.includes(value)
    default:
      return conditionInputs.includes(value)
  }
}

function getConditionalOperationEnumByValue(value: string | undefined) {
  if (!value) {
    return ConditionOperation.MATCH
  }
  return ConditionOperation[value as keyof typeof ConditionOperation]
}

export function getMatchedCondition(
  conditions: Condition[],
  applicationData: IFormData
) {
  return conditions.find(conditionObj => {
    try {
      if (!conditionObj.condition) {
        return true
      }
      return executeConditionalOperation(
        getConditionalOperationEnumByValue(conditionObj.condition.operation),
        conditionObj.condition.values,
        // Will throw an exception when value is not found for given key
        getValueFromApplicationDataByKey(
          applicationData,
          conditionObj.condition.key || ''
        )
      )
    } catch (error) {
      console.info(`FOR_INFO_ONLY: ${error}`)
      return false
    }
  })
}
