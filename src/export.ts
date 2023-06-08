import * as srr from "./seraph-router";

declare global {
  interface Window {
    seraphrouter: () => typeof srr;
  }
}

if (typeof window !== "undefined") {
  window.seraphrouter = () => srr;
}

export * from "./seraph-router";
