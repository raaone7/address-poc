import type { Logger } from "./types.js";

export const tagMethod =
	(logger: Logger, method: string) => (type: "START" | "END", payload: unknown = {}) => {
		logger.info(payload, `${type}-${method}`);
	};
