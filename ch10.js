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

console.info('Ex1 =====');
console.dir(ex1(2, 3));
console.dir(ex1(null, 3));
console.dir(ex1(2, null));
console.dir(ex1(null, null));


// Exercise 2
// ==========
// Now write a function that takes 2 Maybe's and adds them. Use liftA2 instead of ap().

const liftA2 = R.curry(function (f, functor1, functor2) {
    return functor1.map(f).ap(functor2);
});

//  ex2 :: Maybe Number -> Maybe Number -> Maybe Number
function ex2(mx, my) {
    return liftA2(R.add, mx, my);
}

console.info('Ex2 =====');
console.dir(ex2(Maybe.Just(2), Maybe.Just(3)));
console.dir(ex2(Maybe.Nothing(), Maybe.Just(3)));
console.dir(ex2(Maybe.Just(2), Maybe.Nothing()));
console.dir(ex2(Maybe.Nothing(), Maybe.Nothing()));

// Exercise 3
// ==========
// Run both getPost(n) and getComments(n) then render the page with both. (The n arg is arbitrary.)
const makeComments = R.reduce(function(acc, c) { return acc+"<li>"+c+"</li>" }, "");
const render = R.curry(function(p, cs) { return "<div>"+p.title+"</div>"+makeComments(cs); });

//  ex3 :: Task Error HTML
function ex3() {

}

// TEST HELPERS
// =====================

function getPost(i) {
    return new Task(function (rej, res) {
        setTimeout(function () { res({ id: i, title: 'Love them futures' }); }, 300);
    });
}

function getComments(i) {
    return new Task(function (rej, res) {
        setTimeout(function () {
            res(["This book should be illegal", "Monads are like space burritos"]);
        }, 300);
    });
}
