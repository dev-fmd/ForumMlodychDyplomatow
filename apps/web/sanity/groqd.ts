import {
  createGroqBuilder,
  type IGroqBuilder,
  type QueryConfig,
  type QueryRunnerOptions,
  type ValidationErrors,
} from "groqd";
import { sanityFetch } from "./live";
import * as SanityTypes from "./typegen";

export type GroqdContext = {
  schemaTypes: SanityTypes.AllSanitySchemaTypes;
  referenceSymbol: typeof SanityTypes.internalGroqTypeReferenceTo;
};
export type GroqdContextWithParameters<TParams extends Record<string, any>> = GroqdContext & {
  parameters: TParams;
  scope: {
    [K in keyof TParams as K extends string ? `$${K}` : never]: TParams[K];
  };
};
/**
 * GROQD query builder using auto-generated Sanity types
 * @see https://nearform.com/open-source/groqd/docs/
 * @example `q.star(filterByType("post")).order('price desc')`
 */
const q = createGroqBuilder<GroqdContext>();

/**  Custom type for groqd's safe query runner to get sanity live support.
 *
 *  The implementation is taken directly from the groqd implementation,
 *  With the return type tweaked to match the shape of sanityFetch's return value (which includes additional metadata alongside the data)
 *
 * Used exactly the same as groqd's make safe query runner, except the resulting type is always
 * `{data: TResult, ...otherMetadata}` instead of just `TResult`, so it needs to be unpacked.
 */
const makeCustomSafeQueryRunner = <TCustomOptions>(
  execute: <TResult, _TQueryConfig extends QueryConfig>(
    query: string,
    options: QueryRunnerOptions & TCustomOptions
  ) => Promise<Omit<Awaited<ReturnType<typeof sanityFetch>>, "data"> & { data: TResult }>
) => {
  return async function queryRunner<TResult, TQueryConfig extends QueryConfig>(
    builder: IGroqBuilder<TResult, TQueryConfig>,
    _options: QueryRunnerOptions<TQueryConfig> & TCustomOptions
  ) {
    const options = _options || {};
    const results = await execute<TResult, TQueryConfig>(
      builder.query,
      options as QueryRunnerOptions & TCustomOptions
    );

    try {
      const parsed = builder.parse(results.data) ?? results.data;
      return { ...results, data: parsed };
    } catch (error) {
      console.error("Error parsing GROQ results:", error);
      console.error("errors", (error as ValidationErrors).errors);
      return results;
    }
  };
};

export const runQuery = makeCustomSafeQueryRunner<{
  stega?: boolean;
  perspective?: "published" | "drafts";
}>((query, options) =>
  sanityFetch({
    query,
    params: options?.parameters,
    stega: options?.stega,
    perspective: options?.perspective,
  })
);

export { q };
