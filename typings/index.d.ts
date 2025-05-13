/// <reference types="egg" />
import "egg"
import { UserProps } from "../app/model/user"
import { Model } from "mongoose"
declare module "egg" {
  interface MongooseModels extends IModel {
    [k: string]: Model<any>
  }
  interface Context {
    genHash(plainText: string): Promise<string>
    compare(plainText: string, hash: string): Promise<boolean>
  }
  interface EggAppConfig {
    bcrypt: {
      saltRounds: number
    }
  }
}
