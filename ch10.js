import Task from 'data.task';
import R from 'ramda';
import Maybe from 'data.maybe';

// Exercise 1
// ==========
// Write a function that adds two possibly null numbers together using Maybe and ap().

//  ex1 :: Number -> Number -> Maybe Number
function ex1(x, y) {
    return Maybe.of(R.add).ap(Maybe.of(x)).ap(Maybe.of(y));
}

console.dir(ex1(2, 3));
console.dir(ex1(null, 3));
console.dir(ex1(2, null));
console.dir(ex1(null, null));
