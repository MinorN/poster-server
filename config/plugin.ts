import { EggPlugin } from "egg"

const plugin: EggPlugin = {
  mongoose: {
    enable: true,
    package: "egg-mongoose",
  },
  tegg: {
    enable: true,
    package: "@eggjs/tegg-plugin",
  },
  teggConfig: {
    enable: true,
    package: "@eggjs/tegg-config",
  },
  teggController: {
    enable: true,
    package: "@eggjs/tegg-controller-plugin",
  },
  teggSchedule: {
    enable: true,
    package: "@eggjs/tegg-schedule-plugin",
  },
  eventbusModule: {
    enable: true,
    package: "@eggjs/tegg-eventbus-plugin",
  },
  aopModule: {
    enable: true,
    package: "@eggjs/tegg-aop-plugin",
  },
  tracer: {
    enable: true,
    package: "@eggjs/tracer",
  },
  nulljucks: {
    enable: true,
    package: "egg-view-nunjucks",
  },
}

export default plugin
