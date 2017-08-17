export function forwardTo(dispatch, map) {
  return (action) => {
    dispatch(map(action));
  };
}
