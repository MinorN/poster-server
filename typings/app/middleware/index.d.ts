// This file is created by egg-ts-helper@2.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportCustomerError from '../../../app/middleware/customerError';

declare module 'egg' {
  interface IMiddleware {
    customerError: typeof ExportCustomerError;
  }
}
