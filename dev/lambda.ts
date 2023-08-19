import "dotenv/config";
import type { Context } from "aws-lambda";
import { handler } from "../src/index.js";
import { EVENTS, logResponse } from "./events/index.js";

const response = await handler(EVENTS.getAddress, {} as Context);

logResponse(response);
