import type { ZodSchema } from "zod";
import { generateErrorMessage } from "zod-error";
import type { ErrorMessageOptions } from "zod-error";

const options: ErrorMessageOptions = {
	// delimiter: { error: " 🔥 ", component: " , " },
	delimiter: { error: "\n", component: ", " },
	transform: ({ errorMessage, index }) => `${index + 1}: ${errorMessage}`,
	prefix: "\n",
};

export const makeValidate =
	<T>(schema: ZodSchema<T>) =>
	(data: unknown, errorPrefix = "") => {
		const result = schema.safeParse(data);
		const prefix = errorPrefix ? `[ValidationError](${errorPrefix})` : "[ValidationError]";
		if (!result.success) {
			const errorMessage = generateErrorMessage(result.error.issues, options);
			return { success: false, data: `${prefix} - ${errorMessage}` } as const;
		}
		return { success: true, data: result.data } as const;
	};
