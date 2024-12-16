import type { QueryParams } from "@/@types/http";

export function extractQueryParams(query: string): QueryParams {
  const queryParams = query.substring(1).split("&");

  const params = queryParams.reduce((acc, queryParam) => {
    const [key, value] = queryParam.split("=");

    if (key && value) acc[key as keyof QueryParams] = decodeURIComponent(value);

    return acc;
  }, {} as QueryParams);

  return params;
}
