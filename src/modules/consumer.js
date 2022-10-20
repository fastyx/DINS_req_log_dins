const config = require('../../init_config');
const logger = require('../../config/logger');

logger.info(`${config.serviceName}: kafka consumer started ${config.SYSTEM.queueProperties.nodes}`);

var kafka = require('kafka-node'),
    ConsumerGroup = kafka.ConsumerGroup;
var consumerOptions = {
    kafkaHost: config.SYSTEM.queueProperties.nodes,
    groupId: config.SYSTEM.queueProperties.options.groupId,
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    fromOffset: 'earliest'
};
var topics = [config.SYSTEM.queueProperties.options.topic];
try{
    var consumerGroup = new ConsumerGroup(Object.assign({ id: config.SYSTEM.queueProperties.options.consumerId }, consumerOptions), topics);
} catch(e){
    logger.error("here")
}


consumerGroup.on('message', async function (message) {
    try {
        console.log("Сообщение считано")
    } catch (e) {
        logger.error(`${config.serviceName}. consumer. Error:\n${JSON.stringify({ "error": e, "stack": e.stack })}`);
    }
});

consumerGroup.on(`error`, async function (err) {
    logger.error(`${config.serviceName}. consumer. error during read data from queue(${config.SYSTEM.queueProperties.options.topic}). Error:\n${JSON.stringify(err)}`);
});
