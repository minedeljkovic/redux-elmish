import Effects from './effects';
import run from './boilerplate';

import CounterPair, {View as CounterPairView} from './CounterPair';

run('app', () => [CounterPair.init(), Effects.none()], (state, action) => [CounterPair.update(state, action), Effects.none()], CounterPairView);
