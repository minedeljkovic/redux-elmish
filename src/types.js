import t from 'tcomb';
import _curry from 'lodash.curry';

export function tag(name, ...taggedTypes) {
  if (process.env.NODE_ENV !== 'production') {
    // TODO: assert da je name t.String
    // TODO: assert da su taggedTypes t.list(t.Type) (moze da bude prazna!!)
  }
  
  function TagCtor(...taggedValues) {
    if (process.env.NODE_ENV !== 'production') {
      // TODO: assert da taggedValues.length === taggedTypes.length
      // TODO: assert da su taggedTypes t.list(t.Type) (moze da bude prazna!!)
    }

    return taggedValues.reduce((memo, value, index) => {
      memo[`_${index}`] = value;
      return memo;
    }, { type: name });
  }

  const Tag = (taggedTypes.length > 1) ? _curry(TagCtor, taggedTypes.length) : TagCtor;

  Tag.meta = {
    kind: 'tag',
    types: taggedTypes,
    name,
    identity: false // TODO: na sta ovo utice??
  };

  Tag.displayName = name;

  Tag.is = (x) => {
    // type === Tag.meta.name i jedan po jedan value da bude taggedTypes[i].is(value)
    return true;
  }

  return Tag;
}

const anyTag = Symbol('anyTag');
export function union(...tags) {
  const unionType = t.union(tags);
  
  unionType.meta.isMsg = true;
  unionType.Any = anyTag;

  // TODO: f-ja koja matchuje tip i poziva updater
  // ubaciti optimizaciju koja cuva poslednju poziciju na kojoj je bio dati tip
  // ta pozicija se prvo pokusa, pa ako nije tamo, trazi se na ostalim pozicijama
  unionType.match = (value, ...cases) => {
    const matchedTag = unionType.meta.types.find(tag => tag.meta.name === value.type);
    for (let i = 0; i < cases.length; i += 2) {
      const tag = cases[i];
      const fn = cases[i + 1];
      if (tag === unionType.Any) {
        return fn();
      }
      if (tag === matchedTag) {
        const fnArgs = tag.meta.types.map((_, index) => value[`_${index}`]);
        return fn(...fnArgs);
      }
    }

    throw new Error(`[tcomb-redux-elm] No match was found for type ${value.type}`);
  };

  return unionType;
}
