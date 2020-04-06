//conf
const BASE_URL = 'http://localhost:8080'
let tableScrollCount = 0;
let countPerScroll = 200;

let tuplas;
let paginas;
let buckets;

$(document).ready(function() {

    // carregar palavras
    $.get( BASE_URL, function(data) {
        tuplas = data
        $("#totalPalavras").text(tuplas.length)
        loadTuplas(0)
    })

    $("#iniciarBtn").click(function(ev) {
        let type = $("input[name='param01']:checked").val()
        let val = $("#valueParam01").val()

        $.get( BASE_URL + `/init?type=${type}&value=${val}`,function( data ) {
            paginas = data
            $("#totalPaginas").text(paginas.length)
            $.get( BASE_URL+'/generate-buckets', function(res) {
                console.log("buckets: ")
                console.log(res);

                updateInputFields()
                
            } )
        })
    })


    $('#palavrasTableDiv').on('scroll', function() {
        let div = $(this).get(0);
        if(div.scrollTop + div.clientHeight >= div.scrollHeight) {
            console.log("carregando mais")
            loadTuplas(tableScrollCount++)
        }
    })

    $("#searchPage").click(function(ev) {
        let pageNum = $("#searchPageInput").val()
        loadPage(pageNum)
    })

    $("#buscarBtn").click(function() {
        let term = $("#buscarPalavra").val()
        $.get( BASE_URL + `/serch?term=${term}`, function(data) {
            console.log(data)
            buckets = data
        })
    })

})

function loadTuplas(scrollCount) {
    let tuplasToAdd = tuplas.slice(tableScrollCount*countPerScroll, (tableScrollCount+1)*countPerScroll);
    $.each(tuplasToAdd, function( i, val ) {
        $("#palavrasTable tbody").append(`
        <tr>
            <td>${val['chaveDeBusca']}</td>
            <td>${val['palavra']}</td>
        </tr>`)
    })
}

function loadPage(pageNum) {
    let page = paginas[pageNum]
    console.log("entrou")
    $("#pagesDiv").append(`
        <div class="col-6 mt-3" id="pagina${page['endereco']}" class="pagina">
            <h5 class="d-inline-block">Página ${page['endereco']}</h5> 
            <table class="table" id="pagina${page['endereco']}Table">
                <thead>
                    <th>C.B.</th>
                    <th>Palavra</th>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
    `)
    $.each(page['tuplas'], function( i, val ) {
        $(`#pagina${page['endereco']}Table tbody`).append(`
        <tr>
            <td>${val['chaveDeBusca']}</td>
            <td>${val['palavra']}</td>
        </tr>`)
    })

}

function updateInputFields() {
    $("#buscarPalavra").prop("disabled", false)
    $("#buscarBtn").prop("disabled", false).removeClass("desactive btn-secondary").addClass("btn-primary")

    $("#iniciarBtn").prop("disabled", true).addClass("btn-secondary dasactive").removeClass("btn-primary")
    $("#valueParam01").prop("disabled", true)
}
