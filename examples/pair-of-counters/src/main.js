import Effects from './effects';
import run from './boilerplate';

import PairOfCounters, {View as PairOfCountersView} from './PairOfCounters';

run('app', () => [PairOfCounters.init(), Effects.none()], (state, action) => [PairOfCounters.update(state, action), Effects.none()], PairOfCountersView);
