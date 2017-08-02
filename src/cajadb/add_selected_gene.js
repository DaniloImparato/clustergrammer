var Cookies = require('js-cookie');
var _ = require('underscore');

module.exports = function add_selected_gene(gene) {
    
    var genesCookie = Cookies.get('genes');
    var selectedGenes = (genesCookie === undefined ? [] : genesCookie.split(','));

    console.log(gene);
    console.log(selectedGenes);

    if (_.findWhere(selectedGenes, gene) == null) {
        selectedGenes.push(gene);
    }

    console.log(JSON.stringify(selectedGenes));
    Cookies.set('genes', JSON.stringify(selectedGenes));
    console.log(JSON.stringify(selectedGenes));

    // selectedGenes = selectedGenes.filter(function(e) { return e !== gene })

};
