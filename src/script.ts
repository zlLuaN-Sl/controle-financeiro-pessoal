interface Transaction {
    id:number,
    descricao: string,
    valor: number,
    tipo: "entrada" | "saida",
    categoria: string,
    data: string
}

let transactions: Transaction[] = []

const calcTotal = () => {
    let totalEntrada = 0;
    let totalSaida = 0;

    transactions.forEach((item) => {
        if(item.tipo === 'entrada') {
            totalEntrada = item.valor + totalEntrada
        } else {
            totalSaida = item.valor + totalSaida
        }
    })

    let saldo = totalEntrada - totalSaida

    return {totalEntrada, totalSaida, saldo}
}


const addTransaction = (transaction: Transaction):void => {
    transactions.push(transaction)

    console.log(transactions)
}



const form = document.querySelector('form') as HTMLFormElement;
const inputdescricao = document.querySelector('#descricao') as HTMLInputElement;
const inputvalor = document.querySelector('#valor') as HTMLInputElement;
const inputData = document.querySelector('#data') as HTMLInputElement;
const selectCate = document.querySelector('#categoria') as HTMLSelectElement;
const tipoSelect = document.querySelector('#tipo') as HTMLSelectElement;
const btnSubmit = document.querySelector('#btn-submit') as HTMLButtonElement;




form.addEventListener('submit', (event) => {
    event.preventDefault();
    

    const descricao = inputdescricao.value;
    const valor: number = Number(inputvalor.value);
    const data = inputData.value;
    const selectCategoria = selectCate.value;
    const selectTipo = tipoSelect.value as "entrada" | "saida";

    if (!descricao.trim() || valor <= 0 || !selectCategoria || !data) {
        alert('Preencha todos os campos corretamente!');
        return;
    }



    if(idingID === null) {
        const transactionObjeto: Transaction = {   
                id: Date.now(), 
                valor:valor, 
                data:data, 
                categoria:selectCategoria, 
                tipo:selectTipo, 
                descricao:descricao
            }

        addTransaction(transactionObjeto)
        renderTransaction(transactionObjeto)
    } else {
        const index = transactions.findIndex(item => item.id === idingID);
        
        if (index !== -1) {
            transactions[index] = {
                id: idingID,
                descricao,
                valor,
                data,
                categoria:selectCategoria,
                tipo:selectTipo
            };
        }

        const tbody = document.querySelector('#transactions-body')!;
        tbody.innerHTML = '';
        transactions.forEach(renderTransaction);

        idingID = null;
        btnSubmit.textContent = 'Adicionar Transação';

    }

        
        updateSummary()
        form.reset();
        



});

const updateSummary = (): void => {

    const entradaEl = document.querySelector('#total-entrada') as HTMLSpanElement;
    const saidaEl = document.querySelector('#total-saida') as HTMLSpanElement;
    const saldoEl = document.querySelector('#saldo') as HTMLSpanElement;

        
    const {totalEntrada, totalSaida, saldo} = calcTotal();

    entradaEl.textContent = `+ R$ ${totalEntrada}`;
    saidaEl.textContent = `- R$ ${totalSaida}`;
    saldoEl.textContent = ` R$ ${saldo}`;

}

const renderTransaction = (transaction: Transaction) => {
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

    tdAcoes.classList.add('actions')

    tdAcoes.append(btnEdit, btnDelete);

    tdDescricao.textContent = transaction.descricao;
    tdValor.textContent = transaction.tipo === "entrada" ? `+ R$ ${transaction.valor}` : `- R$ ${transaction.valor}`;
    tdTipo.textContent = capitalize(transaction.tipo);
    tdCategoria.textContent = capitalize(transaction.categoria);
    tdData.textContent = formatDate(transaction.data);
   

    tr.append(tdDescricao, tdValor, tdTipo, tdCategoria, tdData, tdAcoes )

    const tbody = document.querySelector('#transactions-body') as HTMLTableElement

    tbody.appendChild(tr);


    btnDelete.addEventListener('click', (e) => {
            removeTransaction(transaction.id)

            tr.remove();

            updateSummary();
    })

    btnEdit.addEventListener('click', (e) => {

        const transactionEdit = transactions.find(id => id.id === transaction.id)

        if(!transactionEdit) return;

        idingID = transactionEdit.id;

        inputdescricao.value = transactionEdit.descricao;
        inputvalor.value = String(transactionEdit.valor);
        inputData.value = transactionEdit.data;
        selectCate.value = transactionEdit.categoria;
        tipoSelect.value = transactionEdit.tipo;

        btnSubmit.textContent = 'Salvar edição'

    })


}

const capitalize = (text: string): string => {
    if(!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
}


const formatDate = (date: string): string => {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
};


const removeTransaction = (id:number): void => {
    transactions = transactions.filter(item => item.id !== id)
}


const clearForm = (): void => {
    inputdescricao.value = '';
    inputvalor.value = '';
    inputData.value = '';
    selectCate.value = '';
    tipoSelect.value = 'entrada'; 
};


let idingID: null | number = null;










