// Função para calcular desconto do INSS
function calcularINSS(valor) {
    if (valor <= 1320.00) return valor * 0.075;
    if (valor <= 2571.29) return valor * 0.09 - 19.80;
    if (valor <= 3856.94) return valor * 0.12 - 96.94;
    if (valor <= 7507.49) return valor * 0.14 - 174.08;
    return 876.97; // teto máximo
}

document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();

    // Pegar dados do formulário
    const admissao = new Date(document.getElementById('admissao').value);
    const salarioBruto = parseFloat(document.getElementById('salarioBruto').value);
    const temFeriasVencidas = document.querySelector('input[name="feriasVencidas"]:checked').value === 'sim';
    const vaiCumprirAviso = document.querySelector('input[name="aviso"]:checked').value === 'cumprir';

    // Data de hoje
    const hoje = new Date();

    // Calcular tempo de empresa em meses
    const anos = hoje.getFullYear() - admissao.getFullYear();
    const meses = hoje.getMonth() - admissao.getMonth() + (anos * 12);
    const mesesAno = hoje.getMonth() + 1; // quantos meses passaram esse ano

    // 1. Saldo de salário
    let saldoSalario = salarioBruto;
    if (!vaiCumprirAviso) {
        const diasMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
        saldoSalario = (salarioBruto / diasMes) * hoje.getDate();
    }

    // 2. Férias
    let valorFerias = 0;
    const feriasProporcionais = (salarioBruto / 12) * mesesAno;
    valorFerias += feriasProporcionais + (feriasProporcionais / 3);

    if (temFeriasVencidas) {
        valorFerias += salarioBruto + (salarioBruto / 3);
    }

    // 3. 13º Salário proporcional
    const valor13 = (salarioBruto / 12) * mesesAno;

    // Descontos INSS
    const descontoSalario = calcularINSS(saldoSalario);
    const descontoFerias = calcularINSS(valorFerias);
    const desconto13 = calcularINSS(valor13);
    const totalDescontos = descontoSalario + descontoFerias + desconto13;

    const totalLiquidoEmpresa = saldoSalario + valorFerias + valor13 - totalDescontos;

    // 4. FGTS
    const saldoFGTS = (salarioBruto * 0.08) * meses;
    const fgtsDemissao = saldoFGTS; // sem multa
    const fgtsAcordo = saldoFGTS * 1.32; // +32% (perdeu 20% dos 40% cheios)
    const ganhoExtra = fgtsAcordo - fgtsDemissao;

    // Totais gerais
    const totalDemissao = totalLiquidoEmpresa + fgtsDemissao;
    const totalAcordo = totalLiquidoEmpresa + fgtsAcordo;

    // Formatar valores em dinheiro
    const formatar = (v) => v.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});

    // Atualizar tela
    document.getElementById('saldoSalario').textContent = formatar(saldoSalario);
    document.getElementById('valorFerias').textContent = formatar(valorFerias);
    document.getElementById('valor13').textContent = formatar(valor13);
    document.getElementById('totalLiquido').textContent = formatar(totalLiquidoEmpresa);

    document.getElementById('fgtsDemissao').textContent = formatar(fgtsDemissao);
    document.getElementById('totalDemissao').textContent = formatar(totalDemissao);

    document.getElementById('fgtsAcordo').textContent = formatar(fgtsAcordo);
    document.getElementById('ganhoExtra').textContent = formatar(ganhoExtra);
    document.getElementById('totalAcordo').textContent = formatar(totalAcordo);

    document.getElementById('resultado').style.display = 'block';
    window.scrollTo({top: document.getElementById('resultado').offsetTop, behavior: 'smooth'});
});

