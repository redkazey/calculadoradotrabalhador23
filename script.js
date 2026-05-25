// VARIAVEIS GLOBAIS
let nomeUsuario = '';
let tipoSaida = '';
let dadosCalculo = {};

// ETAPA 1: IR PARA ESCOLHA DO TIPO
function proximaEtapa() {
    nomeUsuario = document.getElementById('nomeUsuario').value.trim();
    if (!nomeUsuario) {
        alert('Por favor, digite seu nome!');
        return;
    }
    document.getElementById('textoSaudacao').textContent = `Olá ${nomeUsuario}! O que vamos calcular hoje?`;
    document.getElementById('etapaNome').style.display = 'none';
    document.getElementById('etapaTipo').style.display = 'block';
}

// ETAPA 2: SELECIONAR TIPO E MOSTRAR EXPLICAÇÃO
function selecionarTipo(tipo) {
    tipoSaida = tipo;
    let texto = '';

    switch(tipo) {
        case 'semJustaCausa':
            texto = `
                <h3>🔴 Demissão sem justa causa</h3>
                <p><strong>O que significa:</strong> É quando a empresa manda você embora sem que você tenha feito nada de errado, sem ter quebrado regras nem causado prejuízo.</p>
                <p><strong>Seus direitos:</strong> Você recebe tudo: saldo de salário, férias + 1/3, 13º salário proporcional, aviso prévio e <strong>multa de 40% sobre todo o FGTS</strong>. Pode também pedir seguro-desemprego.</p>
            `;
            break;

        case 'comJustaCausa':
            texto = `
                <h3>⚫ Demissão com justa causa</h3>
                <p><strong>O que significa:</strong> É quando você é mandado embora por motivo grave: faltar muito sem aviso, roubar, bater em alguém, quebrar regras importantes ou causar prejuízo para empresa.</p>
                <p><strong>Seus direitos:</strong> Você só recebe o saldo de salário e férias vencidas. <strong>Perde o 13º, aviso prévio, multa do FGTS e seguro-desemprego</strong>.</p>
            `;
            break;

        case 'pedidoDemissao':
            texto = `
                <h3>🟡 Pedido de demissão</h3>
                <p><strong>O que significa:</strong> É quando você mesmo resolve sair da empresa por vontade própria, sem ser obrigado nem combinou nada a mais.</p>
                <p><strong>Seus direitos:</strong> Você recebe saldo de salário, férias + 1/3 e 13º salário proporcional. <strong>NÃO ganha aviso prévio nem multa do FGTS</strong> (só pode sacar o que já foi depositado).</p>
            `;
            break;

        // ✅ EXPLICAÇÃO DA NOVA OPÇÃO
        case 'pedidoComAcordo':
            texto = `
                <h3>🟡🤝 Pedi para sair mas fiz acordo com o patrão</h3>
                <p><strong>O que significa:</strong> Você quis sair por vontade própria, mas conversou com o dono e combinaram valores a mais, ele concordou em pagar parte da multa ou outros benefícios.</p>
                <p><strong>Seus direitos:</strong> Você recebe saldo, férias e 13º proporcional. <strong>Ganha entre 20% a 32% de multa sobre o FGTS</strong> (depois do que combinou). Não tem direito a seguro-desemprego.</p>
            `;
            break;

        case 'consensual':
            texto = `
                <h3>🟢 Demissão consensual / Acordo</h3>
                <p><strong>O que significa:</strong> É quando você e a empresa combinam juntos a sua saída, dá certo para os dois lados.</p>
                <p><strong>Seus direitos:</strong> Você recebe tudo igual ao pedido de demissão, mas ganha <strong>32% de multa sobre o FGTS</strong>. Não tem direito a seguro-desemprego.</p>
            `;
            break;

        case 'indireta':
            texto = `
                <h3>🟠 Rescisão indireta</h3>
                <p><strong>O que significa:</strong> É quando você sai da empresa porque ela não cumpriu com o combinado: não pagou salário, mandou você fazer coisa errada, maltratou ou mudou seu serviço sem combinar.</p>
                <p><strong>Seus direitos:</strong> É igual a demissão sem justa causa: recebe tudo, inclusive <strong>40% de multa no FGTS e seguro-desemprego</strong>.</p>
            `;
            break;

        case 'naoSei':
            document.getElementById('etapaTipo').style.display = 'none';
            document.getElementById('etapaPerguntas').style.display = 'block';
            return;
    }

    document.getElementById('textoExplicacao').innerHTML = texto;
    document.getElementById('etapaTipo').style.display = 'none';
    document.getElementById('etapaConfirmacao').style.display = 'block';
}

// ETAPA 3: CONFIRMAR OU NÃO
function confirmarTipo(sim) {
    if (sim) {
        document.getElementById('etapaConfirmacao').style.display = 'none';
        document.getElementById('etapaDados').style.display = 'block';
    } else {
        document.getElementById('etapaConfirmacao').style.display = 'none';
        document.getElementById('etapaTipo').style.display = 'block';
    }
}

// ETAPA 4: IDENTIFICAR QUEM NÃO SABE (ATUALIZADO)
function identificarTipo() {
    let quemQuis = document.querySelector('input[name="quemQuis"]:checked').value;
    let fezAcordo = document.querySelector('input[name="fezAcordo"]:checked').value;
    let motivoErro = document.querySelector('input[name="motivoErro"]:checked').value;
    let motivoEmpresa = document.querySelector('input[name="motivoEmpresa"]:checked').value;

    let resultado = '';
    let tipoEncontrado = '';

    if (quemQuis === 'empresa') {
        if (motivoErro === 'sim') {
            tipoEncontrado = 'comJustaCausa';
            resultado = `
                <h3>⚫ Demissão com justa causa</h3>
                <p>Com base em suas informações fornecidas este é o seu tipo de demissão</p>
                <p><strong>Seus direitos:</strong> Saldo de salário + férias vencidas. Não recebe mais nada.</p>
            `;
        } else {
            tipoEncontrado = 'semJustaCausa';
            resultado = `
                <h3>🔴 Demissão sem justa causa</h3>
                <p>Com base em suas informações fornecidas este é o seu tipo de demissão</p>
                <p><strong>Seus direitos:</strong> Recebe tudo completo + 40% de multa no FGTS + seguro-desemprego.</p>
            `;
        }
    }

    if (quemQuis === 'eu') {
        if (motivoEmpresa === 'sim') {
            tipoEncontrado = 'indireta';
            resultado = `
                <h3>🟠 Rescisão indireta</h3>
                <p>Com base em suas informações fornecidas este é o seu tipo de demissão</p>
                <p><strong>Seus direitos:</strong> É igual a demissão sem justa causa, recebe tudo completo.</p>
            `;
        } else {
            if (fezAcordo === 'sim') {
                tipoEncontrado = 'pedidoComAcordo';
                resultado = `
                    <h3>🟡🤝 Pedi para sair mas fiz acordo com o patrão</h3>
                    <p>Com base em suas informações fornecidas este é o seu tipo de demissão</p>
                    <p><strong>Seus direitos:</strong> Recebe saldo, férias e 13º + até 32% de multa no FGTS conforme combinado.</p>
                `;
            } else {
                tipoEncontrado = 'pedidoDemissao';
                resultado = `
                    <h3>🟡 Pedido de demissão</h3>
                    <p>Com base em suas informações fornecidas este é o seu tipo de demissão</p>
                    <p><strong>Seus direitos:</strong> Recebe saldo, férias e 13º proporcional. Sem multa no FGTS.</p>
                `;
            }
        }
    }

    if (quemQuis === 'ambos') {
        tipoEncontrado = 'consensual';
        resultado = `
            <h3>🟢 Demissão consensual / Acordo</h3>
            <p>Com base em suas informações fornecidas este é o seu tipo de demissão</p>
            <p><strong>Seus direitos:</strong> Recebe tudo + 32% de multa no FGTS.</p>
        `;
    }

    tipoSaida = tipoEncontrado;
    document.getElementById('resultadoIdentificacao').innerHTML = resultado;
    document.getElementById('etapaPerguntas').style.display = 'none';
    document.getElementById('etapaResultadoTipo').style.display = 'block';
}

function irParaDados() {
    document.getElementById('etapaResultadoTipo').style.display = 'none';
    document.getElementById('etapaDados').style.display = 'block';
}

// FUNÇÕES DE CÁLCULO
document.getElementById('salarioBruto').addEventListener('input', function(e) {
    let valor = e.target.value;
    let apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros) {
        let numero = (parseInt(apenasNumeros) / 100).toFixed(2);
        e.target.value = numero;
    } else {
        e.target.value = '';
    }
});

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function calcularINSS(valor) {
    if (valor <= 1320.00) return valor * 0.075;
    if (valor <= 2571.29) return valor * 0.09 - 19.80;
    if (valor <= 3856.94) return valor * 0.12 - 96.94;
    if (valor <= 7507.49) return valor * 0.14 - 174.08;
    return 876.97;
}

document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();

    const admissao = new Date(document.getElementById('admissao').value);
    const salarioBruto = parseFloat(document.getElementById('salarioBruto').value);
    const opcaoFerias = document.querySelector('input[name="ferias"]:checked').value;
    const vaiCumprirAviso = document.querySelector('input[name="aviso"]:checked').value === 'cumprir';

    const hoje = new Date();
    const anos = hoje.getFullYear() - admissao.getFullYear();
    const meses = hoje.getMonth() - admissao.getMonth() + (anos * 12);
    const mesesAno = hoje.getMonth() + 1;

    function calcular(temFeriasVencidas) {
        let saldoSalario = salarioBruto;
        if (!vaiCumprirAviso) {
            const diasMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
            saldoSalario = (salarioBruto / diasMes) * hoje.getDate();
        }

        let valorFerias = 0;
        const feriasProporcionais = (salarioBruto / 12) * mesesAno;
        valorFerias += feriasProporcionais + (feriasProporcionais / 3);

        if (temFeriasVencidas) {
            valorFerias += salarioBruto + (salarioBruto / 3);
        }

        const valor13 = (salarioBruto / 12) * mesesAno;

        let valorAviso = 0;
        let percentualMulta = 0;

        // ✅ CÁLCULO DA NOVA OPÇÃO
        switch(tipoSaida) {
            case 'semJustaCausa':
                valorAviso = salarioBruto;
                percentualMulta = 0.40;
                break;
            case 'consensual':
                valorAviso = salarioBruto / 2;
                percentualMulta = 0.32;
                break;
            case 'pedidoComAcordo': // NOVA OPÇÃO
                valorAviso = 0;
                percentualMulta = 0.25; // média do que geralmente combinam
                break;
            case 'indireta':
                valorAviso = salarioBruto;
                percentualMulta = 0.40;
                break;
            case 'pedidoDemissao':
                valorAviso = 0;
                percentualMulta = 0;
                break;
            case 'comJustaCausa':
                valorAviso = 0;
                percentualMulta = 0;
                valor13 = 0;
                break;
        }

        const descSalario = calcularINSS(saldoSalario);
        const descFerias = calcularINSS(valorFerias);
        const desc13 = calcularINSS(valor13);
        const descAviso = calcularINSS(valorAviso);
        const totalDescontos = descSalario + descFerias + desc13 + descAviso;

        const totalEmpresa = saldoSalario + valorFerias + valor13 + valorAviso - totalDescontos;

        const saldoFGTS = (salarioBruto * 0.08) * meses;
        const multaFGTS = saldoFGTS * percentualMulta;
        const totalFGTS = saldoFGTS + multaFGTS;

        const totalGeral = totalEmpresa + totalFGTS;

        return {
            saldoSalario, valorFerias, valor13, valorAviso, multaFGTS, totalEmpresa, totalFGTS, totalGeral
        };
    }

    const resultadoSemFerias = calcular(false);
    const resultadoComFerias = calcular(true);

    if (opcaoFerias === 'nao') {
        document.getElementById('casoSemFerias').style.display = 'block';
        document.getElementById('casoComFerias').style.display = 'none';
    } else if (opcaoFerias === 'sim') {
        document.getElementById('casoSemFerias').style.display = 'none';
        document.getElementById('casoComFerias').style.display = 'block';
    } else {
        document.getElementById('casoSemFerias').style.display = 'block';
        document.getElementById('casoComFerias').style.display = 'block';
    }

    // PREENCHER RESULTADOS
    document.getElementById('saldoSalario1').textContent = formatarMoeda(resultadoSemFerias.saldoSalario);
    document.getElementById('valorFerias1').textContent = formatarMoeda(resultadoSemFerias.valorFerias);
    document.getElementById('valor13_1').textContent = formatarMoeda(resultadoSemFerias.valor13);
    document.getElementById('valorAviso1').textContent = formatarMoeda(resultadoSemFerias.valorAviso);
    document.getElementById('valorMulta1').textContent = formatarMoeda(resultadoSemFerias.multaFGTS);
    document.getElementById('totalEmpresa1').textContent = formatarMoeda(resultadoSemFerias.totalEmpresa);
    document.getElementById('fgtsTotal1').textContent = formatarMoeda(resultadoSemFerias.totalFGTS);
    document.getElementById('totalGeral1').textContent = formatarMoeda(resultadoSemFerias.totalGeral);

    document.getElementById('saldoSalario2').textContent = formatarMoeda(resultadoComFerias.saldoSalario);
    document.getElementById('valorFerias2').textContent = formatarMoeda(resultadoComFerias.valorFerias);
    document.getElementById('valor13_2').textContent = formatarMoeda(resultadoComFerias.valor13);
    document.getElementById('valorAviso2').textContent = formatarMoeda(resultadoComFerias.valorAviso);
    document.getElementById('valorMulta2').textContent = formatarMoeda(resultadoComFerias.multaFGTS);
    document.getElementById('totalEmpresa2').textContent = formatarMoeda(resultadoComFerias.totalEmpresa);
    document.getElementById('fgtsTotal2').textContent = formatarMoeda(resultadoComFerias.totalFGTS);
    document.getElementById('totalGeral2').textContent = formatarMoeda(resultadoComFerias.totalGeral);

    // CONCLUSÃO ATUALIZADA
    let textoConclusao = '';
    if (tipoSaida === 'consensual') {
        textoConclusao = `✅ <strong>FAZER ACORDO É UMA BOA OPÇÃO!</strong><br>Você ganha 32% de multa no FGTS, valor bem melhor do que pedir demissão!`;
    } else if (tipoSaida === 'pedidoComAcordo') {
        textoConclusao = `✅ <strong>FEZ ACORDO E FOI UMA ÓTIMA ESCOLHA!</strong><br>Você ganha cerca de 25% de multa no FGTS, valor muito maior do que se tivesse saído sem combinar nada!`;
    } else if (tipoSaida === 'semJustaCausa' || tipoSaida === 'indireta') {
        textoConclusao = `✅ <strong>VOCÊ TEM DIREITO A TUDO!</strong><br>Recebe todos os valores + 40% de multa no FGTS e ainda pode pedir seguro-desemprego. É o melhor tipo de saída!`;
    } else if (tipoSaida === 'pedidoDemissao') {
        textoConclusao = `ℹ️ <strong>VOCÊ SAI POR VONTADE PRÓPRIA</strong><br>Recebe o que trabalhou, mas não ganha multa nem aviso prévio. É o normal para quem resolve sair!`;
    } else {
        textoConclusao = `⚠️ <strong>VOCÊ PERDEU ALGUNS DIREITOS</strong><br>Por ter saído por justa causa, recebe só o saldo e férias vencidas. Fique atento para não acontecer de novo!`;
    }

    document.getElementById('textoConclusao').innerHTML = textoConclusao;

    document.getElementById('etapaDados').style.display = 'none';
    document.getElementById('resultado').style.display = 'block';
    window.scrollTo({top: 0, behavior: 'smooth'});
});

