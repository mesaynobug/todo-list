export interface IOHandler {
    output(s: string): Promise<void>;
    end(): void;
}
