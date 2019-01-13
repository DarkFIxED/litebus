import {Listener} from './listener';
import {Observable, Subscription} from 'rxjs';
import {Message} from './message';
import {SimpleMessage} from './simple-message';
import {ListenerPriority} from './listener-priority';

export class OneTimeListener extends Listener {
    public constructor(eventTypes: string[],
                       subscriptionFunc: (observable: Observable<Message<any> | SimpleMessage>) => Subscription,
                       priority: ListenerPriority = ListenerPriority.Normal) {
        super(eventTypes, subscriptionFunc, priority);
    }
}
