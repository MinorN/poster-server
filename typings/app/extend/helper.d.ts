// This file is created by egg-ts-helper@3.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExtendIHelper from '../../../app/extend/helper.js';
type ExtendIHelperType = typeof ExtendIHelper;
declare module 'egg' {
  interface IHelper extends ExtendIHelperType { }
}