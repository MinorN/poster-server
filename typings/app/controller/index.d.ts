// This file is created by egg-ts-helper@3.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import "egg"
import ExportUserController from "../../../app/controller/user.js"

declare module "egg" {
  interface IController {
    userController: ExportUserController
  }
}
