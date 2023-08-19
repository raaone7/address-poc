import { z } from "zod";
import { createLogger } from "./logger.js";

// Logger
export type Logger = ReturnType<typeof createLogger>;
export type LoggerLogLevel = "debug" | "info" | "warn" | "error";
export type LoggerProperties = Record<string, unknown>;

// Lambda
export type CustomLambdaEventMetadata = {
	clientId?: string;
	clientRequestId?: string;
	clientEvent?: string;
};

export type CustomLambdaEvent = {
	action: string;
	metadata?: CustomLambdaEventMetadata;
	payload: Record<string, unknown>;
};

/**
 * Output from Lambda
 */
export type LambdaOutput = {
	/** HTTP statusCode */
	statusCode: number;
	/** Stringified version of HandlerOutput */
	body: string;
};

// Individual Handler(s)
export type HandlerInput = { logger: Logger; event: CustomLambdaEvent };
export type HandlerOutput = {
	statusCode: number;
	status: string;
	code: string;
	message: string;
	data?: Record<string, unknown>;
};
export type HandlerFunction = (params: HandlerInput) => Promise<HandlerOutput>;

// Address
export const inputAddressValidator = z.object({
	line1: z.string().trim().min(3),
	line2: z.string().trim().min(3).optional(),
	suburb: z.string().trim().min(3),
	state: z.string().trim().min(2),
	postCode: z.string().trim().min(4).max(4).regex(/^[0-9]*$/),
	countryCode: z.enum(["AUS", "NZL"]),
});

export type InputAddress = z.infer<typeof inputAddressValidator>;
