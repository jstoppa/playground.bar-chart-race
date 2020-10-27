import { Component, ElementRef, OnInit } from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart-race',
  templateUrl: './app-bar-chart-race.component.html',
  styleUrls: ['./app-bar-chart-race.component.css']
})
export class AppBarChartRaceComponent implements OnInit {
  title = 'appBarChartRace';
  svg: any;

  constructor(private elRef: ElementRef) {
    this.svg = d3.select(this.elRef.nativeElement).append('svg')
    .attr('width', 960)
    .attr('height', 600);
  }

  ngOnInit(): void {
    const tickDuration = 500;

    const topN = 12;
    const height = 600;
    const width = 960;

    const margin = {
      top: 80,
      right: 0,
      bottom: 5,
      left: 0
    };

    const barPadding = (height - (margin.bottom + margin.top)) / (topN * 5);

    const title = this.svg.append('text')
     .attr('class', 'title')
     .attr('y', 24)
     .html('18 years of Interbrand’s Top Global Brands');

    const subTitle = this.svg.append('text')
     .attr('class', 'subTitle')
     .attr('y', 55)
     .html('Brand value, $m');

    const caption = this.svg.append('text')
     .attr('class', 'caption')
     .attr('x', width)
     .attr('y', height - 5)
     .style('text-anchor', 'end')
     .html('Source: Interbrand');

    let year = 2000;

    d3.csv('assets/api/brand_values.csv').then((data: any) => {
    // if (error) throw error;

      console.log(data);

      data.forEach(d => {
        d.value = +d.value,
        d.lastValue = +d.lastValue,
        d.value = isNaN(d.value) ? 0 : d.value,
        d.year = +d.year,
        d.colour = d3.hsl(Math.random() * 360, 0.75, 0.75);
      });

      console.log(data);

      let yearSlice = data.filter(d => d.year === year && !isNaN(d.value))
      .sort((a, b) => b.value - a.value)
      .slice(0, topN);

      yearSlice.forEach((d, i) => d.rank = i);

      console.log('yearSlice: ', yearSlice);

      const x = d3.scaleLinear()
        .domain([0, d3.max(yearSlice, (d: any) => d.value as number)])
        .range([margin.left, width - margin.right - 65]);

      const y = d3.scaleLinear()
        .domain([topN, 0])
        .range([height - margin.bottom, margin.top]);

      const xAxis = d3.axisTop(x)
        .ticks(width > 500 ? 5 : 2)
        .tickSize(-(height - margin.top - margin.bottom))
        .tickFormat(d => d3.format(',')(d));

      this.svg.append('g')
       .attr('class', 'axis xAxis')
       .attr('transform', `translate(0, ${margin.top})`)
       .call(xAxis)
       .selectAll('.tick line')
       .classed('origin', d => d === 0);

      this.svg.selectAll('rect.bar')
        .data(yearSlice, d => d.name)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', x(0) + 1)
        .attr('width', d => x(d.value) - x(0) - 1)
        .attr('y', d => y(d.rank) + 5)
        .attr('height', y(1) - y(0) - barPadding)
        .style('fill', d => d.colour);

      this.svg.selectAll('text.label')
        .data(yearSlice, d => d.name)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.value) - 8)
        .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
        .style('text-anchor', 'end')
        .html(d => d.name);

      this.svg.selectAll('text.valueLabel')
      .data(yearSlice, d => d.name)
      .enter()
      .append('text')
      .attr('class', 'valueLabel')
      .attr('x', d => x(d.value) + 5)
      .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
      .text(d => d3.format(',.0f')(d.lastValue));

      const yearText = this.svg.append('text')
      .attr('class', 'yearText')
      .attr('x', width - margin.right)
      .attr('y', height - 25)
      .style('text-anchor', 'end')
      // tslint:disable-next-line: no-bitwise
      .html(~~year)
      .call(this.halo, 10);

      const ticker = d3.interval(e => {

        yearSlice = data.filter(d => d.year === year && !isNaN(d.value))
          .sort((a, b) => b.value - a.value)
          .slice(0, topN);

        yearSlice.forEach((d, i) => d.rank = i);

        // console.log('IntervalYear: ', yearSlice);

        x.domain([0, d3.max(yearSlice, (d: any) => d.value as number)]);

        this.svg.select('.xAxis')
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .call(xAxis);

        const bars = this.svg.selectAll('.bar').data(yearSlice, d => d.name);

        bars
          .enter()
          .append('rect')
          .attr('class', d => `bar ${d.name.replace(/\s/g, '_')}`)
          .attr('x', x(0) + 1)
          .attr( 'width', d => x(d.value) - x(0) - 1)
          .attr('y', d => y(topN + 1) + 5)
          .attr('height', y(1) - y(0) - barPadding)
          .style('fill', d => d.colour)
          .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('y', d => y(d.rank) + 5);

        bars
          .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('width', d => x(d.value) - x(0) - 1)
            .attr('y', d => y(d.rank) + 5);

        bars
          .exit()
          .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('width', d => x(d.value) - x(0) - 1)
            .attr('y', d => y(topN + 1) + 5)
            .remove();

        const labels = this.svg.selectAll('.label')
            .data(yearSlice, d => d.name);

        labels
          .enter()
          .append('text')
          .attr('class', 'label')
          .attr('x', d => x(d.value) - 8)
          .attr('y', d => y(topN + 1) + 5 + ((y(1) - y(0)) / 2))
          .style('text-anchor', 'end')
          .html(d => d.name)
          .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1);


        labels
            .transition()
            .duration(tickDuration)
              .ease(d3.easeLinear)
              .attr('x', d => x(d.value) - 8)
              .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1);

        labels
            .exit()
            .transition()
              .duration(tickDuration)
              .ease(d3.easeLinear)
              .attr('x', d => x(d.value) - 8)
              .attr('y', d => y(topN + 1) + 5)
              .remove();



        const valueLabels = this.svg.selectAll('.valueLabel').data(yearSlice, d => d.name);

        valueLabels
            .enter()
            .append('text')
            .attr('class', 'valueLabel')
            .attr('x', d => x(d.value) + 5)
            .attr('y', d => y(topN + 1) + 5)
            .text(d => d3.format(',.0f')(d.lastValue))
            .transition()
              .duration(tickDuration)
              .ease(d3.easeLinear)
              .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1);

        valueLabels
            .transition()
              .duration(tickDuration)
              .ease(d3.easeLinear)
              .attr('x', d => x(d.value) + 5)
              .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
              .tween('text', (d) => {
                const i = d3.interpolateRound(d.lastValue, d.value);
                return function(t) {
                  this.textContent = d3.format(',')(i(t));
                };
              });


        valueLabels
          .exit()
          .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x(d.value) + 5)
            .attr('y', d => y(topN + 1) + 5)
            .remove();

        // tslint:disable-next-line: no-bitwise
        yearText.html(~~year);

        if (year === 2018) { ticker.stop(); }
        year = Number(d3.format('.1f')((+year) + 0.1));
      }, tickDuration);
    });
  }

  halo(text, strokeWidth) {
      text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
      .style('fill', '#ffffff')
      .style( 'stroke', '#ffffff')
      .style('stroke-width', strokeWidth)
      .style('stroke-linejoin', 'round')
      .style('opacity', 1);
  }

  // drawChart(data: any) {
  //  //  https://bl.ocks.org/jrzief/70f1f8a5d066a286da3a1e699823470f
  // }
}
