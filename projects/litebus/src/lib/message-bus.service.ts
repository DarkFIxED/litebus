import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Listener } from './listener';
import { Message } from './message';
import { Subscription } from 'rxjs/internal/Subscription';
import { SimpleMessage } from './simple-message';
import { MessagePriority } from './message-priority';

@Injectable()
export class MessageBusService {

    private listeners: Listener[] = [];

    public listen(eventTypes: string[],
                  subscriptionFunc: (observable: Observable<Message<any> | SimpleMessage>) => Subscription,
                  priority: MessagePriority = MessagePriority.Normal): string {
        let listener = new Listener(eventTypes, subscriptionFunc, priority);
        this.listeners.push(listener);

        return listener.id;
    }

    public listenAll(subscriptionFunc: (observable: Observable<Message<any> | SimpleMessage>) => Subscription,
                     priority: MessagePriority = MessagePriority.Normal): string {
        return this.listen(['*'], subscriptionFunc, priority);
    }

    public stopListen(listenerIds: string[]) {
        let listeners = this.listeners.filter(x => listenerIds.some(y => y === x.id));

        for (let listener of listeners) {
            let index = this.listeners.indexOf(listener);

            listener.subscription.unsubscribe();
            this.listeners.splice(index, 1);
        }
    }

    public publish(message: Message<any> | SimpleMessage) {
        let relevantListeners = this.listeners.filter(x => x.eventTypes.some(x => x === message.name || x === '*'));
        relevantListeners = relevantListeners.sort((listenerA, listenerB) => listenerA.priority - listenerB.priority);

        for (let listener of relevantListeners) {
            if (message.isRejected) {
                break;
            }

            listener.handle(message);
        }
    }
}
