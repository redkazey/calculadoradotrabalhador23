// Formatar valor automaticamente
function formatarValorInput(valor) {
    let numero = valor.replace(/\D/g, '');
    numero = (numero / 100).toFixed(2) + '';
    numero = numero.replace('.', ',');
    return 'R$ ' + numero;
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Calcular INSS
function calcularINSS(valor) {
    if (valor <= 1320.00) return valor * 0.075;
    if (valor <= 2571.29) return valor * 0.09 - 19.80;
    if (valor <= 3856.94) return valor * 0.12 - 96.94;
    if (valor <= 7507.49) return valor * 0.14 - 174.08;
    return 876.97;
}

// Formatar input enquanto digita
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

document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();

    // Pegar dados
    const admissao = new Date(document.getElementById('admissao').value);
    const salarioBruto = parseFloat(document.getElementById('salarioBruto').value);
    const opcaoFerias = document.querySelector('input[name="ferias"]:checked').value;
    const vaiCumprirAviso = document.querySelector('input[name="aviso"]:checked').value === 'cumprir';

    const hoje = new Date();
    const anos = hoje.getFullYear() - admissao.getFullYear();
    const meses = hoje.getMonth() - admissao.getMonth() + (anos * 12);
    const mesesAno = hoje.getMonth() + 1;

    // Função de cálculo que pode receber se tem férias ou não
    function calcular(temFeriasVencidas) {
        // Saldo salário
        let saldoSalario = salarioBruto;
        if (!vaiCumprirAviso) {
            const diasMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
            saldoSalario = (salarioBruto / diasMes) * hoje.getDate();
        }

        // Férias
        let valorFerias = 0;
        const feriasProporcionais = (salarioBruto / 12) * mesesAno;
        valorFerias += feriasProporcionais + (feriasProporcionais / 3);

        if (temFeriasVencidas) {
            valorFerias += salarioBruto + (salarioBruto / 3);
        }

        // 13º
        const valor13 = (salarioBruto / 12) * mesesAno;

        // Descontos
        const descSalario = calcularINSS(saldoSalario);
        const descFerias = calcularINSS(valorFerias);
        const desc13 = calcularINSS(valor13);
        const totalDesc = descSalario + descFerias + desc13;

        const totalEmpresa = saldoSalario + valorFerias + valor13 - totalDesc;

        // FGTS
        const saldoFGTS = (salarioBruto * 0.08) * meses;
        const fgtsDemissao = saldoFGTS;
        const fgtsAcordo = saldoFGTS * 1.32;
        const ganhoExtra = fgtsAcordo - fgtsDemissao;

        const totalDemissao = totalEmpresa + fgtsDemissao;
        const totalAcordo = totalEmpresa + fgtsAcordo;

        return {
            saldoSalario, valorFerias, valor13, totalEmpresa,
            fgtsDemissao, fgtsAcordo, ganhoExtra, totalDemissao, totalAcordo
        };
    }

    // Calcular os dois casos
    const resultadoSemFerias = calcular(false);
    const resultadoComFerias = calcular(true);

    // Mostrar/esconder blocos conforme opção
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

    // Preencher valores SEM férias
    document.getElementById('saldoSalario1').textContent = formatarMoeda(resultadoSemFerias.saldoSalario);
    document.getElementById('valorFerias1').textContent = formatarMoeda(resultadoSemFerias.valorFerias);
    document.getElementById('valor13_1').textContent = formatarMoeda(resultadoSemFerias.valor13);
    document.getElementById('totalEmpresa1').textContent = formatarMoeda(resultadoSemFerias.totalEmpresa);
    document.getElementById('fgtsDemissao1').textContent = formatarMoeda(resultadoSemFerias.fgtsDemissao);
    document.getElementById('fgtsAcordo1').textContent = formatarMoeda(resultadoSemFerias.fgtsAcordo);
    document.getElementById('ganhoExtra1').textContent = formatarMoeda(resultadoSemFerias.ganhoExtra);
    document.getElementById('totalDemissao1').textContent = formatarMoeda(resultadoSemFerias.totalDemissao);
    document.getElementById('totalAcordo1').textContent = formatarMoeda(resultadoSemFerias.totalAcordo);

    // Preencher valores COM férias
    document.getElementById('saldoSalario2').textContent = formatarMoeda(resultadoComFerias.saldoSalario);
    document.getElementById('valorFerias2').textContent = formatarMoeda(resultadoComFerias.valorFerias);
    document.getElementById('valor13_2').textContent = formatarMoeda(resultadoComFerias.valor13);
    document.getElementById('totalEmpresa2').textContent = formatarMoeda(resultadoComFerias.totalEmpresa);
    document.getElementById('fgtsDemissao2').textContent = formatarMoeda(resultadoComFerias.fgtsDemissao);
    document.getElementById('fgtsAcordo2').textContent = formatarMoeda(resultadoComFerias.fgtsAcordo);
    document.getElementById('ganhoExtra2').textContent = formatarMoeda(resultadoComFerias.ganhoExtra);
    document.getElementById('totalDemissao2').textContent = formatarMoeda(resultadoComFerias.totalDemissao);
    document.getElementById('totalAcordo2').textContent = formatarMoeda(resultadoComFerias.totalAcordo);

    // Conclusão
    const ganhoMedio = (resultadoSemFerias.ganhoExtra + resultadoComFerias.ganhoExtra) / 2;
    document.getElementById('textoConclusao').innerHTML = `
        ✅ <strong>FAZER ACORDO É SEMPRE MELHOR!</strong><br>
        Você ganha cerca de <strong>${formatarMoeda(ganhoMedio)}</strong> a mais do que se pedir demissão, 
        sem perder nenhum direito. O valor que recebe da empresa é exatamente o mesmo nas duas opções, 
        a diferença só está no FGTS — e no acordo você leva muito mais! 🎯
    `;

    document.getElementById('resultado').style.display = 'block';
    window.scrollTo({top: document.getElementById('resultado').offsetTop - 20, behavior: 'smooth'});
});

