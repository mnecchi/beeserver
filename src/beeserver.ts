import * as express from 'express';
import * as bodyParser from 'body-parser';
import DbMock from 'dev-dbmock';
import { BeeserverConfig, RestMethod, Alias } from './types';

const getAliases = (aliases: Alias[] | undefined, method: RestMethod) => {
  if (!aliases) {
    return [];
  }

  return aliases.reduce((acc, { name, methods }) => {
    if (methods === undefined || methods.includes(method)) {
      acc.push(name);
    }
    return acc;
  }, [] as string[]); 
};

export const beeserver = async ({ dbPath, endpoints }: BeeserverConfig): Promise<express.Express> => {
  const app = express();

  app.use(bodyParser.json());

  app.use((_, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  const { addTable } = await DbMock({ path: dbPath });

  // Endpoints
  Object.keys(endpoints).forEach(async (name) => {
    const { seed, aliases, methods = [RestMethod.GET, RestMethod.POST, RestMethod.PATCH] } = endpoints[name];
    const { get, put } = await addTable({ name, seed });

    methods.forEach((method) => {
      const allEndpoints = [name, ...getAliases(aliases, method)];
      switch (method) {
        case RestMethod.GET:
          allEndpoints.forEach(endpoint => {
            app.get(`/${endpoint}/:id?`, async (req, res) => res.status(200).send(await get(req.params.id)));
          })
          break;
        case RestMethod.POST:
          allEndpoints.forEach(endpoint => {
            app.post(`/${endpoint}/`, async (req, res) => {
              const { body } = req;
              delete body.id;
              return res.status(200).send(await put(body));
            });
          });
          break;
        case RestMethod.PATCH:
          allEndpoints.forEach(endpoint => {
            app.patch(`/${endpoint}/:id`, async (req, res) => {
              const { body } = req;
              body.id = req.params.id;
              return res.status(200).send(await put(body));
            });
          });
          break;
        default:
          break;
      }
    });
  });

  return app;
};
