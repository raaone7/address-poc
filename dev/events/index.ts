import addAddress from "./addAddress.json";
import getAddress from "./getAddress.json";
import getAddressWithPostCodeFilter from "./getAddressWithPostCodeFilter.json";
import getAddressWithSuburbFilter from "./getAddressWithSuburbFilter.json";

export const logResponse = (response: { statusCode: number; body: string }) => {
	console.log("\n\n");
	console.log("______________________");
	console.log("Status Code", response.statusCode);
	console.log("------- Body -------");
	console.log(JSON.stringify(JSON.parse(response.body), null, 2));
	console.log("______________________");
	console.log("\n\n");
};

export const EVENTS = {
	addAddress,
	getAddress,
	getAddressWithPostCodeFilter,
	getAddressWithSuburbFilter,
};
