import { createGroqBuilder, makeSafeQueryRunner } from "groqd";
import * as SanityTypes from "./typegen";
import { sanityFetch } from "./live";

type GroqdContext = {
  schemaTypes: SanityTypes.AllSanitySchemaTypes;
  referenceSymbol: typeof SanityTypes.internalGroqTypeReferenceTo;
};

/**
 * GROQD query builder using auto-generated Sanity types
 * @see https://nearform.com/open-source/groqd/docs/
 * @example `q.star(filterByType("post")).order('price desc')`
 */
const q = createGroqBuilder<GroqdContext>();

export const runQuery = makeSafeQueryRunner((query, options) =>
  sanityFetch({ query, params: options?.parameters }).then((res) => res.data)
);

export { q };
