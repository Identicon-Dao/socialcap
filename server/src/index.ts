import 'module-alias/register';
// import Fastify from 'fastify';
import { fastify, logger } from "./global";
import fastifyJwt from '@fastify/jwt';
import cors from '@fastify/cors'
import fastifyRoutes from '@fastify/routes';
import helperRoutes from './routes/helper-routes';
import queryRoutes from './routes/query-routes';
import mutationRoutes from './routes/mutation-routes';

// setup JWT plugin
fastify.register(fastifyJwt, { secret: 'MYYYYsupersecret' })

// show all routes on server startup (just for debug)
fastify.register(fastifyRoutes);

fastify
  .register(helperRoutes)
  .register(queryRoutes)
  .register(mutationRoutes);

// register CORS
fastify.register(require('@fastify/cors'), (instance) => {
  return (request: any, callback: any) => {
    const corsOptions = {
      // This is NOT recommended for production as it enables reflection exploits
      origin: true
    };

    // do not include CORS headers for requests from localhost
    if (/^localhost$/m.test(request.headers.origin)) {
      corsOptions.origin = false
    }
  }
})

fastify.register(async function (fastify) {
  // Configures the Access-Control-Allow-Methods CORS header.
})

/**
 * Run the server!
 */
fastify.listen({ port: 3080 }, (err, address) => {
  if (err) {
    logger.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`);
  console.log(fastify.routes);
})
