 module.exports = function resize_highlights(params){

  // reposition tile highlight
  ////////////////////////////////

  var rel_width_hlight = 6;
  // var opacity_hlight = 0.85;
  var hlight_width = rel_width_hlight*params.viz.border_width;
  var hlight_height = rel_width_hlight*params.viz.border_width/params.viz.zoom_switch;

  // top highlight
  d3.select(params.root+' .top_hlight')
    .attr('width', params.matrix.rect_width)
    .attr('height', hlight_height)
    .attr('transform', function() {
      return 'translate(' + params.matrix.x_scale(params.matrix.click_hlight_x) + ',0)';
    });

  // left highlight
  d3.select(params.root+' .left_hlight')
    .attr('width', hlight_width)
    .attr('height', params.matrix.rect_width - hlight_height*0.99 )
    .attr('transform', function() {
      return 'translate(' + params.matrix.x_scale(params.matrix.click_hlight_x) + ','+
        hlight_height*0.99+')';
    });

  // right highlight
  d3.select(params.root+' .right_hlight')
    .attr('width', hlight_width)
    .attr('height', params.matrix.rect_height - hlight_height*0.99 )
    .attr('transform', function() {
      var tmp_translate = params.matrix.x_scale(params.matrix.click_hlight_x) + params.matrix.rect_width - hlight_width;
      return 'translate(' + tmp_translate + ','+
        hlight_height*0.99+')';
    });

  // bottom highlight
  d3.select(params.root+' .bottom_hlight')
    .attr('width', function(){
      return params.matrix.rect_width - 1.98*hlight_width;})
    .attr('height', hlight_height)
    .attr('transform', function() {
      var tmp_translate_x = params.matrix.x_scale(params.matrix.click_hlight_x) + hlight_width*0.99;
      var tmp_translate_y = params.matrix.rect_height - hlight_height;
      return 'translate(' + tmp_translate_x + ','+
        tmp_translate_y+')';
    });

  // resize row highlight
  /////////////////////////
  d3.select(params.root+' .row_top_hlight')
    .attr('width',params.viz.svg_dim.width)
    .attr('height',hlight_height);

  d3.select(params.root+' .row_bottom_hlight')
    .attr('width',params.viz.svg_dim.width)
    .attr('height',hlight_height)
    .attr('transform', function(){
      var tmp_translate_y = params.matrix.rect_height - hlight_height;
      return 'translate(0,'+tmp_translate_y+')';
    });

  // resize col highlight
  /////////////////////////
  d3.select(params.root+' .col_top_hlight')
    .attr('width',params.viz.clust.dim.height)
    .attr('height',hlight_width)
    .attr('transform',function(){
          var tmp_translate_y = 0;
          var tmp_translate_x = -(params.viz.clust.dim.height+
            params.class_room.col+params.viz.uni_margin);
          return 'translate('+tmp_translate_x+','+tmp_translate_y+')';
        });

  d3.select(params.root+' .col_bottom_hlight')
    .attr('width',params.viz.clust.dim.height)
    .attr('height',hlight_width)
    .attr('transform', function(){
          var tmp_translate_y = params.matrix.rect_width - hlight_width;
          var tmp_translate_x = -(params.viz.clust.dim.height +
            params.class_room.col+params.viz.uni_margin);
          return 'translate('+tmp_translate_x+','+tmp_translate_y+')';
        });

 };