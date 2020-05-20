export enum RestMethod {
    GET = 'get',
    POST = 'post',
    PATCH = 'patch'
}

export interface Alias {
  name: string;
  methods?: RestMethod[];
}
  
export interface BeeserverConfig {
  port: number;
  dbPath: string;
  endpoints: {
    [name: string]: {
      methods?: RestMethod[];
      seed?: any[];
      aliases?: Alias[];
    };
  };
}
