(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.entities = {}));
})(this, (function (exports) { 'use strict';

  function _isPlaceholder$4(a) {
    return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
  }

  var _isPlaceholder_1 = _isPlaceholder$4;

  var _isPlaceholder$3 =

  _isPlaceholder_1;
  /**
   * Optimized internal one-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */


  function _curry1$5(fn) {
    return function f1(a) {
      if (arguments.length === 0 || _isPlaceholder$3(a)) {
        return f1;
      } else {
        return fn.apply(this, arguments);
      }
    };
  }

  var _curry1_1 = _curry1$5;

  function _arity$3(n, fn) {
    /* eslint-disable no-unused-vars */
    switch (n) {
      case 0:
        return function () {
          return fn.apply(this, arguments);
        };

      case 1:
        return function (a0) {
          return fn.apply(this, arguments);
        };

      case 2:
        return function (a0, a1) {
          return fn.apply(this, arguments);
        };

      case 3:
        return function (a0, a1, a2) {
          return fn.apply(this, arguments);
        };

      case 4:
        return function (a0, a1, a2, a3) {
          return fn.apply(this, arguments);
        };

      case 5:
        return function (a0, a1, a2, a3, a4) {
          return fn.apply(this, arguments);
        };

      case 6:
        return function (a0, a1, a2, a3, a4, a5) {
          return fn.apply(this, arguments);
        };

      case 7:
        return function (a0, a1, a2, a3, a4, a5, a6) {
          return fn.apply(this, arguments);
        };

      case 8:
        return function (a0, a1, a2, a3, a4, a5, a6, a7) {
          return fn.apply(this, arguments);
        };

      case 9:
        return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
          return fn.apply(this, arguments);
        };

      case 10:
        return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
          return fn.apply(this, arguments);
        };

      default:
        throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
    }
  }

  var _arity_1 = _arity$3;

  var _curry1$4 =

  _curry1_1;

  var _isPlaceholder$2 =

  _isPlaceholder_1;
  /**
   * Optimized internal two-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */


  function _curry2$3(fn) {
    return function f2(a, b) {
      switch (arguments.length) {
        case 0:
          return f2;

        case 1:
          return _isPlaceholder$2(a) ? f2 : _curry1$4(function (_b) {
            return fn(a, _b);
          });

        default:
          return _isPlaceholder$2(a) && _isPlaceholder$2(b) ? f2 : _isPlaceholder$2(a) ? _curry1$4(function (_a) {
            return fn(_a, b);
          }) : _isPlaceholder$2(b) ? _curry1$4(function (_b) {
            return fn(a, _b);
          }) : fn(a, b);
      }
    };
  }

  var _curry2_1 = _curry2$3;

  var _arity$2 =

  _arity_1;

  var _isPlaceholder$1 =

  _isPlaceholder_1;
  /**
   * Internal curryN function.
   *
   * @private
   * @category Function
   * @param {Number} length The arity of the curried function.
   * @param {Array} received An array of arguments received thus far.
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */


  function _curryN$1(length, received, fn) {
    return function () {
      var combined = [];
      var argsIdx = 0;
      var left = length;
      var combinedIdx = 0;

      while (combinedIdx < received.length || argsIdx < arguments.length) {
        var result;

        if (combinedIdx < received.length && (!_isPlaceholder$1(received[combinedIdx]) || argsIdx >= arguments.length)) {
          result = received[combinedIdx];
        } else {
          result = arguments[argsIdx];
          argsIdx += 1;
        }

        combined[combinedIdx] = result;

        if (!_isPlaceholder$1(result)) {
          left -= 1;
        }

        combinedIdx += 1;
      }

      return left <= 0 ? fn.apply(this, combined) : _arity$2(left, _curryN$1(length, combined, fn));
    };
  }

  var _curryN_1 = _curryN$1;

  var _arity$1 =

  _arity_1;

  var _curry1$3 =

  _curry1_1;

  var _curry2$2 =

  _curry2_1;

  var _curryN =

  _curryN_1;
  /**
   * Returns a curried equivalent of the provided function, with the specified
   * arity. The curried function has two unusual capabilities. First, its
   * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
   * following are equivalent:
   *
   *   - `g(1)(2)(3)`
   *   - `g(1)(2, 3)`
   *   - `g(1, 2)(3)`
   *   - `g(1, 2, 3)`
   *
   * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
   * "gaps", allowing partial application of any combination of arguments,
   * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
   * the following are equivalent:
   *
   *   - `g(1, 2, 3)`
   *   - `g(_, 2, 3)(1)`
   *   - `g(_, _, 3)(1)(2)`
   *   - `g(_, _, 3)(1, 2)`
   *   - `g(_, 2)(1)(3)`
   *   - `g(_, 2)(1, 3)`
   *   - `g(_, 2)(_, 3)(1)`
   *
   * @func
   * @memberOf R
   * @since v0.5.0
   * @category Function
   * @sig Number -> (* -> a) -> (* -> a)
   * @param {Number} length The arity for the returned function.
   * @param {Function} fn The function to curry.
   * @return {Function} A new, curried function.
   * @see R.curry
   * @example
   *
   *      const sumArgs = (...args) => R.sum(args);
   *
   *      const curriedAddFourNumbers = R.curryN(4, sumArgs);
   *      const f = curriedAddFourNumbers(1, 2);
   *      const g = f(3);
   *      g(4); //=> 10
   */


  var curryN$1 =
  /*#__PURE__*/
  _curry2$2(function curryN(length, fn) {
    if (length === 1) {
      return _curry1$3(fn);
    }

    return _arity$1(length, _curryN(length, [], fn));
  });

  var curryN_1 = curryN$1;

  var _curry1$2 =

  _curry1_1;

  var curryN =

  curryN_1;
  /**
   * Returns a curried equivalent of the provided function. The curried function
   * has two unusual capabilities. First, its arguments needn't be provided one
   * at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the
   * following are equivalent:
   *
   *   - `g(1)(2)(3)`
   *   - `g(1)(2, 3)`
   *   - `g(1, 2)(3)`
   *   - `g(1, 2, 3)`
   *
   * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
   * "gaps", allowing partial application of any combination of arguments,
   * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
   * the following are equivalent:
   *
   *   - `g(1, 2, 3)`
   *   - `g(_, 2, 3)(1)`
   *   - `g(_, _, 3)(1)(2)`
   *   - `g(_, _, 3)(1, 2)`
   *   - `g(_, 2)(1)(3)`
   *   - `g(_, 2)(1, 3)`
   *   - `g(_, 2)(_, 3)(1)`
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Function
   * @sig (* -> a) -> (* -> a)
   * @param {Function} fn The function to curry.
   * @return {Function} A new, curried function.
   * @see R.curryN, R.partial
   * @example
   *
   *      const addFourNumbers = (a, b, c, d) => a + b + c + d;
   *
   *      const curriedAddFourNumbers = R.curry(addFourNumbers);
   *      const f = curriedAddFourNumbers(1, 2);
   *      const g = f(3);
   *      g(4); //=> 10
   */


  var curry =
  /*#__PURE__*/
  _curry1$2(function curry(fn) {
    return curryN(fn.length, fn);
  });

  var curry_1 = curry;

  var curry$1 = curry_1;

  var _curry1$1 =

  _curry1_1;

  var _curry2$1 =

  _curry2_1;

  var _isPlaceholder =

  _isPlaceholder_1;
  /**
   * Optimized internal three-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */


  function _curry3$1(fn) {
    return function f3(a, b, c) {
      switch (arguments.length) {
        case 0:
          return f3;

        case 1:
          return _isPlaceholder(a) ? f3 : _curry2$1(function (_b, _c) {
            return fn(a, _b, _c);
          });

        case 2:
          return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2$1(function (_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder(b) ? _curry2$1(function (_b, _c) {
            return fn(a, _b, _c);
          }) : _curry1$1(function (_c) {
            return fn(a, b, _c);
          });

        default:
          return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2$1(function (_a, _b) {
            return fn(_a, _b, c);
          }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2$1(function (_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2$1(function (_b, _c) {
            return fn(a, _b, _c);
          }) : _isPlaceholder(a) ? _curry1$1(function (_a) {
            return fn(_a, b, c);
          }) : _isPlaceholder(b) ? _curry1$1(function (_b) {
            return fn(a, _b, c);
          }) : _isPlaceholder(c) ? _curry1$1(function (_c) {
            return fn(a, b, _c);
          }) : fn(a, b, c);
      }
    };
  }

  var _curry3_1 = _curry3$1;

  /**
   * Tests whether or not an object is an array.
   *
   * @private
   * @param {*} val The object to test.
   * @return {Boolean} `true` if `val` is an array, `false` otherwise.
   * @example
   *
   *      _isArray([]); //=> true
   *      _isArray(null); //=> false
   *      _isArray({}); //=> false
   */

  var _isArray$1 = Array.isArray || function _isArray(val) {
    return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
  };

  function _isString$1(x) {
    return Object.prototype.toString.call(x) === '[object String]';
  }

  var _isString_1 = _isString$1;

  var _curry1 =

  _curry1_1;

  var _isArray =

  _isArray$1;

  var _isString =

  _isString_1;
  /**
   * Tests whether or not an object is similar to an array.
   *
   * @private
   * @category Type
   * @category List
   * @sig * -> Boolean
   * @param {*} x The object to test.
   * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
   * @example
   *
   *      _isArrayLike([]); //=> true
   *      _isArrayLike(true); //=> false
   *      _isArrayLike({}); //=> false
   *      _isArrayLike({length: 10}); //=> false
   *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
   */


  var _isArrayLike$1 =
  /*#__PURE__*/
  _curry1(function isArrayLike(x) {
    if (_isArray(x)) {
      return true;
    }

    if (!x) {
      return false;
    }

    if (typeof x !== 'object') {
      return false;
    }

    if (_isString(x)) {
      return false;
    }

    if (x.nodeType === 1) {
      return !!x.length;
    }

    if (x.length === 0) {
      return true;
    }

    if (x.length > 0) {
      return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
    }

    return false;
  });

  var _isArrayLike_1 = _isArrayLike$1;

  var XWrap =
  /*#__PURE__*/
  function () {
    function XWrap(fn) {
      this.f = fn;
    }

    XWrap.prototype['@@transducer/init'] = function () {
      throw new Error('init not implemented on XWrap');
    };

    XWrap.prototype['@@transducer/result'] = function (acc) {
      return acc;
    };

    XWrap.prototype['@@transducer/step'] = function (acc, x) {
      return this.f(acc, x);
    };

    return XWrap;
  }();

  function _xwrap$1(fn) {
    return new XWrap(fn);
  }

  var _xwrap_1 = _xwrap$1;

  var _arity =

  _arity_1;

  var _curry2 =

  _curry2_1;
  /**
   * Creates a function that is bound to a context.
   * Note: `R.bind` does not provide the additional argument-binding capabilities of
   * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
   *
   * @func
   * @memberOf R
   * @since v0.6.0
   * @category Function
   * @category Object
   * @sig (* -> *) -> {*} -> (* -> *)
   * @param {Function} fn The function to bind to context
   * @param {Object} thisObj The context to bind `fn` to
   * @return {Function} A function that will execute in the context of `thisObj`.
   * @see R.partial
   * @example
   *
   *      const log = R.bind(console.log, console);
   *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
   *      // logs {a: 2}
   * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
   */


  var bind$1 =
  /*#__PURE__*/
  _curry2(function bind(fn, thisObj) {
    return _arity(fn.length, function () {
      return fn.apply(thisObj, arguments);
    });
  });

  var bind_1 = bind$1;

  var _isArrayLike =

  _isArrayLike_1;

  var _xwrap =

  _xwrap_1;

  var bind =

  bind_1;

  function _arrayReduce(xf, acc, list) {
    var idx = 0;
    var len = list.length;

    while (idx < len) {
      acc = xf['@@transducer/step'](acc, list[idx]);

      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }

      idx += 1;
    }

    return xf['@@transducer/result'](acc);
  }

  function _iterableReduce(xf, acc, iter) {
    var step = iter.next();

    while (!step.done) {
      acc = xf['@@transducer/step'](acc, step.value);

      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }

      step = iter.next();
    }

    return xf['@@transducer/result'](acc);
  }

  function _methodReduce(xf, acc, obj, methodName) {
    return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
  }

  var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';

  function _reduce$1(fn, acc, list) {
    if (typeof fn === 'function') {
      fn = _xwrap(fn);
    }

    if (_isArrayLike(list)) {
      return _arrayReduce(fn, acc, list);
    }

    if (typeof list['fantasy-land/reduce'] === 'function') {
      return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
    }

    if (list[symIterator] != null) {
      return _iterableReduce(fn, acc, list[symIterator]());
    }

    if (typeof list.next === 'function') {
      return _iterableReduce(fn, acc, list);
    }

    if (typeof list.reduce === 'function') {
      return _methodReduce(fn, acc, list, 'reduce');
    }

    throw new TypeError('reduce: list must be array or iterable');
  }

  var _reduce_1 = _reduce$1;

  var _curry3 =

  _curry3_1;

  var _reduce =

  _reduce_1;
  /**
   * Returns a single item by iterating through the list, successively calling
   * the iterator function and passing it an accumulator value and the current
   * value from the array, and then passing the result to the next call.
   *
   * The iterator function receives two values: *(acc, value)*. It may use
   * [`R.reduced`](#reduced) to shortcut the iteration.
   *
   * The arguments' order of [`reduceRight`](#reduceRight)'s iterator function
   * is *(value, acc)*.
   *
   * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
   * arrays), unlike the native `Array.prototype.reduce` method. For more details
   * on this behavior, see:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
   *
   * Dispatches to the `reduce` method of the third argument, if present. When
   * doing so, it is up to the user to handle the [`R.reduced`](#reduced)
   * shortcuting, as this is not implemented by `reduce`.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig ((a, b) -> a) -> a -> [b] -> a
   * @param {Function} fn The iterator function. Receives two values, the accumulator and the
   *        current element from the array.
   * @param {*} acc The accumulator value.
   * @param {Array} list The list to iterate over.
   * @return {*} The final, accumulated value.
   * @see R.reduced, R.addIndex, R.reduceRight
   * @example
   *
   *      R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10
   *      //          -               -10
   *      //         / \              / \
   *      //        -   4           -6   4
   *      //       / \              / \
   *      //      -   3   ==>     -3   3
   *      //     / \              / \
   *      //    -   2           -1   2
   *      //   / \              / \
   *      //  0   1            0   1
   *
   * @symb R.reduce(f, a, [b, c, d]) = f(f(f(a, b), c), d)
   */


  var reduce =
  /*#__PURE__*/
  _curry3(_reduce);

  var reduce_1 = reduce;

  var reduce$1 = reduce_1;

  const reduceObjIndexed = curry$1((fn, init, obj) => reduce$1(
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
  var entities = {
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

  exports["default"] = entities;
  exports.defaultOptions = defaultOptions;
  exports.entityMethods = entityMethods;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
