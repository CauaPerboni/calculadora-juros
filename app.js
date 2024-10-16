document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault();

    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '';

    const dicasDiv = document.getElementById('dicas');
    dicasDiv.innerHTML = '';

    const valorInput = document.getElementById('valor').value
        .replace(',', '.');
    const valor = parseFloat(valorInput);
    const jurosTipo = document.getElementById('jurosTipo').value;
    let taxa = parseFloat(document.getElementById('taxa').value);
    const prazo = parseInt(document.getElementById('prazo').value);

    if (isNaN(valor) || isNaN(taxa) || isNaN(prazo) || prazo <= 0) {
        dicasDiv.innerHTML += `<p>Por favor, preencha todos os campos corretamente.</p>`;
        return;
    }

    if (!/^\d+([,]\d{1,2})?$/.test(document.getElementById('valor').value)) {
        dicasDiv.innerHTML += `<p>O valor do empréstimo deve ser um número válido.</p>`;
        return;
    }

    window.scrollTo({
        top: resultadosDiv.offsetTop,
        behavior: 'smooth'
    });

    if (jurosTipo === 'anual') {
        taxa = taxa / 100 / 12;
    } else {
        taxa = taxa / 100;
    }

    const numParcelas = prazo;
    const parcelaMensal = (valor * taxa) / (1 - Math.pow(1 + taxa, -numParcelas));
    const totalPago = parcelaMensal * numParcelas;

    resultadosDiv.innerHTML += `
        <h3>Resultados do Empréstimo</h3>
        <p>Parcela Mensal: R$ ${parcelaMensal.toFixed(2)}</p>
        <p>Total Pago: R$ ${totalPago.toFixed(2)}</p>
    `;

    const tabelaCorpo = document.getElementById('corpoTabela');
    tabelaCorpo.innerHTML = '';
    let saldoDevedor = valor;

    for (let j = 1; j <= numParcelas; j++) {
        const juros = saldoDevedor * taxa;
        const amortizacao = parcelaMensal - juros;
        saldoDevedor -= amortizacao;

        const novaLinha = document.createElement('tr');
        novaLinha.innerHTML = `
            <td>${j}</td>
            <td>R$ ${parcelaMensal.toFixed(2)}</td>
            <td>R$ ${amortizacao.toFixed(2)}</td>
            <td>R$ ${juros.toFixed(2)}</td>
            <td>R$ ${saldoDevedor.toFixed(2)}</td>
        `;
        tabelaCorpo.appendChild(novaLinha);
    }

    document.getElementById('tabelaResultados').style.display = 'table';
});


document.getElementById('valor').addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9,]/g, '');
});


document.querySelectorAll("input").forEach(input => {
    input.addEventListener('keydown', function(event) {
        if (event.key === '.') {
            event.preventDefault();
        }
    });
});
