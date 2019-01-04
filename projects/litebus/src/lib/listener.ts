import { Subscription } from 'rxjs/internal/Subscription';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';
import { UUID } from 'angular2-uuid';
import { Message } from './message';
import { SimpleMessage } from './simple-message';
import { MessagePriority } from './message-priority';

export class Listener {
    public readonly id: string;
    public readonly eventTypes: string[];
    public readonly priority: MessagePriority;
    public readonly subscription: Subscription;

    private readonly subject: Subject<Message<any> | SimpleMessage>;

    public constructor(eventTypes: string[],
                       subscriptionFunc: (observable: Observable<Message<any> | SimpleMessage>) => Subscription,
                       priority: MessagePriority = MessagePriority.Normal) {
        this.id = UUID.UUID();
        this.eventTypes = [...eventTypes];
        this.priority = priority;
        this.subject = new Subject<Message<any> | SimpleMessage>();

        this.subscription = subscriptionFunc(this.subject.asObservable());
    }

    public handle(message: Message<any> | SimpleMessage): void {
        this.subject.next(message);
    }
}
