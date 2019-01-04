import { Message } from './message';
import { ListenerPriority } from './listener-priority';

export class SimpleMessage extends Message<any> {
    constructor(name: string,
                payload: any = undefined,
                priority: ListenerPriority = ListenerPriority.Normal) {
        super(name, payload, priority);
    }
}
