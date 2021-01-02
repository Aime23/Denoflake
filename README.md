# Denoflake
## A Twitter like snowflake generator for deno

### Example : 
```Typescript
import { Snowflake } from "https://raw.githubusercontent.com/Aime23/Denoflake/master/mod.ts"

const snowflake = new Snowflake();

const generated = snowflake.generate(); //Generate a new snowflake
console.log("Snowflake : " + generated);
const decomposed = snowflake.decompose(generated); //Decompose the snowflake
console.log("Decomposed : ",decomposed);
```
### Will output :
```
Snowflake : 17930479688744961
Decomposed :  {
  epoch: 1598911200000,
  timestamp: "1603186159490",
  worker: "0",
  process: "0",
  increment: "1",
  binary: "111111101100111010110100100000100000000000000000000001"
}
```
If you try to decompose a something that is not a snowflake it will return false. A snowflake is a number written on 23 to 64 bits.
### You can also use your own options
```Typescript
//With milliseconds
const snowflake = new Snowflake({
    epoch:1573862400000,
    worker:20,
    process:10
});
//or with a date
const snowflake = new Snowflake({
    epoch:new Date("2019-11-16"),
    worker:20,
    process:10
});
```