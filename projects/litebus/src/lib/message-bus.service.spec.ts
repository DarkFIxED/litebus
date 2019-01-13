import {MessageBusService} from './message-bus.service';
import {Message} from './message';
import {ListenerPriority} from './listener-priority';

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
        
        service.publish(new Message<any>('test', {}, ListenerPriority.Normal));
    });
    
    it('listenAll() creates subscription which called by any published messages', () => {
        service.listenAll(observable => observable.subscribe((message) => {
            expect(message).toBeDefined();
            expect(message.name).toEqual('test');
        }));
        
        service.publish(new Message<any>('test', {}, ListenerPriority.Normal));
    });
    
    it('stopListen() removes existing listener', () => {

        // arrange.
        let callsCount = 0;
        
        let listenerId = service.listen(['test'], observable => observable.subscribe(() => {
            callsCount++;
        }));
        
        // act.
        service.publish(new Message<any>('test', {}, ListenerPriority.Normal));
        service.stopListen([listenerId]);
        service.publish(new Message<any>('test', {}, ListenerPriority.Normal));
        
        // assert.
        expect(callsCount).toEqual(1);
    });
    
    it('listenOnce() firing one time', () => {
        
        // arrange.
        let callsCount = 0;
        
        service.listenOnce(['test'], observable => observable.subscribe(() => {
            callsCount++;
        }));
        
        // act.
        service.publish(new Message<any>('test', {}, ListenerPriority.Normal));
        service.publish(new Message<any>('test', {}, ListenerPriority.Normal));
        
        // assert.
        expect(callsCount).toEqual(1);
    });
    
    it('listenAllOnce() firing one time', () => {
        
        // arrange.
        let callsCount = 0;
        
        service.listenAllOnce(observable => observable.subscribe(() => {
            callsCount++;
        }));
        
        // act.
        service.publish(new Message<any>('test', {}, ListenerPriority.Normal));
        service.publish(new Message<any>('test', {}, ListenerPriority.Normal));
        
        // assert.
        expect(callsCount).toEqual(1);
    });
    
});
