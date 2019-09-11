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
    let position = Array.prototype.slice.call(target_th.parentNode.children).indexOf(target_th);
    let trs = Array.prototype.slice.call(tbody.children).sort(function (a, b) {
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
function insertTable(el, sourceList) {
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
    let attrs = Array.prototype.slice.call(this.attributes).map((a) => {
        o = {};
        o.name = a.name;
        o.value = a.value;
        return o;
    });
    return attrs.length === 0 ? undefined : attrs;
}

//20180319
NodeList.prototype.getAttributeAll = function () {
    return Array.prototype.slice.call(this).map(e => e.getAttributeAll());
}

HTMLFormElement.prototype.toJson = function () {
    let o = {}
    let els = Array.prototype.slice.call(this.elements).filter((e) => { return e.name && e.type != 'file' });
    for (const el of els) {
        if (o.hasOwnProperty(el.name)) {
            if (!el.checked) continue;
            let l = [];
            l.push(o[el.name]);
            l.push(el.value);
            o[el.name] = l;
        }
        else if (el.nodeName == 'SELECT') {
            let key = el.name;
            let ops = Array.prototype.slice.call(el.options);
            let l2 = [];
            for (const op of ops) {
                if (op.selected) {
                    l2.push(op.value);
                }
            }
            if (l2.length > 0) o[key] = l2;
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

//20190410
HTMLTableElement.prototype.getData = function () {
    let start_index = (this.querySelector('tr th:nth-child(2)') === null) ? 0 : 1;
    if (start_index === 1) {
        let header = [];
        let data_list = [];
        const tr = this.rows[0];
        for (let i = 0; i < tr.cells.length; i++) {
            const th = tr.cells[i];
            header.push(th.innerHTML);
        }
        for (let index = start_index; index < this.rows.length; index++) {
            const tr = this.rows[index];
            let data = {};
            for (let j = 0; j < tr.cells.length; j++) {
                const td = tr.cells[j];
                data[header[j]] = td.innerHTML;
            }
            data_list.push(data);
        }
        return data_list;
    }
    else {
        let data = {};
        for (let index = start_index; index < this.rows.length; index++) {
            const tr = this.rows[index];
            data[tr.cells[0].innerHTML] = tr.cells[1].innerHTML;
        }
        return data;
    }
}

//20190911
HTMLSelectElement.prototype.getSelectValues = function(){
    var result = [];
    var options = this && this.options;
    var opt;

    for (var i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
}

//20190911
HTMLSelectElement.prototype.setValues = function (values) {
    for (var i = 0; i < this.options.length; i++) {
        this.options[i].selected = values.indexOf(element.options[i].value) >= 0;
    }
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
    ajax.send(JSON.stringify(data));
}

Window.prototype.query = function (selector) {
    let el = document.querySelectorAll(selector);
    return el.length < 2 ? el[0] : el;
}

//20190911
Window.prototype.getCookie = function(name){
    name += "=";
    var arr = decodeURIComponent(document.cookie).split(';');
    for (var i = 0; i < arr.length; i++) {
      var c = arr[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}