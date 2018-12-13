import { fhirWorkflowEventHandler } from 'src/features/events/handler'

const enum RouteScope {
  DECLARE = 'declare',
  REGISTER = 'register',
  CERTIFY = 'certify'
}

export const getRoutes = () => {
  const routes = [
    // add ping route by default for health check
    {
      method: 'GET',
      path: '/ping',
      handler: (request: any, h: any) => {
        return 'pong'
      },
      config: {
        tags: ['api']
      }
    },
    {
      method: '*',
      path: '/fhir/{path*}',
      handler: fhirWorkflowEventHandler,
      config: {
        tags: ['api'],
        description:
          'Mimics the fhir API, detects OpenCRVS event and calls the correct workflow handler. Else, just forwards the request to Hearth.',
        auth: {
          scope: [RouteScope.DECLARE, RouteScope.REGISTER] // TODO
        },
        plugins: {
          'hapi-swagger': {
            responses: {
              200: {
                description: 'Successful, see standard fhir response types'
              },
              400: {
                description:
                  'Bad request, see standard fhir error response types'
              }
            }
          }
        }
      }
    }
    // {
    //   method: 'POST',
    //   path: '/createBirthRegistration',
    //   handler: createBirthRegistrationHandler,
    //   config: {
    //     tags: ['api'],
    //     description:
    //       'Push trackingid, note author and appropriate status before submitting to Hearth and send notification to the shared contact',
    //     auth: {
    //       scope: [RouteScope.DECLARE, RouteScope.REGISTER]
    //     },
    //     plugins: {
    //       'hapi-swagger': {
    //         responses: {
    //           200: { description: 'Birth declaration is successfully synced' },
    //           400: { description: 'Bad request, check your request body' }
    //         }
    //       }
    //     }
    //   }
    // },
    // {
    //   method: 'POST',
    //   path: '/updateTask',
    //   handler: updateTaskHandler,
    //   config: {
    //     tags: ['api'],
    //     description: 'Update Task with the user information and send to fhir',
    //     auth: {
    //       scope: [RouteScope.DECLARE, RouteScope.REGISTER, RouteScope.CERTIFY]
    //     },
    //     plugins: {
    //       'hapi-swagger': {
    //         responses: {
    //           200: { description: 'Task is successfully synced' },
    //           400: { description: 'Bad request, check your request body' }
    //         }
    //       }
    //     }
    //   }
    // },
    // {
    //   method: 'POST',
    //   path: '/markBirthAsRegistered',
    //   handler: markBirthAsRegisteredHandler,
    //   config: {
    //     tags: ['api'],
    //     description:
    //       'Push BRN number and registered status before submitting to Hearth',
    //     auth: {
    //       scope: [RouteScope.REGISTER]
    //     },
    //     plugins: {
    //       'hapi-swagger': {
    //         responses: {
    //           200: { description: 'Birth registration is successfull' },
    //           400: { description: 'Bad request, check your request body' }
    //         }
    //       }
    //     }
    //   }
    // }
  ]
  return routes
}
