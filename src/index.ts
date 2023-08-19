import type { Context } from "aws-lambda";
import { createLogger } from "./lib/logger.js";
import { handlers } from "./handlers/index.js";
import type { CustomLambdaEvent, LambdaOutput } from "./lib/types.js";

export const handler = async (
	event: CustomLambdaEvent,
	context: Context,
): Promise<LambdaOutput> => {
	try {
		context.callbackWaitsForEmptyEventLoop = false;
		const loggerOptions = {
			awsTraceId: process.env._X_AMZN_TRACE_ID,
			awsRequestId: context.awsRequestId,
		};
		const logger = createLogger(loggerOptions);
		if (!event.action) throw new Error("event.action is required");
		if (typeof event.action !== "string") throw new Error("event.action must be a string");
		const handler = handlers[event.action];
		if (handler == null) throw new Error(`event action ${event.action} is not supported`);
		const { statusCode, ...rest } = await handler({ logger, event });
		return { statusCode, body: JSON.stringify(rest) };
	} catch (error: unknown) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				status: "ERROR",
				code: "BAD_EVENT_ACTION",
				message: (error as Error).message ?? "Internal server error",
			}),
		};
	}
};
