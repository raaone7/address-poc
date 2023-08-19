import { DynamoDB } from "../DynamoDB.js";
import type { InputAddress } from "../types.js";

export type AddressDBItem = {
	/** PK: Unique Identifier for item*/
	id: string;
	/** SK: user identifier (uuid) */
	userId: string;
	/** ISO8601 timestamp */
	createdAt: string;
	address: InputAddress;
	// for filtering
	postCode: string;
	suburb: string;
};

export type AddressDBKey = {
	/** Hash */
	id: string;
	/** Range */
	userId: number;
};

// Table
export class AddressTable extends DynamoDB<AddressDBKey, AddressDBItem> {
	private constructor() {
		super("Address");
	}
	static #instance: AddressTable;
	static get instance() {
		if (!this.#instance) this.#instance = new this();
		return this.#instance;
	}
}
