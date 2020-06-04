$(document).ready(function() {

    $("#executeQuery").click(function(ev) {

        let query = $("#queryInput").val()


    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/execute-sql',
        contentType:"application/json; charset=utf-8",
        data: query,
        success: function(msg){
            let tabelas = msg[2];

        }
    });

    })


    function initGraph(tables) {
        /* let nodes = new vis.DataSet([])
        tables.forEach(element => {
            nodes.push({id: 0, element})
        }); */
        
        var nodes = new vis.DataSet([
            {id: 1, label: 'Node 1'},
            {id: 2, label: 'Node 2'},
            {id: 3, label: 'Node 3'},
            {id: 4, label: 'Node 4'},
            {id: 5, label: 'Node 5'}
        ]);
    
        // create an array with edges
        var edges = new vis.DataSet([
            {from: 1, to: 3},
            {from: 1, to: 2},
            {from: 2, to: 4},
            {from: 2, to: 5}
        ]);
    
        // create a network
        var container = document.getElementById('grafo');
    
        // provide the data in the vis format
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {};
    
        // initialize your network!
        var network = new vis.Network(container, data, options);
    }

})