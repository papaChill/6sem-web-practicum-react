
import * as d3 from "d3";
import { useRef, useEffect, useState, useMemo } from "react";

const ChartDraw = ({data, oy, type}) => {
	
	const chartRef = useRef(null);
	
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	// заносим в состояния ширину и высоту svg-элемента
	useEffect(() => {
        const svg = d3.select(chartRef.current);      
        setWidth(parseFloat(svg.style('width')));
		setHeight(parseFloat(svg.style('height')));
    }); 
	// задаем отступы в svg-элементе
	const  margin = {
		top:10, 
		bottom:60, 
		left:40, 
		right:10
	};
		
	// вычисляем ширину и высоту области для вывода графиков
    const boundsWidth = width -  margin.left - margin.right;
    const boundsHeight = height - margin.top - margin.bottom;

	//let [min, max] = d3.extent(data.map(d => d.values[1]));
	
	//let [min, max] = d3.extent(data[0].values);
	let allValues = [];
	if (oy[0]) {
		data.forEach(d => allValues.push(d.values[1]));
	}
	if (oy[1]) {
		data.forEach(d => allValues.push(d.values[0]));
	}
	let [min, max] = d3.extent(allValues);

	// формируем шкалы для осей
    const scaleX = useMemo(() => {
        return d3
            .scaleBand()
            .domain(data.map(d => d.labelX))
            .range([0,boundsWidth])
    }, [data, boundsWidth]);
  
    const scaleY = useMemo(() => {
        return d3
            .scaleLinear()
            .domain([min * 0.85, max * 1.1 ])
            .range([boundsHeight, 0])
    }, [boundsHeight, min, max]);

    	
	useEffect(() => {
        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();
        
        const xAxis = d3.axisBottom(scaleX);     
        svg .append("g")
            .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
            .call(xAxis)
            .selectAll("text") 
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", d => "rotate(-30)");

        const yAxis = d3.axisLeft(scaleY);
        svg .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(yAxis);
			
		const drawData = (color, indexOY, offset) => {
			
			if (type === "Точечная диаграмма") {
				svg .selectAll(".dot")
					.data(data)
					.enter()
					.append("circle")
					.attr("r", 5)
					.attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
					.attr("cy", d => scaleY(d.values[indexOY]) + Number(offset))
					.attr("transform", `translate(${margin.left}, ${margin.top})`)
					.style("fill", color)
			} else {
				svg .selectAll(".bar")
					.data(data)
					.enter()
					.append("rect")
					.attr("x", d => scaleX(d.labelX) + (indexOY === 1 ? 0 : scaleX.bandwidth()/2))
                    .attr("y", d => scaleY(d.values[indexOY]))
                    .attr("width", (oy[0] && oy[1] ? scaleX.bandwidth()/2 : scaleX.bandwidth())*0.7)
                    .attr("height", d => boundsHeight - scaleY(d.values[indexOY]))
					.attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .style("fill", color);
				
			}
		}
		if (oy[0] && oy[1]){
			drawData("red", 1, 5);
			drawData("blue", 0, 0);
		}
		else if (oy[0]) drawData("red", 1, 0);
		else if (oy[1]) drawData("blue", 0, 0);		

    }, [scaleX, scaleY, data]); 

    return (
      <svg ref={ chartRef }>  </svg>
	)
}

export default ChartDraw;

