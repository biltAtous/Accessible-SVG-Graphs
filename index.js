"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessibleSVG = void 0;
//todo
// add custom tooltip
// preserveAspectRatio="xMidYMin meet"
class AccessibleSVG {
    constructor(config) {
        this.type = config.type;
        this.title = config.title;
        this.description = config.description;
        this.data = config.data;
        this.injection = config.injection;
        this.options = config.options;
        if (this.type === 'pie' || this.type == 'donut') {
            this.pie(this.data, this.injection);
        }
        else if (this.type === 'bar') {
            this.bar(this.data, this.injection);
        }
        else if (this.type === 'scatterplot') {
            this.scatterplot(this.data, this.injection);
        }
        else if (this.type === 'line') {
            this.line(this.data, this.injection);
        }
        // console.log('Accessible SVG class has been properly instantiated!');
    }
    //PIE or DONUT
    pie(data, injection) {
        const makePieSlice = (percentage, color, offset) => {
            const circle = document.createElement('circle');
            //radius
            let r = '25'; //set r="25%"
            circle.setAttribute('r', r + '%'); //always try to pass radius as percentage
            //translate
            circle.setAttribute('cx', '50%');
            circle.setAttribute('cy', '50%');
            //set stroke-dasharray
            r = 16; // because it's 0.25 * 64 which is the viewBox    
            const circumference = 2 * Math.PI * r; //makes the circumference 100.53096491487338 !!
            // console.log('circ: ' + circumference)
            const firstValue = circumference * (percentage / 100);
            // console.log('first: ' + firstValue)
            const value = firstValue + ',' + circumference;
            circle.style.strokeDasharray = value;
            // console.log(value)
            //color 'stroke'
            circle.style.stroke = color;
            //stroke dashoffset
            circle.style.strokeDashoffset = String(offset);
            return {
                "element": circle,
                "value": firstValue
            };
        };
        //check if percentage adds up to 100%
        const addedPercentages = (data) => {
            let sum = 0;
            data.forEach((item) => { sum += item.percentage; });
            return sum;
        };
        const additionalDescription = (data) => {
            let desc = 'This pie is contains: ';
            data.forEach((item) => { desc += String(item.percentage + '% for ' + item.title + ' and it\'s colored ' + item.color + '. '); });
            return desc;
        };
        const sumPercent = addedPercentages(data);
        if (sumPercent !== 100) {
            console.log('The percentages for the pie must add up to exactly 100%.');
            return;
        }
        //create svg
        const svg = this.createSVG(0, 0, 64, 64);
        svg.classList.add('asg-graph');
        let offset = 0; //store somewhere the dash-offset
        const desc = svg.querySelector('desc');
        desc.innerText += additionalDescription(data);
        const piecesOfPie = []; //push the circle elements
        data.forEach((circle) => {
            const circleSvg = makePieSlice(circle.percentage, circle.color, -offset);
            // console.log('circlesvgValue: '+ circleSvg.value)
            const title = document.createElement('title');
            title.setAttribute('role', 'tooltip');
            title.innerText = circle.title + ': ' + circle.percentage + '%';
            offset += circleSvg.value;
            circleSvg.element.appendChild(title);
            piecesOfPie.push(circleSvg.element);
        });
        svg.classList.add('asg-pie');
        //mask aka animation
        if (this.options.animation == true) {
            let mask = makePieSlice('0', 'white', -offset + .53096491487338).element;
            mask.classList.add('asg-reveal');
            mask.style.animation = 'rotate ' + this.options.duration + 's ease-in-out forwards reverse';
            mask.style.transform = 'rotate(0deg) scale(1,-1)';
            mask.style.transformOrigin = 'center';
            piecesOfPie.push(mask); //add brown mask
        }
        piecesOfPie.forEach((circle) => {
            // console.log(circle)
            svg.appendChild(circle);
        });
        //donut
        if (this.type === 'donut') {
            svg.innerHTML += '<circle r="35%" cx="50%" cy="50%" style="fill:white;"></circle>';
            //remove border
            svg.style.border = 'none';
        }
        this.addDataType(svg, this.type);
        this.hook(injection, svg);
    }
    //BAR
    bar(data, injection) {
        const numberOfBars = data.length;
        const gap = 10;
        const values = data.map((item) => item.value);
        const maxValue = Math.max(...values);
        const leftPadding = gap;
        const barWidth = 30;
        const width = (numberOfBars * barWidth) + (gap * (numberOfBars)) + leftPadding * 2;
        const graphHeight = width;
        let offset = gap + leftPadding;
        const svg = this.createSVG(0, 0, width + 2 * gap, graphHeight + 2 * gap);
        svg.classList.add('asg-graph');
        const individualBar = (x, barWidth, height, color) => {
            const rect = document.createElement('rect');
            rect.setAttribute('x', String(x));
            rect.setAttribute('width', String(barWidth));
            rect.setAttribute('height', String(height));
            rect.setAttribute('y', String(graphHeight - height - gap));
            rect.style.fill = color;
            //scale to flip and subtract the height plus the difference
            rect.setAttribute('transform', 'scale(1,-1) translate(0,-' + String(graphHeight + (graphHeight - height)) + ')');
            if (this.options.animation) {
                rect.innerHTML = '<animate attributeName="height" from="0" to="' + String(height) + '" dur="' + this.options.duration + 's" fill="freeze" />';
            }
            return rect;
        };
        //ORDER SORT
        if (Object.keys(this.options).length !== 0) { //if object is not empty
            //sorting
            if (this.options.order) {
                if (this.options.order === 'desc') {
                    //desc
                    data.sort((a, b) => (a.value < b.value) ? 1 : (a.value > b.value) ? -1 : 0);
                }
                else if (this.options.order === 'asc') {
                    //asc
                    data.sort((a, b) => (a.value > b.value) ? 1 : (a.value < b.value) ? -1 : 0);
                }
            }
        }
        data.forEach((bar, index) => {
            const value = bar.value;
            const color = bar.color === '' ? 'black' : bar.color;
            const title = bar.title;
            const height = (value / maxValue * graphHeight);
            const rect = individualBar(offset, barWidth, height, color);
            const txt = this.text(title, offset + (bar.title.length), graphHeight + gap + gap * 0.75, '8px');
            const group = this.createGTag();
            //title 
            const titleTag = document.createElement('title');
            titleTag.innerText = title + ': ' + bar.value;
            titleTag.id = 'accessible-svg-graphs' + this.randomID(); //just push a random id 
            titleTag.setAttribute('role', 'tooltip');
            group.appendChild(titleTag);
            group.setAttribute('aria-labelledby', titleTag.id);
            group.appendChild(rect);
            group.appendChild(txt);
            svg.appendChild(group);
            offset += barWidth + gap;
        });
        const xAxis = this.drawLine(0, graphHeight + gap, width, graphHeight + gap, '0.2px');
        const yAxis = this.drawLine(gap, 0, gap, graphHeight + gap, '0.5px');
        if (this.options.yAxis) {
            const g = this.yAxisValues(this.options.yAxis, maxValue, graphHeight, width, gap, 8);
            svg.appendChild(g);
        }
        svg.appendChild(xAxis);
        svg.appendChild(yAxis);
        this.addDataType(svg, this.type);
        this.hook(injection, svg);
    }
    //SCATTERPLOT
    scatterplot(data, injection) {
        const valuesX = data.map((item) => item.x);
        const maxXValue = Math.floor(Math.max(...valuesX) * 1);
        const width = 100;
        const valuesY = data.map((item) => item.y);
        const maxYValue = Math.max(...valuesY);
        const gap = 4;
        const graphHeight = maxYValue > maxXValue ? width : Math.floor((maxYValue / maxXValue) * width); //kinda ratio
        const svg = this.createSVG(0, 0, width + gap, graphHeight + 2 * gap);
        svg.classList.add('asg-graph');
        const bubble = (x, y, originalX, originalY, radius, title, color) => {
            const circle = document.createElement('circle');
            let tit = document.createElement('title');
            tit.innerText = 'x: ' + String(originalX) + ', y: ' + String(originalY) + ', ' + title;
            tit.setAttribute('role', 'tooltip');
            circle.setAttribute('cx', String(x));
            circle.setAttribute('cy', String(y));
            circle.setAttribute('r', String(radius));
            circle.style.strokeWidth = '0.2px';
            circle.style.stroke = 'gray';
            circle.style.fill = color;
            if (this.options.animation === true) {
                circle.setAttribute('opacity', '0');
                circle.innerHTML += '<animate attributeName="opacity" repeatCount="1" from="0" to="1" dur="' + this.options.duration + 's" fill="freeze" />';
            }
            circle.appendChild(tit);
            return circle;
        };
        data.forEach((item) => {
            const x = ((item.x / maxXValue) * (width - gap)) + gap;
            //you basically need to subtract the gap twice, up and down and add after the operation gap from one side
            const y = (((maxYValue - item.y) / maxYValue) * (graphHeight)) + gap; //revert y axis computer vs cartesian //that why you need to pass the original y 
            const titre = item.title;
            const radius = this.options.radius ? this.options.radius : 1;
            const dot = bubble(x, y, item.x, item.y, radius, titre, item.color);
            svg.appendChild(dot);
        });
        //add style for x and y axis
        const xAxis = this.drawLine(gap, graphHeight + gap, width + gap, graphHeight + gap, '0.1px');
        const yAxis = this.drawLine(gap, 0, gap, graphHeight + gap, '0.3px');
        if (this.options.yAxis) {
            const g = this.yAxisValues(this.options.yAxis, maxYValue, graphHeight, width, gap, 2.2);
            svg.appendChild(g);
        }
        if (this.options.xAxis) {
            const g = this.xAxisValue(this.options.xAxis, graphHeight, gap, 3, 0, maxXValue, width);
            svg.appendChild(g);
        }
        svg.appendChild(xAxis);
        svg.appendChild(yAxis);
        this.addDataType(svg, this.type);
        this.hook(injection, svg);
    }
    //LINE
    line(data, injection) {
        const valuesX = data.map((item) => item.x);
        // const maxXValue:number = Math.max(...valuesX);
        // const minXValue:number = Math.min(...valuesX);
        const valuesY = data.map((item) => item.y);
        const maxYValue = Math.max(...valuesY);
        const gap = 4;
        const numberOfValues = valuesX.length;
        const svgWidth = (numberOfValues * gap) * 2;
        const svgHeight = svgWidth;
        const distanceBetweenXPoints = Math.floor((svgWidth + gap) / numberOfValues);
        const svg = this.createSVG(0, 0, svgWidth + 2 * gap, svgHeight + 2 * gap);
        svg.classList.add('asg-graph');
        //sort on x points
        data.sort((x, xNext) => (x.x > xNext.x) ? 1 : (x.x < xNext.x) ? -1 : 0);
        const dataLength = data.length;
        let pathSequence = '';
        for (let index = 0; index < dataLength - 1; index++) {
            const x1 = index === 0 ? 2 * gap : distanceBetweenXPoints * (index) + gap + gap;
            let y1 = svgHeight - ((data[index].y / maxYValue) * svgHeight) + gap;
            const x2 = distanceBetweenXPoints * (index + 1) + gap + gap;
            let y2 = svgHeight - ((data[index + 1].y / maxYValue) * svgHeight) + gap;
            // y1 = maxYValue - y1 + (  svgHeight - maxYValue  );
            // y2 = maxYValue - y2 + (  svgHeight - maxYValue  );
            if (index === 0) {
                pathSequence = 'M ' + Math.floor(x1) + ' ' + Math.floor(y1) + " L " + Math.floor(x2) + ' ' + Math.floor(y2);
            }
            else {
                pathSequence += ' L ' + Math.floor(x2) + ' ' + Math.floor(y2);
            }
        }
        const path = this.options.fontSize ? this.doPath(pathSequence, this.options.strikeWidth) : this.doPath(pathSequence);
        svg.appendChild(path);
        //add style for x and y axis
        const xAxis = this.drawLine(gap, svgHeight + gap, svgWidth + gap, svgHeight + gap, '0.2px');
        const yAxis = this.drawLine(gap, 0, gap, svgHeight + gap, '0.2px');
        if (this.options.yAxis) {
            const g = this.options.fontSize ?
                this.yAxisValues(this.options.yAxis, maxYValue, svgHeight, svgWidth, gap, this.options.fontSize)
                :
                    this.yAxisValues(this.options.yAxis, maxYValue, svgHeight, svgWidth, gap, 3);
            svg.appendChild(g);
        }
        if (this.options.xAxis) {
            const g = this.options.fontSize ?
                this.xAxisValue(this.options.xAxis, svgHeight, gap, this.options.fontSize, distanceBetweenXPoints)
                :
                    this.xAxisValue(this.options.xAxis, svgHeight, gap, 3, distanceBetweenXPoints);
            svg.appendChild(g);
        }
        svg.appendChild(xAxis);
        svg.appendChild(yAxis);
        this.addDataType(svg, this.type);
        this.hook(injection, svg);
    }
    //generic way of creating an SVG aka HTMLElement
    createSVG(x = 0, y = 0, width = 64, height = 64) {
        const svg = document.createElement('svg');
        svg.setAttribute('viewBox', x + ' ' + y + ' ' + width + ' ' + height);
        svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        //tabindex, 0 for focusable
        svg.setAttribute('tabindex', String(0));
        //title 
        const title = document.createElement('title');
        title.innerText = this.title;
        title.id = 'accessible-svg-graphs' + this.randomID(); //just push a random id 
        svg.appendChild(title);
        //desc
        const desc = document.createElement('desc');
        desc.innerText = this.description;
        desc.id = 'accessible-svg-graphs' + this.randomID(); //just push a random id 
        svg.appendChild(desc);
        svg.setAttribute('aria-labelledby', title.id + ' ' + desc.id);
        return svg;
    }
    createGTag(tabindex = true) {
        const g = document.createElement('g');
        if (tabindex) {
            g.setAttribute('tabindex', '0'); //tabbable
        }
        return g;
    }
    randomID() {
        return String(Math.floor(Math.random() * 10000));
    }
    drawLine(x1, y1, x2, y2, strokeWidth) {
        const line = document.createElement('line');
        line.setAttribute('x1', String(x1));
        line.setAttribute('y1', String(y1));
        line.setAttribute('x2', String(x2));
        line.setAttribute('y2', String(y2));
        line.setAttribute('stroke', 'black');
        line.setAttribute('stroke-width', strokeWidth);
        return line;
    }
    text(inputText, x, y, fontsize) {
        const txt = document.createElement('text');
        txt.innerText = inputText;
        txt.setAttribute('x', String(x));
        // txt.setAttribute('y', String(graphHeight - y));
        txt.setAttribute('y', String(y));
        txt.style.fill = 'black';
        txt.style.fontSize = fontsize;
        return txt;
    }
    doPath(pathSequence, strikeWidth = 3) {
        const path = document.createElement('path');
        path.setAttribute('d', pathSequence);
        if (this.options.animation === true) {
            path.classList.add('asg-path');
            path.style.animation = 'asg-dash ' + this.options.duration + 's ease-in-out forwards';
        }
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-width', String(strikeWidth) + 'px');
        path.setAttribute('fill', 'transparent');
        return path;
    }
    yAxisValues(yAxis, maxValue, height, width, gap, fontSize) {
        const g = this.createGTag(false);
        yAxis.forEach((y) => {
            const calculateY = ((maxValue - y) / maxValue * (height)) + gap;
            g.appendChild(this.text(String(y), 0, calculateY, String(fontSize) + 'px'));
            g.appendChild(this.drawLine(gap, calculateY, width + gap, calculateY, '0.1px'));
        });
        return g;
    }
    xAxisValue(xAxis, height, gap, fontSize, distanceBetweenXPoints, maxValue, width) {
        const g = this.createGTag(false);
        if (this.type === 'scatterplot' && maxValue && width) {
            xAxis.forEach((x) => {
                const calculateX = (x / maxValue) * width + gap;
                g.appendChild(this.text(String(x), calculateX, height + gap + gap * 0.75, String(fontSize) + 'px'));
                g.appendChild(this.drawLine(calculateX, height + gap, calculateX, gap, '0.1px'));
            });
        }
        else if (this.type === 'line' && distanceBetweenXPoints) {
            xAxis.forEach((x, index) => {
                const calculateX = index === 0 ? 2 * gap : distanceBetweenXPoints * (index) + 2 * gap;
                g.appendChild(this.text(String(x), calculateX, height + gap + gap * 0.75, String(fontSize) + 'px'));
                g.appendChild(this.drawLine(calculateX, height + gap, calculateX, height + gap + gap / 2, '0.1px'));
            });
        }
        return g;
    }
    addDataType(svg, type) {
        return svg.setAttribute('data-type', type);
    }
    hook(injection, svg) {
        let injectDiv = document.querySelector(injection);
        //observe only if this.options.animation is set to true
        if (this.options.animation) {
            this.observe(injection, injectDiv, svg);
        }
        else {
            if (injectDiv) {
                injectDiv.innerHTML += svg.outerHTML;
            }
        }
    }
    observe(target, injectDiv, svg) {
        const targets = document.querySelectorAll(target);
        const handleIntersection = (entries) => {
            entries.map((entry) => {
                if (entry.isIntersecting) {
                    if (injectDiv && !injectDiv.querySelector('.asg-graph')) {
                        injectDiv.innerHTML += svg.outerHTML;
                    }
                }
            });
        };
        const options = {
            threshold: 0.8,
        };
        const observer = new IntersectionObserver(handleIntersection, options);
        if (targets) {
            targets.forEach((target) => {
                observer.observe(target);
            });
        }
    }
}
exports.AccessibleSVG = AccessibleSVG;
