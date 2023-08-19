import { pino } from "pino";
import type { LoggerLogLevel, LoggerProperties } from "./types.js";

const PINO_PRETTY_TRANSPORT = {
	target: "pino-pretty",
	options: { colorize: true },
};

export const createLogger = (baseProperties: LoggerProperties, logLevel?: LoggerLogLevel) => {
	let transport;
	if (process.env.NODE_ENV !== "production") {
		transport = PINO_PRETTY_TRANSPORT;
	}

	return pino({
		base: baseProperties,
		transport,
		level: logLevel ?? process.env.LOG_LEVEL ?? "info",
		messageKey: "message",
		nestedKey: "payload",
		timestamp: pino.stdTimeFunctions.isoTime,
	});
};
