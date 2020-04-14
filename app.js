//conf
const BASE_URL = 'http://localhost:8080'
let tableScrollCount = 0;
let countPerScroll = 200;

let tuplas;
let paginas;
let buckets;

$(document).ready(function() {

    $(".pagesContainer, .bucketsContainer").addClass("d-none")

    // carregar palavras
    $.get( BASE_URL, function(data) {
        tuplas = data
        $("#totalPalavras").text(tuplas.length)
        loadTuplas(0)
        $("#loading").removeClass("d-flex").addClass("d-none")
        $("main").removeClass("d-none")

    })

    $("#iniciarBtn").click(function(ev) {
        let type = $("input[name='param01']:checked").val()
        let val = $("#valueParam01").val()

        $.get( BASE_URL + `/init?type=${type}&value=${val}`,function( data ) {
            paginas = data
            $("#totalPaginas").text(paginas.length)
            $.get( BASE_URL+'/generate-buckets', function(res) {
                buckets = res
                updateInputFields()
                
                $.get( BASE_URL + '/get-stats', function(res) {
                    
                    updateBucketsInfoUi(res['taxaOverflow'], res['taxaColisao'])
                })
                
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
        $(".highlight").removeClass("highlight")
        
        let term = $("#buscarPalavra").val()
        $.get( BASE_URL + `/serch?term=${term}`, function(data) {
            console.log(data)
            loadPage(data['page_number'])
            loadBucket(data['bucket_number'])

            highlightWorld(data['cb'], data['page_number'], data['bucket_number'])
        })
    })

    $("#searchBucket").click(function() {
        let bucketNum = $("#searchBucketInput").val()
        loadBucket(bucketNum)
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
        <tr cb=${val['chaveDeBusca']}>
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
    $(".pagesContainer, .bucketsContainer").removeClass("d-none")
}

function updateBucketsInfoUi(taxaOverflow, taxaColisao) {
    $("#totalBuckets").text(buckets.length - 1)
    $("#tamanhoBuckets").text(buckets[0].tamanho)

    $("#taxaOverflow").text(taxaOverflow + "%")
    $("#taxaColisao").text(taxaColisao + "%")
}

function loadBucket(bucketNum) {
    let bucket = buckets[bucketNum]
    $("#bucketDiv").append(`
        <div class="col-3 mt-3" id="bucket${bucket['endereco']}" class="bucket">
            <h5 class="d-inline-block">Bucket ${bucket['endereco']}</h5> 
            <table class="table" id="bucket${bucket['endereco']}Table">
                <thead>
                    <th>C.B.</th>
                    <th>Endereço Pág.</th>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
    `)
    for(let cb in buckets[bucketNum]["chavePagina"]) {
        $(`#bucket${bucket['endereco']}Table tbody`).append(`
        <tr cb=${cb}>
            <td>${cb}</td>
            <td>${buckets[bucketNum]["chavePagina"][cb]}</td>
        </tr>`)
    }
}


function highlightWorld(cb, pageNumber, bucketNumber) {
    $(`#bucket${bucketNumber} tbody tr[cb=${cb}]`).addClass("highlight")
    $(`#pagina${pageNumber}Table tbody tr[cb=${cb}]`).addClass("highlight")

    //TODO SCROLL
}