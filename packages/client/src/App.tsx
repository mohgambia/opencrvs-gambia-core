/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * OpenCRVS is also distributed under the terms of the Civil Registration
 * & Healthcare Disclaimer located at http://opencrvs.org/license.
 *
 * Copyright (C) The OpenCRVS Authors. OpenCRVS and the OpenCRVS
 * graphic logo are (registered/a) trademark(s) of Plan International.
 */
import { ErrorBoundary } from '@client/components/ErrorBoundary'
import { NotificationComponent } from '@client/components/Notification'
import { Page } from '@client/components/Page'
import { ProtectedPage } from '@client/components/ProtectedPage'
import { ProtectedRoute } from '@client/components/ProtectedRoute'
import ScrollToTop from '@client/components/ScrollToTop'
import { SessionExpireConfirmation } from '@client/components/SessionExpireConfirmation'
import { StyledErrorBoundary } from '@client/components/StyledErrorBoundary'
import TransitionWrapper from '@client/components/TransitionWrapper'
import { I18nContainer } from '@client/i18n/components/I18nContainer'
import { getDefaultLanguage } from '@client/i18n/utils'
import * as routes from '@client/navigation/routes'
import styled, {
  createGlobalStyle,
  ThemeProvider
} from '@client/styledComponents'
import { createClient } from '@client/utils/apolloClient'
import { ReviewDuplicates } from '@client/views/Duplicates/ReviewDuplicates'
import { EventInfo } from '@client/views/EventInfo/EventInfo'
import { FieldAgentHome } from '@client/views/FieldAgentHome/FieldAgentHome'
import { Details } from '@client/views/Home/Details'
import { FieldAgentList } from '@client/views/Performance/FieldAgentList'
import { CollectorForm } from '@client/views/PrintCertificate/collectorForm/CollectorForm'
import { Payment } from '@client/views/PrintCertificate/Payment'
import { ReviewCertificateAction } from '@client/views/PrintCertificate/ReviewCertificateAction'
import { VerifyCollector } from '@client/views/PrintCertificate/VerifyCollector'
import { ApplicationForm } from '@client/views/RegisterForm/ApplicationForm'
import { ReviewForm } from '@client/views/RegisterForm/ReviewForm'
import { RegistrationHome } from '@client/views/RegistrationHome/RegistrationHome'
import { SearchResult } from '@client/views/SearchResult/SearchResult'
import { SelectInformant } from '@client/views/SelectInformant/SelectInformant'
import { SelectPrimaryApplicant } from '@client/views/SelectPrimaryApplicant/SelectPrimaryApplicant'
import { SelectVitalEvent } from '@client/views/SelectVitalEvent/SelectVitalEvent'
import { SettingsPage } from '@client/views/Settings/SettingsPage'
import { OperationalReport } from '@client/views/SysAdmin/Performance/OperationalReport'
import { PerformanceHome } from '@client/views/SysAdmin/Performance/PerformanceHome'
import { RegistrationRates } from '@client/views/SysAdmin/Performance/RegistrationRates'
import { Report } from '@client/views/SysAdmin/Performance/Report'
import { ReportList } from '@client/views/SysAdmin/Performance/ReportList'
import { WorkflowStatus } from '@client/views/SysAdmin/Performance/WorkflowStatus'
import { TeamSearch } from '@client/views/SysAdmin/Team/TeamSearch'
import { CreateNewUser } from '@client/views/SysAdmin/Team/user/userCreation/CreateNewUser'
import { UserProfile } from '@client/views/SysAdmin/Team/user/userProfilie/UserProfile'
import { getTheme } from '@opencrvs/components/lib/theme'
import ApolloClient from 'apollo-client'
import { ConnectedRouter } from 'connected-react-router'
import { History, Location } from 'history'
import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'react-redux'
import { Switch } from 'react-router'
import { AppStore } from './store'
import ImmunizationHome from './views/Immunization/ImmunizationHome'
import { UserList } from './views/SysAdmin/Team/user/UserList'

interface IAppProps {
  client?: ApolloClient<{}>
  store: AppStore
  history: History
}

const MainSection = styled.section`
  flex-grow: 8;
  background: ${({ theme }) => theme.colors.background};
`

// Injecting global styles for the body tag - used only once
// eslint-disable-line
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    overflow-y: scroll;
  }
`

export class App extends React.Component<IAppProps> {
  public render() {
    return (
      <ErrorBoundary>
        <GlobalStyle />
        <ApolloProvider
          client={this.props.client || createClient(this.props.store)}
        >
          <Provider store={this.props.store}>
            <I18nContainer>
              <ThemeProvider theme={getTheme(getDefaultLanguage())}>
                <StyledErrorBoundary>
                  <ConnectedRouter history={this.props.history}>
                    <ScrollToTop>
                      <SessionExpireConfirmation />
                      <NotificationComponent>
                        <Page>
                          <MainSection>
                            <ProtectedPage
                              unprotectedRouteElements={[
                                'documents',
                                'affidavit'
                              ]}
                            >
                              <ProtectedRoute
                                render={({
                                  location
                                }: {
                                  location: Location
                                }) => {
                                  return (
                                    <>
                                      <TransitionWrapper location={location}>
                                        <Switch location={location}>
                                          <ProtectedRoute
                                            exact
                                            path={routes.HOME}
                                            component={FieldAgentHome}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.FIELD_AGENT_HOME_TAB}
                                            component={FieldAgentHome}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.SELECT_VITAL_EVENT}
                                            component={SelectVitalEvent}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.EVENT_INFO}
                                            component={EventInfo}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={
                                              routes.SELECT_BIRTH_PRIMARY_APPLICANT
                                            }
                                            component={SelectPrimaryApplicant}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.SELECT_BIRTH_INFORMANT}
                                            component={SelectInformant}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.SELECT_DEATH_INFORMANT}
                                            component={SelectInformant}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={
                                              routes.DRAFT_BIRTH_PARENT_FORM
                                            }
                                            component={ApplicationForm}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={
                                              routes.DRAFT_BIRTH_PARENT_FORM_PAGE
                                            }
                                            component={ApplicationForm}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={
                                              routes.DRAFT_BIRTH_PARENT_FORM_PAGE_GROUP
                                            }
                                            component={ApplicationForm}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.DRAFT_DEATH_FORM}
                                            component={ApplicationForm}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.DRAFT_DEATH_FORM_PAGE}
                                            component={ApplicationForm}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={
                                              routes.DRAFT_DEATH_FORM_PAGE_GROUP
                                            }
                                            component={ApplicationForm}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={
                                              routes.REVIEW_EVENT_PARENT_FORM_PAGE
                                            }
                                            component={ReviewForm}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={
                                              routes.REVIEW_EVENT_PARENT_FORM_PAGE_GROUP
                                            }
                                            component={ReviewForm}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.REGISTRAR_HOME}
                                            component={RegistrationHome}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.REGISTRAR_HOME_TAB}
                                            component={RegistrationHome}
                                          />
                                          <ProtectedRoute
                                            path={routes.SEARCH}
                                            component={SearchResult}
                                          />
                                          <ProtectedRoute
                                            path={routes.SEARCH_RESULT}
                                            component={SearchResult}
                                          />
                                          <ProtectedRoute
                                            path={routes.REVIEW_DUPLICATES}
                                            component={ReviewDuplicates}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.CERTIFICATE_COLLECTOR}
                                            component={CollectorForm}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.VERIFY_COLLECTOR}
                                            component={VerifyCollector}
                                          />
                                          <ProtectedRoute
                                            path={routes.REVIEW_CERTIFICATE}
                                            component={ReviewCertificateAction}
                                          />
                                          <ProtectedRoute
                                            path={
                                              routes.PRINT_CERTIFICATE_PAYMENT
                                            }
                                            component={Payment}
                                          />
                                          <ProtectedRoute
                                            path={routes.SETTINGS}
                                            component={SettingsPage}
                                          />
                                          <ProtectedRoute
                                            path={routes.APPLICATION_DETAIL}
                                            component={Details}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.TEAM_SEARCH}
                                            component={TeamSearch}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.TEAM_USER_LIST}
                                            component={UserList}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.CREATE_USER}
                                            component={CreateNewUser}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={
                                              routes.CREATE_USER_ON_LOCATION
                                            }
                                            component={CreateNewUser}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.CREATE_USER_SECTION}
                                            component={CreateNewUser}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.REVIEW_USER_FORM}
                                            component={CreateNewUser}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.REVIEW_USER_DETAILS}
                                            component={CreateNewUser}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.PERFORMANCE_HOME}
                                            component={PerformanceHome}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.IMMUNIZATION_HOME}
                                            component={ImmunizationHome}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={
                                              routes.IMMUNIZATION_HOME + '/:id/'
                                            }
                                            component={ImmunizationHome}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={
                                              routes.PERFORMANCE_REPORT_LIST
                                            }
                                            component={ReportList}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.PERFORMANCE_REPORT}
                                            component={Report}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.OPERATIONAL_REPORT}
                                            component={OperationalReport}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={
                                              routes.EVENT_REGISTRATION_RATES
                                            }
                                            component={RegistrationRates}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.WORKFLOW_STATUS}
                                            component={WorkflowStatus}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={
                                              routes.PERFORMANCE_FIELD_AGENT_LIST
                                            }
                                            component={FieldAgentList}
                                          />
                                          <ProtectedRoute
                                            exact
                                            path={routes.USER_PROFILE}
                                            component={UserProfile}
                                          />
                                        </Switch>
                                      </TransitionWrapper>
                                    </>
                                  )
                                }}
                              />
                            </ProtectedPage>
                          </MainSection>
                        </Page>
                      </NotificationComponent>
                    </ScrollToTop>
                  </ConnectedRouter>
                </StyledErrorBoundary>
              </ThemeProvider>
            </I18nContainer>
          </Provider>
        </ApolloProvider>
      </ErrorBoundary>
    )
  }
}
