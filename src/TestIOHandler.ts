import { IOHandler } from "./IOHandler";

export class TestIOHandler implements IOHandler {
    async output(s: string): Promise<void> {
        console.log(s);
    }

    end(): void {
        1;
    }
}
