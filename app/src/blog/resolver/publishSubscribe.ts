import { PubSub } from 'graphql-subscriptions';

export class PublishSubscribe {
    // PubSub is not fit for production use
    static pubSub = new PubSub();
}