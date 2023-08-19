import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { PutCommandInput, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { PutCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { credentials, AWS_REGION } from "./awsCredentials.js";

export type DynamoDBItem = Record<string, unknown>;
export type DynamoDBItemKey = Record<string, unknown>;
export type PutItemParams = Omit<PutCommandInput, "TableName" | "Item">;
export type QueryItemsParams = Omit<QueryCommandInput, "TableName">;

export class DynamoDB<K extends DynamoDBItemKey, T extends DynamoDBItem> {
	readonly #tableName: string;
	readonly #client: DynamoDBDocumentClient;
	constructor(tableName: string) {
		this.#tableName = tableName;
		const ddbClient = new DynamoDBClient({ region: AWS_REGION, credentials });
		this.#client = DynamoDBDocumentClient.from(ddbClient, {
			marshallOptions: { removeUndefinedValues: true },
		});
	}

	#parseError(error: unknown, method: string): never {
		if (error instanceof Error) {
			error.message = `[dynamodb.${this.#tableName}.${method}] - ${error.message}`;
			throw error;
		}
		throw error;
	}

	async putItem(record: T, params: PutItemParams = {}): Promise<void> {
		try {
			const command = new PutCommand({ TableName: this.#tableName, Item: record, ...params });
			await this.#client.send(command);
		} catch (error) {
			this.#parseError(error, this.putItem.name);
		}
	}

	async queryItems(params: QueryItemsParams = {}): Promise<T[]> {
		try {
			const { Limit, ...rest } = params;
			const limit = Math.max(0, Limit ?? 0);
			if (limit === 0) return [];
			const queryParams: QueryItemsParams = { ...rest };
			if (!params.FilterExpression) queryParams.Limit = limit;
			const allItems: T[] = [];
			let lastEvaluatedKey: K | undefined;
			do {
				const command = new QueryCommand({ TableName: this.#tableName, ...queryParams });
				const data = await this.#client.send(command);
				allItems.push(...((data.Items ?? []) as T[]));
				lastEvaluatedKey = data.LastEvaluatedKey as K;
				queryParams.ExclusiveStartKey = lastEvaluatedKey;
			} while (allItems.length < limit && lastEvaluatedKey);
			return allItems.slice(0, limit);
		} catch (error) {
			this.#parseError(error, this.queryItems.name);
		}
	}
}
