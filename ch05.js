import R from 'ramda';
import accounting from 'accounting';

const CARS = [{
    name: 'Ferrari FF',
    horsepower: 660,
    dollar_value: 700000,
    in_stock: true
}, {
    name: 'Spyker C12 Zagato',
    horsepower: 650,
    dollar_value: 648000,
    in_stock: false
}, {
    name: 'Jaguar XKR-S',
    horsepower: 550,
    dollar_value: 132000,
    in_stock: false
}, {
    name: 'Audi R8',
    horsepower: 525,
    dollar_value: 114200,
    in_stock: false
}, {
    name: 'Aston Martin One-77',
    horsepower: 750,
    dollar_value: 1850000,
    in_stock: true
}, {
    name: 'Pagani Hoary',
    horsepower: 700,
    dollar_value: 1300000,
    in_stock: false
}];

function isLastInStock0(cars) {
    var last_car = R.last(cars);
    return R.prop('in_stock', last_car);
}

const isLastInStock = R.compose(R.prop('in_stock'), R.last);

const [c0, c1, c2] = [CARS, CARS.slice(0, -1), CARS.slice(0, -2)];

console.dir([
    [isLastInStock0(c0), isLastInStock(c0)],
    [isLastInStock0(c1), isLastInStock(c1)],
    [isLastInStock0(c2), isLastInStock(c2)]
]);

console.log(
    R.compose(R.prop('name'), R.head)(c0)
);

function _average(xs) {
    return R.reduce(R.add, 0, xs) / xs.length;
}

function averageDollarValue0(cars) {
  const dollarValues = R.map(c => c.dollar_value, cars);
  return _average(dollarValues);
}

const averageDollarValue = R.compose(_average, R.map(R.prop('dollar_value')));

console.dir([
    averageDollarValue0(c0),
    averageDollarValue(c0)
]);

// Write a function: sanitizeNames() using compose that returns a list of
// lowercase and underscored car's names: e.g: sanitizeNames([{name: 'Ferrari
// FF', horsepower: 660, dollar_value: 700000, in_stock: true}]) //=>
// ['ferrari_ff'].

const _underscore = R.replace(/\W+/g, '_');

const sanitizeNames = R.map(
    R.compose(
        R.toLower,
        _underscore,
        R.prop('name')
    )
);

console.dir(sanitizeNames(c0));

function availablePrices0(cars) {
  var available_cars = R.filter(R.prop('in_stock'), cars);
  return available_cars.map(function(x) {
    return accounting.formatMoney(x.dollar_value);
  }).join(', ');
}

const availablePrices = R.compose(
    R.join(', '),
    R.map(
        R.compose(
            accounting.formatMoney,
            R.prop('dollar_value')
        )
    ),
    R.filter(R.prop('in_stock'))
);

console.dir([availablePrices0(c0), availablePrices(c0)]);

function fastestCar0(cars) {
  var sorted = R.sortBy(function(car) {
    return car.horsepower;
  }, cars);

  var fastest = R.last(sorted);
  return fastest.name + ' is the fastest';
}

const fastestCar = R.compose(
    R.flip(R.concat)(' is the fastest'),
    R.prop('name'),
    R.last,
    R.sortBy(R.prop('horsepower'))
);

console.dir([fastestCar0(c0), fastestCar(c0)]);
