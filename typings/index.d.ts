/// <reference types="egg" />
import "egg"
import { UserProps } from "../app/model/user"
import { Model } from "mongoose"
import OSS, { COSOptions } from "cos-nodejs-sdk-v5"
declare module "egg" {
  interface MongooseModels extends IModel {
    [k: string]: Model<any>
  }
  interface Context {
    genHash(plainText: string): Promise<string>
    compare(plainText: string, hash: string): Promise<boolean>
    oss: OSS
  }
  interface Application {}
  interface EggAppConfig {
    bcrypt: {
      saltRounds: number
    }
    oss: {
      client?: COSOptions
    }
  }
}
