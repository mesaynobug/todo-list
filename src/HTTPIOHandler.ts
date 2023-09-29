import { IOHandler } from "./IOHandler";
import { ServerResponse } from "http";

export class HTTPIOHandler implements IOHandler {
    res: ServerResponse;

    async output(s: string): Promise<void> {
        this.res.write(s);
    }

    async end(): Promise<void> {
        this.res.end;
    }

    constructor(res: ServerResponse) {
        this.res = res;
    }
}
