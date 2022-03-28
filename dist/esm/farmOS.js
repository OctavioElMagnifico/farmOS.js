import omit from 'ramda/src/omit.js';
import append from 'ramda/src/append.js';
import chain from 'ramda/src/chain.js';
import compose from 'ramda/src/compose.js';
import concat from 'ramda/src/concat.js';
import evolve from 'ramda/src/evolve.js';
import mapObjIndexed from 'ramda/src/mapObjIndexed.js';
import map from 'ramda/src/map.js';
import path from 'ramda/src/path.js';
import reduce from 'ramda/src/reduce.js';
import axios from 'axios';
import curry from 'ramda/src/curry.js';
import prop from 'ramda/src/prop.js';
import replace from 'ramda/src/replace.js';
import dissoc from 'ramda/src/dissoc.js';
import filter from 'ramda/src/filter.js';
import mapObjIndexed$1 from 'ramda/src/mapObjIndexed';
import pick from 'ramda/src/pick.js';
import addIndex from 'ramda/src/addIndex.js';
import clone from 'ramda/src/clone.js';
import identity from 'ramda/src/identity.js';
import anyPass from 'ramda/src/anyPass.js';
import has from 'ramda/src/has.js';
import mergeWith from 'ramda/src/mergeWith.js';
import dropLast from 'ramda/src/dropLast.js';
import { v4, validate } from 'uuid';
import cond from 'ramda/src/cond.js';
import eqBy from 'ramda/src/eqBy.js';
import equals from 'ramda/src/equals.js';
import isNil from 'ramda/src/isNil.js';

/**
 * farmOS client method for sending an entity to a Drupal JSON:API server
 * @typedef {Function} deleteEntity
 * @param {String} bundle The bundle type (eg, 'activity', 'equipment', etc).
 * @param {Object} entity The entity being sent to the server.
 * @returns {Promise}
 */

/**
 * @param {String} entity
 * @param {Function} request
 * @returns {deleteEntity}
 */
const deleteEntity = (entity, request) => (bundle, id) => request(
  `/api/${entity}/${bundle}/${id}`,
  { method: 'DELETE' },
);

function mergeParams(p1, p2) {
  const params = new URLSearchParams(p1);
  new URLSearchParams(p2).forEach((val, key) => {
    params.append(key, val);
  });
  return params.toString();
}

// Helper for determining if a value is a primitive data structure
const isPrim = val =>
  ['string', 'number', 'boolean'].includes(typeof val) || val === null;

const logical = {
  $and: 'AND',
  $or: 'OR',
};
const comparison = {
  $eq: '%3D',
  $ne: '<>',
  $gt: '>',
  $gte: '>=',
  $lt: '<',
  $lte: '<=',
  $in: 'IN',
  $nin: 'NOT%20IN',
};

function parseFilter(filter, options = {}) {
  const { filterTransforms = {} } = options;

  function parseComparison(path, expr, comGroup = null, index = 0) {
    const amp = index > 0 ? '&' : '';
    const pre = `filter[${path}-${index}-filter][condition]`;
    const membership = comGroup ? `&${pre}[memberOf]=${comGroup}` : '';
    const [[op, rawValue], ...tail] = Object.entries(expr);
    const val = typeof filterTransforms[path] === 'function'
      ? filterTransforms[path](rawValue)
      : rawValue;
    if (val === null) {
      const pathStr = `${amp}filter[${path}-filter][condition][path]=${path}`;
      const opStr = `&filter[${path}-filter][condition][operator]=IS%20NULL`;
      return pathStr + opStr + membership;
    }
    const urlEncodedOp = comparison[op];
    if (!urlEncodedOp) throw new Error(`Invalid comparison operator: ${op}`);
    const pathStr = `${amp}${pre}[path]=${path}`;
    const opStr = `&${pre}[operator]=${urlEncodedOp}`;
    const valStr = Array.isArray(val)
      ? val.reduce((substr, v, i) => `${substr}&${pre}[value][${i}]=${v}`, '')
      : `&${pre}[value]=${val}`;
    const str = pathStr + opStr + valStr + membership;
    if (tail.length === 0) return str;
    const nextExpr = Object.fromEntries(tail);
    return str + parseComparison(path, nextExpr, comGroup, index + 1);
  }

  function parseLogic(op, filters, logicGroup, logicDepth) {
    const label = `group-${logicDepth}`;
    const conjunction = `&filter[${label}][group][conjunction]=${logical[op]}`;
    const membership = logicGroup ? `&filter[${label}][condition][memberOf]=${logicGroup}` : '';
    return filters.reduce(
      // eslint-disable-next-line no-use-before-define
      (params, f) => mergeParams(params, parser(f, label, logicDepth + 1)),
      conjunction + membership,
    );
  }

  function parseField(path, val, fieldGroup, fieldDepth) {
    if (isPrim(val)) {
      return parseComparison(path, { $eq: val }, fieldGroup);
    }
    if (Array.isArray(val) || '$or' in val) {
      const arr = Array.isArray(val) ? val : val.$or;
      if (!Array.isArray(arr)) {
        throw new Error(`The value of \`${path}.$or\` must be an array. `
        + `Invalid constructor: ${arr.constructor.name}`);
      }
      const filters = arr.map(v => (isPrim(v) ? { [path]: v } : v));
      return parseLogic('$or', filters, fieldGroup, fieldDepth + 1);
    }
    if ('$and' in val) {
      if (!Array.isArray(val.$and)) {
        throw new Error(`The value of \`${path}.$and\` must be an array. `
        + `Invalid constructor: ${val.$and.constructor.name}`);
      }
      return parseLogic('$and', val.$and, fieldGroup, fieldDepth + 1);
    }
    // Otherwise we assume val is an object and all its properties are comparison
    // operators; parseComparison will throw if any property is NOT a comp op.
    return parseComparison(path, val, fieldGroup);
  }

  const parser = (_filter, group, depth = 0) => {
    if (Array.isArray(_filter)) {
      return parseLogic('$or', _filter, group, depth);
    }
    let params = '';
    const entries = Object.entries(_filter);
    if (entries.length === 0) return params;
    const [[key, val], ...rest] = entries;
    if (['$and', '$or'].includes(key)) {
      params = parseLogic(key, val, group, depth);
    }
    if (key && val !== undefined) {
      params = parseField(key, val, group, depth);
    }
    if (rest.length === 0) return params;
    const tailParams = parser(Object.fromEntries(rest));
    return mergeParams(params, tailParams);
  };

  return parser(filter);
}

/**
 * farmOS client method for fetching entities from a Drupal JSON:API server
 * @typedef {Function} fetchEntity
 * @param {String} bundle The bundle type (eg, 'activity', 'equipment', etc).
 * @param {Object} [options] Options for the fetch request.
 * @property {Object} [options.filter]
 * @property {Object} [options.filterTransforms]
 * @property {Object} [options.limit]
 * @returns {Promise}
 */

/** @type {(limit: Number?) => String} */
const parseLimit = limit =>
  (Number.isInteger(limit) && limit > 0 ? `&page[limit]=${limit}` : '');
/**
 * @param {Object} [options]
 * @property {Object} [options.filter]
 * @property {Object} [options.filterTransforms]
 * @property {Object} [options.limit]
 * @returns {String}
 */
const parseFetchParams = ({ filter = {}, filterTransforms, limit } = {}) =>
  parseFilter(filter, { filterTransforms }) + parseLimit(limit);

/**
 * @param {String} entity
 * @param {Function} request
 * @returns {fetchEntity}
 */
const fetchEntity = (entity, request) => (bundle, options) =>
  request(`/api/${entity}/${bundle}?${parseFetchParams(options)}`);

/**
 * farmOS client method for sending an entity to a Drupal JSON:API server
 * @typedef {Function} sendEntity
 * @param {String} bundle The bundle type (eg, 'activity', 'equipment', etc).
 * @param {Object} entity The entity being sent to the server.
 * @returns {Promise}
 */

/**
 * @param {String} entityName
 * @param {Function} request
 * @param {String} bundle
 * @returns {(entity: String) => Promise}
 */
const postEntity = (entityName, request, bundle) => data =>
  request(`/api/${entityName}/${bundle}`, { method: 'POST', data });

/**
 * @param {String} entityName
 * @param {Function} request
 * @returns {sendEntity}
 */
const sendEntity = (entityName, request) => (bundle, entity) => {
  const data = JSON.stringify({ data: entity });
  const post = postEntity(entityName, request, bundle);
  // We assume if an entity has an id it is a PATCH request, but that may not be
  // the case if it has a client-generated id. Such a PATCH request will result
  // in a 404 (NOT FOUND), since the endpoint includes the id. We handle this
  // error with a POST request, but otherwise return a rejected promise.
  if ('id' in entity) {
    const patchURL = `/api/${entityName}/${bundle}/${entity.id}`;
    const patchOptions = { method: 'PATCH', data };
    const patchRequest = request(patchURL, patchOptions);
    const intercept404 = error =>
      (error.response && error.response.status === 404 ? post(data) : Promise.reject(error));
    return patchRequest.catch(intercept404);
  }
  return post(data);
};

/**
 * @typedef {Object} OAuthMethods
 * @property {Function} authorize
 * @property {Function} getToken
 */

/**
 * @typedef {Function} OAuthMixin
 * @param {import('axios').AxiosInstance} request
 * @param {Object} authOptions
 * @property {String} authOptions.host
 * @property {String} authOptions.clientId
 * @property {Function} [authOptions.getToken]
 * @property {Function} [authOptions.setToken]
 * @returns {Object}
 */
function oAuth(request, authOptions) {
  let memToken = {};
  const {
    host = '',
    clientId = '',
    getToken = () => memToken,
    setToken = (t) => { memToken = t; },
  } = authOptions;
  const accessTokenUri = `${host}/oauth/token`;

  /*
   * SUBSCRIBE TO TOKEN REFRESH
   * Based on https://gist.github.com/mkjiau/650013a99c341c9f23ca00ccb213db1c
   */
  // Keep track if the OAuth token is being refreshed.
  let isRefreshing = false;

  // Array of callbacks to call once token is refreshed.
  let subscribers = [];

  // Add to array of callbacks.
  function subscribeTokenRefresh(resolve, reject) {
    subscribers.push({ resolve, reject });
  }

  // Call all subscribers.
  function onRefreshed(token) {
    subscribers.forEach(({ resolve }) => { resolve(token); });
  }

  // Make sure promises fulfill with a rejection if the refresh fails.
  function onFailedRefresh(error) {
    subscribers.forEach(({ reject }) => { reject(error); });
  }

  // Helper function to parse tokens from server.
  function parseToken(token) {
    // Calculate new expiration time.
    const newToken = !token.expires
      ? { ...token, expires: (Date.now() + token.expires_in * 1000) }
      : token;

    // Update the token state.
    setToken(newToken);

    return newToken;
  }

  // Helper function to refresh OAuth2 token.
  function refreshToken(token) {
    isRefreshing = true;
    const refreshParams = new URLSearchParams();
    refreshParams.append('grant_type', 'refresh_token');
    refreshParams.append('client_id', clientId);
    refreshParams.append('refresh_token', token);
    return axios.post(accessTokenUri, refreshParams)
      .then((res) => {
        const newToken = parseToken(res.data);
        isRefreshing = false;
        onRefreshed(newToken.access_token);
        subscribers = [];
        return newToken;
      })
      .catch((error) => {
        onFailedRefresh(error);
        subscribers = [];
        isRefreshing = false;
        throw error;
      });
  }

  // Helper function to get an OAuth access token.
  // This will attempt to refresh the token if needed.
  // Returns a Promise that resvoles as the access token.
  function getAccessToken(token) {
    // Wait for new access token if currently refreshing.
    if (isRefreshing) {
      return new Promise(subscribeTokenRefresh);
    }

    // Refresh if token expired.
    // - 1000 ms to factor for tokens that might expire while in flight.
    if (!isRefreshing && token.expires - 1000 < Date.now()) {
      return new Promise((resolve, reject) => {
        refreshToken(token.refresh_token)
          .then(t => resolve(t.access_token))
          .catch(reject);
      });
    }

    // Else return the current access token.
    return Promise.resolve(token.access_token);
  }

  // Add axios request interceptor to the client.
  // This adds the Authorization Bearer token header.
  request.interceptors.request.use(
    config => getAccessToken(getToken() || {})
      .then(accessToken => ({
        ...config,
        headers: {
          ...config.headers,
          // Only add access token to header.
          Authorization: `Bearer ${accessToken}`,
        },
      }))
      .catch((error) => { throw error; }),
    Promise.reject,
  );

  // Add axios response interceptor to the client.
  // This tries to resolve 403 errors due to expired tokens.
  request.interceptors.response.use(undefined, (err) => {
    const { config } = err;
    const originalRequest = config;

    if (err.response && err.response.status === 403) {
      // Refresh the token and retry.
      if (!isRefreshing) {
        isRefreshing = true;
        const token = getToken();
        return refreshToken(token ? token.refresh_token : {}).then((t) => {
          originalRequest.headers.Authorization = `Bearer ${t.access_token}`;
          return axios(originalRequest);
        }).catch((error) => { throw error; });
      }
      // Else subscribe for new access token after refresh.
      const requestSubscribers = new Promise((resolve, reject) => {
        subscribeTokenRefresh(
          (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axios(originalRequest));
          },
          reject,
        );
      });
      return requestSubscribers;
    }
    throw err;
  });
  return {
    authorize: (user, password) => axios(accessTokenUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'json',
      },
      data: `grant_type=password&username=${user}&password=${password}&client_id=${clientId}`,
    }).then(res => parseToken(res.data)).catch((error) => { throw error; }),
    getToken,
  };
}

/** @type {(x: any) => Boolean} */
const isObject = x => typeof x === 'object' && x !== null;

const reduceObjIndexed = curry((fn, init, obj) => reduce(
  (acc, [key, val]) => fn(acc, val, key),
  init,
  Object.entries(obj),
));

const createObserver = () => {
  const listeners = new Map();
  const subscribe = ((callback) => {
    listeners.set(callback, callback);
    return () => {
      listeners.delete(callback);
    };
  });
  const next = (event) => {
    listeners.forEach((callback) => {
      callback(event);
    });
  };
  return { subscribe, next };
};

const byType = {
  string: () => '',
  boolean: () => false,
  object: () => null,
  array: () => [],
};
const byFormat = {
  'date-time': () => new Date().toISOString(),
};
const defaultOptions = { byType, byFormat };

/**
 * @typedef {Object} EntityReference
 * @property {String} id A v4 UUID as specified by RFC 4122.
 * @property {String} type Corresponding to the entity bundle (eg, 'activity').
 */

/**
 * @typedef {Object} Entity
 * @property {String} id A v4 UUID as specified by RFC 4122.
 * @property {String} type Corresponding to the entity bundle (eg, 'activity').
 * @property {Object} attributes Values directly attributable to this entity.
 * @property {Object.<String, EntityReference|Array.<EntityReference>>} relationships
 * References to other entities that define a one-to-one or one-to-many relationship.
 * @property {Object} meta Non-domain information associated with the creation,
 * modification, storage and transmission of the entity.
 * @property {String} meta.created An ISO 8601 date-time string indicating when
 * the entity was first created, either locally or remotely.
 * @property {String} meta.changed An ISO 8601 date-time string indicating when
 * the entity was last changed, either locally or remotely.
 * @property {Object} meta.remote
 * @property {Object} meta.fieldChanges
 * @property {Array} meta.conflicts
 */

// Configuration objects for the entities supported by this library.

/**
 * @typedef {Object} EntityConfig
 * @property {Object} nomenclature
 * @property {Object} nomenclature.name
 * @property {Object} nomenclature.shortName
 * @property {Object} nomenclature.plural
 * @property {Object} nomenclature.shortPlural
 * @property {Object} nomenclature.display
 * @property {Object} nomenclature.displayPlural
 * @property {Object} defaultOptions
 * @property {Object} defaultOptions.byType
 * @property {Object} defaultOptions.byFormat
 */

/** @type {Object.<String, EntityConfig>} */
/**
 * @typedef {Object.<String, EntityConfig>} DefaultEntities
 * @property {EntityConfig} asset
 * @property {EntityConfig} log
 * @property {EntityConfig} plan
 * @property {EntityConfig} quantity
 * @property {EntityConfig} taxonomy_term
 * @property {EntityConfig} user
 */
var defaultEntities = {
  asset: {
    nomenclature: {
      name: 'asset',
      shortName: 'asset',
      plural: 'assets',
      shortPlural: 'assets',
      display: 'Asset',
      displayPlural: 'Assets',
    },
    defaultOptions,
  },
  log: {
    nomenclature: {
      name: 'log',
      shortName: 'log',
      plural: 'logs',
      shortPlural: 'logs',
      display: 'Log',
      displayPlural: 'Logs',
    },
    defaultOptions,
  },
  plan: {
    nomenclature: {
      name: 'plan',
      shortName: 'plan',
      plural: 'plans',
      shortPlural: 'plans',
      display: 'Plan',
      displayPlural: 'Plans',
    },
    defaultOptions,
  },
  quantity: {
    nomenclature: {
      name: 'quantity',
      shortName: 'quantity',
      plural: 'quantities',
      shortPlural: 'quantities',
      display: 'Quantity',
      displayPlural: 'Quantities',
    },
    defaultOptions,
  },
  taxonomy_term: {
    nomenclature: {
      name: 'taxonomy_term',
      shortName: 'term',
      plural: 'taxonomy_terms',
      shortPlural: 'terms',
      display: 'Taxonomy Term',
      displayPlural: 'Taxonomy Terms',
    },
    defaultOptions,
  },
  user: {
    nomenclature: {
      name: 'user',
      shortName: 'user',
      plural: 'users',
      shortPlural: 'users',
      display: 'User',
      displayPlural: 'Users',
    },
    defaultOptions,
  },
};

const entityMethods = (fn, allConfigs) =>
  reduceObjIndexed((methods, config) => ({
    ...methods,
    [config.nomenclature.shortName]: {
      ...fn(config),
    },
  }), {}, allConfigs);

var typeToBundle = (entity, type) =>
  replace(`${entity}--`, '', type);

/**
 * Fetch JSON Schema documents for farmOS data structures.
 * @typedef {Function} FetchSchema
 * @param {string} [entity] The farmOS entity for which you wish to retrieve schemata.
 * @param {string} [bundle] The entity bundle for which you wish to retrieve schemata.
 * @returns {Promise<EntitySchemata|BundleSchemata|JsonSchema>}
 */

/**
 * @typedef {import('../entities.js').EntityConfig} EntityConfig
 */

/**
 * @param {import('axios').AxiosInstance} request
 * @param {Object<String, EntityConfig>} entities
 * @returns {FetchSchema}
 */
const fetchSchema = (request, entities) => (entity, bundle) => {
  if (!entity) {
    const schemata = map(() => ({}), entities);
    return request('/api/')
      .then(res => Promise.all(Object.keys(res.data.links)
        .filter(type => Object.keys(entities)
          .some(name => type.startsWith(`${name}--`)))
        .map((type) => {
          const [entName, b] = type.split('--');
          return request(`/api/${entName}/${b}/resource/schema`)
            .then(({ data: schema }) => { schemata[entName][b] = schema; });
        })))
      .then(() => schemata);
  }
  if (!bundle) {
    return request('/api/')
      .then(res => Promise.all(Object.keys(res.data.links)
        .filter(type => type.startsWith(`${entity}--`))
        .map((type) => {
          const b = typeToBundle(entity, type);
          return request(`/api/${entity}/${b}/resource/schema`)
            .then(({ data: schema }) => [b, schema]);
        }))
        .then(Object.fromEntries));
  }
  return request(`/api/${entity}/${bundle}/resource/schema`)
    .then(prop('data'));
};

/** The methods for transmitting farmOS data structures, such as assets, logs,
 * etc, to a farmOS server.
 * @typedef {Object} ClientEntityMethods
 * @property {import('./fetch.js').fetchEntity} fetch
 * @property {import('./send.js').sendEntity} send
 * @property {import('./delete.js').deleteEntity} delete
 */

/**
 * @typedef {Function} AuthMixin
 * @param {import('axios').AxiosInstance} request
 * @param {Object} authOptions
 * @property {String} authOptions.host
 * @returns {Object<string,function>}
 */

/** A collection of functions for transmitting farmOS data structures to and
 * from a farmOS Drupal 9 server using JSON:API.
 * @typedef {Object} FarmClient
 * @property {import('axios').AxiosInstance} request
 * @property {Function} [authorize]
 * @property {Function} [getToken]
 * @property {Function} info
 * @property {Object} schema
 * @property {Function} schema.fetch
 * @property {ClientEntityMethods} asset
 * @property {ClientEntityMethods} log
 * @property {ClientEntityMethods} plan
 * @property {ClientEntityMethods} quantity
 * @property {ClientEntityMethods} term
 * @property {ClientEntityMethods} user
 */

/**
 * @typedef {import('../entities.js').EntityConfig} EntityConfig
 */

/**
 * Create a farm client for interacting with farmOS servers.
 * @typedef {Function} client
 * @param {String} host
 * @param {Object} [options]
 * @property {AuthMixin=OAuthMixin} [options.auth=oauth]
 * @property {Object<String, EntityConfig>} [options.entities=defaultEntities]
 * @property {String} [options.clientId]
 * @property {Function} [options.getToken]
 * @property {Function} [options.setToken]
 * @returns {FarmClient}
 */
function client(host, options) {
  const {
    auth = oAuth,
    entities = defaultEntities,
    ...authOptions
  } = options;

  // Instantiate axios client.
  const clientOptions = {
    baseURL: host,
    headers: {
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
    },
  };
  const request = axios.create(clientOptions);

  const authMethods = auth(request, { host, ...authOptions }) || {};

  const farm = {
    ...authMethods,
    request,
    info() {
      return request('/api');
    },
    schema: {
      fetch: fetchSchema(request, entities),
    },
    ...entityMethods(({ nomenclature: { name } }) => ({
      delete: deleteEntity(name, request),
      fetch: fetchEntity(name, request),
      send: sendEntity(name, request),
    }), entities),
  };
  return farm;
}

const URIre = /^(http[s]?:\/\/)?([^/\s:#]+)?(:[0-9]+)?((?:\/?\w?)+(?:\/?[\w\-.]+[^#?\s])?)?(\??[^#?\s]+)?(#(?:\/?[\w\-$])*)?$/;

/**
 * @typedef {Object} UriComponents
 * @prop {?string} match - The full URI that matched the query.
 * @prop {?string} scheme - The protocol, either "http://" or "https://".
 * @prop {?string} domain - The domain and/or subdomain (eg, "api.example.com").
 * @prop {?string} port - The port if specified (eg, ":80").
 * @prop {?string} path - The relative directory path and/or file name (eg, "/foo/index.html").
 * @prop {?string} query - Search params (eg, "?foo=42&bar=36").
 * @prop {?string} fragment - The hash or JSON pointer (eg, "#Introduction", "#$defs/address").
 */

/**
 * Parses a URI into its component strings.
 * @param {string} uri
 * @returns {UriComponents}
 */
function parseURI(uri) {
  const groups = uri.match(URIre) || [];
  const [
    match, scheme, domain, port, path, query, fragment,
  ] = groups;
  return {
    match, scheme, domain, port, path, query, fragment,
  };
}

const hasAny = compose(anyPass, map(has));

/**
 * @typedef {import('./reference').JsonSchema} JsonSchema
 * @typedef {import('./reference').JsonSchemaDereferenced} JsonSchemaDereferenced
 */

const logicalKeywords = ['allOf', 'anyOf', 'oneOf', 'not'];
/** @type {(JsonSchema) => boolean} */
const hasLogicalKeyword = hasAny(logicalKeywords);

/** @type {(x: any) => Boolean} */
const boolOrThrow = (x) => {
  if (typeof x === 'boolean') return x;
  throw new Error(`Invalid schema: ${x}`);
};

/**
 * @template T
 * @param {(t: T, i: number) => T} transform
 * @param {Array.<T>} array
 * @returns {Array.<T>}
*/
const mapIndexed = addIndex(map);

/**
 * JSON Schema: A complete definition can probably be imported from a library.
 * @typedef {Object|Boolean} JsonSchema
 */

/**
 * JSON Schema Dereferenced: A JSON Schema, but w/o any $ref keywords. As such,
 * it may contain circular references that cannot be serialized.
 * @typedef {Object|Boolean} JsonSchemaDereferenced
 */

const trimPathRexEx = /^[/#\s]*|[/#\s]*$/g;
/** @type {(path: string) => String} */
const trimPath = path => path.replace(trimPathRexEx, '');

/**
 * Resolve a schema definition from a JSON pointer reference.
 * @param {JsonSchema} schema
 * @param {string} pointer - A relative URI provided as the `$ref` keyword.
 * @returns {JsonSchema}
 */
const getDefinition = (schema, pointer) => {
  const pathSegments = trimPath(pointer).split('/');
  const subschema = path(pathSegments, schema);
  if (subschema === undefined) return true;
  return subschema;
};

/**
 * Resolve the `$ref` keyword in given schema to its corresponding subschema.
 * @param {JsonSchema} root - The root schema that contained the reference.
 * @param {string} ref - The URI provided as the `$ref` keyword in the root
 *  schema or one of its subschemas.
 * @param {Object} [options]
 * @param {string} [options.retrievalURI] - The URI where the schema was found.
 * @param {Object.<string, JsonSchemaDereferenced>} [options.knownReferences] -
 * An object mapping known references to their corresponding dereferenced schemas.
 * @returns {JsonSchema}
 */
const getReference = (root, ref, options = {}) => {
  if (typeof ref !== 'string' || ref === '') {
    const submsg = ref === '' ? '[empty string]' : ref;
    throw new Error(`Invalid reference: ${submsg}`);
  }
  const { retrievalURI, knownReferences = {} } = options;
  if (ref in knownReferences) return knownReferences[ref];
  if (!isObject(root)) return boolOrThrow(root);
  // The $id keyword takes precedence according to the JSON Schema spec.
  const rootURI = root.$id || retrievalURI || null;
  const {
    scheme = '', domain = '', port = '', path = '', fragment = '',
  } = parseURI(ref);
  const baseURI = scheme + domain + port + path;
  const baseIsRoot = rootURI === baseURI || ref === fragment;
  let refRoot;
  if (baseIsRoot) refRoot = root;
  if (!baseIsRoot && baseURI in knownReferences) refRoot = knownReferences[baseURI];
  if (refRoot === undefined) return true;
  if (fragment) return getDefinition(refRoot, fragment);
  return refRoot;
};

const setInPlace = (obj, path = [], val) => {
  if (path.length < 1) return;
  const [i, ...tail] = path;
  if (!['string', 'number'].includes(typeof i)) throw new Error('Invalid path');
  if (!(i in obj)) throw new Error('Path not found');
  if (tail.length === 0) {
    obj[i] = val; // eslint-disable-line no-param-reassign
    return;
  }
  setInPlace(obj[i], tail, val);
};

/**
 * Takes a schema which may contain the $ref keyword in it or in its subschemas,
 * and returns an equivalent schema where those references have been replaced
 * with the full schema document.
 * @param {JsonSchema} root - The root schema to be dereferenced.
 * @param {Object} [options]
 * @param {string} [options.retrievalURI] - The URI where the schema was found.
 * @param {string[]} [options.ignore] - A list of schemas to ignore. They will
 * subsequently be referenced as `true`.
 * @param {Object.<string, JsonSchema>} [options.knownReferences] - An object mapping
 * known references to their corresponding schemas. They will also be dereferenced.
 * @returns {JsonSchemaDereferenced}
 */
const dereference = (root, options = {}) => {
  const { retrievalURI, ignore = [], knownReferences = {} } = options;

  const knownRefsMap = new Map();
  /** @type {(ref: string, refSchema: JsonSchema) => void} */
  const setKnownRef = (ref, refSchema) => {
    const appliedSchema = ignore.includes(ref) ? true : refSchema;
    knownRefsMap.set(ref, appliedSchema);
  };
  Object.entries(knownReferences).forEach(([ref, refSchema]) => {
    // We could just use setKnownRef here, but this prevents unnecessary recursion;
    const schema = ignore.includes(ref) ? true : dereference(refSchema);
    knownRefsMap.set(ref, schema);
  });

  // Set ignore refs to true to start, so they don't have to be checked in every
  // call to `deref` below.
  ignore.forEach((ref) => { knownRefsMap.set(ref, true); });
  const baseURI = root.$id || retrievalURI || null;
  const _root = clone(root);

  /** @type {(schema: JsonSchema, path?: Array.<string|number>) => JsonSchemaDereferenced} */
  const deref = (schema, path = []) => {
    if (!isObject(schema)) return boolOrThrow(schema);
    let _schema = schema;
    const set = (cb) => {
      _schema = cb(_schema);
      setInPlace(_root, path, _schema);
    };
    const derefSubschema = keyword => sub => deref(sub, [...path, keyword]);
    const derefSubschemaObject = keyword => mapObjIndexed((sub, prop) =>
      deref(sub, [...path, keyword, prop]));
    const derefSubschemaArray = keyword => mapIndexed((sub, i) =>
      deref(sub, [...path, keyword, i]));
    const schemaTypes = {
      string: identity,
      number: identity,
      integer: identity,
      object: evolve({
        properties: derefSubschemaObject('properties'),
        patternProperties: derefSubschemaObject('patternProperties'),
        additionalProperties: derefSubschema('additionalProperties'),
      }),
      array: evolve({
        items: derefSubschema('items'),
        contains: derefSubschema('contains'),
        prefixItems: derefSubschemaArray('prefixItems'),
      }),
      boolean: identity,
      null: identity,
    };
    if ('type' in _schema && _schema.type in schemaTypes) {
      set(schemaTypes[_schema.type]);
    }
    if (hasLogicalKeyword(_schema)) {
      set(evolve({
        allOf: derefSubschemaArray('allOf'),
        anyOf: derefSubschemaArray('allOf'),
        oneOf: derefSubschemaArray('allOf'),
        not: derefSubschema('not'),
      }));
    }
    if ('$ref' in _schema) {
      const { $ref } = _schema;
      // Anything beginning with # or /, the followed only by # or /.
      const rootHashRE = /^[/#]+[/#]?$/;
      const refIsRoot = rootHashRE.test($ref) || $ref === baseURI;
      const refKey = refIsRoot ? baseURI : $ref;
      if (knownRefsMap.has(refKey)) {
        set(() => knownRefsMap.get(refKey));
      } else if (refIsRoot) {
        set(() => _root);
        setKnownRef(baseURI, _root);
      } else {
        const opts = {
          knownReferences: Object.fromEntries(knownRefsMap),
          retrievalURI,
        };
        set(() => getReference(_root, $ref, opts));
        set(sub => deref(sub, path));
        setKnownRef($ref, _schema);
      }
    }
    if (isObject(_schema) && '$id' in _schema) setKnownRef(_schema.$id, _schema);
    return _schema;
  };
  return deref(_root);
};

/**
 * @typedef {import('./reference').JsonSchema} JsonSchema
 * @typedef {import('./reference').JsonSchemaDereferenced} JsonSchemaDereferenced
 */

/**
 * Provide a dereferenced schema and get back the object corresponding to the
 * "properties" keyword. A schema of type "array" will also be checked for the
 * "items" keyword and any corresponding properties it has. Properties found
 * under contitional keywords "allOf", "anyOf", "oneOf" and "not" will be
 * merged; however, the "$ref" keyword will NOT be handled and will throw an
 * error if encountered.
 * @param {JsonSchemaDereferenced} schema - Must NOT contain the "$ref" keyword,
 * nor subschemas containing "$ref".
 * @returns {Object.<string, JsonSchemaDereferenced>}
 */
const getProperties = (schema) => {
  if (!isObject(schema)) return {};
  if ('$ref' in schema) {
    // It is the responsibility of the caller to dereference the schema first.
    const msg = `Unknown schema reference ($ref): "${schema.$ref}". `
    + 'Try dereferencing the schema before trying to access its properties or defaults.';
    throw new Error(msg);
  }
  if ('properties' in schema) {
    return schema.properties;
  }
  if ('items' in schema && 'properties' in schema.items) {
    return schema.items.properties;
  }
  if (hasLogicalKeyword(schema)) {
    const keyword = logicalKeywords.find(k => k in schema);
    if (keyword === 'not') {
      return map(p => ({ not: p }), getProperties(schema.not));
    }
    return schema[keyword].reduce((props, subschema) => {
      const subProps = getProperties(subschema);
      const strategy = (b, a) => {
        const aList = keyword in a ? a[keyword] : [a];
        const bList = keyword in b ? b[keyword] : [b];
        return { [keyword]: [...aList, ...bList] };
      };
      return mergeWith(strategy, props, subProps);
    }, {});
  }
  return {};
};

/**
 * Provide a dereferenced schema of type 'object', and get back the subschema
 * corresponding to the specified property name.
 * @param {JsonSchemaDereferenced} schema - Must NOT contain the `$ref` keyword,
 * nor subschemas containing `$ref`.
 * @param  {string} property - The name of a property under the `properties` keyword.
 * @returns {JsonSchemaDereferenced}
 */
const getProperty = (schema, property) => {
  if (typeof schema === 'boolean') return {};
  if (typeof property !== 'string') throw new Error(`Invalid property: ${property}`);
  const properties = getProperties(schema);
  if (property in properties) {
    return properties[property];
  }
  return {};
};

/**
 * Provide a dereferenced schema of type 'object', and get back the subschema
 * corresponding to the specified property name, or to the specified path.
 * @param {JsonSchemaDereferenced} schema - Must NOT contain the `$ref` keyword,
 * nor subschemas containing `$ref`.
 * @param  {...string|string[]} path - A property name, or array of property names.
 * @returns {JsonSchemaDereferenced}
 */
const getPath = (schema, ...path) => {
  if (typeof schema === 'boolean') return {};
  const pathArray = path.flat();
  if (pathArray.length === 0) return schema;
  const [head, ...tail] = pathArray;
  if (typeof head !== 'string') throw new Error(`Invalid path in subschema: ${head}`);
  const subschema = getProperty(schema, head);
  if (!isObject(subschema)) return {};
  if (tail.length > 0) {
    return getPath(subschema, tail);
  }
  return subschema;
};

/**
 * Provide a dereferenced schema of type 'object', and get back a list of all its
 * specified properties, or the properties of the subschema indicated by its path.
 * @param {JsonSchemaDereferenced} schema - Must NOT contain the `$ref` keyword, nor
 * subschemas containing `$ref`.
 * @param  {...string|string[]} [path] - A property name, or array of property names.
 * @returns {string[]}
 */
const listProperties = (schema, ...path) => {
  if (typeof schema === 'boolean') return [];
  const subschema = path.length > 0 ? getPath(schema, path.flat()) : schema;
  if ('properties' in subschema) {
    return Object.keys(subschema.properties);
  }
  return [];
};

/**
 * @typedef {import('./reference').JsonSchema} JsonSchema
 * @typedef {import('./reference').JsonSchemaDereferenced} JsonSchemaDereferenced
 */

/** Transform function
 * @typedef {(JsonSchemaDereferenced) => *} SchemaTransform
 */

/**
 * Get the default value at a given path for a given schema.
 * @param {JsonSchemaDereferenced} schema
 * @param {string[]|string} [path] - A property name or array of property names.
 * @param {Object} [options]
 * @param {Object.<string, SchemaTransform>} [options.byType]
 * @param {Object.<string, SchemaTransform>} [options.byFormat]
 * @param {Object.<string, SchemaTransform>|string|boolean} [options.byProperty]
 * @param {Object} [options.use]
 * @returns {*}
 */
const getDefault = (schema, path = [], options = {}) => {
  const subschema = getPath(schema, path);
  if (!isObject(subschema)) return undefined;
  if ('default' in subschema) return subschema.default;
  if ('const' in subschema) return subschema.const;

  // For recursive calls
  /** @type {(sub: JsonSchemaDereferenced) => *} */
  const getDef = sub => getDefault(sub, [], options);
  /** @typedef {JsonSchemaDereferenced[]|Object.<string, JsonSchemaDereferenced>} SchemaFunctor */
  /** @type {(sub: SchemaFunctor) => Array|Object} */
  const mapGetDef = map(getDef);

  if (hasLogicalKeyword(subschema)) {
    return evolve({
      allOf: mapGetDef,
      anyOf: mapGetDef,
      oneOf: mapGetDef,
      not: getDef,
    }, subschema);
  }
  const { type } = subschema;
  if (type === 'null') {
    // This is the only case that should return null; if a default can't be
    // resolved, undefined should be returned, as below.
    return null;
  }
  const {
    byType, byFormat, use,
  } = options;
  if (type === 'string') {
    if (byFormat && 'format' in subschema && subschema.format in byFormat) {
      const { [subschema.format]: transform } = byFormat;
      return transform(subschema);
    }
  }
  if (use && ['number', 'integer'].includes(type)) {
    const keywords = ['minimum', 'maximum', 'multipleOf'];
    const useOptions = Array.isArray(use) ? use : [use];
    const kw = useOptions.find(k => k in subschema && keywords.includes(k));
    if (kw !== undefined) return subschema[kw];
  }
  // Evaluate byType last, so options of higher specificity take precedence.
  if (byType && type in byType) {
    const { [type]: transform } = byType;
    return transform(subschema);
  }
  return undefined;
};

const dropMilliseconds = replace(/\.\d\d\d/, '');
const safeIso = t => t && new Date(t).toISOString();
const safeUnix = t => t && Math.floor(new Date(t).valueOf() / 1000);

// These functions provide transformations that are ultimately passed to
// parseFilter, so it can compare values of the same format.
const filterTransformsByFormat = {
  'date-time': safeUnix,
};
const filterTransformsByMetafield = {
  created: safeUnix,
  changed: safeUnix,
  revision_created: safeUnix,
};
// The transforms need to be regenerated whenever the schemata are set, so the
// format transforms can be mapped to every field with that format.
const generateFilterTransforms = (schemata) => {
  const formats = filterTransformsByFormat;
  const filterTransforms = {};
  const entities = Object.keys(schemata);
  entities.forEach((entity) => {
    filterTransforms[entity] = {};
    Object.entries(schemata[entity]).forEach(([bundle, schema]) => {
      filterTransforms[entity][bundle] = { ...filterTransformsByMetafield };
      const attributes = getPath(schema, 'attributes');
      const relationships = getPath(schema, 'relationships');
      const fieldSchemata = { ...attributes.properties, ...relationships.properties };
      Object.entries(fieldSchemata).forEach(([field, sub]) => {
        if (isObject(sub) && 'format' in sub && sub.format in formats) {
          const { [sub.format]: transform } = formats;
          filterTransforms[entity][bundle][field] = transform;
        }
      });
    });
  });
  return filterTransforms;
};

const drupalMetaFields = {
  attributes: [
    'created',
    'changed',
    'drupal_internal__id',
    'drupal_internal__revision_id',
    'langcode',
    'revision_created',
    'revision_log_message',
    'default_langcode',
    'revision_translation_affected',
    'revision_default',
  ],
  relationships: ['revision_user', 'uid'],
};
const removeDrupalMetaSchemas = drupalFields => evolve({
  properties: omit(drupalFields),
  required: filter(field => !drupalFields.includes(field)),
});

// Drupal's jsonapi_schema module classifies certain enumerable values as plain
// strings; e.g., "status" should be an enumerable of ['pending', 'done']. To
// avoid errors w/o enums a default is provided.
const attributeDefaults = {
  asset: {
    status: 'active',
  },
  log: {
    status: 'pending',
  },
  plan: {
    status: 'active',
  },
  user: {
    langcode: 'en',
  },
};

// Relationships are comprised of either one resource identifier objects, or an
// array of resource identifier objects. For now, we'll just use the same schema
// regardless of the resource type, but the type could be constrained to an enum
// or a const value.
const transformResourceSchema = (subschema) => {
  const resourceSchema = {
    type: 'object',
    required: ['id', 'type'],
    properties: {
      id: {
        type: 'string',
        title: 'Resource ID',
        format: 'uuid',
        maxLength: 128,
      },
      type: { type: 'string' },
    },
  };
  const { properties: { data: { type } }, title } = subschema;
  if (type === 'object') {
    return { title, ...resourceSchema };
  }
  return { type, title, items: resourceSchema };
};

const transformD9Schema = entName => (d9Schema) => {
  const {
    $id, $schema, title, definitions: { type, attributes, relationships },
  } = d9Schema;
  const bundle = typeToBundle(entName, type.const);
  const defaultTitle = `${bundle} ${entName}`;

  const transformAttributeFields = evolve({
    properties: mapObjIndexed$1((subschema, propName) => {
      const hasOwnDefault = isObject(subschema) && 'default' in subschema;
      if (hasOwnDefault) return subschema;
      const standardDefault = path([entName, propName], attributeDefaults);
      if (!standardDefault) return subschema;
      return { ...subschema, default: standardDefault };
    }),
  });
  const transformRelationshipFields = evolve({
    properties: map(transformResourceSchema),
  });
  const transformAttributesSchema = compose(
    transformAttributeFields,
    removeDrupalMetaSchemas(drupalMetaFields.attributes),
  );
  const transformRelationshipsSchema = compose(
    transformRelationshipFields,
    removeDrupalMetaSchemas(drupalMetaFields.relationships.concat(`${entName}_type`)),
  );

  return {
    $schema,
    $id,
    title: title || defaultTitle,
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      type: { const: bundle },
      meta: { type: 'object' },
      attributes: transformAttributesSchema(attributes),
      relationships: transformRelationshipsSchema(relationships),
    },
  };
};

const transformLocalEntity = (entName, data) => compose(
  dissoc('meta'),
  evolve({
    type: t => `${entName}--${t}`,
    attributes: { timestamp: dropMilliseconds },
    relationships: map(r => ({ data: r })),
  }),
)(data);

const transformRemoteAttributes = compose(
  evolve({ timestamp: safeIso }),
  omit(drupalMetaFields.attributes),
);
const transformRemoteRelationships = compose(
  map(prop('data')),
  omit(drupalMetaFields.attributes),
);
const makeFieldChanges = (attrs, rels) => ({
  ...map(() => safeIso(attrs.changed), omit(drupalMetaFields.attributes, attrs)),
  ...map(() => safeIso(rels.changed), omit(drupalMetaFields.relationships, rels)),
});

const emptyAttrs = { created: null, changed: null, drupal_internal__id: null };
const transformRemoteEntity = (entName, setLastSync = false) => ({
  id, type, attributes = emptyAttrs, relationships = {},
}) => ({
  id,
  type: typeToBundle(entName, type),
  meta: {
    created: safeIso(attributes.created),
    changed: safeIso(attributes.changed),
    fieldChanges: makeFieldChanges(attributes, relationships),
    conflicts: [],
    remote: {
      lastSync: setLastSync ? new Date().toISOString() : null,
      url: `/${entName}/${attributes.drupal_internal__id}`,
      meta: {
        attributes: pick(drupalMetaFields.attributes, attributes),
        relationships: pick(drupalMetaFields.relationships, relationships),
      },
    },
  },
  attributes: transformRemoteAttributes(attributes),
  relationships: transformRemoteRelationships(relationships),
});

const transformFetchResponse = name => evolve({
  data: map(transformRemoteEntity(name)),
});

const transformSendResponse = name => compose(
  transformRemoteEntity(name, true),
  path(['data', 'data']),
);

/**
 * @typedef {import('../../json-schema/reference').JsonSchema} JsonSchema
 * @typedef {import('../../model/index').EntitySchemata} EntitySchemata
 * @typedef {import('../../model/index').BundleSchemata} BundleSchemata
 */

const DRUPAL_PAGE_LIMIT = 50;

function parseBundles(filter, validTypes) {
  const bundles = [];
  // The filter must either be an object (logical $and) or an array (logical $or).
  if (Array.isArray(filter) || Array.isArray(filter.$or)) {
    (Array.isArray(filter) ? filter : filter.$or).forEach((f) => {
      parseBundles(f).forEach(({ name, filter: bundleFilter }) => {
        const i = bundles.findIndex(b => b.name === name);
        if (i > -1) {
          // Concat on an empty array to flatten either bundle or both.
          bundles[i].filter = [].concat(bundles[i].filter, bundleFilter);
        } else {
          bundles.push({ name, filter: bundleFilter });
        }
      });
    });
    return bundles;
  }
  if (typeof filter !== 'object') return bundles;
  const { type, ...rest } = typeof filter.$and === 'object' ? filter.$and : filter;
  if (typeof type === 'string') {
    if (!validTypes.includes(type)) return bundles;
    bundles.push({ name: type, filter: rest });
  }
  if (Array.isArray(type)) {
    type.forEach((t) => {
      if (validTypes.includes(t)) {
        bundles.push({ name: t, filter: rest });
      }
    });
  }
  if ([undefined, null].includes(type)) {
    validTypes.forEach((t) => {
      bundles.push({ name: t, filter: rest });
    });
  }
  return bundles;
}

const aggregateBundles = reduce((aggregate, result) => {
  const { reason, value, status } = result;
  if (status === 'fulfilled') {
    const nextData = chain(path(['data', 'data']), value);
    return evolve({
      data: concat(nextData),
      fulfilled: concat(value),
    }, aggregate);
  }
  return evolve({
    rejected: append(reason),
  }, aggregate);
}, { data: [], fulfilled: [], rejected: [] });

/**
 * @typedef {import('../../entities.js').EntityConfig} EntityConfig
 */
/**
 * @param {import('../../model/index').FarmModel} model
 * @param {Object} opts
 * @property {Object<String, EntityConfig>} [opts.entities=defaultEntities]
 * @returns {import('../index.js').FarmClient}
 */
function adapter(model, opts) {
  const {
    host, maxPageLimit = DRUPAL_PAGE_LIMIT, entities = defaultEntities, ...rest
  } = opts;
  const connection = client(host, { ...rest, entities });
  const initSchemata = model.schema.get();
  let filterTransforms = generateFilterTransforms(initSchemata);
  model.schema.on('set', (schemata) => {
    filterTransforms = generateFilterTransforms(schemata);
  });

  // For chaining consecutive requests for the next page of resources until the
  // provided limit is reached, or there are no further resources to fetch.
  const chainRequests = (req, limit, prev = [], total = 0) => req.then((res) => {
    let next = path(['data', 'links', 'next', 'href'], res);
    const resLength = path(['data', 'data', 'length'], res);
    const newTotal = total + resLength;
    const all = prev.concat(res);
    if (!next || newTotal >= limit) return all;
    const remainder = limit - newTotal;
    if (remainder < maxPageLimit) next = `${next}&page[limit]=${remainder}`;
    const url = new URL(next);
    const nextReq = connection.request(url.pathname + url.search);
    return chainRequests(nextReq, limit, all, newTotal);
  });

  return {
    ...connection,
    schema: {
      fetch(entName, type) {
        return connection.schema.fetch(entName, type)
          .then((schemata) => {
            if (!entName) {
              return mapObjIndexed(
                (entitySchemata, entityName) => map(
                  transformD9Schema(entityName),
                  entitySchemata,
                ),
                schemata,
              );
            }
            if (!type) {
              return map(transformD9Schema(entName), schemata);
            }
            return transformD9Schema(entName)(schemata);
          });
      },
    },
    ...entityMethods(({ nomenclature: { name, shortName } }) => ({
      ...connection[shortName],
      fetch: ({ filter, limit }) => {
        const validTypes = Object.keys(model.schema.get(name));
        const bundles = parseBundles(filter, validTypes);
        const bundleRequests = bundles.map(({ name: bundle, filter: bundleFilter }) => {
          const fetchOptions = {
            filter: bundleFilter,
            limit,
          };
          if (name in filterTransforms && bundle in filterTransforms[name]) {
            fetchOptions.filterTransforms = filterTransforms[name][bundle];
          }
          const req = connection[shortName].fetch(bundle, fetchOptions);
          return chainRequests(req, limit);
        });
        const handleBundleResponse = compose(
          transformFetchResponse(name),
          aggregateBundles,
        );
        return Promise.allSettled(bundleRequests)
          .then(handleBundleResponse);
      },
      send: data => connection[shortName].send(
        data.type,
        transformLocalEntity(name, data),
      ).then(transformSendResponse(name)),
    }), entities),
  };
}

/**
 * @typedef {import('../entities.js').Entity} Entity
 */
/**
 * Create a farmOS entity that will validate against the schema for the
 * specified bundle (ie, the `type` prop).
 * @typedef {Function} createEntity
 * @param {Object.<String, any>|Entity} props
 * @property {String} props.type The only required prop. It must correspond to a
 * valid entity bundle (eg, 'activity') whose schema has been previously set.
 * @returns {Entity}
 */
/**
 * @param {string} entName
 * @param {import('./index.js').BundleSchemata} schemata
 * @returns {createEntity}
 */
const createEntity = (entName, schemata, defaultOptions) => (props) => {
  const { id = v4(), type } = props;
  if (!validate(id)) { throw new Error(`Invalid ${entName} id: ${id}`); }
  const schema = schemata[entName][type];
  if (!schema) { throw new Error(`Cannot find a schema for the ${entName} type: ${type}.`); }
  const {
    attributes = {}, relationships = {}, meta = {}, ...rest
  } = clone(props);
  // Spread attr's and rel's like this so other entities can be passed as props,
  // but nesting props is still not required.
  const copyProps = { ...attributes, ...relationships, ...rest };
  const {
    created = new Date().toISOString(),
    changed = created,
    remote: {
      lastSync = null,
      url = null,
      meta: remoteMeta = null,
    } = {},
  } = meta;
  const fieldChanges = {};
  const initFields = (fieldType) => {
    const fields = {};
    listProperties(schema, fieldType).forEach((name) => {
      if (name in copyProps) {
        const changedProp = meta.fieldChanges && meta.fieldChanges[name];
        fieldChanges[name] = changedProp || changed;
        fields[name] = copyProps[name];
      } else {
        fieldChanges[name] = changed;
        fields[name] = getDefault(schema, [fieldType, name], defaultOptions);
      }
    });
    return fields;
  };
  return {
    id,
    type,
    attributes: initFields('attributes'),
    relationships: initFields('relationships'),
    meta: {
      created,
      changed,
      remote: { lastSync, url, meta: remoteMeta },
      fieldChanges,
      conflicts: [],
    },
  };
};

// Helpers for determining if a set of fields are equivalent. Attributes are
// fairly straightforward, but relationships need to be compared strictly by
// their id(s), b/c JSON:API gives a lot of leeway for how these references
// can be ordered and structured.
const setOfIds = compose(
  array => new Set(array),
  map(prop('id')),
);
const relsTransform = cond([
  [isNil, identity],
  [Array.isArray, setOfIds],
  [has('id'), prop('id')],
]);
const eqFields = fieldType =>
  (fieldType === 'relationships' ? eqBy(relsTransform) : equals);

/**
 * @typedef {import('../entities.js').Entity} Entity
 */
/**
 * Merge a local copy of a farmOS entity with an incoming remote copy. They must
 * share the same id (UUID v4) and type (aka, bundle).
 * @typedef {Function} mergeEntity
 * @param {Entity} [local] If the local is nullish, merging will dispatch to the
 * create method instead, creating a new local copy of the remote entity.
 * @param {Entity} [remote] If the remote is nullish, a clone of the local will be returned.
 * @returns {Entity}
 */
/**
 * @param {string} entName
 * @param {import('./index.js').BundleSchemata} schemata
 * @returns {mergeEntity}
 */
const mergeEntity = (entName, schemata) => (local, remote) => {
  if (!remote) return clone(local);
  const now = new Date().toISOString();
  if (!local) {
    // A nullish local value represents the first time a remotely generated
    // entity was fetched, so all changes are considered synced with the remote.
    const resetLastSync = evolve({ meta: { remote: { lastSync: () => now } } });
    return createEntity(entName, schemata)(resetLastSync(remote));
  }
  const { id, type } = local;
  if (!validate(id)) { throw new Error(`Invalid ${entName} id: ${id}`); }
  const schema = schemata[entName][type];
  if (!schema) {
    throw new Error(`Cannot find a schema for the ${entName} type: ${type}.`);
  }
  const localName = local.attributes && `"${local.attributes.name || ''}" `;
  if (id !== remote.id) {
    throw new Error(`Cannot merge remote ${entName} with UUID ${remote.id} `
      + `and local ${entName} ${localName}with UUID ${id}.`);
  }
  if (local.type !== remote.type) {
    throw new Error(`Cannot merge remote ${entName} of type ${remote.type} `
      + `and local ${entName} ${localName}of type ${local.type}.`);
  }
  if (local.meta.conflicts.length > 0) {
    throw new Error(`Cannot merge local ${entName} ${localName}`
      + 'while it still has unresolved conflicts.');
  }

  // Establish a consistent value for the current time.
  // const now = new Date().toISOString();

  // Deep clone the local & destructure its metadata for internal reference.
  const localCopy = clone(local);
  const {
    meta: {
      fieldChanges: localChanges,
      changed: localChanged = now,
      remote: { lastSync: localLastSync = null },
    },
  } = localCopy;

  // Deep clone the remote & destructure its metadata for internal reference.
  const remoteCopy = clone(remote);
  const {
    meta: {
      fieldChanges: remoteChanges,
      changed: remoteChanged = now,
      remote: { lastSync: remoteLastSync = null },
    },
  } = remoteCopy;

  // These variables are for storing the values that will ultimately be returned
  // as metadata. They are all considered mutable within this function scope and
  // will be reassigned or appeneded to during the iterations of mergeFields, or
  // afterwards in the case of lastSync.
  let changed = localChanged; let lastSync = localLastSync;
  const fieldChanges = {}; const conflicts = [];

  const mergeFields = (fieldType) => {
    const checkEquality = eqFields(fieldType);
    const { [fieldType]: localFields } = localCopy;
    const { [fieldType]: remoteFields } = remoteCopy;
    // Spread localFields so lf.data and lf.changed aren't mutated when fields is.
    const fields = { ...localFields };
    // This loop comprises the main algorithm for merging changes to concurrent
    // versions of the same entity that may exist on separate systems. It uses a
    // "Last Write Wins" (LWW) strategy, which applies to each field individually.
    listProperties(schema, fieldType).forEach((name) => {
      const lf = { // localField shorthand
        data: localFields[name],
        changed: localChanges[name] || localChanged,
      };
      const rf = { // remoteField shorthand
        data: remoteFields[name],
        changed: remoteChanges[name] || remoteChanged,
      };
      const localFieldHasBeenSent = !!localLastSync && localLastSync > lf.changed;
      // Use the local changed value as our default.
      fieldChanges[name] = lf.changed;
      // If the remote field changed more recently than the local field, and the
      // local was synced more recently than it changed, apply the remote changes.
      if (rf.changed > lf.changed && localFieldHasBeenSent) {
        fields[name] = rf.data;
        fieldChanges[name] = rf.changed;
        // Also update the global changed value if the remote field changed more recently.
        if (rf.changed > localChanged) ({ changed } = rf);
      }
      // If the remote field changed more recently than the local field, and the
      // local entity has NOT been synced since then, there may be a conflict.
      if (rf.changed > lf.changed && !localFieldHasBeenSent) {
        // Run one last check to make sure the data isn't actually the same. If
        // they are, there's no conflict, but apply the remote changed timestamps.
        if (checkEquality(lf.data, rf.data)) {
          fieldChanges[name] = rf.changed;
          if (rf.changed > localChanged) ({ changed } = rf);
        } else {
          // Otherwise keep the local values, but add the remote changes to the
          // list of conflicts.
          conflicts.push({
            fieldType,
            field: name,
            changed: rf.changed,
            data: rf.data,
          });
        }
      }
      // In all other cases, the local values will be retained.
    });
    return fields;
  };

  const attributes = mergeFields('attributes');
  const relationships = mergeFields('relationships');

  // These tests will set the lastSync value to the current timestamp if any one
  // of the following criteria can be met: 1) a remote entity is being merged
  // with a local entity whose changes have already been sent to that remote,
  // 2) the merge occurs after the very first time a locally generated entity
  // was sent to the remote system, 3) all changes from the remote have been
  // fetched since the most recent local change. Otherwise, the local lastSync
  // value will be retained.
  const localChangesHaveBeenSent = !!localLastSync && localLastSync >= localChanged;
  const remoteIsInitialSendResponse = !localLastSync && !!remoteLastSync;
  const remoteChangesHaveBeenFetched = !!remoteLastSync && remoteLastSync >= localChanged;
  const syncHasCompleted = localChangesHaveBeenSent
    || remoteIsInitialSendResponse
    || remoteChangesHaveBeenFetched;
  if (syncHasCompleted) lastSync = now;

  return {
    id,
    type,
    attributes,
    relationships,
    meta: {
      ...localCopy.meta,
      changed,
      fieldChanges,
      conflicts,
      remote: {
        ...remoteCopy.meta.remote,
        lastSync,
      },
    },
  };
};

/**
 * @typedef {import('../entities.js').Entity} Entity
 */
/**
 * Update a farmOS entity.
 * @typedef {Function} updateEntity
 * @param {Entity} entity
 * @param {Object.<String, any>} props
 * @returns {Entity}
 */
/**
 * @param {string} entName
 * @param {import('./index.js').BundleSchemata} schemata
 * @returns {updateEntity}
 */
const updateEntity = (entName, schemata) => (entity, props) => {
  const { id, type } = entity;
  if (!validate(id)) { throw new Error(`Invalid ${entName} id: ${id}`); }
  const schema = schemata[entName][type];
  if (!schema) { throw new Error(`Cannot find a schema for the ${entName} type: ${type}.`); }

  const now = new Date().toISOString();
  const entityCopy = clone(entity);
  const propsCopy = clone(props);
  const { meta = {} } = entityCopy;
  let { changed = now } = meta;
  const { fieldChanges = {}, conflicts = [] } = meta;
  const updateFields = (fieldType) => {
    const fields = { ...entityCopy[fieldType] };
    listProperties(schema, fieldType).forEach((name) => {
      if (name in propsCopy) {
        fields[name] = propsCopy[name];
        fieldChanges[name] = now;
        changed = now;
      }
    });
    return fields;
  };

  const attributes = updateFields('attributes');
  const relationships = updateFields('relationships');

  return {
    id,
    type,
    attributes,
    relationships,
    meta: {
      ...meta,
      changed,
      fieldChanges,
      conflicts,
    },
  };
};

/**
 * JSON Schema for defining the entities supported by a farmOS instance.
 * @see {@link https://json-schema.org/understanding-json-schema/index.html}
 * @typedef {import('../json-schema/reference').JsonSchema} JsonSchema
 */
/**
 * JSON Schema Dereferenced: A JSON Schema, but w/o any $ref keywords. As such,
 * it may contain circular references that cannot be serialized.
 * @typedef {import('../json-schema/reference').JsonSchemaDereferenced} JsonSchemaDereferenced
 */
/**
 * An object containing the schemata for the bundles of a farmOS entity, with
 * the bundle name as key and its corresponding schema as its value.
 * @typedef {Object.<string, JsonSchema>} BundleSchemata
 */
/**
 * An object containing the schemata for the bundles of a farmOS entity, with
 * the bundle name as key and its corresponding schema as its value.
 * @typedef {Object.<string, BundleSchemata>} EntitySchemata
 */

/** The methods for writing to local copies of farmOS data structures, such as
 * assets, logs, etc.
 * @typedef {Object} ModelEntityMethods
 * @property {import('./create.js').createEntity} create
 * @property {import('./update.js').updateEntity} update
 * @property {import('./merge.js').mergeEntity} merge
 */
/** A collection of functions for working with farmOS data structures, their
 * associated metadata and schemata.
 * @typedef {Object} FarmModel
 * @property {Object} schema
 * @property {Function} schema.get
 * @property {Function} schema.set
 * @property {Function} schema.on
 * @property {Object} meta
 * @property {Function} meta.isUnsynced
 * @property {ModelEntityMethods} asset
 * @property {ModelEntityMethods} log
 * @property {ModelEntityMethods} plan
 * @property {ModelEntityMethods} quantity
 * @property {ModelEntityMethods} term
 * @property {ModelEntityMethods} user
 */

/**
 * @typedef {import('../entities.js').EntityConfig} EntityConfig
 */
/**
 * Create a farm model for generating and manipulating farmOS data structures.
 * @typedef {Function} model
 * @param {Object} options
 * @property {EntitySchemata} [options.schemata]
 * @property {Object<String, EntityConfig>} [options.entities=defaultEntities]
 * @returns {FarmModel}
 */
function model(options = {}) {
  const { entities = defaultEntities } = options;
  const entityNames = Object.keys(entities);
  const schemata = map(() => ({}), entities);

  const observers = {
    schema: {
      set: createObserver(),
    },
  };

  /**
   * Retrieve all schemata that have been previously set, or the schemata of a
   * particular entity, or one bundle's schema, if specified.
   * @param {String} [entity] The name of a farmOS entity (eg, 'asset', 'log', etc).
   * @param {String} [type] The entity's type (aka, bundle).
   * @returns {EntitySchemata|BundleSchemata|JsonSchemaDereferenced}
   */
  function getSchemata(entity, type) {
    if (!entity) {
      return clone(schemata);
    }
    if (!type) {
      return clone(schemata[entity]);
    }
    return clone(schemata[entity][type]);
  }

  /**
   * Load all schemata, the schemata of a particular entity, or one bundle's
   * schema, if spcified.
   * @param {...String|EntitySchemata|BundleSchemata|JsonSchema} args
   * @void
   */
  function setSchemata(...args) {
    if (args.length === 1) {
      entityNames.forEach((entName) => {
        if (entName in args[0]) {
          setSchemata(entName, args[0][entName]);
        }
      });
    }
    if (args.length === 2) {
      const [entName, newSchemata] = args;
      if (entityNames.includes(entName)) {
        Object.entries(newSchemata).forEach(([type, schema]) => {
          setSchemata(entName, type, schema);
        });
      }
    }
    if (args.length > 2) {
      const [entName, type, schema] = args;
      schemata[entName][type] = dereference(schema);
    }
  }

  if (options.schemata) setSchemata(options.schemata);

  const addListeners = namespace => (name, callback) => {
    if (name in observers[namespace]) {
      return observers[namespace][name].subscribe(callback);
    }
    throw new Error(`Invalid method name for ${namespace} listener: ${name}`);
  };

  return {
    schema: {
      get: getSchemata,
      /** @param {...String|EntitySchemata|BundleSchemata|JsonSchema} args */
      set(...args) {
        setSchemata(...args);
        const getterArgs = dropLast(1, args);
        observers.schema.set.next(getSchemata(...getterArgs));
      },
      on: addListeners('schema'),
    },
    meta: {
      isUnsynced(entity) {
        const { changed, remote: { lastSync } } = entity.meta;
        return lastSync === null || changed > lastSync;
      },
    },
    ...entityMethods(({ nomenclature: { name }, defaultOptions }) => ({
      create: createEntity(name, schemata, defaultOptions),
      merge: mergeEntity(name, schemata),
      update: updateEntity(name, schemata),
    }), entities),
  };
}

/** The methods for writing to local copies of farmOS data structures, such as
 * assets, logs, etc, and for transmitting those entities to a farmOS server.
 * @typedef {Object} FarmEntityMethods
 * @property {import('./model/create.js').createEntity} create
 * @property {import('./model/update.js').updateEntity} update
 * @property {import('./model/merge.js').mergeEntity} merge
 * @property {import('./client/fetch.js').fetchEntity} [fetch]
 * @property {import('./client/send.js').sendEntity} [send]
 * @property {import('./client/delete.js').deleteEntity} [delete]
 */

/** A collection of functions for working with farmOS data structures, their
 * associated metadata and schemata, and for interacting with farmOS servers.
 * @typedef {Object} FarmObject
 * @property {Object} schema
 * @property {Function} schema.get
 * @property {Function} schema.set
 * @property {Function} schema.on
 * @property {Function} [schema.fetch]
 * @property {Object} meta
 * @property {Function} meta.isUnsynced
 * @property {Object} remote
 * @property {import('axios').AxiosInstance} remote.request
 * @property {Function} [remote.info]
 * @property {Function} [remote.authorize]
 * @property {Function} [remote.getToken]
 * @property {FarmEntityMethods} asset
 * @property {FarmEntityMethods} log
 * @property {FarmEntityMethods} plan
 * @property {FarmEntityMethods} quantity
 * @property {FarmEntityMethods} term
 * @property {FarmEntityMethods} user
 */

/**
 * To enable support for each entity type, its config object must be provided.
 * @typedef {import('./entities.js').EntityConfig} EntityConfig
 */

/** The main farmOS factory function for creating a new farm object.
 * @typedef {Function} farmOS
 * @param {Object} farmConfig
 * @property {import('./model/index.js').EntitySchemata} [config.schemata]
 * @property {Object} [config.remote]
 * @property {import('./client/index.js').client} [config.remote.adapter=d9JsonApiAdapter]
 * @property {Object.<String, EntityConfig>} [config.entities=defaultEntities]
 * @returns {FarmObject}
 */
function farmOS(farmConfig) {
  const { schemata, remote, entities = defaultEntities } = farmConfig;
  const shortNames = Object.values(entities).map(e => e.nomenclature.shortName);

  const farm = /** @type {FarmObject} */ (model({ schemata, entities }));

  const addRemote = (remoteConfig = {}) => {
    const { adapter: adapter$1 = adapter, ...options } = remoteConfig;
    const connection = adapter$1(farm, options);
    farm.schema.fetch = connection.schema.fetch;
    shortNames.forEach((shortName) => {
      farm[shortName].fetch = connection[shortName].fetch;
      farm[shortName].send = connection[shortName].send;
      farm[shortName].delete = connection[shortName].delete;
    });
    farm.remote = { ...omit(shortNames, connection), add: addRemote };
  };
  addRemote({ ...remote, entities });

  return farm;
}

export { client, farmOS as default, defaultEntities as entities, model, parseBundles };
