import { Message } from './message';
import { MessagePriority } from './message-priority';

export class SimpleMessage extends Message<any> {
    constructor(name: string,
                payload: any = undefined,
                priority: MessagePriority = MessagePriority.Normal) {
        super(name, payload, priority);
    }
}
