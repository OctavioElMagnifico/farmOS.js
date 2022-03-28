(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.model = {}));
})(this, (function (exports) { 'use strict';

  function _cloneRegExp$1(pattern) {
    return new RegExp(pattern.source, (pattern.global ? 'g' : '') + (pattern.ignoreCase ? 'i' : '') + (pattern.multiline ? 'm' : '') + (pattern.sticky ? 'y' : '') + (pattern.unicode ? 'u' : ''));
  }

  var _cloneRegExp_1 = _cloneRegExp$1;

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


  function _curry1$f(fn) {
    return function f1(a) {
      if (arguments.length === 0 || _isPlaceholder$3(a)) {
        return f1;
      } else {
        return fn.apply(this, arguments);
      }
    };
  }

  var _curry1_1 = _curry1$f;

  var _curry1$e =

  _curry1_1;
  /**
   * Gives a single-word string description of the (native) type of a value,
   * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
   * attempt to distinguish user Object types any further, reporting them all as
   * 'Object'.
   *
   * @func
   * @memberOf R
   * @since v0.8.0
   * @category Type
   * @sig (* -> {*}) -> String
   * @param {*} val The value to test
   * @return {String}
   * @example
   *
   *      R.type({}); //=> "Object"
   *      R.type(1); //=> "Number"
   *      R.type(false); //=> "Boolean"
   *      R.type('s'); //=> "String"
   *      R.type(null); //=> "Null"
   *      R.type([]); //=> "Array"
   *      R.type(/[A-z]/); //=> "RegExp"
   *      R.type(() => {}); //=> "Function"
   *      R.type(undefined); //=> "Undefined"
   */


  var type$2 =
  /*#__PURE__*/
  _curry1$e(function type(val) {
    return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
  });

  var type_1 = type$2;

  var _cloneRegExp =

  _cloneRegExp_1;

  var type$1 =

  type_1;
  /**
   * Copies an object.
   *
   * @private
   * @param {*} value The value to be copied
   * @param {Array} refFrom Array containing the source references
   * @param {Array} refTo Array containing the copied source references
   * @param {Boolean} deep Whether or not to perform deep cloning.
   * @return {*} The copied value.
   */


  function _clone$1(value, refFrom, refTo, deep) {
    var copy = function copy(copiedValue) {
      var len = refFrom.length;
      var idx = 0;

      while (idx < len) {
        if (value === refFrom[idx]) {
          return refTo[idx];
        }

        idx += 1;
      }

      refFrom[idx + 1] = value;
      refTo[idx + 1] = copiedValue;

      for (var key in value) {
        copiedValue[key] = deep ? _clone$1(value[key], refFrom, refTo, true) : value[key];
      }

      return copiedValue;
    };

    switch (type$1(value)) {
      case 'Object':
        return copy({});

      case 'Array':
        return copy([]);

      case 'Date':
        return new Date(value.valueOf());

      case 'RegExp':
        return _cloneRegExp(value);

      default:
        return value;
    }
  }

  var _clone_1 = _clone$1;

  var _clone =

  _clone_1;

  var _curry1$d =

  _curry1_1;
  /**
   * Creates a deep copy of the value which may contain (nested) `Array`s and
   * `Object`s, `Number`s, `String`s, `Boolean`s and `Date`s. `Function`s are
   * assigned by reference rather than copied
   *
   * Dispatches to a `clone` method if present.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Object
   * @sig {*} -> {*}
   * @param {*} value The object or array to clone
   * @return {*} A deeply cloned copy of `val`
   * @example
   *
   *      const objects = [{}, {}, {}];
   *      const objectsClone = R.clone(objects);
   *      objects === objectsClone; //=> false
   *      objects[0] === objectsClone[0]; //=> false
   */


  var clone =
  /*#__PURE__*/
  _curry1$d(function clone(value) {
    return value != null && typeof value.clone === 'function' ? value.clone() : _clone(value, [], [], true);
  });

  var clone_1 = clone;

  var clone$1 = clone_1;

  var _curry1$c =

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


  function _curry2$k(fn) {
    return function f2(a, b) {
      switch (arguments.length) {
        case 0:
          return f2;

        case 1:
          return _isPlaceholder$2(a) ? f2 : _curry1$c(function (_b) {
            return fn(a, _b);
          });

        default:
          return _isPlaceholder$2(a) && _isPlaceholder$2(b) ? f2 : _isPlaceholder$2(a) ? _curry1$c(function (_a) {
            return fn(_a, b);
          }) : _isPlaceholder$2(b) ? _curry1$c(function (_b) {
            return fn(a, _b);
          }) : fn(a, b);
      }
    };
  }

  var _curry2_1 = _curry2$k;

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

  var _isArray$3 = Array.isArray || function _isArray(val) {
    return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
  };

  function _isTransformer$1(obj) {
    return obj != null && typeof obj['@@transducer/step'] === 'function';
  }

  var _isTransformer_1 = _isTransformer$1;

  var _isArray$2 =

  _isArray$3;

  var _isTransformer =

  _isTransformer_1;
  /**
   * Returns a function that dispatches with different strategies based on the
   * object in list position (last argument). If it is an array, executes [fn].
   * Otherwise, if it has a function with one of the given method names, it will
   * execute that function (functor case). Otherwise, if it is a transformer,
   * uses transducer [xf] to return a new transformer (transducer case).
   * Otherwise, it will default to executing [fn].
   *
   * @private
   * @param {Array} methodNames properties to check for a custom implementation
   * @param {Function} xf transducer to initialize if object is transformer
   * @param {Function} fn default ramda implementation
   * @return {Function} A function that dispatches on object in list position
   */


  function _dispatchable$3(methodNames, xf, fn) {
    return function () {
      if (arguments.length === 0) {
        return fn();
      }

      var args = Array.prototype.slice.call(arguments, 0);
      var obj = args.pop();

      if (!_isArray$2(obj)) {
        var idx = 0;

        while (idx < methodNames.length) {
          if (typeof obj[methodNames[idx]] === 'function') {
            return obj[methodNames[idx]].apply(obj, args);
          }

          idx += 1;
        }

        if (_isTransformer(obj)) {
          var transducer = xf.apply(null, args);
          return transducer(obj);
        }
      }

      return fn.apply(this, arguments);
    };
  }

  var _dispatchable_1 = _dispatchable$3;

  function _reduced$1(x) {
    return x && x['@@transducer/reduced'] ? x : {
      '@@transducer/value': x,
      '@@transducer/reduced': true
    };
  }

  var _reduced_1 = _reduced$1;

  var _xfBase$3 = {
    init: function () {
      return this.xf['@@transducer/init']();
    },
    result: function (result) {
      return this.xf['@@transducer/result'](result);
    }
  };

  var _curry2$j =

  _curry2_1;

  var _reduced =

  _reduced_1;

  var _xfBase$2 =

  _xfBase$3;

  var XTake =
  /*#__PURE__*/
  function () {
    function XTake(n, xf) {
      this.xf = xf;
      this.n = n;
      this.i = 0;
    }

    XTake.prototype['@@transducer/init'] = _xfBase$2.init;
    XTake.prototype['@@transducer/result'] = _xfBase$2.result;

    XTake.prototype['@@transducer/step'] = function (result, input) {
      this.i += 1;
      var ret = this.n === 0 ? result : this.xf['@@transducer/step'](result, input);
      return this.n >= 0 && this.i >= this.n ? _reduced(ret) : ret;
    };

    return XTake;
  }();

  var _xtake$1 =
  /*#__PURE__*/
  _curry2$j(function _xtake(n, xf) {
    return new XTake(n, xf);
  });

  var _xtake_1 = _xtake$1;

  var _isArray$1 =

  _isArray$3;
  /**
   * This checks whether a function has a [methodname] function. If it isn't an
   * array it will execute that function otherwise it will default to the ramda
   * implementation.
   *
   * @private
   * @param {Function} fn ramda implemtation
   * @param {String} methodname property to check for a custom implementation
   * @return {Object} Whatever the return value of the method is.
   */


  function _checkForMethod$2(methodname, fn) {
    return function () {
      var length = arguments.length;

      if (length === 0) {
        return fn();
      }

      var obj = arguments[length - 1];
      return _isArray$1(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
    };
  }

  var _checkForMethod_1 = _checkForMethod$2;

  var _curry1$b =

  _curry1_1;

  var _curry2$i =

  _curry2_1;

  var _isPlaceholder$1 =

  _isPlaceholder_1;
  /**
   * Optimized internal three-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */


  function _curry3$5(fn) {
    return function f3(a, b, c) {
      switch (arguments.length) {
        case 0:
          return f3;

        case 1:
          return _isPlaceholder$1(a) ? f3 : _curry2$i(function (_b, _c) {
            return fn(a, _b, _c);
          });

        case 2:
          return _isPlaceholder$1(a) && _isPlaceholder$1(b) ? f3 : _isPlaceholder$1(a) ? _curry2$i(function (_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder$1(b) ? _curry2$i(function (_b, _c) {
            return fn(a, _b, _c);
          }) : _curry1$b(function (_c) {
            return fn(a, b, _c);
          });

        default:
          return _isPlaceholder$1(a) && _isPlaceholder$1(b) && _isPlaceholder$1(c) ? f3 : _isPlaceholder$1(a) && _isPlaceholder$1(b) ? _curry2$i(function (_a, _b) {
            return fn(_a, _b, c);
          }) : _isPlaceholder$1(a) && _isPlaceholder$1(c) ? _curry2$i(function (_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder$1(b) && _isPlaceholder$1(c) ? _curry2$i(function (_b, _c) {
            return fn(a, _b, _c);
          }) : _isPlaceholder$1(a) ? _curry1$b(function (_a) {
            return fn(_a, b, c);
          }) : _isPlaceholder$1(b) ? _curry1$b(function (_b) {
            return fn(a, _b, c);
          }) : _isPlaceholder$1(c) ? _curry1$b(function (_c) {
            return fn(a, b, _c);
          }) : fn(a, b, c);
      }
    };
  }

  var _curry3_1 = _curry3$5;

  var _checkForMethod$1 =

  _checkForMethod_1;

  var _curry3$4 =

  _curry3_1;
  /**
   * Returns the elements of the given list or string (or object with a `slice`
   * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
   *
   * Dispatches to the `slice` method of the third argument, if present.
   *
   * @func
   * @memberOf R
   * @since v0.1.4
   * @category List
   * @sig Number -> Number -> [a] -> [a]
   * @sig Number -> Number -> String -> String
   * @param {Number} fromIndex The start index (inclusive).
   * @param {Number} toIndex The end index (exclusive).
   * @param {*} list
   * @return {*}
   * @example
   *
   *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
   *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
   *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
   *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
   *      R.slice(0, 3, 'ramda');                     //=> 'ram'
   */


  var slice$2 =
  /*#__PURE__*/
  _curry3$4(
  /*#__PURE__*/
  _checkForMethod$1('slice', function slice(fromIndex, toIndex, list) {
    return Array.prototype.slice.call(list, fromIndex, toIndex);
  }));

  var slice_1 = slice$2;

  var _curry2$h =

  _curry2_1;

  var _dispatchable$2 =

  _dispatchable_1;

  var _xtake =

  _xtake_1;

  var slice$1 =

  slice_1;
  /**
   * Returns the first `n` elements of the given list, string, or
   * transducer/transformer (or object with a `take` method).
   *
   * Dispatches to the `take` method of the second argument, if present.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig Number -> [a] -> [a]
   * @sig Number -> String -> String
   * @param {Number} n
   * @param {*} list
   * @return {*}
   * @see R.drop
   * @example
   *
   *      R.take(1, ['foo', 'bar', 'baz']); //=> ['foo']
   *      R.take(2, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
   *      R.take(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
   *      R.take(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
   *      R.take(3, 'ramda');               //=> 'ram'
   *
   *      const personnel = [
   *        'Dave Brubeck',
   *        'Paul Desmond',
   *        'Eugene Wright',
   *        'Joe Morello',
   *        'Gerry Mulligan',
   *        'Bob Bates',
   *        'Joe Dodge',
   *        'Ron Crotty'
   *      ];
   *
   *      const takeFive = R.take(5);
   *      takeFive(personnel);
   *      //=> ['Dave Brubeck', 'Paul Desmond', 'Eugene Wright', 'Joe Morello', 'Gerry Mulligan']
   * @symb R.take(-1, [a, b]) = [a, b]
   * @symb R.take(0, [a, b]) = []
   * @symb R.take(1, [a, b]) = [a]
   * @symb R.take(2, [a, b]) = [a, b]
   */


  var take$1 =
  /*#__PURE__*/
  _curry2$h(
  /*#__PURE__*/
  _dispatchable$2(['take'], _xtake, function take(n, xs) {
    return slice$1(0, n < 0 ? Infinity : n, xs);
  }));

  var take_1 = take$1;

  var take =

  take_1;

  function dropLast$2(n, xs) {
    return take(n < xs.length ? xs.length - n : 0, xs);
  }

  var _dropLast$1 = dropLast$2;

  var _curry2$g =

  _curry2_1;

  var _xfBase$1 =

  _xfBase$3;

  var XDropLast =
  /*#__PURE__*/
  function () {
    function XDropLast(n, xf) {
      this.xf = xf;
      this.pos = 0;
      this.full = false;
      this.acc = new Array(n);
    }

    XDropLast.prototype['@@transducer/init'] = _xfBase$1.init;

    XDropLast.prototype['@@transducer/result'] = function (result) {
      this.acc = null;
      return this.xf['@@transducer/result'](result);
    };

    XDropLast.prototype['@@transducer/step'] = function (result, input) {
      if (this.full) {
        result = this.xf['@@transducer/step'](result, this.acc[this.pos]);
      }

      this.store(input);
      return result;
    };

    XDropLast.prototype.store = function (input) {
      this.acc[this.pos] = input;
      this.pos += 1;

      if (this.pos === this.acc.length) {
        this.pos = 0;
        this.full = true;
      }
    };

    return XDropLast;
  }();

  var _xdropLast$1 =
  /*#__PURE__*/
  _curry2$g(function _xdropLast(n, xf) {
    return new XDropLast(n, xf);
  });

  var _xdropLast_1 = _xdropLast$1;

  var _curry2$f =

  _curry2_1;

  var _dispatchable$1 =

  _dispatchable_1;

  var _dropLast =

  _dropLast$1;

  var _xdropLast =

  _xdropLast_1;
  /**
   * Returns a list containing all but the last `n` elements of the given `list`.
   *
   * Acts as a transducer if a transformer is given in list position.
   *
   * @func
   * @memberOf R
   * @since v0.16.0
   * @category List
   * @sig Number -> [a] -> [a]
   * @sig Number -> String -> String
   * @param {Number} n The number of elements of `list` to skip.
   * @param {Array} list The list of elements to consider.
   * @return {Array} A copy of the list with only the first `list.length - n` elements
   * @see R.takeLast, R.drop, R.dropWhile, R.dropLastWhile
   * @example
   *
   *      R.dropLast(1, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
   *      R.dropLast(2, ['foo', 'bar', 'baz']); //=> ['foo']
   *      R.dropLast(3, ['foo', 'bar', 'baz']); //=> []
   *      R.dropLast(4, ['foo', 'bar', 'baz']); //=> []
   *      R.dropLast(3, 'ramda');               //=> 'ra'
   */


  var dropLast =
  /*#__PURE__*/
  _curry2$f(
  /*#__PURE__*/
  _dispatchable$1([], _xdropLast, _dropLast));

  var dropLast_1 = dropLast;

  var dropLast$1 = dropLast_1;

  function _map$1(fn, functor) {
    var idx = 0;
    var len = functor.length;
    var result = Array(len);

    while (idx < len) {
      result[idx] = fn(functor[idx]);
      idx += 1;
    }

    return result;
  }

  var _map_1 = _map$1;

  function _isString$3(x) {
    return Object.prototype.toString.call(x) === '[object String]';
  }

  var _isString_1 = _isString$3;

  var _curry1$a =

  _curry1_1;

  var _isArray =

  _isArray$3;

  var _isString$2 =

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
  _curry1$a(function isArrayLike(x) {
    if (_isArray(x)) {
      return true;
    }

    if (!x) {
      return false;
    }

    if (typeof x !== 'object') {
      return false;
    }

    if (_isString$2(x)) {
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

  function _arity$5(n, fn) {
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

  var _arity_1 = _arity$5;

  var _arity$4 =

  _arity_1;

  var _curry2$e =

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
  _curry2$e(function bind(fn, thisObj) {
    return _arity$4(fn.length, function () {
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

  function _reduce$3(fn, acc, list) {
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

  var _reduce_1 = _reduce$3;

  var _curry2$d =

  _curry2_1;

  var _xfBase =

  _xfBase$3;

  var XMap =
  /*#__PURE__*/
  function () {
    function XMap(f, xf) {
      this.xf = xf;
      this.f = f;
    }

    XMap.prototype['@@transducer/init'] = _xfBase.init;
    XMap.prototype['@@transducer/result'] = _xfBase.result;

    XMap.prototype['@@transducer/step'] = function (result, input) {
      return this.xf['@@transducer/step'](result, this.f(input));
    };

    return XMap;
  }();

  var _xmap$1 =
  /*#__PURE__*/
  _curry2$d(function _xmap(f, xf) {
    return new XMap(f, xf);
  });

  var _xmap_1 = _xmap$1;

  var _arity$3 =

  _arity_1;

  var _isPlaceholder =

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

        if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
          result = received[combinedIdx];
        } else {
          result = arguments[argsIdx];
          argsIdx += 1;
        }

        combined[combinedIdx] = result;

        if (!_isPlaceholder(result)) {
          left -= 1;
        }

        combinedIdx += 1;
      }

      return left <= 0 ? fn.apply(this, combined) : _arity$3(left, _curryN$1(length, combined, fn));
    };
  }

  var _curryN_1 = _curryN$1;

  var _arity$2 =

  _arity_1;

  var _curry1$9 =

  _curry1_1;

  var _curry2$c =

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


  var curryN$4 =
  /*#__PURE__*/
  _curry2$c(function curryN(length, fn) {
    if (length === 1) {
      return _curry1$9(fn);
    }

    return _arity$2(length, _curryN(length, [], fn));
  });

  var curryN_1 = curryN$4;

  function _has$5(prop, obj) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  var _has_1 = _has$5;

  var _has$4 =

  _has_1;

  var toString = Object.prototype.toString;

  var _isArguments$1 =
  /*#__PURE__*/
  function () {
    return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
      return toString.call(x) === '[object Arguments]';
    } : function _isArguments(x) {
      return _has$4('callee', x);
    };
  }();

  var _isArguments_1 = _isArguments$1;

  var _curry1$8 =

  _curry1_1;

  var _has$3 =

  _has_1;

  var _isArguments =

  _isArguments_1; // cover IE < 9 keys issues


  var hasEnumBug = !
  /*#__PURE__*/
  {
    toString: null
  }.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString']; // Safari bug

  var hasArgsEnumBug =
  /*#__PURE__*/
  function () {

    return arguments.propertyIsEnumerable('length');
  }();

  var contains = function contains(list, item) {
    var idx = 0;

    while (idx < list.length) {
      if (list[idx] === item) {
        return true;
      }

      idx += 1;
    }

    return false;
  };
  /**
   * Returns a list containing the names of all the enumerable own properties of
   * the supplied object.
   * Note that the order of the output array is not guaranteed to be consistent
   * across different JS platforms.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Object
   * @sig {k: v} -> [k]
   * @param {Object} obj The object to extract properties from
   * @return {Array} An array of the object's own properties.
   * @see R.keysIn, R.values
   * @example
   *
   *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
   */


  var keys$3 = typeof Object.keys === 'function' && !hasArgsEnumBug ?
  /*#__PURE__*/
  _curry1$8(function keys(obj) {
    return Object(obj) !== obj ? [] : Object.keys(obj);
  }) :
  /*#__PURE__*/
  _curry1$8(function keys(obj) {
    if (Object(obj) !== obj) {
      return [];
    }

    var prop, nIdx;
    var ks = [];

    var checkArgsLength = hasArgsEnumBug && _isArguments(obj);

    for (prop in obj) {
      if (_has$3(prop, obj) && (!checkArgsLength || prop !== 'length')) {
        ks[ks.length] = prop;
      }
    }

    if (hasEnumBug) {
      nIdx = nonEnumerableProps.length - 1;

      while (nIdx >= 0) {
        prop = nonEnumerableProps[nIdx];

        if (_has$3(prop, obj) && !contains(ks, prop)) {
          ks[ks.length] = prop;
        }

        nIdx -= 1;
      }
    }

    return ks;
  });
  var keys_1 = keys$3;

  var _curry2$b =

  _curry2_1;

  var _dispatchable =

  _dispatchable_1;

  var _map =

  _map_1;

  var _reduce$2 =

  _reduce_1;

  var _xmap =

  _xmap_1;

  var curryN$3 =

  curryN_1;

  var keys$2 =

  keys_1;
  /**
   * Takes a function and
   * a [functor](https://github.com/fantasyland/fantasy-land#functor),
   * applies the function to each of the functor's values, and returns
   * a functor of the same shape.
   *
   * Ramda provides suitable `map` implementations for `Array` and `Object`,
   * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
   *
   * Dispatches to the `map` method of the second argument, if present.
   *
   * Acts as a transducer if a transformer is given in list position.
   *
   * Also treats functions as functors and will compose them together.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig Functor f => (a -> b) -> f a -> f b
   * @param {Function} fn The function to be called on every element of the input `list`.
   * @param {Array} list The list to be iterated over.
   * @return {Array} The new list.
   * @see R.transduce, R.addIndex
   * @example
   *
   *      const double = x => x * 2;
   *
   *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
   *
   *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
   * @symb R.map(f, [a, b]) = [f(a), f(b)]
   * @symb R.map(f, { x: a, y: b }) = { x: f(a), y: f(b) }
   * @symb R.map(f, functor_o) = functor_o.map(f)
   */


  var map$2 =
  /*#__PURE__*/
  _curry2$b(
  /*#__PURE__*/
  _dispatchable(['fantasy-land/map', 'map'], _xmap, function map(fn, functor) {
    switch (Object.prototype.toString.call(functor)) {
      case '[object Function]':
        return curryN$3(functor.length, function () {
          return fn.call(this, functor.apply(this, arguments));
        });

      case '[object Object]':
        return _reduce$2(function (acc, key) {
          acc[key] = fn(functor[key]);
          return acc;
        }, {}, keys$2(functor));

      default:
        return _map(fn, functor);
    }
  }));

  var map_1 = map$2;

  var map$3 = map_1;

  // Unique ID creation requires a high quality random # generator. In the browser we therefore
  // require the crypto API and do not support built-in fallback to lower quality random number
  // generators (like Math.random()).
  var getRandomValues;
  var rnds8 = new Uint8Array(16);
  function rng() {
    // lazy load so that environments that need to polyfill have a chance to do so
    if (!getRandomValues) {
      // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
      // find the complete implementation of crypto (msCrypto) on IE11.
      getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

      if (!getRandomValues) {
        throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
      }
    }

    return getRandomValues(rnds8);
  }

  var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

  function validate(uuid) {
    return typeof uuid === 'string' && REGEX.test(uuid);
  }

  /**
   * Convert array of 16 byte values to UUID string format of the form:
   * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
   */

  var byteToHex = [];

  for (var i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).substr(1));
  }

  function stringify(arr) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    // Note: Be careful editing this code!  It's been tuned for performance
    // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
    var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
    // of the following:
    // - One or more input array values don't map to a hex octet (leading to
    // "undefined" in the uuid)
    // - Invalid input values for the RFC `version` or `variant` fields

    if (!validate(uuid)) {
      throw TypeError('Stringified UUID is invalid');
    }

    return uuid;
  }

  function v4(options, buf, offset) {
    options = options || {};
    var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

    if (buf) {
      offset = offset || 0;

      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }

      return buf;
    }

    return stringify(rnds);
  }

  /**
   * Private `concat` function to merge two array-like objects.
   *
   * @private
   * @param {Array|Arguments} [set1=[]] An array-like object.
   * @param {Array|Arguments} [set2=[]] An array-like object.
   * @return {Array} A new, merged array.
   * @example
   *
   *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
   */

  function _concat$1(set1, set2) {
    set1 = set1 || [];
    set2 = set2 || [];
    var idx;
    var len1 = set1.length;
    var len2 = set2.length;
    var result = [];
    idx = 0;

    while (idx < len1) {
      result[result.length] = set1[idx];
      idx += 1;
    }

    idx = 0;

    while (idx < len2) {
      result[result.length] = set2[idx];
      idx += 1;
    }

    return result;
  }

  var _concat_1 = _concat$1;

  var _concat =

  _concat_1;

  var _curry1$7 =

  _curry1_1;

  var curryN$2 =

  curryN_1;
  /**
   * Creates a new list iteration function from an existing one by adding two new
   * parameters to its callback function: the current index, and the entire list.
   *
   * This would turn, for instance, [`R.map`](#map) function into one that
   * more closely resembles `Array.prototype.map`. Note that this will only work
   * for functions in which the iteration callback function is the first
   * parameter, and where the list is the last parameter. (This latter might be
   * unimportant if the list parameter is not used.)
   *
   * @func
   * @memberOf R
   * @since v0.15.0
   * @category Function
   * @category List
   * @sig ((a ... -> b) ... -> [a] -> *) -> ((a ..., Int, [a] -> b) ... -> [a] -> *)
   * @param {Function} fn A list iteration function that does not pass index or list to its callback
   * @return {Function} An altered list iteration function that passes (item, index, list) to its callback
   * @example
   *
   *      const mapIndexed = R.addIndex(R.map);
   *      mapIndexed((val, idx) => idx + '-' + val, ['f', 'o', 'o', 'b', 'a', 'r']);
   *      //=> ['0-f', '1-o', '2-o', '3-b', '4-a', '5-r']
   */


  var addIndex =
  /*#__PURE__*/
  _curry1$7(function addIndex(fn) {
    return curryN$2(fn.length, function () {
      var idx = 0;
      var origFn = arguments[0];
      var list = arguments[arguments.length - 1];
      var args = Array.prototype.slice.call(arguments, 0);

      args[0] = function () {
        var result = origFn.apply(this, _concat(arguments, [idx, list]));
        idx += 1;
        return result;
      };

      return fn.apply(this, args);
    });
  });

  var addIndex_1 = addIndex;

  var addIndex$1 = addIndex_1;

  var _curry2$a =

  _curry2_1;
  /**
   * Creates a new object by recursively evolving a shallow copy of `object`,
   * according to the `transformation` functions. All non-primitive properties
   * are copied by reference.
   *
   * A `transformation` function will not be invoked if its corresponding key
   * does not exist in the evolved object.
   *
   * @func
   * @memberOf R
   * @since v0.9.0
   * @category Object
   * @sig {k: (v -> v)} -> {k: v} -> {k: v}
   * @param {Object} transformations The object specifying transformation functions to apply
   *        to the object.
   * @param {Object} object The object to be transformed.
   * @return {Object} The transformed object.
   * @example
   *
   *      const tomato = {firstName: '  Tomato ', data: {elapsed: 100, remaining: 1400}, id:123};
   *      const transformations = {
   *        firstName: R.trim,
   *        lastName: R.trim, // Will not get invoked.
   *        data: {elapsed: R.add(1), remaining: R.add(-1)}
   *      };
   *      R.evolve(transformations, tomato); //=> {firstName: 'Tomato', data: {elapsed: 101, remaining: 1399}, id:123}
   */


  var evolve =
  /*#__PURE__*/
  _curry2$a(function evolve(transformations, object) {
    var result = object instanceof Array ? [] : {};
    var transformation, key, type;

    for (key in object) {
      transformation = transformations[key];
      type = typeof transformation;
      result[key] = type === 'function' ? transformation(object[key]) : transformation && type === 'object' ? evolve(transformation, object[key]) : object[key];
    }

    return result;
  });

  var evolve_1 = evolve;

  var evolve$1 = evolve_1;

  function _identity$1(x) {
    return x;
  }

  var _identity_1 = _identity$1;

  var _curry1$6 =

  _curry1_1;

  var _identity =

  _identity_1;
  /**
   * A function that does nothing but return the parameter supplied to it. Good
   * as a default or placeholder function.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Function
   * @sig a -> a
   * @param {*} x The value to return.
   * @return {*} The input value, `x`.
   * @example
   *
   *      R.identity(1); //=> 1
   *
   *      const obj = {};
   *      R.identity(obj) === obj; //=> true
   * @symb R.identity(a) = a
   */


  var identity =
  /*#__PURE__*/
  _curry1$6(_identity);

  var identity_1 = identity;

  var identity$1 = identity_1;

  var _curry2$9 =

  _curry2_1;

  var _reduce$1 =

  _reduce_1;

  var keys$1 =

  keys_1;
  /**
   * An Object-specific version of [`map`](#map). The function is applied to three
   * arguments: *(value, key, obj)*. If only the value is significant, use
   * [`map`](#map) instead.
   *
   * @func
   * @memberOf R
   * @since v0.9.0
   * @category Object
   * @sig ((*, String, Object) -> *) -> Object -> Object
   * @param {Function} fn
   * @param {Object} obj
   * @return {Object}
   * @see R.map
   * @example
   *
   *      const xyz = { x: 1, y: 2, z: 3 };
   *      const prependKeyAndDouble = (num, key, obj) => key + (num * 2);
   *
   *      R.mapObjIndexed(prependKeyAndDouble, xyz); //=> { x: 'x2', y: 'y4', z: 'z6' }
   */


  var mapObjIndexed =
  /*#__PURE__*/
  _curry2$9(function mapObjIndexed(fn, obj) {
    return _reduce$1(function (acc, key) {
      acc[key] = fn(obj[key], key, obj);
      return acc;
    }, {}, keys$1(obj));
  });

  var mapObjIndexed_1 = mapObjIndexed;

  var mapObjIndexed$1 = mapObjIndexed_1;

  /**
   * Determine if the passed argument is an integer.
   *
   * @private
   * @param {*} n
   * @category Type
   * @return {Boolean}
   */

  var _isInteger$1 = Number.isInteger || function _isInteger(n) {
    return n << 0 === n;
  };

  var _curry2$8 =

  _curry2_1;

  var _isString$1 =

  _isString_1;
  /**
   * Returns the nth element of the given list or string. If n is negative the
   * element at index length + n is returned.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig Number -> [a] -> a | Undefined
   * @sig Number -> String -> String
   * @param {Number} offset
   * @param {*} list
   * @return {*}
   * @example
   *
   *      const list = ['foo', 'bar', 'baz', 'quux'];
   *      R.nth(1, list); //=> 'bar'
   *      R.nth(-1, list); //=> 'quux'
   *      R.nth(-99, list); //=> undefined
   *
   *      R.nth(2, 'abc'); //=> 'c'
   *      R.nth(3, 'abc'); //=> ''
   * @symb R.nth(-1, [a, b, c]) = c
   * @symb R.nth(0, [a, b, c]) = a
   * @symb R.nth(1, [a, b, c]) = b
   */


  var nth$1 =
  /*#__PURE__*/
  _curry2$8(function nth(offset, list) {
    var idx = offset < 0 ? list.length + offset : offset;
    return _isString$1(list) ? list.charAt(idx) : list[idx];
  });

  var nth_1 = nth$1;

  var _curry2$7 =

  _curry2_1;

  var _isInteger =

  _isInteger$1;

  var nth =

  nth_1;
  /**
   * Retrieves the values at given paths of an object.
   *
   * @func
   * @memberOf R
   * @since v0.27.1
   * @category Object
   * @typedefn Idx = [String | Int]
   * @sig [Idx] -> {a} -> [a | Undefined]
   * @param {Array} pathsArray The array of paths to be fetched.
   * @param {Object} obj The object to retrieve the nested properties from.
   * @return {Array} A list consisting of values at paths specified by "pathsArray".
   * @see R.path
   * @example
   *
   *      R.paths([['a', 'b'], ['p', 0, 'q']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, 3]
   *      R.paths([['a', 'b'], ['p', 'r']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, undefined]
   */


  var paths$1 =
  /*#__PURE__*/
  _curry2$7(function paths(pathsArray, obj) {
    return pathsArray.map(function (paths) {
      var val = obj;
      var idx = 0;
      var p;

      while (idx < paths.length) {
        if (val == null) {
          return;
        }

        p = paths[idx];
        val = _isInteger(p) ? nth(p, val) : val[p];
        idx += 1;
      }

      return val;
    });
  });

  var paths_1 = paths$1;

  var _curry2$6 =

  _curry2_1;

  var paths =

  paths_1;
  /**
   * Retrieve the value at a given path.
   *
   * @func
   * @memberOf R
   * @since v0.2.0
   * @category Object
   * @typedefn Idx = String | Int
   * @sig [Idx] -> {a} -> a | Undefined
   * @param {Array} path The path to use.
   * @param {Object} obj The object to retrieve the nested property from.
   * @return {*} The data at `path`.
   * @see R.prop, R.nth
   * @example
   *
   *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
   *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
   *      R.path(['a', 'b', 0], {a: {b: [1, 2, 3]}}); //=> 1
   *      R.path(['a', 'b', -2], {a: {b: [1, 2, 3]}}); //=> 2
   */


  var path$1 =
  /*#__PURE__*/
  _curry2$6(function path(pathAr, obj) {
    return paths([pathAr], obj)[0];
  });

  var path_1 = path$1;

  var rPath = path_1;

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

  var _curry2$5 =

  _curry2_1;
  /**
   * Returns the larger of its two arguments.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Relation
   * @sig Ord a => a -> a -> a
   * @param {*} a
   * @param {*} b
   * @return {*}
   * @see R.maxBy, R.min
   * @example
   *
   *      R.max(789, 123); //=> 789
   *      R.max('a', 'b'); //=> 'b'
   */


  var max$2 =
  /*#__PURE__*/
  _curry2$5(function max(a, b) {
    return b > a ? b : a;
  });

  var max_1 = max$2;

  var _curry2$4 =

  _curry2_1;

  var path =

  path_1;
  /**
   * Returns a function that when supplied an object returns the indicated
   * property of that object, if it exists.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Object
   * @typedefn Idx = String | Int
   * @sig Idx -> {s: a} -> a | Undefined
   * @param {String|Number} p The property name or array index
   * @param {Object} obj The object to query
   * @return {*} The value at `obj.p`.
   * @see R.path, R.nth
   * @example
   *
   *      R.prop('x', {x: 100}); //=> 100
   *      R.prop('x', {}); //=> undefined
   *      R.prop(0, [100]); //=> 100
   *      R.compose(R.inc, R.prop('x'))({ x: 3 }) //=> 4
   */


  var prop$1 =
  /*#__PURE__*/
  _curry2$4(function prop(p, obj) {
    return path([p], obj);
  });

  var prop_1 = prop$1;

  var prop$2 = prop_1;

  var _curry2$3 =

  _curry2_1;

  var map$1 =

  map_1;

  var prop =

  prop_1;
  /**
   * Returns a new list by plucking the same named property off all objects in
   * the list supplied.
   *
   * `pluck` will work on
   * any [functor](https://github.com/fantasyland/fantasy-land#functor) in
   * addition to arrays, as it is equivalent to `R.map(R.prop(k), f)`.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig Functor f => k -> f {k: v} -> f v
   * @param {Number|String} key The key name to pluck off of each object.
   * @param {Array} f The array or functor to consider.
   * @return {Array} The list of values for the given key.
   * @see R.props
   * @example
   *
   *      var getAges = R.pluck('age');
   *      getAges([{name: 'fred', age: 29}, {name: 'wilma', age: 27}]); //=> [29, 27]
   *
   *      R.pluck(0, [[1, 2], [3, 4]]);               //=> [1, 3]
   *      R.pluck('val', {a: {val: 3}, b: {val: 5}}); //=> {a: 3, b: 5}
   * @symb R.pluck('x', [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}]) = [1, 3, 5]
   * @symb R.pluck(0, [[1, 2], [3, 4], [5, 6]]) = [1, 3, 5]
   */


  var pluck$1 =
  /*#__PURE__*/
  _curry2$3(function pluck(p, list) {
    return map$1(prop(p), list);
  });

  var pluck_1 = pluck$1;

  var _curry3$3 =

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


  var reduce$3 =
  /*#__PURE__*/
  _curry3$3(_reduce);

  var reduce_1 = reduce$3;

  var reduce$4 = reduce_1;

  var _curry1$5 =

  _curry1_1;

  var curryN$1 =

  curryN_1;

  var max$1 =

  max_1;

  var pluck =

  pluck_1;

  var reduce$2 =

  reduce_1;
  /**
   * Takes a list of predicates and returns a predicate that returns true for a
   * given list of arguments if at least one of the provided predicates is
   * satisfied by those arguments.
   *
   * The function returned is a curried function whose arity matches that of the
   * highest-arity predicate.
   *
   * @func
   * @memberOf R
   * @since v0.9.0
   * @category Logic
   * @sig [(*... -> Boolean)] -> (*... -> Boolean)
   * @param {Array} predicates An array of predicates to check
   * @return {Function} The combined predicate
   * @see R.allPass
   * @example
   *
   *      const isClub = R.propEq('suit', '♣');
   *      const isSpade = R.propEq('suit', '♠');
   *      const isBlackCard = R.anyPass([isClub, isSpade]);
   *
   *      isBlackCard({rank: '10', suit: '♣'}); //=> true
   *      isBlackCard({rank: 'Q', suit: '♠'}); //=> true
   *      isBlackCard({rank: 'Q', suit: '♦'}); //=> false
   */


  var anyPass =
  /*#__PURE__*/
  _curry1$5(function anyPass(preds) {
    return curryN$1(reduce$2(max$1, 0, pluck('length', preds)), function () {
      var idx = 0;
      var len = preds.length;

      while (idx < len) {
        if (preds[idx].apply(this, arguments)) {
          return true;
        }

        idx += 1;
      }

      return false;
    });
  });

  var anyPass_1 = anyPass;

  var anyPass$1 = anyPass_1;

  function _pipe$1(f, g) {
    return function () {
      return g.call(this, f.apply(this, arguments));
    };
  }

  var _pipe_1 = _pipe$1;

  var _checkForMethod =

  _checkForMethod_1;

  var _curry1$4 =

  _curry1_1;

  var slice =

  slice_1;
  /**
   * Returns all but the first element of the given list or string (or object
   * with a `tail` method).
   *
   * Dispatches to the `slice` method of the first argument, if present.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig [a] -> [a]
   * @sig String -> String
   * @param {*} list
   * @return {*}
   * @see R.head, R.init, R.last
   * @example
   *
   *      R.tail([1, 2, 3]);  //=> [2, 3]
   *      R.tail([1, 2]);     //=> [2]
   *      R.tail([1]);        //=> []
   *      R.tail([]);         //=> []
   *
   *      R.tail('abc');  //=> 'bc'
   *      R.tail('ab');   //=> 'b'
   *      R.tail('a');    //=> ''
   *      R.tail('');     //=> ''
   */


  var tail$1 =
  /*#__PURE__*/
  _curry1$4(
  /*#__PURE__*/
  _checkForMethod('tail',
  /*#__PURE__*/
  slice(1, Infinity)));

  var tail_1 = tail$1;

  var _arity$1 =

  _arity_1;

  var _pipe =

  _pipe_1;

  var reduce$1 =

  reduce_1;

  var tail =

  tail_1;
  /**
   * Performs left-to-right function composition. The first argument may have
   * any arity; the remaining arguments must be unary.
   *
   * In some libraries this function is named `sequence`.
   *
   * **Note:** The result of pipe is not automatically curried.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Function
   * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
   * @param {...Function} functions
   * @return {Function}
   * @see R.compose
   * @example
   *
   *      const f = R.pipe(Math.pow, R.negate, R.inc);
   *
   *      f(3, 4); // -(3^4) + 1
   * @symb R.pipe(f, g, h)(a, b) = h(g(f(a, b)))
   */


  function pipe$1() {
    if (arguments.length === 0) {
      throw new Error('pipe requires at least one argument');
    }

    return _arity$1(arguments[0].length, reduce$1(_pipe, arguments[0], tail(arguments)));
  }

  var pipe_1 = pipe$1;

  var _curry1$3 =

  _curry1_1;

  var _isString =

  _isString_1;
  /**
   * Returns a new list or string with the elements or characters in reverse
   * order.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig [a] -> [a]
   * @sig String -> String
   * @param {Array|String} list
   * @return {Array|String}
   * @example
   *
   *      R.reverse([1, 2, 3]);  //=> [3, 2, 1]
   *      R.reverse([1, 2]);     //=> [2, 1]
   *      R.reverse([1]);        //=> [1]
   *      R.reverse([]);         //=> []
   *
   *      R.reverse('abc');      //=> 'cba'
   *      R.reverse('ab');       //=> 'ba'
   *      R.reverse('a');        //=> 'a'
   *      R.reverse('');         //=> ''
   */


  var reverse$1 =
  /*#__PURE__*/
  _curry1$3(function reverse(list) {
    return _isString(list) ? list.split('').reverse().join('') : Array.prototype.slice.call(list, 0).reverse();
  });

  var reverse_1 = reverse$1;

  var pipe =

  pipe_1;

  var reverse =

  reverse_1;
  /**
   * Performs right-to-left function composition. The last argument may have
   * any arity; the remaining arguments must be unary.
   *
   * **Note:** The result of compose is not automatically curried.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Function
   * @sig ((y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)) -> ((a, b, ..., n) -> z)
   * @param {...Function} ...functions The functions to compose
   * @return {Function}
   * @see R.pipe
   * @example
   *
   *      const classyGreeting = (firstName, lastName) => "The name's " + lastName + ", " + firstName + " " + lastName
   *      const yellGreeting = R.compose(R.toUpper, classyGreeting);
   *      yellGreeting('James', 'Bond'); //=> "THE NAME'S BOND, JAMES BOND"
   *
   *      R.compose(Math.abs, R.add(1), R.multiply(2))(-4) //=> 7
   *
   * @symb R.compose(f, g, h)(a, b) = f(g(h(a, b)))
   */


  function compose() {
    if (arguments.length === 0) {
      throw new Error('compose requires at least one argument');
    }

    return pipe.apply(this, reverse(arguments));
  }

  var compose_1 = compose;

  var compose$1 = compose_1;

  var _curry1$2 =

  _curry1_1;
  /**
   * Checks if the input value is `null` or `undefined`.
   *
   * @func
   * @memberOf R
   * @since v0.9.0
   * @category Type
   * @sig * -> Boolean
   * @param {*} x The value to test.
   * @return {Boolean} `true` if `x` is `undefined` or `null`, otherwise `false`.
   * @example
   *
   *      R.isNil(null); //=> true
   *      R.isNil(undefined); //=> true
   *      R.isNil(0); //=> false
   *      R.isNil([]); //=> false
   */


  var isNil$1 =
  /*#__PURE__*/
  _curry1$2(function isNil(x) {
    return x == null;
  });

  var isNil_1 = isNil$1;

  var isNil$2 = isNil_1;

  var _curry2$2 =

  _curry2_1;

  var _has$2 =

  _has_1;

  var isNil =

  isNil_1;
  /**
   * Returns whether or not a path exists in an object. Only the object's
   * own properties are checked.
   *
   * @func
   * @memberOf R
   * @since v0.26.0
   * @category Object
   * @typedefn Idx = String | Int
   * @sig [Idx] -> {a} -> Boolean
   * @param {Array} path The path to use.
   * @param {Object} obj The object to check the path in.
   * @return {Boolean} Whether the path exists.
   * @see R.has
   * @example
   *
   *      R.hasPath(['a', 'b'], {a: {b: 2}});         // => true
   *      R.hasPath(['a', 'b'], {a: {b: undefined}}); // => true
   *      R.hasPath(['a', 'b'], {a: {c: 2}});         // => false
   *      R.hasPath(['a', 'b'], {});                  // => false
   */


  var hasPath$1 =
  /*#__PURE__*/
  _curry2$2(function hasPath(_path, obj) {
    if (_path.length === 0 || isNil(obj)) {
      return false;
    }

    var val = obj;
    var idx = 0;

    while (idx < _path.length) {
      if (!isNil(val) && _has$2(_path[idx], val)) {
        val = val[_path[idx]];
        idx += 1;
      } else {
        return false;
      }
    }

    return true;
  });

  var hasPath_1 = hasPath$1;

  var _curry2$1 =

  _curry2_1;

  var hasPath =

  hasPath_1;
  /**
   * Returns whether or not an object has an own property with the specified name
   *
   * @func
   * @memberOf R
   * @since v0.7.0
   * @category Object
   * @sig s -> {s: x} -> Boolean
   * @param {String} prop The name of the property to check for.
   * @param {Object} obj The object to query.
   * @return {Boolean} Whether the property exists.
   * @example
   *
   *      const hasName = R.has('name');
   *      hasName({name: 'alice'});   //=> true
   *      hasName({name: 'bob'});     //=> true
   *      hasName({});                //=> false
   *
   *      const point = {x: 0, y: 0};
   *      const pointHas = R.has(R.__, point);
   *      pointHas('x');  //=> true
   *      pointHas('y');  //=> true
   *      pointHas('z');  //=> false
   */


  var has =
  /*#__PURE__*/
  _curry2$1(function has(prop, obj) {
    return hasPath([prop], obj);
  });

  var has_1 = has;

  var has$1 = has_1;

  const hasAny = compose$1(anyPass$1, map$3(has$1));

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

  var _curry1$1 =

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
  _curry1$1(function curry(fn) {
    return curryN(fn.length, fn);
  });

  var curry_1 = curry;

  var curry$1 = curry_1;

  /** @type {(x: any) => Boolean} */
  const isObject = x => typeof x === 'object' && x !== null;

  const reduceObjIndexed = curry$1((fn, init, obj) => reduce$4(
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

  /**
   * @template T
   * @param {(t: T, i: number) => T} transform
   * @param {Array.<T>} array
   * @returns {Array.<T>}
  */
  const mapIndexed = addIndex$1(map$3);

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
    const subschema = rPath(pathSegments, schema);
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
    const _root = clone$1(root);

    /** @type {(schema: JsonSchema, path?: Array.<string|number>) => JsonSchemaDereferenced} */
    const deref = (schema, path = []) => {
      if (!isObject(schema)) return boolOrThrow(schema);
      let _schema = schema;
      const set = (cb) => {
        _schema = cb(_schema);
        setInPlace(_root, path, _schema);
      };
      const derefSubschema = keyword => sub => deref(sub, [...path, keyword]);
      const derefSubschemaObject = keyword => mapObjIndexed$1((sub, prop) =>
        deref(sub, [...path, keyword, prop]));
      const derefSubschemaArray = keyword => mapIndexed((sub, i) =>
        deref(sub, [...path, keyword, i]));
      const schemaTypes = {
        string: identity$1,
        number: identity$1,
        integer: identity$1,
        object: evolve$1({
          properties: derefSubschemaObject('properties'),
          patternProperties: derefSubschemaObject('patternProperties'),
          additionalProperties: derefSubschema('additionalProperties'),
        }),
        array: evolve$1({
          items: derefSubschema('items'),
          contains: derefSubschema('contains'),
          prefixItems: derefSubschemaArray('prefixItems'),
        }),
        boolean: identity$1,
        null: identity$1,
      };
      if ('type' in _schema && _schema.type in schemaTypes) {
        set(schemaTypes[_schema.type]);
      }
      if (hasLogicalKeyword(_schema)) {
        set(evolve$1({
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

  var _curry3$2 =

  _curry3_1;

  var _has$1 =

  _has_1;
  /**
   * Creates a new object with the own properties of the two provided objects. If
   * a key exists in both objects, the provided function is applied to the key
   * and the values associated with the key in each object, with the result being
   * used as the value associated with the key in the returned object.
   *
   * @func
   * @memberOf R
   * @since v0.19.0
   * @category Object
   * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
   * @param {Function} fn
   * @param {Object} l
   * @param {Object} r
   * @return {Object}
   * @see R.mergeDeepWithKey, R.merge, R.mergeWith
   * @example
   *
   *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
   *      R.mergeWithKey(concatValues,
   *                     { a: true, thing: 'foo', values: [10, 20] },
   *                     { b: true, thing: 'bar', values: [15, 35] });
   *      //=> { a: true, b: true, thing: 'bar', values: [10, 20, 15, 35] }
   * @symb R.mergeWithKey(f, { x: 1, y: 2 }, { y: 5, z: 3 }) = { x: 1, y: f('y', 2, 5), z: 3 }
   */


  var mergeWithKey$1 =
  /*#__PURE__*/
  _curry3$2(function mergeWithKey(fn, l, r) {
    var result = {};
    var k;

    for (k in l) {
      if (_has$1(k, l)) {
        result[k] = _has$1(k, r) ? fn(k, l[k], r[k]) : l[k];
      }
    }

    for (k in r) {
      if (_has$1(k, r) && !_has$1(k, result)) {
        result[k] = r[k];
      }
    }

    return result;
  });

  var mergeWithKey_1 = mergeWithKey$1;

  var _curry3$1 =

  _curry3_1;

  var mergeWithKey =

  mergeWithKey_1;
  /**
   * Creates a new object with the own properties of the two provided objects. If
   * a key exists in both objects, the provided function is applied to the values
   * associated with the key in each object, with the result being used as the
   * value associated with the key in the returned object.
   *
   * @func
   * @memberOf R
   * @since v0.19.0
   * @category Object
   * @sig ((a, a) -> a) -> {a} -> {a} -> {a}
   * @param {Function} fn
   * @param {Object} l
   * @param {Object} r
   * @return {Object}
   * @see R.mergeDeepWith, R.merge, R.mergeWithKey
   * @example
   *
   *      R.mergeWith(R.concat,
   *                  { a: true, values: [10, 20] },
   *                  { b: true, values: [15, 35] });
   *      //=> { a: true, b: true, values: [10, 20, 15, 35] }
   */


  var mergeWith =
  /*#__PURE__*/
  _curry3$1(function mergeWith(fn, l, r) {
    return mergeWithKey(function (_, _l, _r) {
      return fn(_l, _r);
    }, l, r);
  });

  var mergeWith_1 = mergeWith;

  var mergeWith$1 = mergeWith_1;

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
        return map$3(p => ({ not: p }), getProperties(schema.not));
      }
      return schema[keyword].reduce((props, subschema) => {
        const subProps = getProperties(subschema);
        const strategy = (b, a) => {
          const aList = keyword in a ? a[keyword] : [a];
          const bList = keyword in b ? b[keyword] : [b];
          return { [keyword]: [...aList, ...bList] };
        };
        return mergeWith$1(strategy, props, subProps);
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
    const mapGetDef = map$3(getDef);

    if (hasLogicalKeyword(subschema)) {
      return evolve$1({
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
    } = clone$1(props);
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

  var _arity =

  _arity_1;

  var _curry1 =

  _curry1_1;

  var map =

  map_1;

  var max =

  max_1;

  var reduce =

  reduce_1;
  /**
   * Returns a function, `fn`, which encapsulates `if/else, if/else, ...` logic.
   * `R.cond` takes a list of [predicate, transformer] pairs. All of the arguments
   * to `fn` are applied to each of the predicates in turn until one returns a
   * "truthy" value, at which point `fn` returns the result of applying its
   * arguments to the corresponding transformer. If none of the predicates
   * matches, `fn` returns undefined.
   *
   * @func
   * @memberOf R
   * @since v0.6.0
   * @category Logic
   * @sig [[(*... -> Boolean),(*... -> *)]] -> (*... -> *)
   * @param {Array} pairs A list of [predicate, transformer]
   * @return {Function}
   * @see R.ifElse, R.unless, R.when
   * @example
   *
   *      const fn = R.cond([
   *        [R.equals(0),   R.always('water freezes at 0°C')],
   *        [R.equals(100), R.always('water boils at 100°C')],
   *        [R.T,           temp => 'nothing special happens at ' + temp + '°C']
   *      ]);
   *      fn(0); //=> 'water freezes at 0°C'
   *      fn(50); //=> 'nothing special happens at 50°C'
   *      fn(100); //=> 'water boils at 100°C'
   */


  var cond =
  /*#__PURE__*/
  _curry1(function cond(pairs) {
    var arity = reduce(max, 0, map(function (pair) {
      return pair[0].length;
    }, pairs));
    return _arity(arity, function () {
      var idx = 0;

      while (idx < pairs.length) {
        if (pairs[idx][0].apply(this, arguments)) {
          return pairs[idx][1].apply(this, arguments);
        }

        idx += 1;
      }
    });
  });

  var cond_1 = cond;

  var cond$1 = cond_1;

  function _arrayFromIterator$1(iter) {
    var list = [];
    var next;

    while (!(next = iter.next()).done) {
      list.push(next.value);
    }

    return list;
  }

  var _arrayFromIterator_1 = _arrayFromIterator$1;

  function _includesWith$1(pred, x, list) {
    var idx = 0;
    var len = list.length;

    while (idx < len) {
      if (pred(x, list[idx])) {
        return true;
      }

      idx += 1;
    }

    return false;
  }

  var _includesWith_1 = _includesWith$1;

  function _functionName$1(f) {
    // String(x => x) evaluates to "x => x", so the pattern may not match.
    var match = String(f).match(/^function (\w*)/);
    return match == null ? '' : match[1];
  }

  var _functionName_1 = _functionName$1;

  // Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
  function _objectIs$1(a, b) {
    // SameValue algorithm
    if (a === b) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return a !== 0 || 1 / a === 1 / b;
    } else {
      // Step 6.a: NaN == NaN
      return a !== a && b !== b;
    }
  }

  var _objectIs_1 = typeof Object.is === 'function' ? Object.is : _objectIs$1;

  var _arrayFromIterator =

  _arrayFromIterator_1;

  var _includesWith =

  _includesWith_1;

  var _functionName =

  _functionName_1;

  var _has =

  _has_1;

  var _objectIs =

  _objectIs_1;

  var keys =

  keys_1;

  var type =

  type_1;
  /**
   * private _uniqContentEquals function.
   * That function is checking equality of 2 iterator contents with 2 assumptions
   * - iterators lengths are the same
   * - iterators values are unique
   *
   * false-positive result will be returned for comparision of, e.g.
   * - [1,2,3] and [1,2,3,4]
   * - [1,1,1] and [1,2,3]
   * */


  function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
    var a = _arrayFromIterator(aIterator);

    var b = _arrayFromIterator(bIterator);

    function eq(_a, _b) {
      return _equals$1(_a, _b, stackA.slice(), stackB.slice());
    } // if *a* array contains any element that is not included in *b*


    return !_includesWith(function (b, aItem) {
      return !_includesWith(eq, aItem, b);
    }, b, a);
  }

  function _equals$1(a, b, stackA, stackB) {
    if (_objectIs(a, b)) {
      return true;
    }

    var typeA = type(a);

    if (typeA !== type(b)) {
      return false;
    }

    if (a == null || b == null) {
      return false;
    }

    if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
      return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) && typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
    }

    if (typeof a.equals === 'function' || typeof b.equals === 'function') {
      return typeof a.equals === 'function' && a.equals(b) && typeof b.equals === 'function' && b.equals(a);
    }

    switch (typeA) {
      case 'Arguments':
      case 'Array':
      case 'Object':
        if (typeof a.constructor === 'function' && _functionName(a.constructor) === 'Promise') {
          return a === b;
        }

        break;

      case 'Boolean':
      case 'Number':
      case 'String':
        if (!(typeof a === typeof b && _objectIs(a.valueOf(), b.valueOf()))) {
          return false;
        }

        break;

      case 'Date':
        if (!_objectIs(a.valueOf(), b.valueOf())) {
          return false;
        }

        break;

      case 'Error':
        return a.name === b.name && a.message === b.message;

      case 'RegExp':
        if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
          return false;
        }

        break;
    }

    var idx = stackA.length - 1;

    while (idx >= 0) {
      if (stackA[idx] === a) {
        return stackB[idx] === b;
      }

      idx -= 1;
    }

    switch (typeA) {
      case 'Map':
        if (a.size !== b.size) {
          return false;
        }

        return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));

      case 'Set':
        if (a.size !== b.size) {
          return false;
        }

        return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));

      case 'Arguments':
      case 'Array':
      case 'Object':
      case 'Boolean':
      case 'Number':
      case 'String':
      case 'Date':
      case 'Error':
      case 'RegExp':
      case 'Int8Array':
      case 'Uint8Array':
      case 'Uint8ClampedArray':
      case 'Int16Array':
      case 'Uint16Array':
      case 'Int32Array':
      case 'Uint32Array':
      case 'Float32Array':
      case 'Float64Array':
      case 'ArrayBuffer':
        break;

      default:
        // Values of other types are only equal if identical.
        return false;
    }

    var keysA = keys(a);

    if (keysA.length !== keys(b).length) {
      return false;
    }

    var extendedStackA = stackA.concat([a]);
    var extendedStackB = stackB.concat([b]);
    idx = keysA.length - 1;

    while (idx >= 0) {
      var key = keysA[idx];

      if (!(_has(key, b) && _equals$1(b[key], a[key], extendedStackA, extendedStackB))) {
        return false;
      }

      idx -= 1;
    }

    return true;
  }

  var _equals_1 = _equals$1;

  var _curry2 =

  _curry2_1;

  var _equals =

  _equals_1;
  /**
   * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
   * cyclical data structures.
   *
   * Dispatches symmetrically to the `equals` methods of both arguments, if
   * present.
   *
   * @func
   * @memberOf R
   * @since v0.15.0
   * @category Relation
   * @sig a -> b -> Boolean
   * @param {*} a
   * @param {*} b
   * @return {Boolean}
   * @example
   *
   *      R.equals(1, 1); //=> true
   *      R.equals(1, '1'); //=> false
   *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
   *
   *      const a = {}; a.v = a;
   *      const b = {}; b.v = b;
   *      R.equals(a, b); //=> true
   */


  var equals$1 =
  /*#__PURE__*/
  _curry2(function equals(a, b) {
    return _equals(a, b, [], []);
  });

  var equals_1 = equals$1;

  var equals$2 = equals_1;

  var _curry3 =

  _curry3_1;

  var equals =

  equals_1;
  /**
   * Takes a function and two values in its domain and returns `true` if the
   * values map to the same value in the codomain; `false` otherwise.
   *
   * @func
   * @memberOf R
   * @since v0.18.0
   * @category Relation
   * @sig (a -> b) -> a -> a -> Boolean
   * @param {Function} f
   * @param {*} x
   * @param {*} y
   * @return {Boolean}
   * @example
   *
   *      R.eqBy(Math.abs, 5, -5); //=> true
   */


  var eqBy =
  /*#__PURE__*/
  _curry3(function eqBy(f, x, y) {
    return equals(f(x), f(y));
  });

  var eqBy_1 = eqBy;

  var eqBy$1 = eqBy_1;

  // Helpers for determining if a set of fields are equivalent. Attributes are
  // fairly straightforward, but relationships need to be compared strictly by
  // their id(s), b/c JSON:API gives a lot of leeway for how these references
  // can be ordered and structured.
  const setOfIds = compose$1(
    array => new Set(array),
    map$3(prop$2('id')),
  );
  const relsTransform = cond$1([
    [isNil$2, identity$1],
    [Array.isArray, setOfIds],
    [has$1('id'), prop$2('id')],
  ]);
  const eqFields = fieldType =>
    (fieldType === 'relationships' ? eqBy$1(relsTransform) : equals$2);

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
    if (!remote) return clone$1(local);
    const now = new Date().toISOString();
    if (!local) {
      // A nullish local value represents the first time a remotely generated
      // entity was fetched, so all changes are considered synced with the remote.
      const resetLastSync = evolve$1({ meta: { remote: { lastSync: () => now } } });
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
    const localCopy = clone$1(local);
    const {
      meta: {
        fieldChanges: localChanges,
        changed: localChanged = now,
        remote: { lastSync: localLastSync = null },
      },
    } = localCopy;

    // Deep clone the remote & destructure its metadata for internal reference.
    const remoteCopy = clone$1(remote);
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
    const entityCopy = clone$1(entity);
    const propsCopy = clone$1(props);
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
    const schemata = map$3(() => ({}), entities);

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
        return clone$1(schemata);
      }
      if (!type) {
        return clone$1(schemata[entity]);
      }
      return clone$1(schemata[entity][type]);
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
          const getterArgs = dropLast$1(1, args);
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

  exports["default"] = model;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
