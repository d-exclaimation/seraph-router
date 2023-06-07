import { state } from "@d-exclaimation/seraph";
import { routing } from "../router";

export const $count = state(0);
export const { $history, ...router } = routing();
