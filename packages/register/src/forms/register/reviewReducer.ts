import { LoopReducer, Loop } from 'redux-loop'
import { IForm } from 'src/forms'
import { defineMessages } from 'react-intl'
import { childSection } from 'src/forms/register/child-section'
import { motherSection } from 'src/forms/register/mother-section'
import { fatherSection } from 'src/forms/register/father-section'
import { registrationSection } from 'src/forms/register/registration-section'
import { documentsSection } from 'src/forms/register/documents-section'

const messages = defineMessages({
  reviewTab: {
    id: 'review.form.tabs.reviewTab',
    defaultMessage: 'Review',
    description: 'Tab title for Review'
  },
  reviewTitle: {
    id: 'review.form.section.reviewTitle',
    defaultMessage: 'Review',
    description: 'Form section title for Review'
  }
})

export interface IReviewFormState {
  reviewForm: IForm
}

export const initialState: IReviewFormState = {
  reviewForm: {
    sections: [
      childSection,
      motherSection,
      fatherSection,
      registrationSection,
      documentsSection,
      {
        id: 'review',
        viewType: 'review',
        name: messages.reviewTab,
        title: messages.reviewTitle,
        fields: []
      }
    ]
  }
}

const GET_REVIEW_FORM = 'REVIEW_FORM/GET_REVIEW_FORM'
type GetReviewFormAction = {
  type: typeof GET_REVIEW_FORM
}
type Action = GetReviewFormAction

export const reviewReducer: LoopReducer<IReviewFormState, Action> = (
  state: IReviewFormState = initialState,
  action: Action
): IReviewFormState | Loop<IReviewFormState, Action> => {
  switch (action.type) {
    default:
      return state
  }
}