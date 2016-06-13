// @flow

export type Dispatch<TAction> = (action: TAction) => void;

export function forwardTo<TParentAction, TChildAction>(dispatch: Dispatch<TParentAction>, map: (childAction: TChildAction) => TParentAction): Dispatch<TChildAction> {
    return (action) => {
        dispatch(map(action));
    };
}

/*
export type Variant<Type> = { type: Type };
export type Tag<Type, TValue> = { type: Type, subAction: TValue };

export function forwardTo1(dispatch: () => void, tag: string): () => void {
  return (subAction) => {
      dispatch({ type: tag, subAction });
  };
}
*/
