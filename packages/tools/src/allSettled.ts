export async function allSettled<T extends readonly unknown[] | []>(values: T) {
  const results = await Promise.allSettled(values);

  const fulfilled = (results as PromiseSettledResult<Awaited<T>>[])
    .filter((result) => result.status === "fulfilled")
    .map((result) => (result as PromiseFulfilledResult<T>).value) as Awaited<
    T[0]
  >[];

  const rejected = (results as PromiseSettledResult<Awaited<T>>[])
    .filter((result) => result.status === "rejected")
    .map((result) => (result as PromiseRejectedResult).reason);

  return {
    fulfilled,
    rejected,
  };
}
