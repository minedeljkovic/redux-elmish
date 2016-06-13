// @flow

type PromiseEffect<TAction> = {
  type: 'PROMISE',
  factory: () => Promise,
  successTagger: (result: any) => TAction,
  failTagger: (error: any) => TAction
};

type NoneEffect = {
  type: 'NONE'
};

type MappedEffect<TAction> = {
  type: 'MAP',
  effect: Effect,
  tagger: (action: any) => TAction
};

type BatchEffect<TAction> = {
  type: 'BATCH',
  effects: Effect<TAction>[]
};

export type Effect<TAction> = PromiseEffect<TAction> | NoneEffect | MappedEffect<TAction> | BatchEffect<TAction>;

function promise<TAction, TPromiseResult>(
  promiseFactory: () => Promise<TPromiseResult>,
  successTagger: (result: TPromiseResult) => TAction,
  failTagger: (error: any) => TAction
): Effect<TAction> {
  return {
    type: 'PROMISE',
    factory: promiseFactory,
    successTagger,
    failTagger
  };
}

function none(): NoneEffect {
  return {
    type: 'NONE'
  }
}

function map<TAction, TTagAction>(
  effect: Effect<TAction>,
  tagger: (action: TAction) => TTagAction
): Effect<TTagAction> {
  return {
    type: 'MAP',
    effect,
    tagger
  };
}

function batch<TAction>(effects: Effect<TAction>[]): Effect<TAction> {
  return {
    type: 'BATCH',
    effects
  }
}

export default {
  promise,
  none,
  map,
  batch
}
