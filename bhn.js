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