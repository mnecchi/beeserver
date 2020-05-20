import { beeserver } from '../src/beeserver';
import { BeeserverConfig, RestMethod } from "../src/types";
import DbMock from 'dev-dbmock';
import * as express from 'express';

const mockedAddTable = jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    put: jest.fn(),
}));
jest.mock('dev-dbmock', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        addTable: mockedAddTable,
    })),
}));

const mockedExpressUse = jest.fn();
const mockedExpressGet = jest.fn();
const mockedExpressPost = jest.fn();
const mockedExpressPatch = jest.fn();
jest.mock('express', () => jest.fn().mockImplementation(() => ({
    ...jest.requireActual('express'),
    use: mockedExpressUse,
    get: mockedExpressGet,
    post: mockedExpressPost,
    patch: mockedExpressPatch,
})));

const config: BeeserverConfig = {
    dbPath: 'db',
    endpoints: {
        beatles: {
            seed: [{ id: 'john', name: 'John Lennon' }],
            aliases: [
                { name: 'fabfour', methods: [RestMethod.GET]}
            ]
        },
        pink_floyd: {
            seed: [{ id: 'syd', name: 'Syd Barrett'}]
        }
    }
};

beforeEach(() => {
    jest.clearAllMocks();
});

it('should create the db', async () => {
    await beeserver({ dbPath: 'data/db', endpoints: {} });
    expect(DbMock).toHaveBeenCalledTimes(1);
    expect(DbMock).toHaveBeenLastCalledWith({ path: 'data/db' });
});

it('should create the endpoints and aliases', async () => {
    await beeserver(config);

    expect(mockedAddTable).toHaveBeenCalledTimes(2);
    expect(mockedAddTable).toHaveBeenNthCalledWith(1, { 
        name: 'beatles',
        seed: config.endpoints.beatles.seed
    });
    expect(await mockedAddTable).toHaveBeenNthCalledWith(2, { 
        name: 'pink_floyd',
        seed: config.endpoints.pink_floyd.seed
    });

    expect(mockedExpressUse).toHaveBeenCalledTimes(2);

    expect(mockedExpressGet).toHaveBeenCalledTimes(3);
    expect(mockedExpressGet).toHaveBeenNthCalledWith(1, '/beatles/:id?', expect.any(Function));
    expect(mockedExpressGet).toHaveBeenNthCalledWith(2, '/fabfour/:id?', expect.any(Function));
    expect(mockedExpressGet).toHaveBeenNthCalledWith(3, '/pink_floyd/:id?', expect.any(Function));

    expect(mockedExpressPost).toHaveBeenCalledTimes(2);
    expect(mockedExpressPost).toHaveBeenNthCalledWith(1, '/beatles/', expect.any(Function));
    expect(mockedExpressPost).toHaveBeenNthCalledWith(2, '/pink_floyd/', expect.any(Function));

    expect(mockedExpressPatch).toHaveBeenCalledTimes(2);
    expect(mockedExpressPatch).toHaveBeenNthCalledWith(1, '/beatles/:id', expect.any(Function));
    expect(mockedExpressPatch).toHaveBeenNthCalledWith(2, '/pink_floyd/:id', expect.any(Function));
});