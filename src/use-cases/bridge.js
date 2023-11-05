/*
  This bridge use-case library is executed at startup to register a webhook with
  a v4 P2WDB. When a new entry hits that v4 P2WDB it triggers the webhook, which
  passes the entry data to this app. This app then rebroadcasts the entry to a
  v5 P2WDB.
*/

// Global npm libraries
import axios from 'axios'

// Local npm libraries
import config from '../../config/index.js'

class BridgeUseCases {
  async start () {
    try {
      const webhookUri = `${config.v4P2wdbUrl}/webhook`
      // const webhookTarget = 'http://localhost:5020/p2wdb'
      const webhookTarget = `${config.webhookTarget}/p2wdb`

      const postBody = {
        url: webhookTarget,
        appId: '*'
      }

      // Delete any previous webhook
      await axios.delete(webhookUri, { data: postBody })

      // Create a new webhook
      const result = await axios.post(webhookUri, postBody)
      console.log('result.data: ', result.data)
    } catch (err) {
      console.error('Error in use-cases/bridge.js/start()', err)
    }
  }
}

export default BridgeUseCases
