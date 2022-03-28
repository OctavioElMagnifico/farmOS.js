'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var addIndex = require('ramda/src/addIndex.js');
var clone = require('ramda/src/clone.js');
var evolve = require('ramda/src/evolve.js');
var identity = require('ramda/src/identity.js');
var map = require('ramda/src/map.js');
var mapObjIndexed = require('ramda/src/mapObjIndexed.js');
var rPath = require('ramda/src/path.js');
var anyPass = require('ramda/src/anyPass.js');
var compose = require('ramda/src/compose.js');
var has = require('ramda/src/has.js');
var curry = require('ramda/src/curry.js');
var reduce = require('ramda/src/reduce.js');
var mergeWith = require('ramda/src/mergeWith.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var addIndex__default = /*#__PURE__*/_interopDefaultLegacy(addIndex);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var evolve__default = /*#__PURE__*/_interopDefaultLegacy(evolve);
var identity__default = /*#__PURE__*/_interopDefaultLegacy(identity);
var map__default = /*#__PURE__*/_interopDefaultLegacy(map);
var mapObjIndexed__default = /*#__PURE__*/_interopDefaultLegacy(mapObjIndexed);
var rPath__default = /*#__PURE__*/_interopDefaultLegacy(rPath);
var anyPass__default = /*#__PURE__*/_interopDefaultLegacy(anyPass);
var compose__default = /*#__PURE__*/_interopDefaultLegacy(compose);
var has__default = /*#__PURE__*/_interopDefaultLegacy(has);
var curry__default = /*#__PURE__*/_interopDefaultLegacy(curry);
var reduce__default = /*#__PURE__*/_interopDefaultLegacy(reduce);
var mergeWith__default = /*#__PURE__*/_interopDefaultLegacy(mergeWith);

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

const hasAny = compose__default["default"](anyPass__default["default"], map__default["default"](has__default["default"]));

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

/** @type {(x: any) => Boolean} */
const isObject = x => typeof x === 'object' && x !== null;

curry__default["default"]((fn, init, obj) => reduce__default["default"](
  (acc, [key, val]) => fn(acc, val, key),
  init,
  Object.entries(obj),
));

/**
 * @template T
 * @param {(t: T, i: number) => T} transform
 * @param {Array.<T>} array
 * @returns {Array.<T>}
*/
const mapIndexed = addIndex__default["default"](map__default["default"]);

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
  const subschema = rPath__default["default"](pathSegments, schema);
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
  const _root = clone__default["default"](root);

  /** @type {(schema: JsonSchema, path?: Array.<string|number>) => JsonSchemaDereferenced} */
  const deref = (schema, path = []) => {
    if (!isObject(schema)) return boolOrThrow(schema);
    let _schema = schema;
    const set = (cb) => {
      _schema = cb(_schema);
      setInPlace(_root, path, _schema);
    };
    const derefSubschema = keyword => sub => deref(sub, [...path, keyword]);
    const derefSubschemaObject = keyword => mapObjIndexed__default["default"]((sub, prop) =>
      deref(sub, [...path, keyword, prop]));
    const derefSubschemaArray = keyword => mapIndexed((sub, i) =>
      deref(sub, [...path, keyword, i]));
    const schemaTypes = {
      string: identity__default["default"],
      number: identity__default["default"],
      integer: identity__default["default"],
      object: evolve__default["default"]({
        properties: derefSubschemaObject('properties'),
        patternProperties: derefSubschemaObject('patternProperties'),
        additionalProperties: derefSubschema('additionalProperties'),
      }),
      array: evolve__default["default"]({
        items: derefSubschema('items'),
        contains: derefSubschema('contains'),
        prefixItems: derefSubschemaArray('prefixItems'),
      }),
      boolean: identity__default["default"],
      null: identity__default["default"],
    };
    if ('type' in _schema && _schema.type in schemaTypes) {
      set(schemaTypes[_schema.type]);
    }
    if (hasLogicalKeyword(_schema)) {
      set(evolve__default["default"]({
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
      return map__default["default"](p => ({ not: p }), getProperties(schema.not));
    }
    return schema[keyword].reduce((props, subschema) => {
      const subProps = getProperties(subschema);
      const strategy = (b, a) => {
        const aList = keyword in a ? a[keyword] : [a];
        const bList = keyword in b ? b[keyword] : [b];
        return { [keyword]: [...aList, ...bList] };
      };
      return mergeWith__default["default"](strategy, props, subProps);
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
  const mapGetDef = map__default["default"](getDef);

  if (hasLogicalKeyword(subschema)) {
    return evolve__default["default"]({
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

exports.dereference = dereference;
exports.getDefault = getDefault;
exports.getDefinition = getDefinition;
exports.getPath = getPath;
exports.getProperties = getProperties;
exports.getProperty = getProperty;
exports.getReference = getReference;
exports.listProperties = listProperties;
exports.parseURI = parseURI;
