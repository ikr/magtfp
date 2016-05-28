import R from 'ramda';
import Task from 'data.task';

console.dir(
    R.map(R.add(1))([42])
);


class Identity {
    constructor(x) {
        this.__value = x;
    }

    static of(x) {
        return new Identity(x);
    }

    map(f) {
        return new Identity(f(this.__value));
    }
}

const xs = Identity.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);

console.dir(
    R.map(R.head, xs).__value
);


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
}

const safeProp = R.curry((x, o) => Maybe.of(o[x]));
const user = {id: 2, name: 'Albert'};

console.dir(
    R.compose(R.map(R.head), safeProp('name'))(user).__value
);


const ex4 = R.compose(R.map(parseInt), Maybe.of);

console.dir([
    ex4(1),
    ex4(0),
    ex4('Lore\'em'),
    ex4(true),
    ex4(false),
    ex4(null),
    ex4(3.141596)
]);


// getPost :: Int -> Future({id: Int, title: String})
function getPost(i) {
    return new Task(function(rej, res) {
        setTimeout(function() {
            res({
                id: i,
                title: 'Love them futures'
            });
        }, 100);
    });
}

const task = R.map(R.compose(R.toUpper, R.prop('title')), getPost(37));
task.fork(console.error, console.dir);


class Left {
    constructor(x) {
        this.__value = x;
    }

    static of(x) {
        return new Left(x);
    }

    map() {
        return this;
    }
}

class Right {
    constructor(x) {
        this.__value = x;
    }

    static of(x) {
        return new Right(x);
    }

    map(f) {
        return Right.of(f(this.__value));
    }
}

//  either :: (a -> c) -> (b -> c) -> Either a b -> c
const either = R.curry(function(f, g, e) {
    switch (e.constructor) {
    case Left:
        return f(e.__value);
    case Right:
        return g(e.__value);
    }
});

const showWelcome = R.compose(R.concat('Welcome '), R.prop('name'));

function checkActive(user) {
  return user.active ? Right.of(user) : Left.of('Your account is not active');
};

const ex6 = R.compose(R.map(showWelcome), checkActive);

console.dir(ex6({active: true, name: 'Ivan'}));
console.dir(ex6({active: false, name: 'Bill'}));


function ex7(x) {
    return (x.length > 3 ? Right.of(x) : Left.of('You need > 3'));
}

console.dir([
    ['ab', ex7('ab')],
    ['asdf', ex7('asdf')]
]);


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

function save(x) {
    return new IO(function() {
        console.log('SAVED USER!');
        return x + '-saved';
    });
}

const validate = R.compose(ex7, R.prop('name'));

console.dir(
    either(IO.of, save, validate({name: 'Ivan'})).unsafePerformIO()
);

console.dir(
    either(IO.of, save, validate({name: 'Mo'})).unsafePerformIO()
);
