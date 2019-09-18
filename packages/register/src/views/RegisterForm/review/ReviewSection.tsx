import * as React from 'react'
import {
  DocumentViewer,
  IDocumentViewerOptions,
  DataSection
} from '@opencrvs/components/lib/interface'
import styled from '@register/styledComponents'
import {
  IApplication,
  writeApplication,
  SUBMISSION_STATUS,
  IPayload
} from '@register/applications'
import { connect } from 'react-redux'
import { IStoreState } from '@register/store'
import {
  getRegisterForm,
  getBirthSection
} from '@register/forms/register/application-selectors'
import { EditConfirmation } from '@register/views/RegisterForm/review/EditConfirmation'
import {
  getConditionalActionsForField,
  getVisibleSectionGroupsBasedOnConditions,
  getSectionFields
} from '@register/forms/utils'
import { flatten, isArray } from 'lodash'
import { getValidationErrorsForForm } from '@register/forms/validation'
import { goToPageGroup } from '@register/navigation'

import {
  ISelectOption as SelectComponentOptions,
  TextArea,
  InputField
} from '@opencrvs/components/lib/forms'

import { getScope } from '@register/profile/profileSelectors'
import { Scope } from '@register/utils/authUtils'
import { getOfflineData } from '@register/offline/selectors'
import {
  OFFLINE_LOCATIONS_KEY,
  OFFLINE_FACILITIES_KEY,
  ILocation,
  IOfflineData
} from '@register/offline/reducer'
import { getLanguage } from '@register/i18n/selectors'
import {
  WrappedComponentProps as IntlShapeProps,
  injectIntl,
  IntlShape,
  MessageDescriptor
} from 'react-intl'
import { LinkButton } from '@opencrvs/components/lib/buttons'
import {
  IForm,
  IFormSection,
  IFormField,
  IFileValue,
  IFormFieldValue,
  LIST,
  PARAGRAPH,
  SELECT_WITH_OPTIONS,
  SELECT_WITH_DYNAMIC_OPTIONS,
  ISelectOption,
  IDynamicOptions,
  IFormSectionData,
  WARNING,
  DATE,
  TEXTAREA,
  Event,
  Section,
  BirthSection,
  IFormTag,
  IFormSectionGroup,
  SEARCH_FIELD
} from '@register/forms'
import { formatLongDate } from '@register/utils/date-formatting'
import { messages } from '@register/i18n/messages/views/review'
import { buttonMessages } from '@register/i18n/messages'
import { REJECTED, BIRTH } from '@register/utils/constants'
import { ReviewHeader } from './ReviewHeader'
import { getDraftApplicantFullName } from '@register/utils/draftUtils'
import { ReviewAction } from '@register/components/form/ReviewActionComponent'
import { findDOMNode } from 'react-dom'
import { isMobileDevice } from '@register/utils/commonUtils'
import { FullBodyContent } from '@opencrvs/components/lib/layout'
import {
  birthSectionMapping,
  birthSectionTitle
} from '@register/forms/register/fieldMappings/birth/mutation/documents-mappings'
import {
  deathSectionMapping,
  deathSectionTitle
} from '@register/forms/register/fieldMappings/death/mutation/documents-mappings'
import { getDefaultLanguage } from '@register/i18n/utils'
import { IValidationResult } from '@register/utils/validate'
import { IDynamicValues } from '@opencrvs/components/lib/common-types'

const RequiredField = styled.span`
  color: ${({ theme }) => theme.colors.error};
  text-transform: lowercase;
`
const Row = styled.div`
  display: flex;
  flex: 1;
  @media (max-width: ${({ theme }) => theme.grid.breakpoints.lg}px) {
    flex-direction: column;
  }
`
const Column = styled.div`
  width: 50%;
  margin: 0px 15px;

  &:first-child {
    margin-left: 0px;
  }
  &:last-child {
    margin-right: 0px;
  }

  @media (max-width: ${({ theme }) => theme.grid.breakpoints.lg}px) {
    margin: 0px;
    width: 100%;
  }
`

const StyledColumn = styled(Column)`
  ${({ theme }) => theme.shadows.mistyShadow};
`

const ZeroDocument = styled.div`
  ${({ theme }) => theme.fonts.bigBodyStyle};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

const ResponsiveDocumentViewer = styled.div.attrs<{ isRegisterScope: boolean }>(
  {}
)`
  @media (max-width: ${({ theme }) => theme.grid.breakpoints.lg}px) {
    display: ${({ isRegisterScope }) => (isRegisterScope ? 'block' : 'none')};
    margin-bottom: 11px;
  }
`

const FormData = styled.div`
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.copy};
  padding: 32px;
`
const FormDataHeader = styled.div`
  ${({ theme }) => theme.fonts.h2Style}
`
const InputWrapper = styled.div`
  margin-top: 56px;
`
type onChangeReviewForm = (
  sectionData: IFormSectionData,
  activeSection: IFormSection,
  application: IApplication
) => void
interface IProps {
  draft: IApplication
  registerForm: { [key: string]: IForm }
  pageRoute: string
  rejectApplicationClickEvent?: () => void
  goToPageGroup: typeof goToPageGroup
  submitClickEvent: (
    application: IApplication,
    submissionStatus: string,
    action: string,
    payload?: IPayload
  ) => void
  scope: Scope | null
  offlineResources: IOfflineData
  language: string
  onChangeReviewForm?: onChangeReviewForm
  writeApplication: typeof writeApplication
  registrationSection: IFormSection
  documentsSection: IFormSection
}
type State = {
  displayEditDialog: boolean
  editClickedSectionId: Section | null
  editClickedSectionGroupId: string
  editClickFieldName?: string
  activeSection: Section | null
}
type FullProps = IProps & IntlShapeProps

const getViewableSection = (registerForm: IForm): IFormSection[] => {
  return registerForm.sections.filter(
    ({ id, viewType }) =>
      id !== 'documents' && (viewType === 'form' || viewType === 'hidden')
  )
}

const getDocumentSections = (registerForm: IForm): IFormSection[] => {
  return registerForm.sections.filter(
    ({ hasDocumentSection }) => hasDocumentSection
  )
}

function renderSelectLabel(
  value: IFormFieldValue,
  options: ISelectOption[],
  intl: IntlShape
) {
  const selectedOption = options.find(option => option.value === value)
  return selectedOption ? intl.formatMessage(selectedOption.label) : value
}

export function renderSelectDynamicLabel(
  value: IFormFieldValue,
  options: IDynamicOptions,
  draftData: IFormSectionData,
  intl: IntlShape,
  resources: IOfflineData,
  language: string
) {
  if (!options.resource) {
    const dependency = options.dependency
      ? draftData[options.dependency]
      : false
    const selectedOption = dependency
      ? options.options &&
        options.options[dependency.toString()].find(
          option => option.value === value
        )
      : false
    return selectedOption ? intl.formatMessage(selectedOption.label) : value
  } else {
    if (options.resource) {
      let selectedLocation: ILocation
      const locationId = value as string
      if (options.resource === 'locations') {
        selectedLocation = resources[OFFLINE_LOCATIONS_KEY][locationId]
      } else {
        selectedLocation = resources[OFFLINE_FACILITIES_KEY][locationId]
      }

      if (selectedLocation) {
        if (language !== getDefaultLanguage()) {
          return selectedLocation.alias
        } else {
          return selectedLocation.name
        }
      } else {
        return false
      }
    } else {
      return false
    }
  }
}

const renderValue = (
  draft: IApplication,
  section: IFormSection,
  field: IFormField,
  intl: IntlShape,
  offlineResources: IOfflineData,
  language: string
) => {
  const value: IFormFieldValue = draft.data[section.id]
    ? draft.data[section.id][field.name]
    : ''
  if (field.type === SELECT_WITH_OPTIONS && field.options) {
    return renderSelectLabel(value, field.options, intl)
  }
  if (field.type === SELECT_WITH_DYNAMIC_OPTIONS && field.dynamicOptions) {
    const draftData = draft.data[section.id]
    return renderSelectDynamicLabel(
      value,
      field.dynamicOptions,
      draftData,
      intl,
      offlineResources,
      language
    )
  }

  if (field.type === DATE && value && typeof value === 'string') {
    return formatLongDate(value)
  }

  if (field.type === SEARCH_FIELD) {
    return (value as IDynamicValues).label
  }
  if (field.hideInReview) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'boolean') {
    return value
      ? intl.formatMessage(buttonMessages.yes)
      : intl.formatMessage(buttonMessages.no)
  }
  return value
}
const getErrorsOnFieldsBySection = (
  formSections: IFormSection[],
  draft: IApplication
) => {
  return formSections.reduce((sections, section: IFormSection) => {
    const fields: IFormField[] = getSectionFields(
      section,
      draft.data[section.id]
    )

    const errors = getValidationErrorsForForm(
      fields,
      draft.data[section.id] || {},
      undefined,
      draft.data
    )

    return {
      ...sections,
      [section.id]: fields.reduce((fields, field) => {
        // REFACTOR
        const validationErrors: IValidationResult[] =
          errors[field.name as keyof typeof errors]

        const value = draft.data[section.id]
          ? draft.data[section.id][field.name]
          : null

        const informationMissing =
          validationErrors.length > 0 || value === null ? validationErrors : []

        return { ...fields, [field.name]: informationMissing }
      }, {})
    }
  }, {})
}

const SECTION_MAPPING = {
  [Event.BIRTH]: birthSectionMapping,
  [Event.DEATH]: deathSectionMapping
}
const SECTION_TITLE = {
  [Event.BIRTH]: birthSectionTitle,
  [Event.DEATH]: deathSectionTitle
}

class ReviewSectionComp extends React.Component<FullProps, State> {
  constructor(props: FullProps) {
    super(props)

    this.state = {
      displayEditDialog: false,
      editClickedSectionGroupId: '',
      editClickFieldName: '',
      editClickedSectionId: null,
      activeSection: null
    }
  }

  componentDidMount() {
    !isMobileDevice() && window.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  }

  docSections = getDocumentSections(
    this.props.registerForm[this.props.draft.event]
  )

  onScroll = () => {
    const scrollY = window.scrollY + window.innerHeight / 2
    let minDistance = 100000
    let sectionYTop = 0
    let sectionYBottom = 0
    let distance = 0
    let sectionElement: HTMLElement
    let activeSection = this.state.activeSection

    const node = findDOMNode(this) as HTMLElement

    this.docSections.forEach((section: IFormSection) => {
      sectionElement = node.querySelector(
        '#Section_' + section.id
      ) as HTMLElement
      sectionYTop = sectionElement.offsetTop
      sectionYBottom = sectionElement.offsetTop + sectionElement.offsetHeight

      distance = Math.abs(sectionYTop - scrollY)
      if (distance < minDistance) {
        minDistance = distance
        activeSection = section.id
      }

      distance = Math.abs(sectionYBottom - scrollY)
      if (distance < minDistance) {
        minDistance = distance
        activeSection = section.id
      }
    })
    this.setState({
      activeSection
    })
  }

  prepSectionDocuments = (
    draft: IApplication,
    activeSection: Section
  ): IDocumentViewerOptions => {
    const { documentsSection } = this.props

    const draftItemName = documentsSection.id
    const documentOptions: SelectComponentOptions[] = []
    const selectOptions: SelectComponentOptions[] = []

    let uploadedDocuments: IFileValue[] = []

    for (let index in draft.data[draftItemName]) {
      if (isArray(draft.data[draftItemName][index])) {
        const newDocuments = (draft.data[draftItemName][
          index
        ] as unknown) as IFileValue[]
        uploadedDocuments = uploadedDocuments.concat(newDocuments)
      }
    }

    uploadedDocuments = uploadedDocuments.filter(document => {
      const sectionMapping = SECTION_MAPPING[draft.event]
      const sectionTitle = SECTION_TITLE[draft.event]

      const allowedDocumentType: string[] =
        sectionMapping[activeSection as keyof typeof sectionMapping] || []

      if (
        allowedDocumentType.indexOf(document.optionValues[0]!.toString()) > -1
      ) {
        const title = sectionTitle[activeSection as keyof typeof sectionMapping]
        const label = title + ' ' + document.optionValues[1]

        documentOptions.push({
          value: document.data,
          label
        })
        selectOptions.push({
          value: label,
          label
        })
        return true
      }
      return false
    })

    return {
      selectOptions,
      documentOptions
    }
  }

  toggleDisplayDialog = () => {
    this.setState(prevState => ({
      displayEditDialog: !prevState.displayEditDialog
    }))
  }

  editLinkClickHandler = (
    sectionId: Section | null,
    sectionGroupId: string,
    fieldName?: string
  ) => {
    this.setState(() => ({
      editClickedSectionId: sectionId,
      editClickedSectionGroupId: sectionGroupId,
      editClickFieldName: fieldName
    }))
    this.toggleDisplayDialog()
  }

  userHasRegisterScope() {
    if (this.props.scope) {
      return this.props.scope && this.props.scope.includes('register')
    } else {
      return false
    }
  }

  userHasValidateScope() {
    if (this.props.scope) {
      return this.props.scope && this.props.scope.includes('validate')
    } else {
      return false
    }
  }

  isVisibleField(field: IFormField, section: IFormSection) {
    const { draft, offlineResources } = this.props
    const conditionalActions = getConditionalActionsForField(
      field,
      draft.data[section.id] || {},
      offlineResources,
      draft.data
    )
    return !conditionalActions.includes('hide')
  }

  isViewOnly(field: IFormField) {
    return [LIST, PARAGRAPH, WARNING, TEXTAREA].find(
      type => type === field.type
    )
  }

  getFieldValueWithErrorMessage(
    section: IFormSection,
    field: IFormField,
    errorsOnField: any
  ) {
    return (
      <RequiredField id={`required_label_${section.id}_${field.name}`}>
        {field.previewGroup && this.props.intl.formatMessage(field.label) + ' '}
        {this.props.intl.formatMessage(
          errorsOnField.message,
          errorsOnField.props
        )}
      </RequiredField>
    )
  }

  getRenderableField(
    section: IFormSection,
    group: IFormSectionGroup,
    fieldLabel: MessageDescriptor,
    fieldName: string,
    value: IFormFieldValue | JSX.Element | undefined
  ) {
    const { intl } = this.props

    return {
      label: intl.formatMessage(fieldLabel),
      value,
      action: {
        id: `btn_change_${section.id}_${fieldName}`,
        label: intl.formatMessage(buttonMessages.change),
        handler: () => {
          this.editLinkClickHandler(section.id, group.id, fieldName)
        }
      }
    }
  }

  getPreviewGroupsField(
    section: IFormSection,
    group: IFormSectionGroup,
    field: IFormField,
    visitedTags: string[],
    errorsOnFields: any
  ) {
    const { intl, draft, offlineResources, language } = this.props

    if (field.previewGroup && !visitedTags.includes(field.previewGroup)) {
      visitedTags.push(field.previewGroup)

      const baseTag = field.previewGroup
      const taggedFields = group.fields.filter(
        field =>
          this.isVisibleField(field, section) &&
          !this.isViewOnly(field) &&
          field.previewGroup === baseTag
      )

      const tagDef =
        (group.previewGroups &&
          (group.previewGroups.filter(
            previewGroup => previewGroup.id === baseTag
          ) as IFormTag[])) ||
        []
      const values = taggedFields
        .map(field => {
          const errorsOnField = errorsOnFields[section.id][field.name]

          return errorsOnField.length > 0
            ? this.getFieldValueWithErrorMessage(
                section,
                field,
                errorsOnField[0]
              )
            : renderValue(
                draft,
                section,
                field,
                intl,
                offlineResources,
                language
              )
        })
        .filter(value => value)

      let completeValue = values[0]
      values.shift()
      values.forEach(
        value =>
          (completeValue = (
            <>
              {completeValue}
              <br />
              {value}
            </>
          ))
      )

      return this.getRenderableField(
        section,
        group,
        (tagDef[0] && tagDef[0].label) || field.label,
        (tagDef[0] && tagDef[0].fieldToRedirect) || field.name,
        completeValue
      )
    }
  }

  getSinglePreviewField(
    section: IFormSection,
    group: IFormSectionGroup,
    field: IFormField,
    errorsOnFields: any
  ) {
    const { intl, draft, offlineResources, language } = this.props
    const errorsOnField = errorsOnFields[section.id][field.name]

    const value =
      errorsOnField.length > 0
        ? this.getFieldValueWithErrorMessage(section, field, errorsOnField[0])
        : renderValue(draft, section, field, intl, offlineResources, language)

    return this.getRenderableField(
      section,
      group,
      field.label,
      field.name,
      value
    )
  }

  transformSectionData = (
    formSections: IFormSection[],
    errorsOnFields: any
  ) => {
    const { intl, draft } = this.props

    return formSections.map(section => {
      let items: any[] = []
      let visitedTags: string[] = []
      getVisibleSectionGroupsBasedOnConditions(
        section,
        draft.data[section.id] || {},
        draft.data
      ).forEach(group => {
        items = items
          .concat(
            group.fields
              .filter(
                field =>
                  this.isVisibleField(field, section) && !this.isViewOnly(field)
              )
              .map(field => {
                return field.previewGroup
                  ? this.getPreviewGroupsField(
                      section,
                      group,
                      field,
                      visitedTags,
                      errorsOnFields
                    )
                  : this.getSinglePreviewField(
                      section,
                      group,
                      field,
                      errorsOnFields
                    )
              })
          )
          .filter(item => item)
      })
      return {
        id: section.id,
        title: intl.formatMessage(section.title),
        items
      }
    })
  }

  render() {
    const {
      intl,
      draft,
      registerForm,
      rejectApplicationClickEvent,
      submitClickEvent,
      pageRoute,
      registrationSection,
      documentsSection,
      offlineResources,
      draft: { event }
    } = this.props

    const formSections = getViewableSection(registerForm[event])

    const errorsOnFields = getErrorsOnFieldsBySection(formSections, draft)

    const isComplete =
      flatten(
        // @ts-ignore
        Object.values(errorsOnFields).map(Object.values)
        // @ts-ignore
      ).filter(errors => errors.length > 0).length === 0

    const textAreaProps = {
      id: 'additional_comments',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        ;(this.props.onChangeReviewForm as onChangeReviewForm)(
          { commentsOrNotes: e.target.value },
          registrationSection,
          draft
        )
      },
      value:
        (draft.data.registration && draft.data.registration.commentsOrNotes) ||
        '',
      ignoreMediaQuery: true
    }

    const sectionName = this.state.activeSection || this.docSections[0].id
    const applicantName = getDraftApplicantFullName(draft, intl.locale)
    const isDraft =
      this.props.draft.submissionStatus === SUBMISSION_STATUS.DRAFT

    return (
      <FullBodyContent>
        <Row>
          <StyledColumn>
            <ReviewHeader
              id="review_header"
              logoSource={offlineResources.assets.logo}
              title={intl.formatMessage(messages.govtName)}
              subject={
                applicantName
                  ? intl.formatMessage(messages.headerSubjectWithName, {
                      eventType: event,
                      name: applicantName
                    })
                  : intl.formatMessage(messages.headerSubjectWithoutName, {
                      eventType: event
                    })
              }
            />
            <FormData>
              <FormDataHeader>
                {intl.formatMessage(messages.formDataHeader, { isDraft })}
              </FormDataHeader>
              {this.transformSectionData(formSections, errorsOnFields).map(
                (sec, index) => (
                  <DataSection key={index} {...sec} id={'Section_' + sec.id} />
                )
              )}
              {event === BIRTH && (
                <InputWrapper>
                  <InputField
                    id="additional_comments"
                    touched={false}
                    required={false}
                    label={intl.formatMessage(messages.additionalComments)}
                  >
                    <TextArea {...textAreaProps} />
                  </InputField>
                </InputWrapper>
              )}
              <ReviewAction
                completeApplication={isComplete}
                applicationToBeValidated={this.userHasValidateScope()}
                applicationToBeRegistered={this.userHasRegisterScope()}
                alreadyRejectedApplication={
                  this.props.draft.registrationStatus === REJECTED
                }
                draftApplication={isDraft}
                application={draft}
                submitApplicationAction={submitClickEvent}
                rejectApplicationAction={rejectApplicationClickEvent}
              />
            </FormData>
          </StyledColumn>
          <Column>
            <ResponsiveDocumentViewer
              isRegisterScope={this.userHasRegisterScope()}
            >
              <DocumentViewer
                id={'document_section_' + this.state.activeSection}
                key={'Document_section_' + this.state.activeSection}
                options={this.prepSectionDocuments(
                  draft,
                  this.state.activeSection || formSections[0].id
                )}
              >
                <ZeroDocument>
                  {intl.formatMessage(messages.zeroDocumentsText, {
                    section: sectionName
                  })}
                  <LinkButton
                    id="edit-document"
                    onClick={() =>
                      this.editLinkClickHandler(
                        documentsSection.id,
                        documentsSection.groups[0].id,
                        this.state.activeSection!
                      )
                    }
                  >
                    {intl.formatMessage(messages.editDocuments)}
                  </LinkButton>
                </ZeroDocument>
              </DocumentViewer>
            </ResponsiveDocumentViewer>
          </Column>
        </Row>
        <EditConfirmation
          show={this.state.displayEditDialog}
          handleClose={this.toggleDisplayDialog}
          handleEdit={() => {
            const application = this.props.draft
            application.review = true
            this.props.writeApplication(application)
            this.props.goToPageGroup(
              pageRoute,
              draft.id,
              this.state.editClickedSectionId!,
              this.state.editClickedSectionGroupId,
              draft.event.toLowerCase(),
              this.state.editClickFieldName
            )
          }}
        />
      </FullBodyContent>
    )
  }
}

export const ReviewSection = connect(
  (state: IStoreState) => ({
    registerForm: getRegisterForm(state),
    registrationSection: getBirthSection(state, BirthSection.Registration),
    documentsSection: getBirthSection(state, BirthSection.Documents),
    scope: getScope(state),
    offlineResources: getOfflineData(state),
    language: getLanguage(state)
  }),
  { goToPageGroup, writeApplication }
)(injectIntl(ReviewSectionComp))
