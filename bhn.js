function makeTable(target_el, config) {
    let el_table = document.createElement('table');
    let data_list = config.data;
    // make thead
    let config_ths = config.thead.ths;
    makeThead(el_table, config_ths);
    // make tbody
    let config_tds = config.tbody.tds;
    makeTbody(el_table, data_list, config_tds);

    target_el.appendChild(el_table);
    return el_table;
}

function makeThead(el_table, ths) {
    let el_thead = document.createElement('thead');
    let el_tr = document.createElement('tr');
    let i = 0;
    let ths_length = ths.length;
    for (; i < ths_length; i++) {
        let th = ths[i];
        let el_th = document.createElement('th');
        el_th.appendChild(document.createTextNode(th.title));
        if (th.className) {
            el_th.classList.add(th.className);
        }
        el_th.addEventListener('click', function () {
            let sortType;
            if (th.sortType === undefined) {
                sortType = 'string';
            } else {
                sortType = th.sortType;
            }
            sorting(el_table, el_th, sortType);
        })
        el_tr.appendChild(el_th);
    }
    el_thead.appendChild(el_tr);
    el_table.appendChild(el_thead);
}

function makeTbody(el_table, data_list, config_tds) {
    let el_tbody = document.createElement('tbody');
    let i = 0;
    let data_list_length = data_list.length;
    for (; i < data_list_length; i++) {
        let el_tr = document.createElement('tr');
        let data_tr = data_list[i];
        let j = 0;
        let config_tds_length = config_tds.length;
        for (; j < config_tds_length; j++) {
            let data_td = data_tr[config_tds[j].data];
            let el_td = document.createElement('td');
            el_td.appendChild(document.createTextNode(data_td));
            if (typeof config_tds[j].callback === 'function') {
                el_td.addEventListener('click', function () {
                    config_tds[j].callback(el_td);
                })
            }
            el_tr.appendChild(el_td);
        }
        el_tbody.appendChild(el_tr);
    }
    el_table.appendChild(el_tbody);
}

function sorting(el_table, target_th, sortType) {

    let orderBy;
    if (target_th.dataset.orderBy === undefined) {
        orderBy = 'asc';
    } else {
        orderBy = target_th.dataset.orderBy;
    }
    let tbody = el_table.children[1];
    let position = Array.from(target_th.parentNode.children).indexOf(target_th);
    let trs = Array.from(tbody.children).sort(function (a, b) {
        let a1, b1;
        if (sortType === 'number') {
            a1 = +a.children[position].innerHTML;
            b1 = +b.children[position].innerHTML;
        } else {
            a1 = a.children[position].innerHTML;
            b1 = b.children[position].innerHTML;
        }
        return ordering(orderBy, a1, b1);
    });
    tbody.children = null;
    for (let i = 0; i < trs.length; i++) {
        tbody.appendChild(trs[i]);
    }

    if (orderBy === 'desc') {
        target_th.dataset.orderBy = 'asc';
    } else {
        target_th.dataset.orderBy = 'desc';
    }

}

function ordering(orderBy, a1, b1) {
    if (orderBy !== 'desc') {
        if (a1 > b1) {
            return -1;
        } else if (a1 < b1) {
            return 1;
        } else {
            return 0;
        }
    } else {
        if (a1 > b1) {
            return 1;
        } else if (a1 < b1) {
            return -1;
        } else {
            return 0;
        }
    }
}



//easy to read
function insertTable(el, sourceList){
    let html = "<table>";

    // making header...
    let obj = sourceList[0];    
    html += '<thead><tr>';
    for (const key of Object.keys(obj)) {
        html += `<th>${key}</th>`;
    }
    html += '</tr></thead>';
    // making body
    html += '<tbody>';
    for (const tr of sourceList) {
        html += '<tr>';
        for (const td in tr) {
            html += `<td>${tr[td]}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    el.innerHTML = html;
}

HTMLElement.prototype.insertElement = function (elementName) {
    let element = document.createElement(elementName);
    this.appendChild(element);
    return element;
}

Element.prototype.insertText = function (text) {
    this.innerHTML = text;
    return this;
}

HTMLElement.prototype.insertTable = function (array) {
    let table1 = this.insertElement('table');
    let theadRow = table1.insertElement('thead').insertRow();
    for (const key of Object.keys(array[0])) {
        theadRow.insertElement('th').innerHTML = key;
    }
    let tbody = table1.insertElement('tbody');
    for (const row of array) {
        let r1 = tbody.insertRow();
        for (const col in row) {
            r1.insertCell().innerHTML = row[col];
        }
    }
}

//20180319
HTMLElement.prototype.getAttributeAll = function () {
    let attrs = Array.from(this.attributes).map((a)=>{
        o = {};
        o.name = a.name;
        o.value = a.value;
        return o2});
    return attrs;
}

//20180319
NodeList.prototype.getAttributeAll = function() {
    return list.map((e)=> {e.getAttributeAll()});
}

HTMLFormElement.prototype.toJson = function () {
    let o = {}
    let els = Array.from(this.elements).filter((e) => { return e.name && e.type != 'file' });
    for (const el of els) {
        if (o.hasOwnProperty(el.name)) {
            if (!el.checked) continue;
            let l = [];
            l.push(o[el.name]);
            l.push(el.value);
            o[el.name] = l;
        } 
        else if(el.nodeName == 'SELECT'){
            let key = el.name;
            let ops = Array.from(el.options);
            let l2 = [];
            for (const op of ops) {
                if (op.selected) {
                    l2.push(op.value);
                }
            }
            if(l2.length > 0) o[key] = l2;
        }
        
        else {
            if (el.type == 'radio' || el.type == 'checkbox') {
                if (!el.checked) continue;
            }
            o[el.name] = el.value;
        }
    }
    return JSON.stringify(o);
}

Window.prototype.httpGet = function (url, fn) {
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == '4' && ajax.status == '200') {
            fn(ajax.responseText);
        }
    }
    ajax.open('get', url, true);
    ajax.send(null);
}

Window.prototype.httpPost = function (url, data, fn) {
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == '4' && ajax.status == '200') {
            fn(ajax.responseText);
        }
    }
    ajax.open('post', url, true);
    ajax.send(data);
}

Window.prototype.query = function (selector) {
    let el = document.querySelectorAll(selector);
    return el.length < 2 ? el[0] : el;
}

//sdfssd
