const { default: beeserver, RestMethod } = require('../lib');

const port = 5000;

const config = {
    dbPath: 'db',
    endpoints: {
        beatles: {
            seed: [{ id: 'john', name: 'John Lennon' }],
            aliases: [
                { name: 'fabfour', methods: [RestMethod.GET]}
            ]
        }
    }
};

beeserver(port, config, () => {
    console.log(`Beeserver listening on port ${port}...`);
});
