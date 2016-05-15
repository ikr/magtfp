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
