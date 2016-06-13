import run from './boilerplate';

import PairOfGifViewers, {View as PairOfGifViewersView} from './PairOfGifViewers';

run('app', PairOfGifViewers.init, PairOfGifViewers.update, PairOfGifViewersView);
