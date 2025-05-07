// This file is created by egg-ts-helper@3.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportTest from '../../../app/controller/test.js';

declare module 'egg' {
  interface IController {
    test: ExportTest;
  }
}
