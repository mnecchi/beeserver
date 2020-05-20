import beeserver from './beeserver';
import { BeeserverConfig, RestMethod } from './types';

export { BeeserverConfig, RestMethod };

export default async (port: number, config: BeeserverConfig, callback?: (...args: any[]) => void) =>
  (await beeserver(config))
    .use((_, res) => {
        res.status(404).end();
    })
    .listen(port, callback);
