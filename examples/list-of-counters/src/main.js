import Effects from './effects';
import run from './boilerplate';

import CounterList, {View as CounterListView} from './CounterList';

run('app', () => [CounterList.init(), Effects.none()], (state, action) => [CounterList.update(state, action), Effects.none()], CounterListView);
