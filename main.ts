import source from "./mouseTaps";
import { Observable, fromEvent, from, defer } from "rxjs";
import {
  map,
  filter,
  tap,
  delay,
  flatMap,
  retry,
  retryWhen,
  scan,
  takeWhile
} from "rxjs/operators";

let circle = document.getElementById("circle");
let output = document.getElementById("output");
let button = document.getElementById("button");

let click = fromEvent(button, "click");

function load(url: string) {
  return Observable.create(observer => {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        observer.next(data);
        observer.complete();
      } else {
        observer.error(xhr.statusText);
      }
    });
    xhr.open("GET", url);
    xhr.send();
  }).pipe(retryWhen(retryStrategy({ attempts: 6 })));
}

function loadWithFetch(url: string) {
  return defer(() => {
    return from(fetch(url).then(r => r.json()));
  });
}

function retryStrategy({ attempts = 3, del = 1500 }) {
  return function(errors) {
    return errors.pipe(
      scan((acc, value) => {
        console.log(acc, value);
        return acc + 1;
      }, 0),
      takeWhile(acc => acc < attempts),
      delay(del)
    );
  };
}

function renderMovies(movies) {
  movies.forEach(m => {
    let div = document.createElement("div");
    div.innerText = m.title;
    output.appendChild(div);
  });
}

click
  .pipe(flatMap(e => loadWithFetch("movies.json")))
  .subscribe(renderMovies, e => console.log(e), () => console.log("complete"));

// function onNext(value) {
//   circle.style.left = `${value.x}px`;
//   circle.style.top = `${value.y}px`;
// }

// source.subscribe(
//   onNext,
//   e => {
//     console.log(`my error is: ${e}`);
//   },
//   () => {
//     console.log(`completed`);
//   }
// );
