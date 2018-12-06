import { Observable, of, from, Observer } from "rxjs";
import { map, tap, filter } from "rxjs/operators";
// import asyncSource from "./async";

let numbers = [1, 2, 3, 4, 5];
let source = from(numbers);

// // three methods that it has
class myObserver implements Observer<number> {
  next(value) {
    console.log(`value: ${value}`);
  }
  error(e) {
    console.log(`error: ${e}`);
  }
  complete() {
    console.log("complete");
  }
}
// source.subscribe(new myObserver());

let nums = [-1, -5, 10];
let asyncSource = Observable.create(observer => {
  let index = 0;
  let produceValue = () => {
    observer.next(nums[index++]);
    if (index < nums.length) {
      setTimeout(produceValue, 2000);
    } else {
      observer.complete();
    }
  };
  produceValue();
}).pipe(
  tap(n => {
    console.log(`${n} is type ${typeof n}`);
  }),
  map(n => {
    return +n * 2;
  }),
  filter(n => {
    return n > 2;
  })
);

// source.subscribe(value(), error(), complete);
// otherSource.subscribe(value(), error(), complete);
asyncSource.subscribe(
  value => {
    console.log(`my value is: ${value}`);
  },
  e => {
    console.log(`my error is: ${e}`);
  },
  () => {
    console.log(`completed`);
  }
);

asyncSource.subscribe(new myObserver());
