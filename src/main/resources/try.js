/**!
 * @fileOverview try.js - try monad for js
 * @author <a href="mailto:ziohimself@gmail.com">Serhiy "seruji" Onyshchenko</a>
 * @requires <a href="http://underscorejs.org/">underscorejs</a>
 * Licensed under
 * <a href="http://www.opensource.org/licenses/mit-license">MIT License</a>
 * */
(function(root, factory){
    function _defineNodeExports() {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        module.exports = factory(require('underscore'));
    }
    function _defineViaAmd() {
        define(['underscore'], factory);
    }
    function _commonjsDefine() {
        var _prev = root['Try'],
            _current = factory(root['_']);
        root['Try'] = _current;
        root['Try'].noConflict = function() {
            root['Try'] = _prev;
            return _current
        }
    }

    /** @see <a href="https://github.com/umdjs/umd/blob/master/returnExports.js">exports doc</a> */
    //noinspection JSUnresolvedVariable
    if (typeof exports === 'object') {
        // Node
        return _defineNodeExports()
    }
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        return _defineViaAmd()
    }
    // Browser globals (root is window)
    return _commonjsDefine()
})(this, function(_, undefined){
    /**
     * @returns {object} - try builder
     * */
    function Try() {
        return {
            of: _ofFn(),
            hasType: hasType,
            isType: isType,
            success: success,
            failure: failure,
            fail: failure
        }
    }
    function _initTry(){
        var _mixins = {
            of: _notImplementedYetFn(),
            isType: _notImplementedYetFn(),
            isSuccess: _.constant(false),
            isFailure: _.constant(false),
            map: _notImplementedYetFn(),
            flatMap: _notImplementedYetFn(),
            recover: _notImplementedYetFn(),
            recoverWith: _notImplementedYetFn(),
            failed: _notImplementedYetFn(),
            getValue: _notImplementedYetFn()
        };
        Try.prototype = _.extend(Try.prototype, _mixins);
        Try[_memberzPropName] = _.extend({}, _mixins);
        return Try
    }

    function _ofFn() {
        var _type = _NoneType;
        function _getType() {
            if(_.isUndefined(_type)) {
                return null
            }
            return _type
        }
        function _setType(type) {
            _type = type
        }
        return function of(type){
            switch(arguments.length) {
                case 0:
                    return _getType();
                case 1:
                default:
                    _setType(type);
                    return this
            }
        }
    }

    function hasType() {
        return this.of() === _NoneType
    }

    function isType(type) {
        return typesEqual(this.of(), type)
    }

    function _notImplementedYetFn() {
        return function notImplementedYet() {
            throw new TypeError("Not implemented yet!")
        }
    }

    function failure(exception) {
        return Failure(this.of(), exception)
    }

    function success(v) {
        var _type = this.of();
        if (_type === _NoneType) {
            _type = getType(v)
        }
        return Success(_type, v)
    }

    function getType(v) {
        if (_.has(v, _clazPropName) && _.isFunction(v[_clazPropName])) {
            return v[_clazPropName]
        }
        if (_.isUndefined(v)) {
            return undefined
        }
        if (_.isNull(v)) {
            return null
        }
        if (_.isNaN(v)) {
            return _NaN
        }
        return v.constructor
    }

    function typesEqual(type1, type2) {
        return _.isNaN(type1) && _.isNaN(type2) ||
            _.isUndefined(type1) && _.isNaN(type2) ||
            _.isNull(type1) && _.isNull(type2) ||
                type1 === type2
    }

    function Failure(type, exception) {
        var that = {
            isSuccess: _.constant(false),
            isFailure: _.constant(true),
            of: _ofFn(),
            isType: isType,
            map: function(){
                return this
            },
            flatMap: function(){
                return this
            },
            recover: function(type, fn){
                var _typeSpecified = false;
                switch(arguments.length) {
                    case 0:
                        return Try().of(this.of()).failure(new TypeError("recover called with no map function"));
                    case 1:
                        var _fnCandidate = arguments[0];
                        if (!_.isFunction(_fnCandidate)) {
                            return Try().of(this.of()).failure(new TypeError("recover called with no map function"))
                        }
                        fn = _fnCandidate;
                        _typeSpecified = false;
                        break;
                    case 2:
                    default:
                        if (!_.isFunction(fn)) {
                            return Try().of(this.of()).failure(new TypeError("recover called with no map function"))
                        }
                        _typeSpecified = true;
                        break;
                }
                var _v;
                try {
                    _v = fn.call(this, exception)
                } catch (err) {
                    var _fail = Try().failure(err);
                    if (_typeSpecified) {
                        return _fail.of(type)
                    }
                    return _fail
                }
                var _success = Try().success(_v);
                if (_typeSpecified) {
                    return _success.of(type)
                }
                return _success
            },
            recoverWith: function (fn) {
                //noinspection UnnecessaryLocalVariableJS
                var _tryOfV = fn.call(this, exception);
                return _tryOfV
            },
            failed: function() {
                return exception
            },
            getValue: function() {
                throw new TypeError("getValue called on a Failure!")
            }
        };
        that.of(type);
        that[_clazPropName] = Try;
        return that
    }

    function Success(type, v) {
        var that = {
            isSuccess: _.constant(true),
            isFailure: _.constant(false),
            of: _ofFn(),
            isType: isType,
            map: function(type, fn){
                var _typeSpecified = false;
                switch(arguments.length) {
                    case 0:
                        return Try().of(this.of()).failure(new TypeError("map called with no map function"));
                    case 1:
                        var _fnCandidate = arguments[0];
                        if (!_.isFunction(_fnCandidate)) {
                            return Try().of(this.of()).failure(new TypeError("map called with no map function"))
                        }
                        fn = _fnCandidate;
                        _typeSpecified = false;
                        break;
                    case 2:
                    default:
                        if (!_.isFunction(fn)) {
                            return Try().of(this.of()).failure(new TypeError("map called with no map function"))
                        }
                        _typeSpecified = true;
                        break;
                }
                var _v;
                try {
                    _v = fn.call(this, v)
                } catch (err) {
                    var _fail = Try().failure(err);
                    if (_typeSpecified) {
                        return _fail.of(type)
                    }
                    return _fail
                }
                var _success = Try().success(_v);
                if (_typeSpecified) {
                    return _success.of(type)
                }
                return _success
            },
            flatMap: function(fn){
                //noinspection UnnecessaryLocalVariableJS
                var _tryOfV = fn.call(this, v);
                return _tryOfV
            },
            recover: function(){
                return this
            },
            recoverWith: function (fn) {
                return this
            },
            failed: function() {
                throw new TypeError("failed called on a Success!")
            },
            getValue: function() {
                return v
            }
        };
        that.of(type);
        that[_clazPropName] = Try;
        return that
    }

    //noinspection UnnecessaryLocalVariableJS
    var _NoneType = {},
        _NaN = Number("_"),

        _memberzPropName = "memberz",
        _clazPropName = "claz",

        exports = {
            Try: Try,
            getType: getType,
            typesEqual: typesEqual,

            /** exposing internals for testing purpose */
            _notImplementedYetFn: _notImplementedYetFn,
            _ofFn: _ofFn,
            _NoneType: _NoneType
        };
    _initTry();
    _NaN = _.isNaN(_NaN)? _NaN : Number.NaN;
    return exports
});