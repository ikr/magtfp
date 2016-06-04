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

const trail = R.flip(R.concat);

// ex3 :: Task Error HTML
function ex3(n) {
    return liftA2(render, getPost(n), getComments(n));
}

console.info('Ex3 =====');
ex3(42).fork(console.error, console.dir);

// TEST HELPERS
// =====================

function getPost(i) {
    return new Task(function (rej, res) {
        setTimeout(function () { res({ id: i, title: 'Love them futures' }); }, 50);
    });
}

function getComments(i) {
    return new Task(function (rej, res) {
        setTimeout(function () {
            res(["This book should be illegal", "Monads are like space burritos"]);
        }, 50);
    });
}


class IO {
    constructor(f) {
        this.unsafePerformIO = f;
    }

    // map :: (a -> b) -> IO b
    map(f) {
        return new IO(R.compose(f, this.unsafePerformIO));
    }

    // of :: a -> IO a
    static of(x) {
        return new IO(() => x);
    }

    // join :: IO a
    join() {
        return new IO(() => {
            return this.unsafePerformIO().unsafePerformIO();
        });
    }

    // chain :: (a -> b) -> IO b
    chain(f) {
        return this.map(f).join();
    }
    // ap :: IO a
    ap(a) {
        return this.chain(f => a.map(f));
    }
}

// Exercise 4
// ==========
// Write an IO that gets both player1 and player2 from the cache and starts the game.
const localStorage = {player1: 'toby', player2: 'sally'};

function getCache(x) {
    return new IO(() => localStorage[x]);
};

const game = R.curry(function(p1, p2) { return p1 + ' vs ' + p2; });

//  ex4 :: IO String
const ex4 = liftA2(game, getCache('player1'), getCache('player2'));

setTimeout(() => {
    console.info('Ex4 =====');
    console.dir(ex4.unsafePerformIO());
}, 100);
