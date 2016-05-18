import run from './boilerplate';

import DynamicListOfCounters from './DynamicListOfCounters';

run('app', DynamicListOfCounters.init, DynamicListOfCounters.update, DynamicListOfCounters.view, DynamicListOfCounters.Msg);
