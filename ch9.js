import R from 'ramda';
import {readFileSync} from 'fs';

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
}

// readFile :: String -> IO String
function readFile(filename) {
    return new IO(() => readFileSync(filename, 'utf-8'));
}

// print :: String -> IO String
function print(x) {
    return new IO(function() {
        console.log(x);
        return x;
    });
}

const cat = R.compose(R.map(print), readFile);

console.dir(cat(__dirname + '/.babelrc').unsafePerformIO().unsafePerformIO());


class Maybe {
    constructor(x) {
        this.__value = x;
    }

    isNothing() {
        return (
            this.__value === null ||
            this.__value === undefined
        );
    }

    map(f) {
        return (
            this.isNothing() ?
            Maybe.of(null) :
            Maybe.of(f(this.__value))
        );
    }

    static of(x) {
        return new Maybe(x);
    }

    join() {
        return this.isNothing() ? Maybe.of(null) : this.__value;
    }

    chain(f) {
        return this.map(f).join();
    }
}

// Exercise 1
// ==========
// Use safeProp and map/join or chain to safely get the street name when given
// a user.

const safeProp = R.curry((x, o) => Maybe.of(o[x]));

const user = {
    id: 2,
    name: 'albert',
    address: {
        street: {
            number: 22,
            name: 'Walnut St'
        }
    }
};

// safeStreetAddress :: User -> Maybe String
const safeStreetAddress = R.compose(
    R.chain(safeProp('name')),
    R.chain(safeProp('street')),
    safeProp('address')
);

console.dir(safeStreetAddress(user));
console.dir(safeStreetAddress({}));
