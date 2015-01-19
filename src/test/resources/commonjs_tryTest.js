//noinspection JSUnresolvedVariable
(function(){
    Qunit.require('lib/underscore-min.js');
    Qunit.require('try.js');

    /*global window*/
    /** QUnit function aliases */
    var module      = QUnit.module,
        test        = QUnit.test;

    /** TODO: remove, when migrated to QUnit 2.0 */
    QUnit.assert.expect = QUnit.expect;

    module('Try loaded');
    test('Try loaded', function(assert) {
        assert.ok(window.Try, 'window.Try should be defined');
    });

    module('Try.Try');
    test('Try.Try loaded', function(assert) {
        assert.ok(_.isFunction(Try.Try), 'Try.Try should be a function');
    });
    test('Try.Try should return a try builder object', function(assert) {
        assert.strictEqual(_.isUndefined(Try.Try()), false, 'Try() should be defined');
        assert.strictEqual(_.isNull(Try.Try()), false, 'Try() should not be null');
        assert.strictEqual(_.isNaN(Try.Try()), false, 'Try() should not be NaN');
        assert.ok(_.isFunction(Try.Try().of), 'Try().of should be a function');
        assert.ok(_.isFunction(Try.Try().hasType), 'Try().hasType should be a function');
        assert.ok(_.isFunction(Try.Try().isType), 'Try().hasType should be a function');
        assert.ok(_.isFunction(Try.Try().success), 'Try().success should be a function');
        assert.ok(_.isFunction(Try.Try().failure), 'Try().failure should be a function');
        assert.ok(_.isFunction(Try.Try().fail), 'Try().fail should be a function');
    });
    module('Try.Try.of');
    test('Try.Try.of should work as setter and getter depending on arguments', function(assert) {
        assert.strictEqual(Try.Try().of(), Try._NoneType, 'Try().of() should work as a getter and return a None Type');
        var _zTry;
        _zTry = Try.Try();
        assert.strictEqual(_zTry.of(Number), _zTry, 'Try().of(Number) should work as a setter and return self');
        assert.strictEqual(_zTry.of(), Number, 'Try().of() should work as a getter and return the set type');
        _zTry = Try.Try();
        assert.strictEqual(_zTry.of(String), _zTry, 'Try().of(String) should work as a setter and return self');
        assert.strictEqual(_zTry.of(), String, 'Try().of() should work as a getter and return the set type');
        _zTry = Try.Try();
        assert.strictEqual(_zTry.of(Object), _zTry, 'Try().of(Object) should work as a setter and return self');
        assert.strictEqual(_zTry.of(), Object, 'Try().of() should work as a getter and return the set type');
        _zTry = Try.Try();
        assert.strictEqual(_zTry.of(Array), _zTry, 'Try().of(Array) should work as a setter and return self');
        assert.strictEqual(_zTry.of(), Array, 'Try().of() should work as a getter and return the set type');
        _zTry = Try.Try();
        assert.strictEqual(_zTry.of(Boolean), _zTry, 'Try().of(Boolean) should work as a setter and return self');
        assert.strictEqual(_zTry.of(), Boolean, 'Try().of() should work as a getter and return the set type');
        _zTry = Try.Try();
        assert.strictEqual(_zTry.of(Try.Try), _zTry, 'Try().of(Try.Try) should work as a setter and return self');
        assert.strictEqual(_zTry.of(), Try.Try, 'Try().of() should work as a getter and return the set type');
    });
    test('Try.Try.of should have separate state across different Try instances', function(assert) {
        var try1 = Try.Try().of(String),
            try2 = Try.Try().of(Number);
        assert.strictEqual(try1.of(), String, 'try1.of() should return its own type');
        assert.strictEqual(try2.of(), Number, 'try2.of() should return its own type');
        try1.of(Object);
        assert.strictEqual(try1.of(), Object, 'try1.of() should return its own type after reset');
        assert.strictEqual(try2.of(), Number, 'try2.of() should return its own type after try1 type reset');
        try2.of(Array);
        assert.strictEqual(try1.of(), Object, 'try1.of() should return its own type after try2 type reset');
        assert.strictEqual(try2.of(), Array, 'try2.of() should return its own type after try2 type reset');
    });
    module('Try.Try.success');
    test('Try.Try.success should return a Success instance', function(assert) {
        assert.ok(Try.Try().success("foo").isSuccess(), 'Try.Try().success("foo").isSuccess() should be true');
        assert.ok(Try.Try().success().isSuccess(), 'Try.Try().success().isSuccess() should be true');
        assert.ok(Try.Try().success(null).isSuccess(), 'Try.Try().success(null).isSuccess() should be true');

        assert.strictEqual(Try.Try().success("foo").isFailure(), false, 'Try.Try().success("foo").isFailure() should be false');
        assert.strictEqual(Try.Try().success().isFailure(), false, 'Try.Try().success().isFailure() should be false');
        assert.strictEqual(Try.Try().success(null).isFailure(), false, 'Try.Try().success().isFailure() should be false');
    });
    module('Try.Try.failure');
    test('Try.Try.failure should return a Failure instance', function(assert) {
        assert.strictEqual(Try.Try().failure("foo").isSuccess(), false, 'Try.Try().failure("foo").isSuccess() should be false');
        assert.strictEqual(Try.Try().failure().isSuccess(), false, 'Try.Try().failure().isSuccess() should be false');
        assert.strictEqual(Try.Try().failure(null).isSuccess(), false, 'Try.Try().failure(null).isSuccess() should be false');

        assert.ok(Try.Try().failure("foo").isFailure(), 'Try.Try().failure("foo").isFailure() should be true');
        assert.ok(Try.Try().failure().isFailure(), 'Try.Try().failure().isFailure() should be true');
        assert.ok(Try.Try().failure(null).isFailure(), 'Try.Try().failure(null).isFailure() should be true');
    });
    module('Try.Try.success.map');
    test('Try.Try.success.map should return a Success instance, if no errors thrown', function(assert) {
        assert.expect( 3 );
        var tryOfFoo = Try.Try().success("foo"),
            tryOfBar = tryOfFoo.map(function(v){
                assert.strictEqual(v, "foo", "Try.Try.success.map should pass the previous value as the argument to the map fn");
                assert.strictEqual(this, tryOfFoo, "Try.Try.success.map should call the map fn over the tryOfFoo");
                return "bar"
            });
        assert.ok(tryOfBar.isSuccess(), 'tryOfBar should be a Success');
    });
    test('Try.Try.success.map should return a Failure instance, if an error is thrown', function(assert) {
        assert.expect( 2 );
        var tryOfFoo = Try.Try().success("foo"),
            tryOfBar = tryOfFoo.map(function(){
                assert.ok(true, 'map fn should be called');
                throw new Error("no reason")
            });
        assert.ok(tryOfBar.isFailure(), 'tryOfBar should be a Failure');
    });
    module('Try.Try.success.flatMap');
    test('Try.Try.success.flatMap should return a Success instance if a Success is returned', function(assert) {
        assert.expect( 4 );
        var tryOfFoo = Try.Try().success("foo"),
            tryOfBar = tryOfFoo.flatMap(function(v){
                assert.strictEqual(v, "foo", "Try.Try.success.flatMap should pass the previous value as the argument to the map fn");
                assert.strictEqual(this, tryOfFoo, "Try.Try.success.flatMap should call the map fn over the tryOfFoo");
                return Try.Try().success("bar")
            });
        assert.ok(tryOfBar.isSuccess(), 'tryOfBar should be a Success');
        assert.strictEqual(tryOfBar.of(), String, 'tryOfBar should be a Success of String');
    });
    test('Try.Try.success.flatMap should return a Failure instance if a Failure is returned', function(assert) {
        assert.expect( 2 );
        var tryOfFoo = Try.Try().success("foo"),
            tryOfBar = tryOfFoo.flatMap(function(){
                assert.ok(true, 'flatMap fn should be called');
                return Try.Try().failure("bar")
            });
        assert.ok(tryOfBar.isFailure(), 'tryOfBar should be a Failure');
    });
    module('Try.Try.failure.recover');
    test('Try.Try.failure.recover should return a Success instance, if no errors thrown', function(assert) {
        assert.expect( 4 );
        var tryOfFoo = Try.Try().failure("foo"),
            tryOfBar = tryOfFoo.recover(function(exception){
                assert.strictEqual(exception, "foo", "Try.Try.failure.recover should pass the exception as the argument to the map fn");
                assert.strictEqual(this, tryOfFoo, "Try.Try.failure.recover should call the map fn over the tryOfFoo");
                return "bar"
            });
        assert.ok(tryOfBar.isSuccess(), 'tryOfBar should be a Success');
        assert.strictEqual(tryOfBar.of(), String, 'tryOfBar should be a Success of String');
    });
    test('Try.Try.failure.recover should return a Failure instance if an error is thrown', function(assert) {
        assert.expect( 2 );
        var tryOfFoo = Try.Try().failure("foo"),
            tryOfBar = tryOfFoo.recover(function(){
                assert.ok(true, 'map fn should be called');
                throw new Error("no reason")
            });
        assert.ok(tryOfBar.isFailure(), 'tryOfBar should be a Failure');
    });
    module('Try.Try.failure.recoverWith');
    test('Try.Try.failure.recoverWith should return a Success instance if Success returned', function(assert) {
        assert.expect( 4 );
        var tryOfFoo = Try.Try().failure("foo"),
            tryOfBar = tryOfFoo.recoverWith(function(exception){
                assert.strictEqual(exception, "foo", "Try.Try.failure.recoverWith should pass the exception as the argument to the map fn");
                assert.strictEqual(this, tryOfFoo, "Try.Try.failure.recoverWith should call the map fn over the tryOfFoo");
                return Try.Try().success("bar")
            });
        assert.ok(tryOfBar.isSuccess(), 'tryOfBar should be a Success');
        assert.strictEqual(tryOfBar.of(), String, 'tryOfBar should be a Success of String');
    });
    test('Try.Try.failure.recoverWith should return a Failure instance if Failure returned', function(assert) {
        assert.expect( 2 );
        var tryOfFoo = Try.Try().failure("foo"),
            tryOfBar = tryOfFoo.recoverWith(function(){
                assert.ok(true, 'map fn should be called');
                return Try.Try().failure("bar")
            });
        assert.ok(tryOfBar.isFailure(), 'tryOfBar should be a Failure');
    });
    module('Try.Try.failure.map');
    test('Try.Try.failure.map should return a Failure instance', function(assert) {
        assert.expect( 1 );
        var tryOfFoo = Try.Try().failure("foo"),
            tryOfBar = tryOfFoo.map(function(){
                assert.ok(false, 'map fn should not be called')
            });
        assert.ok(tryOfBar.isFailure(), 'tryOfBar should be a Failure');
    });
    module('Try.Try.failure.flatMap');
    test('Try.Try.failure.flatMap should return a Failure instance', function(assert) {
        assert.expect( 1 );
        var tryOfFoo = Try.Try().failure("foo"),
            tryOfBar = tryOfFoo.flatMap(function(){
                assert.ok(false, 'map fn should not be called')
            });
        assert.ok(tryOfBar.isFailure(), 'tryOfBar should be a Failure');
    });
    module('Try.Try.success.recover');
    test('Try.Try.success.recover should return a Success instance', function(assert) {
        assert.expect( 1 );
        var tryOfFoo = Try.Try().success("foo"),
            tryOfBar = tryOfFoo.recover(function(){
                assert.ok(false, 'map fn should not be called')
            });
        assert.ok(tryOfBar.isSuccess(), 'tryOfBar should be a Success');
    });
    module('Try.Try.success.recoverWith');
    test('Try.Try.success.recoverWith should return a Success instance', function(assert) {
        assert.expect( 1 );
        var tryOfFoo = Try.Try().success("foo"),
            tryOfBar = tryOfFoo.recoverWith(function(){
                assert.ok(false, 'map fn should not be called')
            });
        assert.ok(tryOfBar.isSuccess(), 'tryOfBar should be a Success');
    });

    module('Try.Try.success.getValue');
    test('Try.Try.success.getValue should return a Success instance, if no errors thrown', function(assert) {
        assert.strictEqual(Try.Try().success("foo").getValue(), "foo", 'tryOfFoo should be able to get the value');
    });
    module('Try.Try.failure.failed');
    test('Try.Try.failure.failed should return the wrapped error', function(assert) {
        assert.strictEqual(Try.Try().failure("foo").failed(), "foo", 'Try.Try().failure("foo").failed() should return the wrapped `"foo"` error');
    });
})();