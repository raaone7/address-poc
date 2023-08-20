import { z } from "zod";
import { tagMethod } from "src/lib/tagging.js";
import { makeValidate } from "src/lib/zod.js";
import type { HandlerFunction } from "../lib/types.js";
import { getAddressesOfUser } from "src/lib/queries/Address.js";
import type { AddressDBItem } from "src/lib/tables/AddressTable.js";

const method = "getAddress";
const eventSchema = z.object({
	action: z.literal(method),
	payload: z.object({
		userId: z.string().uuid(),
		suburb: z.string().trim().min(3).optional(),
		postCode: z.string().trim().min(4).max(4).regex(/^[0-9]*$/).optional(),
	}),
});
const eventSchemaZod = makeValidate(eventSchema);

const mapAddress = (dbItems: AddressDBItem[]) => {
	return dbItems
		.sort((a, b) => {
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		})
		.map((i) => {
			return {
				userId: i.userId,
				id: i.id,
				...i.address,
				createdAt: i.createdAt,
			};
		});
};

export const getAddress: HandlerFunction = async (input) => {
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

		// 2. fetch addresses from db
		const { userId, postCode, suburb } = validation.data.payload;
		const response = await getAddressesOfUser({ userId, postCode, suburb });
		const addresses = mapAddress(response);
		// TODO: perform consistent read
		// TODO: query to do the sorting than the code

		tag("END");
		// 3. return response
		return {
			code: "SUCCESS",
			message: "addresses fetched",
			status: "success",
			statusCode: 200,
			data: { addresses },
		};
	} catch (error: unknown) {
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
