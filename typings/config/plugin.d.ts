// This file is created by egg-ts-helper@2.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import 'egg-onerror';
import 'egg-session';
import 'egg-i18n';
import 'egg-watcher';
import 'egg-multipart';
import 'egg-security';
import 'egg-development';
import 'egg-logrotator';
import 'egg-schedule';
import 'egg-static';
import 'egg-jsonp';
import 'egg-view';
import 'egg-mongoose';
import 'egg-validate';
import 'egg-cors';
import 'egg-jwt';
import 'egg-redis';
import 'egg-bcrypt';
import 'egg-cos';
import '@eggjs/tegg-plugin';
import '@eggjs/tegg-config';
import '@eggjs/tegg-controller-plugin';
import '@eggjs/tegg-schedule-plugin';
import '@eggjs/tegg-eventbus-plugin';
import '@eggjs/tegg-aop-plugin';
import '@eggjs/tracer';
import 'egg-view-nunjucks';
import { EggPluginItem } from 'egg';
declare module 'egg' {
  interface EggPlugin {
    onerror?: EggPluginItem;
    session?: EggPluginItem;
    i18n?: EggPluginItem;
    watcher?: EggPluginItem;
    multipart?: EggPluginItem;
    security?: EggPluginItem;
    development?: EggPluginItem;
    logrotator?: EggPluginItem;
    schedule?: EggPluginItem;
    static?: EggPluginItem;
    jsonp?: EggPluginItem;
    view?: EggPluginItem;
    mongoose?: EggPluginItem;
    validate?: EggPluginItem;
    cors?: EggPluginItem;
    jwt?: EggPluginItem;
    redis?: EggPluginItem;
    bcrypt?: EggPluginItem;
    oss?: EggPluginItem;
    tegg?: EggPluginItem;
    teggConfig?: EggPluginItem;
    teggController?: EggPluginItem;
    teggSchedule?: EggPluginItem;
    eventbusModule?: EggPluginItem;
    aopModule?: EggPluginItem;
    tracer?: EggPluginItem;
    nunjucks?: EggPluginItem;
  }
}