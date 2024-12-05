import type { RouteParams } from "@/routes/routes";

type GetUrlGroups = { params: RouteParams; query: string };

export function getUrlGroups(url: string, path: RegExp): GetUrlGroups {
  const match = url.match(path);

  if (!match || !match.groups) return { params: {} as RouteParams, query: "" };

  const { groups } = match;
  const { query = "", ...params } = groups;

  return { params: params as RouteParams, query };
}
