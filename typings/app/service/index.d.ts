// This file is created by egg-ts-helper@2.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportUser from '../../../app/service/user';
import ExportUtils from '../../../app/service/utils';
import ExportWork from '../../../app/service/work';

declare module 'egg' {
  interface IService {
    user: AutoInstanceType<typeof ExportUser>;
    utils: AutoInstanceType<typeof ExportUtils>;
    work: AutoInstanceType<typeof ExportWork>;
  }
}
