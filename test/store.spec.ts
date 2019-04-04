import Store from "../src/store";
import * as Rx from "rxjs"
import * as Ro from "rxjs/operators"

interface Person {
  firstName: string,
  age: number
}
interface Family {
  father: Person
}

test('observe age', () => {
  var store = new Store<Family>({
    father: {
      firstName: "Papa", age: 38
    }
  }).asProxy();

  var expr = store.father.age.lift(addOne).lift(addOne);
  // expect(expr).toBe(39);
  expr.subscribe(v => expect(v).toBe(40));
});

function addOne(x: number ){ 
  return x + 1;
}
  