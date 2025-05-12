import "egg"
import { UserProps } from "../app/model/user"
import { Model } from "mongoose"
declare module "egg" {
  interface MongooseModels {
    User: Model<UserProps>
  }
}
