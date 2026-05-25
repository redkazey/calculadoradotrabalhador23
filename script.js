// Formatar valor automaticamente enquanto digita
document.getElementById('salarioBruto').addEventListener('input', function(e) {
    let valor = e.target.value;
    let apenasNumeros = valor.replace(/\D/g, ''); // só números
    if (apenasNumeros) {
        let numero = (parseInt(apenasNumeros) / 100).toFixed(2);
        e.target.value = numero;
    } else {
        e.target.value = '';
    }
});

// Formatar número em moeda (R$)
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Calcular desconto do INSS
function calcularINSS(valor) {
    if (valor <= 1320.00) return valor * 0.075;
    if (valor <= 2571.29) return valor * 0.09 - 19.80;
    if (valor <= 3856.94) return valor * 0.12 - 96.94;
    if (valor <= 7507.49) return valor * 0.14 - 174.08;
    return 876.97; // teto máximo
}

// Função principal ao clicar no botão calcular
document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();

    // Pegar dados preenchidos
    const admissao = new Date(document.getElementById('admissao').value);
    const salarioBruto = parseFloat(document.getElementById('salarioBruto').value);
    const opcaoFerias = document.querySelector('input[name="ferias"]:checked').value;
    const vaiCumprirAviso = document.querySelector('input[name="aviso"]:checked').value === 'cumprir';

    // Dados de data atual
    const hoje = new Date();
    const anos = hoje.getFullYear() - admissao.getFullYear();
    const meses = hoje.getMonth() - admissao.getMonth() + (anos * 12);
    const mesesAno = hoje.getMonth() + 1; // quantos meses já passaram esse ano

    // Função que faz todos os cálculos (com ou sem férias vencidas)
    function calcular(temFeriasVencidas) {
        // 1. Saldo de salário
        let saldoSalario = salarioBruto;
        if (!vaiCumprirAviso) {
            const diasMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
            saldoSalario = (salarioBruto / diasMes) * hoje.getDate();
        }

        // 2. Férias + 1/3 constitucional
        let valorFerias = 0;
        const feriasProporcionais = (salarioBruto / 12) * mesesAno;
        valorFerias += feriasProporcionais + (feriasProporcionais / 3);

        if (temFeriasVencidas) {
            valorFerias += salarioBruto + (salarioBruto / 3);
        }

        // 3. 13º salário proporcional
        const valor13 = (salarioBruto / 12) * mesesAno;

        // 4. Descontos INSS
        const descSalario = calcularINSS(saldoSalario);
        const descFerias = calcularINSS(valorFerias);
        const desc13 = calcularINSS(valor13);
        const totalDescontos = descSalario + descFerias + desc13;

        const totalEmpresa = saldoSalario + valorFerias + valor13 - totalDescontos;

        // 5. Cálculo do FGTS
        const saldoFGTS = (salarioBruto * 0.08) * meses;
        const fgtsDemissao = saldoFGTS; // sem multa
        const fgtsAcordo = saldoFGTS * 1.32; // +32% de multa
        const ganhoExtra = fgtsAcordo - fgtsDemissao;

        // Totais finais
        const totalDemissao = totalEmpresa + fgtsDemissao;
        const totalAcordo = totalEmpresa + fgtsAcordo;

        return {
            saldoSalario,
            valorFerias,
            valor13,
            totalEmpresa,
            fgtsDemissao,
            fgtsAcordo,
            ganhoExtra,
            totalDemissao,
            totalAcordo
        };
    }

    // Calcular os dois casos
    const resultadoSemFerias = calcular(false);
    const resultadoComFerias = calcular(true);

    // Mostrar ou esconder blocos conforme a opção escolhida
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

    // Preencher valores - CASO 1: Férias já tiradas
    document.getElementById('saldoSalario1').textContent = formatarMoeda(resultadoSemFerias.saldoSalario);
    document.getElementById('valorFerias1').textContent = formatarMoeda(resultadoSemFerias.valorFerias);
    document.getElementById('valor13_1').textContent = formatarMoeda(resultadoSemFerias.valor13);
    document.getElementById('totalEmpresa1').textContent = formatarMoeda(resultadoSemFerias.totalEmpresa);
    document.getElementById('fgtsDemissao1').textContent = formatarMoeda(resultadoSemFerias.fgtsDemissao);
    document.getElementById('fgtsAcordo1').textContent = formatarMoeda(resultadoSemFerias.fgtsAcordo);
    document.getElementById('ganhoExtra1').textContent = formatarMoeda(resultadoSemFerias.ganhoExtra);
    document.getElementById('totalDemissao1').textContent = formatarMoeda(resultadoSemFerias.totalDemissao);
    document.getElementById('totalAcordo1').textContent = formatarMoeda(resultadoSemFerias.totalAcordo);

    // Preencher valores - CASO 2: Férias NÃO tiradas
    document.getElementById('saldoSalario2').textContent = formatarMoeda(resultadoComFerias.saldoSalario);
    document.getElementById('valorFerias2').textContent = formatarMoeda(resultadoComFerias.valorFerias);
    document.getElementById('valor13_2').textContent = formatarMoeda(resultadoComFerias.valor13);
    document.getElementById('totalEmpresa2').textContent = formatarMoeda(resultadoComFerias.totalEmpresa);
    document.getElementById('fgtsDemissao2').textContent = formatarMoeda(resultadoComFerias.fgtsDemissao);
    document.getElementById('fgtsAcordo2').textContent = formatarMoeda(resultadoComFerias.fgtsAcordo);
    document.getElementById('ganhoExtra2').textContent = formatarMoeda(resultadoComFerias.ganhoExtra);
    document.getElementById('totalDemissao2').textContent = formatarMoeda(resultadoComFerias.totalDemissao);
    document.getElementById('totalAcordo2').textContent = formatarMoeda(resultadoComFerias.totalAcordo);

    // CONCLUSÃO DINÂMICA (muda conforme o valor)
    const ganhoMinimo = Math.min(resultadoSemFerias.ganhoExtra, resultadoComFerias.ganhoExtra);
    let textoConclusao = '';

    if (ganhoMinimo > 100) {
        textoConclusao = `
            ✅ <strong>FAZER ACORDO É A MELHOR OPÇÃO!</strong><br>
            Você ganha pelo menos <strong>${formatarMoeda(ganhoMinimo)}</strong> a mais do que se pedir demissão, 
            sem perder nenhum direito. O valor que recebe da empresa é exatamente o mesmo nas duas opções, 
            a diferença só está no FGTS — e no acordo você leva muito mais! 🎯
        `;
    } 
    else if (ganhoMinimo > 0 && ganhoMinimo <= 100) {
        textoConclusao = `
            ⚖️ <strong>AS DUAS OPÇÕES SÃO QUASE IGUAIS!</strong><br>
            A diferença é pequena (só cerca de <strong>${formatarMoeda(ganhoMinimo)}</strong> a mais no acordo). 
            Escolha conforme o que for melhor pra você no momento — os valores são bem parecidos. 🤝
        `;
    }
    else {
        textoConclusao = `
            ℹ️ <strong>NESSE CASO NÃO FAZ DIFERENÇA OU PEDIR DEMISSÃO É MELHOR!</strong><br>
            O ganho no acordo é zero ou muito pequeno. Você pode escolher o que achar mais fácil, 
            pois o valor final fica praticamente o mesmo nas duas opções. 📌
        `;
    }

    document.getElementById('textoConclusao').innerHTML = textoConclusao;

    // Mostrar resultado e rolar a página
    document.getElementById('resultado').style.display = 'block';
    window.scrollTo({
        top: document.getElementById('resultado').offsetTop - 20,
        behavior: 'smooth'
    });
});

