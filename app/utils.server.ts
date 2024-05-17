import {
  RegExpMatcher,
  TextCensor,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity';
import { memoize } from 'lodash-es';

export const getObscenity = memoize(() => {
  const now = performance.now();
  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });
  console.log(`Obscenity matcher loaded in ${performance.now() - now}ms`);
  return matcher;
});
