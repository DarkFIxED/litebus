import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Listener } from './listener';
import { Message } from './message';
import { Subscription } from 'rxjs/internal/Subscription';
import { SimpleMessage } from './simple-message';
import { ListenerPriority } from './listener-priority';
import {OneTimeListener} from './one-time-listener';

@Injectable()
export class MessageBusService {

    private listeners: Listener[] = [];

    public listen(eventTypes: string[],
                  subscriptionFunc: (observable: Observable<Message<any> | SimpleMessage>) => Subscription,
                  priority: ListenerPriority = ListenerPriority.Normal): string {
        const listener = new Listener(eventTypes, subscriptionFunc, priority);
        this.listeners.push(listener);

        return listener.id;
    }

    public listenAll(subscriptionFunc: (observable: Observable<Message<any> | SimpleMessage>) => Subscription,
                     priority: ListenerPriority = ListenerPriority.Normal): string {
        return this.listen(['*'], subscriptionFunc, priority);
    }

    public listenOnce(eventTypes: string[],
                      subscriptionFunc: (observable: Observable<Message<any> | SimpleMessage>) => Subscription,
                      priority: ListenerPriority = ListenerPriority.Normal): string {
        const listener = new OneTimeListener(eventTypes, subscriptionFunc, priority);
        this.listeners.push(listener);
    
        return listener.id;
    }
    
    public listenAllOnce(subscriptionFunc: (observable: Observable<Message<any> | SimpleMessage>) => Subscription,
                     priority: ListenerPriority = ListenerPriority.Normal): string {
        return this.listenOnce(['*'], subscriptionFunc, priority);
    }
    
    public stopListen(listenerIds: string[]): void {
        let listeners = this.listeners.filter(x => listenerIds.some(y => y === x.id));

        for (let listener of listeners) {
            this.removeListener(listener);
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
        
        this.removeOneTimeListeners(relevantListeners);
    }
    
    private removeOneTimeListeners(relevantListeners: Listener[]): void {
        let oneTimeListeners = relevantListeners.filter(listener => {
            return listener instanceof OneTimeListener;
        });
    
        for (let listener of oneTimeListeners) {
            this.removeListener(listener);
        }
    }
    
    private removeListener(listener: Listener): void {
        let index = this.listeners.indexOf(listener);
    
        listener.subscription.unsubscribe();
        this.listeners.splice(index, 1);
    }
}
