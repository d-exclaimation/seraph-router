import { from, state, type State } from "@d-exclaimation/seraph";

type Location = {
  url: URL;
  previous: URL[];
};

export type History = State<Location> & {
  readonly navigate: (url: string) => void;
  readonly back: () => void;
  readonly reload: () => void;
};

/**
 * Create a new history state object
 * @returns a history state object
 */
export function history(): History {
  const $urls = state<URL[]>([new URL(window.location.href)]);
  const $history = from($urls, (urls) => ({
    url: urls[urls.length - 1],
    previous: urls.slice(0, -1),
  }));

  return {
    __kind: "state",
    get current() {
      return $history.current;
    },
    subscribe: $history.subscribe.bind($history),
    navigate: (url) => {
      const newUrl = new URL(url, window.location.origin);
      const state = {
        url: newUrl.href,
        title: url,
      };
      window.history.pushState(state, url, newUrl.href);
      $urls.current.push(newUrl);
      $urls.current = $urls.current;
    },
    back: () => {
      window.history.back();
      $urls.current.pop();
      $urls.current = $urls.current;
    },
    reload: () => {
      $urls.current = $urls.current;
    },
  };
}
