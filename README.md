# SorterJS
A JS library designed for switch which type of sorting algorythm is better for your array data type and uses it for sort it.<br/>
You can download the updated code from http://cdn.orxatasoftware.com/js/sorter.v0.1.zip

# Basic usage

`var sorter = new Sorter(` <br/>
&emsp;`{` <br/>
&emsp;&emsp;`verbose: true, //default in true`<br/>
&emsp;&emsp;`precision: 0.5, //default in 0.5, max 1, min 0.1`<br/>
&emsp;&emsp;`iterations: 1 //default 1, min 1`<br/>
&emsp;`}`<br/>
`);`
<br/>
`var test = [2,3,1];`<br/>
`sorter.sort(test); // test => [1,2,3]`

- __verbose:__ show info logs in the console.
- __precision:__ seed value to generate random arrays for calibrate the sorter. As larger is the precision, the seed value will be longer and it will take more time to calibrate.
- __iterations:__ the calibration will repeat _[iteration_value]_ times.
<br/>
Current version: v0.1
