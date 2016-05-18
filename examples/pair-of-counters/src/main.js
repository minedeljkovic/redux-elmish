import run from './boilerplate';

import PairOfCounters from './PairOfCounters';

run('app', PairOfCounters.init, PairOfCounters.update, PairOfCounters.view, PairOfCounters.Msg);
