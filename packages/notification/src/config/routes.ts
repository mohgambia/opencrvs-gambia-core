import {
  smsHandler,
  sendBirthDeclarationConfirmation
} from 'src/features/sms/handler'
import {
  requestSchema,
  declarationNotificationSchema
} from 'src/features/sms/payload-schema'

const enum RouteScope {
  DECLARE = 'declare',
  REGISTER = 'register',
  CERTIFY = 'certify'
}

export default function getRoutes() {
  return [
    /* add ping route by default for health check */
    {
      method: 'GET',
      path: '/ping',
      handler: (request: any, h: any) => {
        return 'pong'
      },
      config: {
        tags: ['api'],
        auth: false
      }
    },
    /* curl -H 'Content-Type: application/json' -d '{"msisdn": "+27855555555", "message": "Test"}' http://localhost:2020/sms */
    {
      method: 'POST',
      path: '/sms',
      handler: smsHandler,
      config: {
        tags: ['api'],
        description: 'Sends an sms to a user',
        validate: {
          payload: requestSchema
        },
        plugins: {
          'hapi-swagger': {
            responses: {
              200: { description: 'Sms sent' },
              400: { description: 'Bad request, check your request body' }
            }
          }
        }
      }
    },
    {
      method: 'POST',
      path: '/birthDeclarationSMS',
      handler: sendBirthDeclarationConfirmation,
      config: {
        tags: ['api'],
        description: 'Sends an sms to a user for birth declaration entry',
        auth: {
          scope: [RouteScope.DECLARE, RouteScope.REGISTER, RouteScope.CERTIFY]
        },
        validate: {
          payload: declarationNotificationSchema
        },
        plugins: {
          'hapi-swagger': {
            responses: {
              200: { description: 'Birth declration confirmation sms sent' },
              400: { description: 'Bad request, check your request body' }
            }
          }
        }
      }
    }
  ]
}