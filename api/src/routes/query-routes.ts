/**
 * Implement Query router
 */
import { FastifyInstance } from "fastify";
import { hasError, UNKNOWN_ERROR } from '../errors.js';
import { i18n as _ } from "../i18n/messages.js";
import { queryHandlers } from "../controllers/index.js";
import { logger } from "../global.js";

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
async function queryRoutes(
  fastify: FastifyInstance, 
  options: Object
) {
   fastify.get('/api/query/:method', async (request, reply) => {
    // get the RPC method from the Url path
    const method = (request.params as any).method;
    
    // extract call "params" from queryString "?params=JSON.stringified(...)"
    const query = (request.query as any);
    let params: any = {}; 
    try { 
      params = JSON.parse(query.params); }
    catch (err) { 
      params = {}; 
    }
  
    // check if requested 'method' is valid
    const handler = (queryHandlers as any)[method];
    if (!handler) {
      return hasError.MethodNotSupported(
        _.method_not_supported(method)
      );
    }

    // check if we need to be authorized for callling this procedure
    const needsAuthorized = handler['authorize'];
    if (needsAuthorized) {
      fastify.log.info(`Handler ${method} needs authorization`)
      try {
        const jwt: any = await request.jwtVerify(); 
        console.log(jwt);
        // add to the received params
        params.user = { uid: jwt.uid?.replace(/-/g,'') }
      } catch (err: any) {
        return hasError.UnauthorizedError(err);
      }      
    }

    // call the registered 'method' with given 'params'
    try {
      const callFn = handler['fn'];
      return await callFn(params);
    }
    catch (err) {
      logger.error(`queryRoutes ${method} Error=${err}`);
      reply.code(UNKNOWN_ERROR).send(hasError.Unknown(
        _.unknown_error(method, `params=${JSON.stringify(params)}`)
      ));
    }
  })
}

export default queryRoutes;
