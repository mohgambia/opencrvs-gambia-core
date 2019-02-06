import {
  IFormSection,
  ViewType,
  DATE,
  SELECT_WITH_OPTIONS,
  SUBSECTION,
  RADIO_GROUP,
  SELECT_WITH_DYNAMIC_OPTIONS,
  TEXT,
  NUMBER
} from 'src/forms'
import { defineMessages } from 'react-intl'
import { dateFormat } from 'src/utils/validate'

import { messages as addressMessages } from '../../../address'
import { countries } from 'src/forms/countries'
import { conditionals } from 'src/forms/utils'
import { OFFLINE_LOCATIONS_KEY } from 'src/offline/reducer'

const messages = defineMessages({
  deathEventTab: {
    id: 'register.form.tabs.deathEventTab',
    defaultMessage: 'Event',
    description: 'Tab title for Death Event'
  },
  deathEventTitle: {
    id: 'register.form.section.deathEventTitle',
    defaultMessage: 'Event details',
    description: 'Form section title for Death Event'
  },
  deathDate: {
    id: 'formFields.deathDate',
    defaultMessage: 'Date of Occurrence',
    description: 'Label for form field: Date of occurrence'
  },
  manner: {
    id: 'formFields.manner',
    defaultMessage: 'Manner of Death',
    description: 'Label for form field: Manner of death'
  },
  mannerNatural: {
    id: 'formFields.mannerNatural',
    defaultMessage: 'Natural causes',
    description: 'Option for form field: Manner of death'
  },
  mannerAccident: {
    id: 'formFields.mannerAccident',
    defaultMessage: 'Accident',
    description: 'Option for form field: Manner of death'
  },
  mannerSuicide: {
    id: 'formFields.mannerSuicide',
    defaultMessage: 'Suicide',
    description: 'Option for form field: Manner of death'
  },
  mannerHomicide: {
    id: 'formFields.mannerHomicide',
    defaultMessage: 'Homicide',
    description: 'Option for form field: Manner of death'
  },
  mannerUndetermined: {
    id: 'formFields.mannerUndetermined',
    defaultMessage: 'Manner undetermined',
    description: 'Option for form field: Manner of death'
  },
  deathPlace: {
    id: 'formFields.deathPlace',
    defaultMessage: 'Place of Occurrence of Death',
    description: 'Title for place of occurrence of death'
  },
  deathPlaceAddress: {
    id: 'formFields.deathPlaceAddress',
    defaultMessage: 'Where did the death occur?',
    description: 'Label for form field: Place of occurrence of death'
  },
  deathPlaceAddressSameAsPermanent: {
    id: 'formFields.deathPlaceAddressSameAsPermanent',
    defaultMessage: 'Permanent address of the deceased',
    description: 'Option for form field: Place of occurrence of death'
  },
  deathPlaceAddressSameAsCurrent: {
    id: 'formFields.deathPlaceAddressSameAsCurrent',
    defaultMessage: 'Current address of the deceased',
    description: 'Option for form field: Place of occurrence of death'
  },
  deathPlaceAddressOther: {
    id: 'formFields.deathPlaceAddressOther',
    defaultMessage: 'Different Address',
    description: 'Option for form field: Place of occurrence of death'
  },
  deathPlaceAddressType: {
    id: 'formFields.deathPlaceAddressType',
    defaultMessage: 'Type of Place',
    description: 'Label for form field: Type of place of death occurrence'
  },
  hospital: {
    id: 'formFields.hospital',
    defaultMessage: 'Hospital',
    description: 'Select item for hospital'
  },
  otherHealthInstitution: {
    id: 'formFields.otherHealthInstitution',
    defaultMessage: 'Other Health Institution',
    description: 'Select item for Other Health Institution'
  },
  privateHome: {
    id: 'formFields.privateHome',
    defaultMessage: 'Private Home',
    description: 'Select item for Private Home'
  },
  otherInstitution: {
    id: 'formFields.otherInstitution',
    defaultMessage: 'Other Institution',
    description: 'Select item for Other Institution'
  }
})

export const eventSection: IFormSection = {
  id: 'deathEvent',
  viewType: 'form' as ViewType,
  name: messages.deathEventTab,
  title: messages.deathEventTitle,
  fields: [
    {
      name: 'deathDate',
      type: DATE,
      label: messages.deathDate,
      required: true,
      initialValue: '',
      validate: [dateFormat]
    },
    {
      name: 'manner',
      type: SELECT_WITH_OPTIONS,
      label: messages.manner,
      required: false,
      initialValue: '',
      validate: [],
      options: [
        { value: 'NATURAL_CAUSES', label: messages.mannerNatural },
        { value: 'ACCIDENT', label: messages.mannerAccident },
        {
          value: 'SUICIDE',
          label: messages.mannerSuicide
        },
        {
          value: 'HOMICIDE',
          label: messages.mannerHomicide
        },
        {
          value: 'MANNER_UNDETERMINED',
          label: messages.mannerUndetermined
        }
      ]
    },
    {
      name: 'deathPlace',
      type: SUBSECTION,
      label: messages.deathPlace,
      initialValue: '',
      required: true,
      validate: []
    },
    {
      name: 'deathPlaceAddress',
      type: RADIO_GROUP,
      label: messages.deathPlaceAddress,
      required: true,
      initialValue: '',
      validate: [],
      options: [
        {
          value: 'sameAsPermanent',
          label: messages.deathPlaceAddressSameAsPermanent
        },
        {
          value: 'sameAsCurrent',
          label: messages.deathPlaceAddressSameAsCurrent
        },
        { value: 'other', label: messages.deathPlaceAddressOther }
      ],
      conditionals: []
    },
    {
      name: 'addressType',
      type: SELECT_WITH_OPTIONS,
      label: messages.deathPlaceAddressType,
      required: false,
      initialValue: '',
      validate: [],
      options: [
        { value: 'HOSPITAL', label: messages.hospital },
        {
          value: 'OTHER_HEALTH_INSTITUTION',
          label: messages.otherHealthInstitution
        },
        { value: 'PRIVATE_HOME', label: messages.privateHome },
        { value: 'OTHER', label: messages.otherInstitution }
      ],
      conditionals: [conditionals.deathPlaceOther]
    },
    {
      name: 'country',
      type: SELECT_WITH_OPTIONS,
      label: addressMessages.country,
      required: true,
      initialValue: window.config.COUNTRY.toUpperCase(),
      validate: [],
      options: countries,
      conditionals: [conditionals.deathPlaceOther]
    },
    {
      name: 'state',
      type: SELECT_WITH_DYNAMIC_OPTIONS,
      label: addressMessages.state,
      required: true,
      initialValue: '',
      validate: [],
      dynamicOptions: {
        resource: OFFLINE_LOCATIONS_KEY,
        dependency: 'country'
      },
      conditionals: [conditionals.country, conditionals.deathPlaceOther]
    },
    {
      name: 'district',
      type: SELECT_WITH_DYNAMIC_OPTIONS,
      label: addressMessages.district,
      required: true,
      initialValue: '',
      validate: [],
      dynamicOptions: {
        resource: OFFLINE_LOCATIONS_KEY,
        dependency: 'state'
      },
      conditionals: [
        conditionals.country,
        conditionals.state,
        conditionals.deathPlaceOther
      ]
    },
    {
      name: 'addressLine4',
      type: SELECT_WITH_DYNAMIC_OPTIONS,
      label: addressMessages.addressLine4,
      required: true,
      initialValue: '',
      validate: [],
      dynamicOptions: {
        resource: OFFLINE_LOCATIONS_KEY,
        dependency: 'district'
      },
      conditionals: [
        conditionals.country,
        conditionals.state,
        conditionals.district,
        conditionals.deathPlaceOther
      ]
    },
    {
      name: 'addressLine3',
      type: SELECT_WITH_DYNAMIC_OPTIONS,
      label: addressMessages.addressLine3,
      required: true,
      initialValue: '',
      validate: [],
      dynamicOptions: {
        resource: OFFLINE_LOCATIONS_KEY,
        dependency: 'addressLine4'
      },
      conditionals: [
        conditionals.country,
        conditionals.state,
        conditionals.district,
        conditionals.addressLine4,
        conditionals.deathPlaceOther
      ]
    },
    {
      name: 'addressLine2',
      type: TEXT,
      label: addressMessages.addressLine2,
      required: false,
      initialValue: '',
      validate: [],
      conditionals: [
        conditionals.country,
        conditionals.state,
        conditionals.district,
        conditionals.addressLine4,
        conditionals.addressLine3,
        conditionals.deathPlaceOther
      ]
    },
    {
      name: 'addressLine1',
      type: TEXT,
      label: addressMessages.addressLine1,
      required: true,
      initialValue: '',
      validate: [],
      conditionals: [
        conditionals.country,
        conditionals.state,
        conditionals.district,
        conditionals.addressLine4,
        conditionals.addressLine3,
        conditionals.deathPlaceOther
      ]
    },
    {
      name: 'postCode',
      type: NUMBER,
      label: addressMessages.postCode,
      required: false,
      initialValue: '',
      validate: [],
      conditionals: [
        conditionals.country,
        conditionals.state,
        conditionals.district,
        conditionals.addressLine4,
        conditionals.addressLine3,
        conditionals.deathPlaceOther
      ]
    }
  ]
}