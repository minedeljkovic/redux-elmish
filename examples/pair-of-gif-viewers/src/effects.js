// @flow

type PromiseEffect<TAction> = {
  type: 'PROMISE',
  factory: () => Promise,
  successActionCtor: (result: any) => TAction,
  failActionCtor: (error: any) => TAction
};

type NoneEffect = {
  type: 'NONE'
};

type LiftEffect = {
  type: 'LIFT',
  effect: Effect,
  factory: function
};

export type Effect<TAction> = PromiseEffect<TAction> | NoneEffect | LiftEffect;

export function promiseEffect<TAction, TPromiseResult>(
  promiseFactory: () => Promise<TPromiseResult>,
  successActionCtor: (result: TPromiseResult) => TAction,
  failActionCtor: (error: any) => TAction
): Effect<TAction> {
  const factory = () => {
    return promiseFactory()
      .then(result => successActionCtor(result), error => failActionCtor(error))
  }
  return {
    type: 'PROMISE',
    factory: promiseFactory,
    successActionCtor,
    failActionCtor
  };
}
