import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import ReactDOM from 'react-dom/client';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

function App(){
  let width=1300
  let height=600
  let padding=100
  const svgref=useRef();
  const [info,setinfo]=useState([])
  useEffect(()=>{
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    .then(response=>response.json())
    .then(data=>{
      setinfo(data.monthlyVariance)
    })
  },[])
  const year=info.map(item=>item.year)
  const base=8.66;
  const months=info.map(item=>item.month)
  const variance=info.map(item=>item.variance)
  const dataset=info.map((item,index)=>{
    return [year[index],months[index],variance[index]]
  })
 //console.log(new Date(0,1,0,0,0,0,0))
  const mont=["nope",'january',"february","march","april","may","june","july","august","september","october","november","december"]
  const colors=["#4575B4","#74ADD1","#ABD9E9","#E0F3F8","#FFFFBF","#FEE090","#FDAE61","#F46D43","#D73027"];
  // console.log(minmonth,maxmonth)
  const min=new Date(d3.min(year)-1,0,0,0,0,0,0)
  const max=new Date(d3.max(year)+1,0,0,0,0,0,0)
  useEffect(()=>{
    const svg=d3.select(svgref.current)
    
    console.log(d3.max(variance)+base)
    const xscale=d3.scaleTime()
                    .domain([min,max])
                    .range([padding,width-padding]);
    const yscale=d3.scaleTime()
                    .domain([new Date(0,0,0,0,0,0,0),new Date(0,12,0,0,0,0,0)])
                    .range([padding,height-padding])
    const colorscale=d3.scaleLinear()
                        .domain([1.1,13.9])
                        .range([0,450])
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("fill",(d,i)=>{
          return (colors[Math.floor((colorscale(d[2]+base))/50)])
        })
        .attr("y",(d,i)=>yscale(new Date(0,d[1]-1,0,0,0,0,0)))
        .attr("height",(height-2*padding)/12)
        .attr("width",()=>{
          const difference=d3.max(year)-d3.min(year)
          return((width-2*padding)/difference)
        })
        .attr("x",(d,i)=>xscale(new Date(d[0],0,0,0,0,0,0)))
        .attr("class","cell")
        .attr("data-year",d=>d[0])
        .attr("data-month",d=>d[1]-1)
        .attr("data-temp",d=>d[2])
        .attr("stroke","black")
        .attr("stroke-width",.1)
        .on("mouseenter",(event,d)=>{
                        svg.append("rect")
                        .attr("id","frame")
                        .attr("x", xscale(new Date(d[0],0,0,0,0,0,0))-130)
                        .attr("y", yscale(new Date(0,d[1]-1,0,0,0,0,0)) - 80)
                        .attr("width", 150)
                        .attr("height", 60)
                        .attr("fill", "rgba(0, 0, 0,.5)")
                        .attr("rx",10)
                        .attr("ry",10)
                        svg.append("text")
                        .attr("id","tooltip")
                        .attr("x", xscale(new Date(d[0],0,0,0,0,0,0))-100)
                        .attr("y", yscale(new Date(0,d[1]-1,0,0,0,0,0)) - 50)
                        .text(`${d[0]}\n${mont[d[1]]}`)
                        .attr("fill","white")
                        .attr("data-year",d[0])
                        svg.append("text")
                        .attr("id","temp")
                        .attr("x", xscale(new Date(d[0],0,0,0,0,0,0))-110)
                        .attr("y", yscale(new Date(0,d[1]-1,0,0,0,0,0)) - 30)
                        .text(`temperature:${(base+d[2]).toFixed(2)}`)
                        .attr("fill","white")
                      
        })
        .on("mouseleave",(event,d)=>{
          svg.select("#tooltip").remove()
          svg.select("#frame").remove()
          svg.select("#temp").remove()
         })
        
      svg.selectAll('rect')
        .data(colors)
        .enter()
        .append("rect")
        .attr("width",40)
        .attr("height",40)
        .attr("fill",(d,i)=>d)
        .attr('y',540)
        .attr("x",(d,i)=>100+colorscale((1.1*(i+1))+1.1))
        .attr("stroke","black")
        .attr("stroke-width",1);
    const xaxis=d3.axisBottom(xscale)
    svg.select("#x-axis").call(xaxis)
        .attr("transform","translate(0, "+(height-padding)+")")
    const yaxis=d3.axisLeft(yscale)
                  .tickFormat(d3.timeFormat("%B"))
    svg.select("#y-axis").call(yaxis)
        .attr("transform",`translate(${padding},0)`)
    const coloraxis=d3.axisBottom(colorscale)
    .tickValues(d3.range(2.8, 13, 1.1))
    .tickFormat(d => d.toFixed(1));               
    svg.select("#color-axis").call(coloraxis)
    .attr("transform",`translate(80,580)`)
    
    

      
        
    
    svg.selectAll("rect")
          .attr("id","legend")
          .data(colors)
          .enter()
          .append("rect")
          .attr("x",(d,i)=>200+i*30)
          .attr('y',550)
          .attr("width",30)
          .attr('height',30)
          .attr('fill',(d,i)=>d)
          

  })
  return(<div>
    <div id="title"><h1>Monthly Global Land-Surface Temperature</h1></div>
    <div id="description"> 1753 - 2015: base temperature 8.66℃</div>
    
    <svg  ref={svgref} width={1300} height={600} id="legend">
      <g id="x-axis"></g>
      <g id="y-axis"></g>
      <g id="color-axis"></g>
      
    </svg>
   
  </div>)
}
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);