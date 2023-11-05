/*
  REST API Controller library for the /ipfs route
*/

import axios from 'axios'

import wlogger from '../../../adapters/wlogger.js'
import config from '../../../../config/index.js'

class P2wdbRESTControllerLib {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating /ipfs REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating /ipfs REST Controller.'
      )
    }

    // Encapsulate dependencies
    // this.UserModel = this.adapters.localdb.Users
    // this.userUseCases = this.useCases.user

    // Bind 'this' object to all subfunctions
    this.bridgeEntry = this.bridgeEntry.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  // Return information on IPFS peers this node is connected to.
  async bridgeEntry (ctx) {
    try {
      const body = ctx.request.body
      console.log('bridgeEntry() body: ', body)

      const result1 = await axios.get(`${config.v4P2wdbUrl}/entry/txid/${body.txid}`)
      console.log('result1.data: ', JSON.stringify(result1.data, null, 2))

      const entry = {
        txid: result1.data.data.key,
        signature: result1.data.data.value.signature,
        message: result1.data.data.value.message,
        data: result1.data.data.value.data,
        appId: result1.data.data.appId
      }

      const result2 = await axios.post(`${config.v5P2wdbUrl}/entry/write`, entry)
      console.log('bridgeEntry() result2.data: ', result2.data)

      ctx.body = result2.data
    } catch (err) {
      wlogger.error('Error in p2wdb/controller.js/bridgeEntry(): ', err)
      // ctx.throw(422, err.message)
      this.handleError(ctx, err)
    }
  }

  // DRY error handler
  handleError (ctx, err) {
    // If an HTTP status is specified by the buisiness logic, use that.
    if (err.status) {
      if (err.message) {
        ctx.throw(err.status, err.message)
      } else {
        ctx.throw(err.status)
      }
    } else {
      // By default use a 422 error if the HTTP status is not specified.
      ctx.throw(422, err.message)
    }
  }
}

// module.exports = IpfsRESTControllerLib
export default P2wdbRESTControllerLib
