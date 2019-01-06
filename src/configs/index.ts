import { injectable } from 'smart-factory';
import { ConfigModules } from './modules';
import { ConfigTypes } from './types';

export { ConfigModules } from './modules';
export { ConfigTypes } from './types';

injectable(ConfigModules.EmptyConfig, [], async (): Promise<ConfigTypes.RootConfig> => ({
  http: {
    port: null
  },
  mysql: {
    host: null,
    port: null,
    user: null,
    password: null,
    database: null,
    connectionLimit: null
  },
  credential: {
    sessionExpires: null,
    secret: null
  },
  cache: {
    enabled: null,
    provider: null
  }
}));

// configuration rules.
injectable(ConfigModules.ConfigRules, [],
  async (): Promise<ConfigTypes.ConfigRule[]> => ([
    { key: 'HTTP_PORT', path: ['http', 'port'], defaultValue: 8080 },
    { key: 'MYSQL_HOST', path: ['mysql', 'host'] },
    { key: 'MYSQL_PORT', path: ['mysql', 'port'] },
    { key: 'MYSQL_USER', path: ['mysql', 'user'] },
    { key: 'MYSQL_PASSWORD', path: ['mysql', 'password'] },
    { key: 'MYSQL_DATABASE', path: ['mysql', 'database'] },
    { key: 'MYSQL_CONNECTION_LIMIT', path: ['mysql', 'connectionLimit'], defaultValue: 10 },
    { key: 'CREDENTIAL_SECRET', path: ['credential', 'secret'] },
    { key: 'CREDENTIAL_SESSION_EXPIRES', path: ['credential', 'sessionExpires'], defaultValue: 60 },
    { key: 'CACHE_ENABLED', path: ['cache', 'enabled'], defaultValue: false},
    { key: 'CACHE_PROVIDER', path: ['cache', 'provider'], defaultValue: 'MEMORY'},
    { key: 'CACHE_REDIS_HOST', path: ['cache', 'redis', 'host'], defaultValue: null},
    { key: 'CACHE_REDIS_PORT', path: ['cache', 'redis', 'port'], defaultValue: null},
    { key: 'CACHE_REDIS_PASSWORD', path: ['cache', 'redis', 'password'], defaultValue: null},
  ]));

injectable(ConfigModules.ConfigSource,
  [ConfigModules.ConfigReader],
  async (read: ConfigTypes.ConfigReader) => read());

injectable(ConfigModules.RootConfig,
  [ConfigModules.ConfigParser,
   ConfigModules.ConfigSource,
   ConfigModules.ConfigRules],
  async (parse: ConfigTypes.ConfigParser,
    src: ConfigTypes.ConfigSource,
    rules: ConfigTypes.ConfigRule[]): Promise<ConfigTypes.RootConfig> => parse(src, rules));

injectable(ConfigModules.HttpConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.http);

injectable(ConfigModules.MysqlConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.mysql);

injectable(ConfigModules.CredentialConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.credential);

injectable(ConfigModules.CacheConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.cache);

injectable(ConfigModules.Env,
  [ConfigModules.ConfigSource],
  async (src: ConfigTypes.ConfigSource) => {
    const envExpr = src['NODE_ENV'];
    if (!envExpr || envExpr === 'production') return ConfigTypes.Env.DEV;
    return ConfigTypes.Env.PROD;
  });