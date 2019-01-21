import { Message } from './message';

export class SimpleMessage extends Message<any> {
    constructor(name: string,
                payload?: any,
                sender?: any) {
        super(name, payload, sender);
    }
}
