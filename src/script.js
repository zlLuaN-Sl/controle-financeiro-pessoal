let transactions = [];
const calcTotal = () => {
    let totalEntrada = 0;
    let totalSaida = 0;
    transactions.forEach((item) => {
        if (item.tipo === 'entrada') {
            totalEntrada = item.valor + totalEntrada;
        }
        else {
            totalSaida = item.valor + totalSaida;
        }
    });
    let saldo = totalEntrada - totalSaida;
    return { totalEntrada, totalSaida, saldo };
};
const addTransaction = (transaction) => {
    transactions.push(transaction);
    console.log(transactions);
};
const form = document.querySelector('form');
const inputdescricao = document.querySelector('#descricao');
const inputvalor = document.querySelector('#valor');
const inputData = document.querySelector('#data');
const selectCate = document.querySelector('#categoria');
const tipoSelect = document.querySelector('#tipo');
const btnSubmit = document.querySelector('#btn-submit');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const descricao = inputdescricao.value;
    const valor = Number(inputvalor.value);
    const data = inputData.value;
    const selectCategoria = selectCate.value;
    const selectTipo = tipoSelect.value;
    if (!descricao.trim() || valor <= 0 || !selectCategoria || !data) {
        alert('Preencha todos os campos corretamente!');
        return;
    }
    if (idingID === null) {
        const transactionObjeto = {
            id: Date.now(),
            valor: valor,
            data: data,
            categoria: selectCategoria,
            tipo: selectTipo,
            descricao: descricao
        };
        addTransaction(transactionObjeto);
        renderTransaction(transactionObjeto);
    }
    else {
        const index = transactions.findIndex(item => item.id === idingID);
        if (index !== -1) {
            transactions[index] = {
                id: idingID,
                descricao,
                valor,
                data,
                categoria: selectCategoria,
                tipo: selectTipo
            };
        }
        const tbody = document.querySelector('#transactions-body');
        tbody.innerHTML = '';
        transactions.forEach(renderTransaction);
        idingID = null;
        btnSubmit.textContent = 'Adicionar Transação';
    }
    updateSummary();
    form.reset();
});
const updateSummary = () => {
    const entradaEl = document.querySelector('#total-entrada');
    const saidaEl = document.querySelector('#total-saida');
    const saldoEl = document.querySelector('#saldo');
    const { totalEntrada, totalSaida, saldo } = calcTotal();
    entradaEl.textContent = `+ R$ ${totalEntrada}`;
    saidaEl.textContent = `- R$ ${totalSaida}`;
    saldoEl.textContent = ` R$ ${saldo}`;
};
const renderTransaction = (transaction) => {
    const tr = document.createElement('tr');
    const tdDescricao = document.createElement('td');
    const tdValor = document.createElement('td');
    const tdTipo = document.createElement('td');
    const tdCategoria = document.createElement('td');
    const tdData = document.createElement('td');
    const tdAcoes = document.createElement('td');
    const btnEdit = document.createElement('button');
    btnEdit.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
    const btnDelete = document.createElement('button');
    btnDelete.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    tdAcoes.classList.add('actions');
    tdAcoes.append(btnEdit, btnDelete);
    tdDescricao.textContent = transaction.descricao;
    tdValor.textContent = transaction.tipo === "entrada" ? `+ R$ ${transaction.valor}` : `- R$ ${transaction.valor}`;
    tdTipo.textContent = capitalize(transaction.tipo);
    tdCategoria.textContent = capitalize(transaction.categoria);
    tdData.textContent = formatDate(transaction.data);
    tr.append(tdDescricao, tdValor, tdTipo, tdCategoria, tdData, tdAcoes);
    const tbody = document.querySelector('#transactions-body');
    tbody.appendChild(tr);
    btnDelete.addEventListener('click', (e) => {
        removeTransaction(transaction.id);
        tr.remove();
        updateSummary();
    });
    btnEdit.addEventListener('click', (e) => {
        const transactionEdit = transactions.find(id => id.id === transaction.id);
        if (!transactionEdit)
            return;
        idingID = transactionEdit.id;
        inputdescricao.value = transactionEdit.descricao;
        inputvalor.value = String(transactionEdit.valor);
        inputData.value = transactionEdit.data;
        selectCate.value = transactionEdit.categoria;
        tipoSelect.value = transactionEdit.tipo;
        btnSubmit.textContent = 'Salvar edição';
    });
};
const capitalize = (text) => {
    if (!text)
        return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
};
const formatDate = (date) => {
    if (!date)
        return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
};
const removeTransaction = (id) => {
    transactions = transactions.filter(item => item.id !== id);
};
const clearForm = () => {
    inputdescricao.value = '';
    inputvalor.value = '';
    inputData.value = '';
    selectCate.value = '';
    tipoSelect.value = 'entrada';
};
let idingID = null;
export {};
//# sourceMappingURL=script.js.map