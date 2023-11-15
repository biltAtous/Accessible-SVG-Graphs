# accessible-svg-graphs

The idea behind this project is to offer both visually appealing animations that developers desire and a high level of accessibility that large companies seek. The focus on accessibility serves as an additional layer of value, making it more inclusive. Furthermore, this solution is exceptionally lightweight, requires zero dependencies and has a user-friendly implementation.

Utilizing SVG, a vector graphic format that maintains quality at any scale, opens up opportunities for integrating numerous ARIA attributes and CSS properties. As everyone, including goverments, increasingly transition to digital interactions in the post-COVID era, the creation of a universally accessible web is of paramount importance.

This project is an effort by me, Billy Basdras, and my project at 5cript.com. I am committed to enhance and expand this project further as soon as I receive expressions of interest and valuable feedback. Your input is highly appreciated.

Billy Basdras - Geneva, Switzerland. 
billbasdras@yahoo.gr
https://www.linkedin.com/in/billybasdras/
https://5cript.com


### Types of Graphs ###

* pie/donut
* bar
* scatterplot
* line

### Installation ###

Add the script to the footer of the document or defer it in the head.


### Configuration ###

You will need to create an object with the appropriate input for each graph. As well choose the type of graph.

Below are the options you have to configure your graph.

```
interface Options{
    order:string, //bar
    animation:boolean, //bar, pie, donut, scatterplot, line
    duration:number, //bar, pie, donut, scatterplot, line
    xAxis:any,  //scatterplot, line
    yAxis:any,  //scatterplot, line, bar
    fontSize:number, // bar and scatterplot axis font size
    strikeWidth:number, // line
    radius:number //scatterplot
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

data found here: https://www.westga.edu/academics/research/vrc/assets/docs/scatterplots_and_correlation_notes.pdf


So basically you have to create a configuration object and finally instantiate the class: 

```
let accessibleScatterplot = new AccessibleSVG(configScatter);
```

