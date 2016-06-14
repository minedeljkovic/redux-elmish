import run from './boilerplate';

import GifPair, {View as GifPairView} from './GifPair';

run('app', GifPair.init, GifPair.update, GifPairView);
