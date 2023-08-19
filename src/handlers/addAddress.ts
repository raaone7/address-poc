import { z } from "zod";
import { tagMethod } from "src/lib/tagging.js";
import { makeValidate } from "src/lib/zod.js";
import { inputAddressValidator } from "../lib/types.js";
import type { HandlerFunction } from "../lib/types.js";
import { addAddressForUser } from "src/lib/queries/Address.js";

const method = "addAddress";
const eventSchema = z.object({
	action: z.literal(method),
	payload: z.object({
		userId: z.string().uuid(),
		address: inputAddressValidator,
	}),
});
const eventSchemaZod = makeValidate(eventSchema);

export const addAddress: HandlerFunction = async (input) => {
	const logger = input.logger.child({ method });
	const tag = tagMethod(logger, method);

	tag("START", { event: input.event });
	try {
		// 1. validate
		const validation = eventSchemaZod(input.event, method);
		if (!validation.success) {
			const data = {
				code: "INVALID_PAYLOAD",
				message: validation.data,
				status: "error",
				statusCode: 400,
			};
			logger.error(data, data.code);
			return data;
		}

		// 2. save address in db
		const { address, userId } = validation.data.payload;
		const addressDBItem = await addAddressForUser(userId, address);
		// TODO: perform conditional write
		// TODO: avoid duplicate concurrent request by locking into cash

		tag("END");
		// 3. return response
		return {
			code: "SUCCESS",
			message: "address saved",
			status: "success",
			statusCode: 200,
			data: { addressDBItem },
		};
	} catch (error: unknown) {
		// TODO: retry failed requests
		logger.error(error);
		return {
			code: "ERROR",
			message: (error as Error).message,
			status: "error",
			statusCode: 500,
		};
	}
};
// TODO: write unit tests
