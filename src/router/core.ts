import { BaseProps, from, html } from "@d-exclaimation/seraph";
import { history } from "../history";

type ParamsProps<
  T extends string,
  Result extends {} = {}
> = T extends `${infer Head}/${infer Tail}`
  ? Head extends `:${infer Param}`
    ? ParamsProps<Tail, Result & { [K in Param]: string }>
    : ParamsProps<Tail, Result>
  : T extends `:${infer Param}`
  ? Result & { [K in Param]: string }
  : Result;

type PathComponent =
  | { __kind: "exact"; value: string }
  | { __kind: "param"; name: string }
  | { __kind: "wildcard" }
  | { __kind: "any" };

type Path = PathComponent[];

export const path = (href: string) =>
  href
    .split("/")
    .filter((p) => p)
    .map((p) => {
      if (p.startsWith(":")) {
        return { __kind: "param", name: p.slice(1) };
      }
      if (p === "*") {
        return { __kind: "wildcard" };
      }
      if (p === "**") {
        return { __kind: "any" };
      }
      return { __kind: "exact", value: p };
    }) satisfies Path;

export const match = (path: Path, href: string) => {
  const parts = href.split("/").filter((p) => p);
  if (parts.length !== path.length) return false;

  const params: Record<string, string> = {};

  for (let i = 0; i < path.length; i++) {
    const p = path[i];
    const part = parts[i];

    if (p.__kind === "exact" && p.value !== part) return false;
    if (p.__kind === "param") {
      params[p.name] = part;
      continue;
    }
    if (p.__kind === "wildcard") continue;
    if (p.__kind === "any") return params;
  }

  return params;
};

export const route = <T extends string, K extends HTMLElement>(
  path: T,
  component: (props: ParamsProps<T>) => K
) => ({
  path,
  component,
});

export function routing() {
  const $history = history();
  const $href = from($history, (history) => history.url.href);
  const $search = from($history, (history) => history.url.searchParams);
  const $path = from($history, (history) => history.url.pathname);

  const link = ({ attr, on, ...props }: BaseProps & { href: string }) =>
    html.a({
      ...props,
      attr: {
        ...attr,
        href: props.href,
      },
      on: {
        ...on,
        click: (e) => {
          e.preventDefault();
          $history.navigate(props.href);
        },
      },
    });

  const navigate = ({ href }: { href: string }) => {
    setTimeout(() => $history.navigate(href), 0);
    return html.span({});
  };

  const provider = <
    T extends {
      path: string;
      component: (props: any) => HTMLElement;
    }[]
  >(
    opts: T
  ) => {
    const config = opts.map(({ path: href, ...rest }) => ({
      path: path(href),
      ...rest,
    }));

    const $selected = from($path, (href) => {
      for (const { path, component } of config) {
        const params = match(path, href);
        if (params) {
          return [component, params] as const;
        }
      }
    });

    const $page = from($selected, (selected) => {
      if (selected) {
        const [component, params] = selected;
        return component(params as {});
      }
    });

    const notFound = config
      .find((r) => r.path.length === 1 && r.path[0].__kind === "wildcard")
      ?.component({});

    const $outlet = from($page, (selected) => {
      const route = selected ?? notFound;

      return route ? route : html.div({ c: "Not found..." });
    });

    return {
      $outlet,
      $page,
      $selected,
      config,
    };
  };

  return {
    $history,
    $href,
    $search,
    link,
    navigate,
    provider,
  };
}
