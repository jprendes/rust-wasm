/* tslint:disable */
/* eslint-disable */
/**
* @param {string} s
* @returns {Stats}
*/
export function count_x(s: string): Stats;
/**
* @param {string} name
*/
export function greet(name: string): void;
/**
*/
export class Stats {
  free(): void;
/**
*/
  count: number;
/**
*/
  total: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_stats_free: (a: number, b: number) => void;
  readonly __wbg_get_stats_total: (a: number) => number;
  readonly __wbg_set_stats_total: (a: number, b: number) => void;
  readonly __wbg_get_stats_count: (a: number) => number;
  readonly __wbg_set_stats_count: (a: number, b: number) => void;
  readonly count_x: (a: number, b: number) => number;
  readonly greet: (a: number, b: number) => void;
  readonly __wbindgen_export_0: (a: number, b: number) => number;
  readonly __wbindgen_export_1: (a: number, b: number, c: number, d: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
