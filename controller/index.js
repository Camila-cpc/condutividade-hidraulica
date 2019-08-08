
var json2xls = require('json2xls');
const fs = require('fs');
const $ = require('jquery');
const axios = require('axios');
var t;

//botões
var btnColetarDados           = document.getElementById('btnICD');
var btnExportarParaExcel      = document.getElementById('btnEE');
var btnInterromperColetaDados = document.getElementById('btnECD');
var btnCalibrarSensores       = document.getElementById('btnCS');
var btnGuardar                = document.getElementById('btnGuardar');

//outros
var cardIP                    = document.getElementById('cardContent');
var alertMSG                  = document.getElementById('alertMSG');
var alertMSGExcel             = document.getElementById('alertMSGExcel');
var enderecoIp                = document.getElementById('enderecoIp')
var tempoAtualizacao          = document.getElementById('tempoatualizacao');
var nomeArquivo               = document.getElementById('nomeArquivo');
var dados                     = {sensor1: string = '',sensor2: string = '', tempo: string = '', Ksat: string = '', cond: string = ''};
var arrayDadosR               = [];
var arrayFinal                = [];
var tempoAtualizacaoValue;
var intervalo;
var tabela = document.getElementById("tableBodyId");


btnColetarDados.addEventListener('click', function (){
    console.log('botao coletar dados clicado');
    //mostra o card
    cardIP.style.display = 'block';
    clearInterval(t);
    arrayFinal = [];
    document.querySelector('#valorKsatID').innerHTML = "--";
    tabela.innerHTML = '';

});

btnExportarParaExcel.addEventListener('click', function (){
    //console.log('botao exportar para excel clicado');
    mostrarAlert('Excel exportado com sucesso!', 5000, 2);
    gerarExcel();
    
    //var testeArray = [{titulo1: 'texto', titulo2: 'texto2'},{titulo1: 'texto3', titulo2: 'texto4'}]
    
});

function gerarExcel(){
    var xls = json2xls(arrayFinal);
    var local = `./output/${nomeArquivo.value}.xls`;
    local = local.toString();
    //console.log(local);
    fs.writeFileSync(local, xls, 'binary');
}

function mostrarAlert(texto, tempo, opcao){
    //mostrar texto de coleta de dados
    if(opcao == 1){
        alertMSG.innerHTML = texto;
        alertMSG.style.display = 'block';

    
        setTimeout(()=>{
            alertMSG.innerHTML = '';
            alertMSG.style.display = 'none';
        
        },tempo);  
    }
    // mostrar alert de gerar excel
    if( opcao == 2){
        alertMSGExcel.innerHTML = texto;
        alertMSGExcel.style.display = 'block';

    
        setTimeout(()=>{
            alertMSGExcel.innerHTML = '';
            alertMSGExcel.style.display = 'none';
        
        },tempo);
    }
      
    
}

btnInterromperColetaDados.addEventListener('click', function (){
    console.log('botao interromper coleta de dados clicado');
    //tempoAtualizacaoValue = 99999 * 10000000;
    window.clearInterval(intervalo);
    tabela.innerHTML = '';
    
});

btnCalibrarSensores.addEventListener('click', function (){
    console.log('botao coletar calibrar sensores clicado');
});

btnGuardar.addEventListener('click', ()=>{
    let enderecoIpValue       = enderecoIp.value;
 
    tempoAtualizacaoValue = tempoAtualizacao.value * 1000;
    //console.log('Tempo de atualização ' + tempoAtualizacaoValue);
  
    mostrarAlert('suas informações foram guardadas!', 5000, 1);
    cardIP.style.display = 'none';

    var url = `http://${enderecoIpValue}`;//Sua URL

    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
        //console.log(Http.responseText);
    }
    var testeOne = false;
    
    t = setInterval(()=>{
        console.log('nova requisição realizada' + new Date());
        axios.get(url)
        .then(function (response) {
        
            var arrayDadosR = response.data.split(';',5);
            
            
                
            console.log(arrayDadosR);
            if(arrayDadosR){
               // console.log('arrayDados = 4');
                arrayDadosR[0] = arrayDadosR[0].replace("DADOS:sensor1 = ","");
                arrayDadosR[1] = arrayDadosR[1].replace("sensor2 = ","");
                arrayDadosR[2] = arrayDadosR[2].replace("tempo = ","");
                arrayDadosR[3] = arrayDadosR[3].replace("Ksat = ","");
                arrayDadosR[4] = arrayDadosR[4].replace("cond = ","");

                dados.sensor1 = arrayDadosR[0];
                dados.sensor2 = arrayDadosR[1];
                dados.tempo   = arrayDadosR[2];
                dados.Ksat    = arrayDadosR[3];
                dados.cond    = arrayDadosR[4];

                //para a coleta de dados
                if(dados.sensor1 < 50 && dados.sensor2 < 50){
                    gerarExcel();
                    clearInterval(t);
                }
                arrayFinal.push(dados)
                //console.log(arrayFinal);
                var node = document.createElement('tr') ;               
                var sensor1TD =  document.createElement('td'); 
                sensor1TD.innerHTML = dados.sensor1; 
                node.appendChild(sensor1TD); 

                var sensor2TD =  document.createElement('td'); 
                sensor2TD.innerHTML = dados.sensor2;
                node.appendChild(sensor2TD);

                var tempoTD = document.createElement('td'); 
                tempoTD.innerHTML = dados.tempo;
                node.appendChild(tempoTD);

                var KsatTD =  document.createElement('td'); 
                KsatTD.innerHTML = dados.Ksat; 
                document.querySelector('#valorKsatID').innerHTML = dados.Ksat;
                node.appendChild(KsatTD);
                                           
                var condTD =  document.createElement('td'); 
                condTD.innerHTML = dados.cond; 
                
                node.appendChild(condTD);

                tabela.appendChild(node);
            }
    // handle success
        console.log(response);
     })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });
    },tempoAtualizacaoValue);
});

enderecoIp.addEventListener('keyup', ()=> {
    
        enderecoIp.value = VALORFINALIP;

});

