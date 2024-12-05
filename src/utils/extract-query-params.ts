import type { QueryParams } from "@/routes/routes";

export function extractQueryParams(query: string): QueryParams {
  const queryParams = query.substring(1).split("&");

  const params = queryParams.reduce((acc, queryParam) => {
    const [key, value] = queryParam.split("=");

    if (key && value) acc[key as keyof QueryParams] = value;

    return acc;
  }, {} as QueryParams);

  return params;
}
