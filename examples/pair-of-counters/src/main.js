import run from './boilerplate';

import PairOfCounters, {View as PairOfCountersView} from './PairOfCounters';

run('app', PairOfCounters.init, PairOfCounters.update, PairOfCountersView);
