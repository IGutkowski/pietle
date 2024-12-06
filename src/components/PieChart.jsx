import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const PieChart = ({ percentage }) => {
    const pieRef = useRef();

    useEffect(() => {
        const data = [parseInt(percentage, 10), 100 - parseInt(percentage, 10)];
        const colors = ["cyan", "gray"];

        const svg = d3.select(pieRef.current);
        const width = 200;
        const height = 200;
        const radius = Math.min(width, height) / 2;

        svg.selectAll("*").remove();
        const group = svg
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const pie = d3.pie()(data);
        const arc = d3.arc().innerRadius(0).outerRadius(radius);

        group
            .selectAll("path")
            .data(pie)
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => colors[i]);
    }, [percentage]);

    return <svg ref={pieRef} width="200" height="200"></svg>;
};

export default PieChart;
