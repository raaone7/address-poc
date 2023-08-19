import { fromEnv } from "@aws-sdk/credential-providers";

const getAwsVariables = () => {
	try {
		// AWS_REGION is required
		const AWS_REGION = process.env.AWS_REGION;
		if (AWS_REGION == null) throw new Error("cannot find AWS_REGION environment variable");

		// AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
		// When working locally, above secrets fetched from environment (.env file)
		// When deployed to AWS, above secrets are available in Lambda environment
		const credentials = fromEnv();
		if (credentials == null) throw new Error("cannot get credentials from env");
		return { AWS_REGION, credentials };
	} catch (error) {
		const method = "npm.aws-core.getAwsVariables";
		console.error({
			level: "error",
			time: new Date().toISOString(),
			method,
			message: `[${method}] - ${(error as Error).message}`,
			payload: { error },
		});
		process.exit(1);
	}
};

const { AWS_REGION, credentials } = getAwsVariables();
export { AWS_REGION, credentials };
