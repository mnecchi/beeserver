export enum RestMethod {
    GET = 'get',
    POST = 'post',
    PATCH = 'patch'
}

export interface Alias {
  name: string;
  methods?: RestMethod[];
}

interface EndpointConfig {
  methods?: RestMethod[];
  seed?: any[];
  aliases?: Alias[];
}
  
export interface BeeserverConfig {
  port: number;
  dbPath: string;
  endpoints: {
    [name: string]: EndpointConfig;
  };
}
