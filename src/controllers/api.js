const config = require('../../init_config');
const pjson = require('../../package.json');
const promClient = require('prom-client');
const db = require("../models/users")
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function getIsrun(req, res, next) {
    res.status(200).send('Ok!');
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function getFullstatus(req, res, next) {
    res.status(200).send({ response: [{ status: 0 }, { version: `${pjson.version}` }, { config: `${config}` }] });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });
async function getMetrics(req, res, next) {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = {
    getIsrun,
    getFullstatus,
    getMetrics
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////