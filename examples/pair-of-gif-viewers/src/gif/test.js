import Component, {View} from './index';

export default {
  default: {
    ...Component,
    View
  },
  dogs: {
    ...Component,
    View,
    init: () => Component.init('dogs')
  },
  birds: {
    ...Component,
    View,
    init: () => Component.init('funny birds'),
    description: 'Test gif of funny birds'
  }
}
