import type { HandlerFunction } from "src/lib/types.js";

import { addAddress } from "./addAddress.js";
import { getAddress } from "./getAddress.js";

export const handlers: Record<string, HandlerFunction> = {
	addAddress,
	getAddress,
} as const;

// TODO: define monitors
// TODO: define monitoring and alerting rules
