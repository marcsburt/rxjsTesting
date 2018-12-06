import { fromEvent } from "rxjs";
import { map, filter, tap, delay } from "rxjs/operators";

let source = fromEvent(document, "mousemove")
  .pipe(
    map((e: MouseEvent) => {
      return {
        x: e.clientX,
        y: e.clientY
      };
    })
  )
  .pipe(
    filter(value => value.x < 500),
    tap(data => console.log(data)),
    delay(100)
  );

export default source;
