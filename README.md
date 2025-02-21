# accessible-svg-graphs

The idea behind this project is to offer both visually appealing animations that developers desire and a high level of accessibility that large companies seek, recognizing that increased accessibility not only fosters inclusivity but also contributes to better SEO. Furthermore, this solution is exceptionally lightweight, requires zero dependencies, and has a user-friendly implementation.

Utilizing SVG, a vector graphic format that maintains quality at any scale, opens up opportunities for integrating numerous ARIA attributes and CSS properties. As everyone, including governments, increasingly transitions to digital interactions in the post-COVID era, the creation of a universally accessible web is of paramount importance.

This project is an effort by me, Billy Basdras, and my project at 5cript.com. I am committed to enhancing and expanding this project further as soon as I receive expressions of interest and valuable feedback. Your input is highly appreciated.

Billy Basdras - Geneva, Switzerland. 
billbasdras@yahoo.gr
https://www.linkedin.com/in/billybasdras/
https://5cript.com


### Types of Graphs ###

* pie/donut
* bar
* scatterplot
* line
* progress-bar

### Installation ###

Before installing, have a look at a complete demo in my website https://5cript.com/blog/accessible-svg-graphs/. Ensure that this project fits your usecase before you have to go through the installation process.

This library is meant to run on the browser. If you want to add to your SPA project use the npm method otherwise you can call the script on the head. Also you need to add the CSS to project. Copy paste in your CSS or again use the CDN.

```
npm i accessible-svg-graphs
```

You can just add the cdn of the npm package as module follows (kindly specify the desired version):

```
<script type="module">

import { AccessibleSVG } from "https://cdn.jsdelivr.net/npm/accessible-svg-graphs@1.3.2/index.min.js";

//configuration here
// init here
//please look sample file

</script>

```
```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/accessible-svg-graphs@1.3.1/css/style.css">
```

### Configuration ###

Ensure to have the element you want to inject into, already in the page and with some min-height. The min-height will have some smooth animation with the Observer API and it will reduce the shift layout.

You will need to create an object with the appropriate input for each graph. As well choose the type of graph.

Below are the options you have to configure your graph.


```
interface Options{
    order:string, //bar  asc | desc | original 
    animation:boolean, //bar, pie, donut, scatterplot, line  
    duration:number, //bar, pie, donut, scatterplot, line  | integer or decimal , refers to seconds
    xAxis:any,  //scatterplot, line  | an array of values
    yAxis:any,  //scatterplot, line, bar  | an array of values
    fontSize:number, // bar and scatterplot axis font size
    strikeWidth:number, // line  | integer or decimal, refers to pixels
    radius:number //scatterplot | integer or decimal
    outterColor:string, //progressbar
    innerColor:string, //progressbar
}
interface Configuration{
    type:string,  //bar, pie, donut, scatterplot, line
    title:string,
    description:string, //be descriptive of the chart and/or your dataset
    data:Array<any>, //array of objects
    injection:string, //id, class or selector
    options:Options //see above
}
```

```

    const configScatter = 
    {
        title : 'This is a scatterplot.',
        description: 'What is the relationship between students achievement motivation and GPA?',
        type: 'scatterplot',
        data: [                
            {title: "Joe", x: 2.0, y: 50, color: "#3498db"},
            {title: "Lisa", x: 2.0, y: 48, color: "#2ecc71"},
            {title: "Mary", x: 2.0, y: 100, color: "#e74c3c"},
            {title: "Sam", x: 2.0, y: 12, color: "#f39c12"},
            {title: "Deana", x: 2.3, y: 34, color: "#16a085"},
            {title: "Sarah", x: 2.6, y: 30, color: "#c0392b"},
            {title: "Jennifer", x: 2.6, y: 78, color: "#8e44ad"},
            {title: "Gregory", x: 3.0, y: 87, color: "#3498db"},
            {title: "Thomas", x: 3.1, y: 84, color: "#2ecc71"},
            {title: "Cindy", x: 3.2, y: 75, color: "#e74c3c"},
            {title: "Martha", x: 3.6, y: 83, color: "#f39c12"},
            {title: "Steve", x: 3.8, y: 90, color: "#16a085"},
            {title: "Jamell", x: 3.8, y: 90, color: "#c0392b"}, //be aware of overlapping datapoints
            {title: "Tammie", x: 4.0, y: 98, color: "#8e44ad"}
        ],
        options: {
            order: 'original',
            animation: true,
            duration: 2,
            yAxis: [20, 40, 60, 80],
            xAxis: [0, 1, 2.0, 2.5, 3.0, 3.5,],
            radius: 0.8
        },
        injection: '#svg-scatter'
    }
```

### The data object for each graph type ###

Pie/Donut:
```
    {
        percentage: 40,
        color: '#8B0000',
        title: 'China'
    }
```

Scatterplot:
```
 {title: "Joe", x: 2.0, y: 50, color: "#3498db"}

```

Line:
```
    //2 datapoints to make a line (x1, y1, x2, y2)
 {
    x: 2017,
    y: 10
 },

```

Progress-Bar:

```
data: [70],

```


data found here: https://www.westga.edu/academics/research/vrc/assets/docs/scatterplots_and_correlation_notes.pdf


So basically you have to create a configuration object and finally instantiate the class: 

```
let accessibleScatterplot = new AccessibleSVG(configScatter);
```
Please have a look at the complete example, in the example folder or visit my website https://5cript.com/products/accessible-svg-graphs/ for a complete live demo. 


### Release Notes ###
1.3.4 - Changed link 

1.3.3 - Readme changes

1.3.2 - Changed the sample.html

1.3.1 - Compiling with ES module now. 

1.3.0 - Introducing the progress bar

1.2.0 - Made the code more typescripty

1.1.5 - Fixed some bug on the observer.   

1.1.0 - With the use of observer API, it does load the graph when the wrapper element is observed. 