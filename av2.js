$(document).ready(function() {

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/',
        contentType:"application/json; charset=utf-8"
    })

    $("#executeQuery").click(function(ev) {

        let query = $("#queryInput").val()


    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/execute-sql',
        contentType:"application/json; charset=utf-8",
        data: query,
        success: function(msg){
            if(msg[3]) {
                createGraphWithWhere(msg)
            } else {
                createGraphWithoutWhere(msg)
            }
            console.log(msg[2])
            getTable(msg[2])


            
        }
    });

    })

    function createGraphWithWhere(msg) {
        let nodes = new vis.DataSet([
            {id: 1, label: "Tabela " + msg[2]}, 
            {id: 3, label: "Projeção [" + msg[1] + "]"},
            {id: 2, label: msg[3]}
        ])

        var edges = new vis.DataSet([
            {from: 1, to: 2},
            {from: 2, to: 3}
        ])

        var container = document.getElementById('grafo')

        // provide the data in the vis format
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {};
    
        // initialize your network!
        var network = new vis.Network(container, data, options)
    }

    function createGraphWithoutWhere(msg) {
        let nodes = new vis.DataSet([
            {id: 1, label: "Tabela " + msg[2]}, 
            {id: 2, label: "Projeção [" + msg[1] + "]"}
        ])

        var edges = new vis.DataSet([
            {from: 1, to: 2}
        ])

        var container = document.getElementById('grafo');

        // provide the data in the vis format
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {};
    
        // initialize your network!
        var network = new vis.Network(container, data, options)
    }

    function getTable(tableName) {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/table/' + tableName,
            contentType:"application/json; charset=utf-8",
            success: function(records) {
                let table = records
                fillTable(table)
            }
        })
    }

    function fillTable(table) {
        if(table == "empregado") {
            console.log("entrou")
            console.log(table)
            table['tuplas'].forEach(function(val) {
                $("#empregadoTable").append(`<tr>
                    <td>${val['matri']}</td>
                    <td>${val['nome']}</td>
                    <td>${val['salario']}</td>
                </tr>
                `)
            })
            $("#empregadoTable").removeClass("d-none")
        }

    }

   

})