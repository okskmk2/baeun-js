const search_input = document.getElementById('search_input');
const search_btn = document.getElementById('search_btn');

let isRequesting = false;

let jstreeobj = {
    core: {
        data: {
            text: '/',
            li_attr: {
                path: '/'
            }
        },
        check_callback: true
    },
    plugins: ["search", "wholerw", "contextmenu"],
    contextmenu: {
        items: function (o, cb) {
            return {
                refresh: {
                    label: "Refresh",
                    action: function () {
                        request_path = o.text;
                        $('#jstree').jstree(true).delete_node(o.children);
                        axios({
                            method: 'get',
                            url: "/web/v1/file/get-api/",
                            params: {path: o.li_attr.path}
                        }).then(function (response) {
                            isRequesting = false;
                            let file_list = response.data;

                            if (file_list.length < 1) {
                                snackbar("No file.");
                                return;
                            }
                            for (let i = 0; i < file_list.length; i++) {
                                let icon;
                                if (!file_list[i].file.endsWith('/')) {
                                    icon = 'jstree-icon jstree-file';
                                }
                                $('#jstree').jstree("create_node", o.id, {
                                    text: file_list[i].file,
                                    li_attr: {
                                        path: o.li_attr.path + file_list[i].file
                                    },
                                    icon: icon
                                });
                            }
                        }).catch(function (reason) {
                            console.log(reason);
                        });
                    }
                }
            }
        }
    }
};
//제이쿼리 시작
$(function () {

    if (localStorage.getItem('jstree_content') != null) {
        jstreeobj.core.data = JSON.parse(localStorage.getItem('jstree_content'));
    }

    $('#jstree').jstree(jstreeobj).on('changed.jstree', function (e, data) {
        if (!data.node) return;

        if ($('#jstree').jstree(true).is_open(data.node)) {
            $('#jstree').jstree(true).close_node(data.node);
            return;
        }
        // console.log(data.node); //TODO

        // 일반 파일인 경우
        if (!data.node.text.endsWith('/')) {
            if (data && data.selected && data.selected.length) {
                htmlSelectedFileList(data.node.li_attr.path); // html 렌더 함수
            }
            return; // ajax를 호출하지 않는다.
        }
        // 클릭한 노드에 자식이 없으면 새로 데이터를 불러온다.
        if (data.node.children.length < 1) {
            //자식 가져오기
            if (!isRequesting) {
                isRequesting = true;
                let path = data.node.li_attr.path;
                if (!path) {
                    path = '/';
                }
                axios({
                    method: 'get',
                    url: "/web/v1/file/get-api/",
                    params: {path: data.node.li_attr.path}
                }).then(function (response) {
                    isRequesting = false;
                    let file_list = response.data;
                    if (file_list.length < 1) {
                        snackbar("No file.");
                        return;
                    }
                    //노드 추가 로직
                    for (let i = 0; i < file_list.length; i++) {
                        let icon;
                        if (!file_list[i].file.endsWith('/')) {
                            icon = 'jstree-icon jstree-file';
                        }
                        $('#jstree').jstree("create_node", data.node.id, {
                            // text: 'test',
                            text: file_list[i].file,
                            li_attr: {
                                path: path + file_list[i].file
                            },
                            icon: icon
                        });
                    }
                    //해당 노드 열기
                    $('#jstree').jstree(true).open_node(data.node);
                }).catch(function (error) {
                    isRequesting = false;
                    snackbar(error.response.data.message);
                });
            }
        }
        // 클릭한 노드가 이미 자식이 있으면 그냥 연다.(최신정보 보장 못함 => 컨텍스트메뉴의 리프래쉬로 해결)
        else {
            $('#jstree').jstree(true).open_node(data.node);
        }
    });

    function htmlSelectedFileList(selected_item) {
        let html = "<li><span>" + selected_item + "</span><a class='sbtn'><i class='material-icons'>remove</i></a></li>";
        $('#selected_list_ul').append(html);
        //클로즈 버튼 이벤트 리스너 호출 함수
        bindEvntRemoveBtn();
    }

    $('#okay_btn').on('click', function () {
        //콜랙트 데이터
        let trasfer_data_list = [];
        $('#selected_list_ul li span').each(function () {
            trasfer_data_list.push($(this).text());
        });

        //트랜스퍼 데이터
        opener.resolveInputFileList(trasfer_data_list);
        localStorage.setItem('jstree_content', saveJstree());
        window.close();
    });

    function bindEvntRemoveBtn() {
        $('.sbtn').on('click', function () {
            $(this).parent().remove();
        });
    }
});

function recurve(ary) {
    ary.sort(compare);
    for (let i = 0; i < ary.length; i++) {
        const element = ary[i];
        if (element['children'].length > 0) {
            recurve(element['children']);
        }
    }
}

function sortJstreeData(in_data) {
    let root = in_data[0]['children'];
    recurve(root);
}


function compare(a, b) {
    if (a['children'].length > b['children'].length) {
        return -1;
    }
    else if (a['children'].length === b['children'].length) {
        return 0;
    }
    else if (a['children'].length < b['children'].length) {
        return 1;
    }
}

function saveJstree() {
    let objtree = $('.jstree').jstree(true).get_json('#', {'flat': false});
    sortJstreeData(objtree);
    let stringtree = JSON.stringify(objtree);
    localStorage.setItem('jstree_content', stringtree);
    return stringtree;
}

search_input.addEventListener("keyup", function (e) {
    e.preventDefault();
    if (e.keyCode === 13) {
        searchLocation();
    }
});

search_btn.addEventListener('click', function () {
    searchLocation();
});

function searchLocation() {
    let searchWord = search_input.value;
    if (!searchWord) {
        return;
    }
    if (!/^\//g.test(searchWord)) {
        snackbar("The path must be a full-path.");
        return;
    }
    searchWord = searchWord.replace(/([/])$/g, '$1');
    search_input.value = searchWord;
    let queue = searchWord.split('/').map(function (value) {
        return value + '/';
    });
    if (queue[queue.length - 1] === '/') {
        queue.pop();
    }
    // console.log(queue); // TODO 검색 리스트 완성
    let jstreeObj = $('#jstree').jstree(true).get_json('#');
    // console.log(jstreeObj);  // TODO
    let cur_data = jstreeObj;
    let text;

    function search() {
        if (queue.length > 0) {
            text = queue.shift();
            // console.log("text : " + text);  // TODO
            let target_data = cur_data.filter(function (v) {
                return v['text'] === text
            });
            // console.log(target_data);  // TODO
            if (target_data.length > 0) {
                console.log("필터의 결과가 있다."); // TODO
                if (target_data[0].children.length > 0) {
                    console.log("자식이 있다.");  // TODO
                    $('#jstree').jstree(true).open_node('#' + target_data[0].id);
                    cur_data = target_data[0].children;
                    // console.log(cur_data);  // TODO
                    search();
                } else {
                    console.log("자식이 없다.");  // TODO
                    function OpenNode(node) {
                        console.log("통신을 통한 가져오기 시도..."); //TODO
                        axios({
                            url: "/web/v1/file/get-api/",
                            method: 'get',
                            params: {path: node.li_attr.path}
                        }).then(function (response) {
                            let file_list = response.data;
                            if (file_list.length < 1) {
                                snackbar("No file.");
                                return;
                            }
                            //노드 추가 로직
                            for (let i = 0; i < file_list.length; i++) {
                                let icon;
                                if (!file_list[i].file.endsWith('/')) {
                                    icon = 'jstree-icon jstree-file';
                                }
                                $('#jstree').jstree("create_node", node.id, {
                                    // text: 'test',
                                    text: file_list[i].file,
                                    li_attr: {
                                        path: node.li_attr.path + file_list[i].file
                                    },
                                    icon: icon
                                });
                            }
                            //해당 노드 열기
                            $('#jstree').jstree(true).open_node(node);
                            // console.log(node);  // TODO
                            cur_data = $('#jstree').jstree(true).get_json('#' + node.id).children;
                            // console.log(cur_data);  // TODO
                            search();
                        }).catch(function (reason) {
                            snackbar(reason.response.data.message);
                        });
                    }
                    OpenNode(target_data[0]);
                }
            }
        }
    }
    search();
}
