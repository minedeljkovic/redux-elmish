import run from './boilerplate';

import GifList, {View as GifListView} from './GifList';

run('app', GifList.init, GifList.update, GifListView);
