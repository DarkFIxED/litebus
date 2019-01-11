# About
Litebus is a lightweight message bus for angular apps.

# Documentation
This library provides messages exchanging between different modules with priorities mechanism. 

## Installation and configuration
First of all it is required to install package via npm:

```bash
npm install litebus
```

After that you must register *MessageBusService* in root module of your app:

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageBusService } from 'litebus';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    providers: [MessageBusService]
})
export class AppModule {
}
```
As you can see *MessageBusService* present in *providers* property of *AppModule*. Sure, you can select different module or component which will provide *MessageBusService*.

Package installed and ready to work.

## Messaging
MessageBusService provides some methods to implement messaging system. When you publishing any message MessageBusService notify all previously created listeners on order of their priority.

### Examples

Trace all messages:
```typescript
constructor(private messageBus: MessageBusService) {
    this.messageBus.listenAll((observable) => {
        return observable.subscribe(message => console.log(message));
    }, ListenerPriority.High);
}
```

Listen messages with name *MessageNames.DomainPlaceAdded*:
```typescript
this.listeners.push(
    this.messageBus.listen([MessageNames.DomainPlaceAdded],
        (observable: Observable<Message<Place>>) => {
            return observable.subscribe(message => this.drawPlace(message.payload));
        })
);
```
Note: *listen* and *listenAll* methods returns identifier of newly created listener. Use this identifier to cancel listening with *stopListen* method.

Listen messages with high *ListenerPriority*:
```typescript
this.listeners.push(
    this.messageBus.listen([MessageNames.DomainPlaceAdded],
        (observable: Observable<Message<Place>>) => {
            return observable.subscribe(message => this.drawPlace(message.payload));
        }),
        ListenerPriority.High
);
```

Stop listen messages: 
```typescript
this.messageBus.stopListen(this.listeners);
this.listeners.splice(0, this.listeners.length);
```

Reject listened message to prevent handling with next listeners:
```typescript
this.listeners.push(
    this.messageBus.listen([MessageNames.DomainPlaceAdded],
        (observable: Observable<Message<Place>>) => {
            return observable.subscribe(message => {
                message.reject();
            });
        })
);
```

Publishing message:
```typescript
let message = new Message(MessageNames.DomainPlaceAdded, place, sender);
this.messageBus.publish(message);
```

# Conclusion
I really hope that this package will help you. Enjoy ;)
