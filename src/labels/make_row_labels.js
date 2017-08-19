var utils = require('../Utils_clust');
var add_row_click_hlight = require('./add_row_click_hlight');
var row_reorder = require('../reorder/row_reorder');
var make_row_tooltips = require('./make_row_tooltips');
var add_selected_gene = require('../cajadb/add_selected_gene');

module.exports = function make_row_labels(cgm, row_names='all', text_delay = 0){

  // console.log('make_row_labels')
  // console.log(row_names)

  var params = cgm.params;
  var row_nodes = [];

  params.gene_data = {};

  if (row_names === 'all'){
    row_nodes = params.network_data.row_nodes;
  } else {
    _.each(params.network_data.row_nodes, function(inst_row){
      if (_.contains(row_names, inst_row.name)){
        row_nodes.push(inst_row);
      }
    });
  }

  // make row labels in row_label_zoom_container, bind row_nodes data
  var row_labels = d3.select(params.root+' .row_label_zoom_container')
    .selectAll('g')
    .data(row_nodes, function(d){return d.name;})
    .enter()
    .append('g')
    .classed('row_label_group', true);

  var row_nodes_names = params.network_data.row_nodes_names;
  row_labels
    .attr('transform', function(d) {
         // var inst_index = d.row_index;
         var inst_index = _.indexOf(row_nodes_names, d.name);
      return 'translate(0,' + params.viz.y_scale(inst_index) + ')';
    });

  row_labels
    .on('dblclick', function(d) {

      var data_attr = '__data__';
      var row_name = this[data_attr].name;

      // if (params.sim_mat){
      //   row_reorder(cgm, this, row_name);

      //   d3.selectAll(params.root+' .col_label_text')
      //     .filter(function(d){
      //       return d.name == row_name;}
      //       )[0][0];

      //   // this is causing buggyness may reenable
      //   // col_reorder -> two_translate_zoom -> show_visible_area -> make_row_labels -> col_reorder
      //   // col_reorder(cgm, col_selection, row_name);

      // } else {
      //   row_reorder(cgm, this, row_name);
      // }

      row_reorder(cgm, this, row_name);

      if (params.tile_click_hlight){
        add_row_click_hlight(this,d.ini);
      }

    });

  row_labels
    .on('click', function(d, i) {

      var data_attr = '__data__';
      var row_name = this[data_attr].name;

      // console.log(row_name);
      // add_selected_gene(row_name);

      // d3.select(this)
      //   .select('rect')
      //   .style('fill', 'pink')
      //   .style('opacity', function(){          
      //     return d3.select(this).style('opacity') == 1 ? 0 : 1;
      //   });

      // toggle gene info modal
      //////////////////////////
        $.get('https://amp.pharm.mssm.edu/Harmonizome/api/1.0/gene/'+row_name, function(data) {

          data = JSON.parse(data);

          // save data for repeated use
          params.gene_data[row_name] = {}
          params.gene_data[row_name].name = data.name;
          params.gene_data[row_name].description = data.description;
        
          $(params.root+' .gene_info').modal('toggle');
          
          d3.select(params.root+' .gene_info h4')
            .html(row_name + ': ' + data.name);

          d3.select(params.root+' .gene_info p.gene_text')
            .text(data.description);

          d3.select(params.root+' .gene_info a.splicing_link')
            .attr("xlink:href", "splicing/"+data.name);

        });

    });

  make_row_tooltips(params);

  // append rectangle behind text
  row_labels
    .insert('rect')
    .style('opacity', 0);

  // append row label text
  row_labels
    .append('text')
    .attr('y', params.viz.rect_height * 0.5 + params.labels.default_fs_row*0.35 )
    .attr('text-anchor', 'end')
    .style('font-size', params.labels.default_fs_row + 'px')
    .text(function(d){ return utils.normal_name(d); })
    .attr('pointer-events','none')
    .style('opacity',0)
    .style('cursor','default')
    .transition().delay(text_delay).duration(text_delay)
    .style('opacity',1);

  // change the size of the highlighting rects
  row_labels
    .each(function() {
      var bbox = d3.select(this)
          .select('text')[0][0]
        .getBBox();
      d3.select(this)
        .select('rect')
        .attr('x', bbox.x )
        .attr('y', 0)
        .attr('width', bbox.width )
        .attr('height', params.viz.y_scale.rangeBand())
        .style('fill', function() {
        var inst_hl = 'yellow';
        return inst_hl;
        })
        .style('opacity', function(d) {
        var inst_opacity = 0;
        // highlight target genes
        if (d.target === 1) {
          inst_opacity = 1;
        }
        return inst_opacity;
        });
    });

  // almost-deprecated row value bars
  ///////////////////////////////
  if (utils.has(params.network_data.row_nodes[0], 'value')) {

    row_labels
      .append('rect')
      .classed('row_bars', true)
      .attr('width', function(d) {
        var inst_value = 0;
        inst_value = params.labels.bar_scale_row( Math.abs(d.value) );
        return inst_value;
      })
      .attr('x', function(d) {
        var inst_value = 0;
        inst_value = -params.labels.bar_scale_row( Math.abs(d.value) );
        return inst_value;
      })
      .attr('height', params.viz.y_scale.rangeBand() )
      .attr('fill', function(d) {
        return d.value > 0 ? params.matrix.bar_colors[0] : params.matrix.bar_colors[1];
      })
      .attr('opacity', 0.4);

  }

};