"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";

interface SunburstData {
  name: string;
  value?: number;
  children?: SunburstData[];
}

const D3Sunburst = ({ data }: { data: SunburstData }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // 1. Dimensions
    const width = 928;
    const radius = width / 6;

    // 2. Color Scale
    const color = d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, (data.children?.length || 10) + 1),
    );

    // 3. Hierarchy
    const hierarchy = d3
      .hierarchy<SunburstData>(data)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const root = d3
      .partition<SunburstData>()
      .size([2 * Math.PI, hierarchy.height + 1])(hierarchy);
    (root as any).each((d: any) => (d.current = d));

    const arc = d3
      .arc<any>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius((d) => d.y0 * radius)
      .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1));

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [-width / 2, -width / 2, width, width])
      .style("font", "bold 22px sans-serif"); // LARGE READABLE FONT

    svg.selectAll("*").remove();

    // 4. Center Label (Displays name on hover)
    const centerText = svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "42px") // Very large center text
      .style("fill", "#1976d2")
      .style("font-weight", "bold")
      .style("pointer-events", "none")
      .text("");

    // 5. Arcs
    const path = svg
      .append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", (d: any) => {
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .attr("fill-opacity", (d: any) =>
        arcVisible(d.current) ? (d.children ? 0.7 : 0.5) : 0,
      )
      .attr("pointer-events", (d: any) =>
        arcVisible(d.current) ? "auto" : "none",
      )
      .attr("d", (d: any) => arc(d.current));

    path
      .filter((d: any) => !!d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

    // Hover effect for Center Text
    path
      .on("mouseenter", (event, d: any) => {
        centerText.text(d.data.name).style("fill-opacity", 1);
      })
      .on("mouseleave", () => {
        centerText.style("fill-opacity", 0);
      });

    // 6. Labels
    const label = svg
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", (d: any) => (labelVisible(d.current) ? 1 : 0))
      .attr("transform", (d: any) => labelTransform(d.current))
      .text((d: any) => d.data.name);

    // 7. Transparent Zoom-Out Trigger
    const parentCircle = svg
      .append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .style("cursor", "pointer")
      .on("click", clicked);

    // 8. Zoom Logic
    function clicked(event: any, p: any) {
      parentCircle.datum(p.parent || root);

      root.each((d: any) => {
        d.target = {
          x0:
            Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          x1:
            Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth),
        };
      });

      const t = svg.transition().duration(750);

      path
        .transition(t as any)
        .tween("data", (d: any) => {
          const i = d3.interpolate(d.current, d.target);
          return (t: any) => (d.current = i(t));
        })
        .filter(function (this: any, d: any) {
          return (
            !!(
              this?.getAttribute("fill-opacity") &&
              +this.getAttribute("fill-opacity") > 0
            ) || arcVisible(d.target)
          );
        })
        .attr("fill-opacity", (d: any) =>
          arcVisible(d.target) ? (d.children ? 0.7 : 0.5) : 0,
        )
        .attr("pointer-events", (d: any) =>
          arcVisible(d.target) ? "auto" : "none",
        )
        .attrTween("d", (d: any) => () => arc(d.current) as string);

      label
        .transition(t as any)
        .filter(function (this: any, d: any) {
          return (
            !!(
              this?.getAttribute("fill-opacity") &&
              +this.getAttribute("fill-opacity") > 0
            ) || labelVisible(d.target)
          );
        })
        .attr("fill-opacity", (d: any) => (labelVisible(d.target) ? 1 : 0))
        .attrTween("transform", (d: any) => () => labelTransform(d.current));
    }

    function arcVisible(d: any): boolean {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d: any): boolean {
      // Increased threshold to 0.05 to prevent cramped text
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.05;
    }

    function labelTransform(d: any): string {
      const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
      const y = ((d.y0 + d.y1) / 2) * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
  }, [data]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 450,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <svg
        ref={svgRef}
        style={{ width: "100%", height: "auto", maxWidth: "600px" }}
      />
    </Box>
  );
};

export default D3Sunburst;
