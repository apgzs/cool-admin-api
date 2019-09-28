"use strict";

const DEFAULT_TTL = 600;
const REDIS_PRE = 'cache';
const _ = require('lodash');
const {Repository} = require('typeorm');

Object.defineProperty(exports, "__esModule", {
    value: true
});

function Cache(config) {
    if (config === void 0) {
        config = {};
    }
    return function (target, name, propertyDesciptor) {
        let prop = propertyDesciptor.value ? "value" : "get";
        let originalFunction = propertyDesciptor[prop];
        propertyDesciptor[prop] = async function () {
            let args = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                if (!(arguments[_i] instanceof Repository)){
                    args[_i] = arguments[_i];
                }
            }
            const url = this.ctx.url;
            if (config.url && _.startsWith(url, config.url) === false) {
                return await originalFunction.apply(this, args)
            }
            let key = REDIS_PRE + ':' + target.pathName + `.${name}` + (config.resolver ?
                config.resolver.apply(this, args) :
                JSON.stringify(args).split(':').join('='));
            const cacheValue = await this.app.redisGet(key);
            if (!_.isEmpty(cacheValue)) {
                return JSON.parse(cacheValue).data
            } else {
                let result = await originalFunction.apply(this, args);
                let data = {
                    data: result
                };
                this.ctx.app.redisSet(key, JSON.stringify(data), config.ttl ? config.ttl : DEFAULT_TTL);
                return result
            }
        };
        return propertyDesciptor
    };
}

exports.Cache = Cache;

function ClearCache() {
    return function (target, name, propertyDesciptor) {
        let prop = propertyDesciptor.value ? "value" : "get";
        propertyDesciptor[prop] = async function () {
            const key = REDIS_PRE + ':' + target.pathName + '*';
            const keys = await this.ctx.app.redis.keys(key);
            if (!_.isEmpty(keys)) {
                keys.forEach(key => {
                    this.ctx.app.redisDel(key)
                });
            }
        };
        return propertyDesciptor
    };
}

exports.ClearCache = ClearCache;
