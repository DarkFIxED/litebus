import {MessageBusService} from './message-bus.service';
import {Message} from './message';
import {MessagePriority} from './message-priority';

describe('MessageBusService', () => {
    let service: MessageBusService;
    
    beforeEach(() => {
        service = new MessageBusService();
    });
    
    it('listen() adds listener and returns identifier of created listener', () => {
        let listenerId = service.listen(['test'], observable => observable.subscribe(() => {}));
        
        expect(listenerId).toBeDefined();
    });
    
    it('publish() calls all assigned subscriptions', () => {
        service.listen(['test'], observable => observable.subscribe((message) => {
            expect(message).toBeDefined();
            expect(message.name).toEqual('test');
        }));
    
        service.listen(['test'], observable => observable.subscribe((message) => {
            expect(message).toBeDefined();
            expect(message.name).toEqual('test');
        }));
        
        service.publish(new Message<any>('test', {}, MessagePriority.Normal));
    });
    
    it('listenAll() creates subscription which called by any published messages', () => {
        service.listenAll(observable => observable.subscribe((message) => {
            expect(message).toBeDefined();
            expect(message.name).toEqual('test');
        }));
        
        service.publish(new Message<any>('test', {}, MessagePriority.Normal));
    });
    
});
