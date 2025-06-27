let members = [];
let expenses = [];

function addMember() {
    const nameInput = document.getElementById('memberName');
    const name = nameInput.value.trim();
    if (name && !members.includes(name)) {
        members.push(name);
        nameInput.value = '';
        renderMembers();
        renderExpenseMemberOptions();
        renderMetrics();
        renderChart();
    } else if (members.includes(name)) {
        alert('Member already exists!');
    }
}

function deleteMember(index) {
    if (confirm('Are you sure you want to delete this member and all their expenses?')) {
        const memberName = members[index];
        members.splice(index, 1);
        expenses = expenses.filter(e => e.member !== memberName);
        renderMembers();
        renderExpenseMemberOptions();
        renderMetrics();
        renderExpensesTable();
        renderChart();
    }
}

function renderMembers() {
    const list = document.getElementById('memberList');
    list.innerHTML = '';
    members.forEach((member, idx) => {
        const li = document.createElement('li');
        li.textContent = member;
        const btn = document.createElement('button');
        btn.textContent = 'Delete';
        btn.className = 'delete-btn';
        btn.onclick = () => deleteMember(idx);
        li.appendChild(btn);
        list.appendChild(li);
    });
}

function renderExpenseMemberOptions() {
    const select = document.getElementById('expenseMember');
    select.innerHTML = '';
    members.forEach(member => {
        const option = document.createElement('option');
        option.value = member;
        option.textContent = member;
        select.appendChild(option);
    });
}

function addExpense() {
    const member = document.getElementById('expenseMember').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const desc = document.getElementById('expenseDesc').value.trim();
    if (member && amount && amount > 0) {
        expenses.push({ member, amount, desc });
        document.getElementById('expenseAmount').value = '';
        document.getElementById('expenseDesc').value = '';
        renderMetrics();
        renderExpensesTable();
        renderChart();
    } else {
        alert('Please enter a valid amount and select a member.');
    }
}

function deleteExpense(index) {
    if (confirm('Delete this expense?')) {
        expenses.splice(index, 1);
        renderMetrics();
        renderExpensesTable();
        renderChart();
    }
}

function renderExpensesTable() {
    const tbody = document.querySelector('#expensesTable tbody');
    tbody.innerHTML = '';
    expenses.forEach((exp, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${exp.member}</td>
            <td>₹${exp.amount.toLocaleString('en-IN')}</td>
            <td>${exp.desc}</td>
            <td><button class="delete-btn" onclick="deleteExpense(${idx})">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderMetrics() {
    const metricsDiv = document.getElementById('metrics');
    let total = expenses.reduce((sum, e) => sum + e.amount, 0);
    let html = `<strong>Total Expenses:</strong> ₹${total.toLocaleString('en-IN')}`;
    if (members.length > 0) {
        html += '<ul>';
        members.forEach(member => {
            const memberTotal = expenses.filter(e => e.member === member).reduce((sum, e) => sum + e.amount, 0);
            html += `<li>${member}: ₹${memberTotal.toLocaleString('en-IN')}</li>`;
        });
        html += '</ul>';
    }
    metricsDiv.innerHTML = html;
}

function renderChart() {
    const ctx = document.getElementById('expensesChart').getContext('2d');
    if (window.expensesChart) window.expensesChart.destroy();
    const data = members.map(member => expenses.filter(e => e.member === member).reduce((sum, e) => sum + e.amount, 0));
    window.expensesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: members,
            datasets: [{
                label: 'Expenses (INR)',
                data: data,
                backgroundColor: '#0078d4',
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        }
                    }
                }
            }
        }
    });
}

// Initial render
renderMembers();
renderExpenseMemberOptions();
renderMetrics();
renderExpensesTable();
renderChart();
