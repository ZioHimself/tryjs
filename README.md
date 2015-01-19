try
=======

### Try monad implementation for javascript

#### Try.Try:

```javascript
var tryOfFoo = Try.Try()
    .success(true)
    .map(function(isFoo){
        if (isFoo) {
            return "foo"
        }
        throw new Error("is not foo")
    });
```