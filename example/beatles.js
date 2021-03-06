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

beeserver(config).then(app => {
    app.get('/selftest', (_, res) => {
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send('OK!');
    });

    app.listen(port, () => {
        console.log(`Beeserver listening on port ${port}...`);
    });
})
