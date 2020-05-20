# beeserver

## An api mocked server with a mocked db

### install

```sh
npm install --save-dev beeserver
```
or
```
yarn add --dev beeserver
```

### usage

*Typescript*:
```ts
import beeserver, { BeeserverConfig } from 'beeserver';

const port = 5000;

const config: BeeserverConfig = {
    dbPath: 'db',
    endpoints: {
        beatles: {
            seed: [{ id: 'john', name: 'John Lennon' }]
        }
    }
};

const app = await beeserver(config); // returns an Express app
app.listen(port, () => {
    console.log(`Beeserver listening on port ${port}...`);
});
```

*Javascript*:
```js
import beeserver from 'beeserver';

const port = 5000;

const config = {
    dbPath: 'db',
    endpoints: {
        beatles: {
            seed: [{ id: 'john', name: 'John Lennon' }]
        }
    }
};

const app = await beeserver(config); // returns an Express app
app.listen(port, () => {
    console.log(`Beeserver listening on port ${port}...`);
});
```

Configuration options are:
- **dbPath** (required): the path of the folder where to create the db files
- **endpoints** (required): an key/value object with endpoint's name as the key and the endpoint's config as the value

The Endpoint configuration options are:
- **seed** (optional): an array of objects to be initially stored in the table. The object **must** all have an `id` already.
- **aliases** (optional): an array of aliases' configuration
- **methods** (optional): an array of rest methods that must be implemented for the endpoint. If not defined all the methods are implemented (get, post and patch).

The Aliases configuration options are:
- **name** (required): the name of the alias
- **methods** (optional): an array of rest methods that must be implemented for the endpoint. If not defined all the methods are implemented (get, post and patch).
