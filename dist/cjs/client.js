'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var axios = require('axios');
var curry = require('ramda/src/curry.js');
var reduce = require('ramda/src/reduce.js');
var map = require('ramda/src/map.js');
var prop = require('ramda/src/prop.js');
var replace = require('ramda/src/replace.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var curry__default = /*#__PURE__*/_interopDefaultLegacy(curry);
var reduce__default = /*#__PURE__*/_interopDefaultLegacy(reduce);
var map__default = /*#__PURE__*/_interopDefaultLegacy(map);
var prop__default = /*#__PURE__*/_interopDefaultLegacy(prop);
var replace__default = /*#__PURE__*/_interopDefaultLegacy(replace);

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
    return axios__default["default"].post(accessTokenUri, refreshParams)
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
          return axios__default["default"](originalRequest);
        }).catch((error) => { throw error; });
      }
      // Else subscribe for new access token after refresh.
      const requestSubscribers = new Promise((resolve, reject) => {
        subscribeTokenRefresh(
          (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axios__default["default"](originalRequest));
          },
          reject,
        );
      });
      return requestSubscribers;
    }
    throw err;
  });
  return {
    authorize: (user, password) => axios__default["default"](accessTokenUri, {
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

const reduceObjIndexed = curry__default["default"]((fn, init, obj) => reduce__default["default"](
  (acc, [key, val]) => fn(acc, val, key),
  init,
  Object.entries(obj),
));

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
  replace__default["default"](`${entity}--`, '', type);

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
    const schemata = map__default["default"](() => ({}), entities);
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
    .then(prop__default["default"]('data'));
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
  const request = axios__default["default"].create(clientOptions);

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

exports["default"] = client;
