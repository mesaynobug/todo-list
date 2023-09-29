import { IOHandler } from "./IOHandler";
import { ServerResponse } from "http";

export class TestIOHandler implements IOHandler {
    res: ServerResponse;

    async output(s: string): Promise<void> {
        console.log(s);
    }

    end(): void {
        this.res;
    }

    constructor(res: ServerResponse) {
        this.res = null as unknown as ServerResponse;
    }
}
