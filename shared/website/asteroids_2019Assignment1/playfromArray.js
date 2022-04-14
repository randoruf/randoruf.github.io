"use strict";
const A = [1, 2];
const B = ['a', 'b', 'c'];
Observable.interval(5000)
    .flatMap(a => Observable.fromArray(A)
    .flatMap(b => Observable.fromArray(B)))
    .subscribe(o => {
});
//# sourceMappingURL=playfromArray.js.map