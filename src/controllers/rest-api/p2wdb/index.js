/*
  REST API library for the /p2wdb route.

  This sets up an endpoint that can be called by the v4 P2WDB.
*/

// Public npm libraries.
import Router from 'koa-router'

// Local libraries.
import P2wdbRESTControllerLib from './controller.js'
import Validators from '../middleware/validators.js'

// let _this

class P2wdbRouter {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating IPFS REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating IPFS REST Controller.'
      )
    }

    const dependencies = {
      adapters: this.adapters,
      useCases: this.useCases
    }

    // Encapsulate dependencies.
    this.p2wdbRESTController = new P2wdbRESTControllerLib(dependencies)
    this.validators = new Validators()

    // Instantiate the router and set the base route.
    const baseUrl = '/p2wdb'
    this.router = new Router({ prefix: baseUrl })

    // _this = this
  }

  attach (app) {
    if (!app) {
      throw new Error(
        'Must pass app object when attaching REST API controllers.'
      )
    }

    // Define the routes and attach the controller.
    this.router.post('/', this.p2wdbRESTController.bridgeEntry)

    // Attach the Controller routes to the Koa app.
    app.use(this.router.routes())
    app.use(this.router.allowedMethods())
  }
}

// module.exports = BchRouter
export default P2wdbRouter
