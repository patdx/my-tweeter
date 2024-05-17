import { memoize } from 'lodash-es';
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity';

export const getObscenity = memoize(() => {
  const now = performance.now();
  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });
  console.log(`Obscenity matcher loaded in ${performance.now() - now}ms`);
  return matcher;
});

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
