// import Store from "../src/store";
// import diff from "../src/diff";

// interface Person {
//   firstName: string,
//   age: number
// }
// interface Family {
//   father: Person
// }

// test('observe age', () => {
//   var store = new Store<Family>({
//     father: {
//       firstName: "Papa", age: 38
//     }
//   }).asProxy();

//   var expr = store.father.age.lift(addOne).lift(addOne);
//   // expect(expr).toBe(39);
//   expr.subscribe(v => expect(v).toBe(40));
// });

// test('diff object', () => {
//   expect(diff({ firstName: "Ibrahim" }, 123)).toBe(123);
//   expect(diff(123, { firstName: "Ibrahim" })).toEqual({ firstName: "Ibrahim" });
//   expect(diff({ a: 12, firstName: "Ibrahim" }, { a: 12, firstName: "Ibrahim" })).toEqual({});
//   expect(diff({ firstName: "Ibrahim1" }, { firstName: "Ibrahim2" })).toEqual({ firstName: "Ibrahim2" });
//   expect(diff({ a: "a", b: "b" }, { a: "a", b: { c: 123 } })).toEqual({ b: { c: 123 } });
//   expect(diff({ a: "a", b: "b" }, { a: "a", b: null, c: undefined })).toEqual({ b: null });
//   expect(diff({ a: [ "a", "b" ] }, { a: [ "a", "c" ] })).toEqual({ a: null });
// })

// function addOne(x: number) {
//   return x + 1;
// }

