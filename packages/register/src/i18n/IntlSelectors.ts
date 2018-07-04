import { IntlState } from './IntlReducer'
import { IStoreState } from '../store'

const getPartialState = (store: IStoreState): IntlState => store.i18n

function getKey<K extends keyof IntlState>(store: IStoreState, key: K) {
  return getPartialState(store)[key]
}

export const getLanguage = (store: IStoreState): IntlState['LANGUAGE'] =>
  getKey(store, 'LANGUAGE')

export const getMessages = (store: IStoreState): IntlState['messages'] =>
  getKey(store, 'messages')