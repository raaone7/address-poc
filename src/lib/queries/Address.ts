import { randomUUID } from "crypto";
import type { InputAddress } from "../types.js";
import { type AddressDBItem, AddressTable } from "../tables/AddressTable.js";

export const getAddressesOfUser = async ({
	userId,
	postCode,
	suburb,
}: { userId: string; postCode?: string; suburb?: string }) => {
	const query = {
		IndexName: "userId-index",
		KeyConditionExpression: "#userId = :userId",
		ExpressionAttributeNames: { "#userId": "userId" },
		ExpressionAttributeValues: { ":userId": userId },
		Limit: 100,
	};

	// @ts-ignore
	if (postCode || suburb) query.FilterExpression = "";
	if (postCode) {
		// @ts-ignore
		if (query.FilterExpression) query.FilterExpression += "AND";
		// @ts-ignore
		query.FilterExpression += " #postCode = :postCode ";
		// @ts-ignore
		query.ExpressionAttributeNames["#postCode"] = "postCode";
		// @ts-ignore
		query.ExpressionAttributeValues[":postCode"] = postCode;
	}
	if (suburb) {
		// @ts-ignore
		if (query.FilterExpression) query.FilterExpression += "AND";
		// @ts-ignore
		query.FilterExpression += " #suburb = :suburb ";
		// @ts-ignore
		query.ExpressionAttributeNames["#suburb"] = "suburb";
		// @ts-ignore
		query.ExpressionAttributeValues[":suburb"] = suburb;
	}

	const items = await AddressTable.instance.queryItems(query);
	return items;
};

export const addAddressForUser = async (userId: string, address: InputAddress) => {
	const addressDBItem: AddressDBItem = {
		id: randomUUID(),
		userId,
		createdAt: new Date().toISOString(),
		address,
		suburb: address.suburb,
		postCode: address.postCode,
	};
	await AddressTable.instance.putItem(addressDBItem);
	return addressDBItem;
};
