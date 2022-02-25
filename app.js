let BabyWordList = {

    addForm: document.querySelector('.js-addForm'),
    submitBtn: document.querySelector('.js-submitBtn'),
    list: document.querySelector('.js-list'),
    trash: document.querySelector('.js-trash'),
    searchBox: document.querySelector('.js-search'),
    searchIcon: document.querySelector('.js-searchIcon'),
    cancelSearch: document.querySelector('.js-searchCancel'),
    errMsg: {},
    addErrMsgArea: document.querySelector('.js-add-err'),
    addVocabErrMsgArea: document.querySelector('.js-addVocab-err'),
    editMode: false,
    wordArea: document.querySelector('.js-word'),
    vocabArea: document.querySelector('.js-vocab'),
    dateArea: document.querySelector('.js-date'),
    vocabList: document.querySelector('.js-vocabList'),
    recordItem: document.querySelector('.js-recordItem'),
    radioBtn: document.querySelector('.js-radio'),
    item: document.querySelector('.js-list-item'),
    star: document.getElementsByClassName('js-fa-star'),
    pageList: document.querySelector('.js-pagenation'),
    pageNum: document.querySelector('.js-pageNum'),
    sortBtn: document.querySelector('.js-sort'),
    inputTags: document.querySelector('.js-inputTags'),
    spVocabMenu: document.querySelector('.js-sp-vocab-menu-box'),
    header: document.querySelector('.js-header'),
    footer: document.querySelector('.js-footer'),
    wrapper: document.querySelector('.js-wrapper'),
    vocabListWrapper: document.querySelector('.js-vocabListWrapper'),
    clearBtn: document.querySelector('#all-clear-btn'),
    indexA: '',
    indexB: '',
    currentPageNum: '',
    itemsNumsPerPage: '',
    targetUnix: '',
    targetIndex: '',
    newVal: {},
    init: function () {


        //@Main column
        //1 Get items from the local storage.
        let dataFromStorage = BabyWordList.getDataFromLocalStorage() ? BabyWordList.getDataFromLocalStorage() : '';

        //2 Get the value of radio button from the session storage.
        let url = new URLSearchParams(location.search.slice(1));
        let sortVal = sessionStorage.sortVal ? sessionStorage.sortVal : '';

        //3 Sort the items by the value of radio button.
        let itemArray = sortVal !== null ? BabyWordList.sortList(dataFromStorage, sortVal) : dataFromStorage;
        let [currentPageNum, itemsNumPerPage, radioVal] = BabyWordList.pagenation(itemArray.length);
        let html = '';


        //4 Prepare to display the list of the items.
        let firstNum = currentPageNum === 1 ? 0 : (itemsNumPerPage - 1) * (currentPageNum - 1) + 1 * (currentPageNum - 1);
        let lastNum = firstNum + (itemsNumPerPage - 1);
        let unix = [];
        let data = '';

        //5 Check the radio button reffering to step2.
        let radioForm = [];
        radioForm = BabyWordList.radioBtn;
        let inputTag = [];
        inputTag = radioForm.getElementsByTagName('input');
        let target = '';
        let number = '';

        for (i = 0; i < inputTag.length; i++) {
            if (inputTag[i].value == sortVal) {
                inputTag[i].outerHTML = `<input type="radio" class="checkbox" value="${sortVal}" name="sort" checked="checked">`;
            }
        }

        //6 Display the items reffering to step4.
        if (itemArray.length > 0) {
            for (i = firstNum; i <= lastNum; i++) {
                html += itemArray[i].html;
                if (i >= itemArray.length - 1) {
                    break;
                }
            }
        }

        BabyWordList.list.innerHTML = html;


        //      //@Vocaburary column

        //1 Get only vocaburaries from the local storage and display.
        let vocabArray = BabyWordList.displayVocab();
        let vocabHTML = '';

        if (vocabArray) {
            vocabArray.sort((a, b) => {
                return (a > b ? 1 : -1);
            });
            vocabArray.forEach((vocabArray) => {
                vocabHTML += `<li class="vocab-item"><i class="fas fa-check"></i>${vocabArray}</li>`;

            });
        }
        BabyWordList.vocabList.innerHTML = vocabHTML;

        //@footer
        // if (BabyWordList.list.children) {
        //     BabyWordList.debug(BabyWordList.list.children.length);
        //     BabyWordList.footerAdjust();
        // }
    },

    footerAdjust: function () {
        if (BabyWordList.list.children.length === 0) {
            let headerh = BabyWordList.header.offsetHeight;
            let footerh = BabyWordList.footer.offsetHeight;
            let windowh = window.innerHeight;
            let mainh = document.querySelector('.main').offsetHeight;
            let vocabh = document.querySelector('.vocab').offsetHeight;
            let targeth = windowh - (headerh + footerh);
            BabyWordList.debug(headerh, footerh, windowh, targeth);
            BabyWordList.wrapper.style.height = targeth + 'px';
            BabyWordList.debug(targeth);
        }
    },
    pagenation: function (storageLength) {
        let url = new URLSearchParams(location.search.slice(1));
        let itemsNumPerPage = 10; //Number of items displayed per page
        let totalPageNum = Math.ceil(storageLength / itemsNumPerPage);//Number of the total pages
        let currentPageNum = '';//Number of the page where you are now
        let maxPageNum = '';//The maximum page number displayed according to the current page number
        let itemsNum = 5;//The number of page numbers
        let minPageNum = '';//The minimum page number displayed according to the current page number
        let sortVal = sessionStorage.getItem('sortVal');//value of radio button
        let HTML = '';


        if (url.get('page') <= totalPageNum && url.get('page') > 0) {
            currentPageNum = Number(url.get('page'));
        } else {
            currentPageNum = 1;
        }

        if (currentPageNum > 1) {
            HTML += `<li><a href="?page=${currentPageNum - 1}&sort=${sortVal}">Prev</a></li>`;
        }

        if (currentPageNum === totalPageNum && totalPageNum >= itemsNum) {
            minPageNum = currentPageNum - 4;
            maxPageNum = currentPageNum;

        } else if (currentPageNum === totalPageNum - 1 && totalPageNum >= itemsNum) {
            minPageNum = currentPageNum - 3;
            maxPageNum = currentPageNum + 1;

        } else if (currentPageNum === 2 && totalPageNum >= itemsNum) {
            minPageNum = currentPageNum - 1;
            maxPageNum = currentPageNum + 3;

        } else if (currentPageNum === 1 && totalPageNum > itemsNum) {

            minPageNum = currentPageNum;
            maxPageNum = currentPageNum + 4;

        } else if (totalPageNum <= itemsNum) {
            minPageNum = 1;
            maxPageNum = totalPageNum;

        } else {
            minPageNum = currentPageNum - 2;
            maxPageNum = currentPageNum + 2;
        }

        for (i = minPageNum; i <= maxPageNum; i++) {
            if (currentPageNum === i) {
                HTML += `<li class="pageNum js-pageNum pageNumActive"><a href="?page=${i}&sort=${sortVal}">${i}</a></li>`;
            } else {
                HTML += `<li class="pageNum js-pageNum"><a href="?page=${i}&sort=${sortVal}">${i}</a></li>`;
            }
        }

        if (currentPageNum < totalPageNum) {
            HTML += `<li><a href="?page=${currentPageNum + 1}&sort=${sortVal}">Next</a></li>`;
        }


        BabyWordList.pageList.innerHTML = HTML;
        BabyWordList.currentPageNum = currentPageNum;
        BabyWordList.itemsNumPerPage = itemsNumPerPage;
        return [currentPageNum, itemsNumPerPage, sortVal];
    },

    createItem: function (word, vocab, year, month, date) {
        let item = '';
        item = `<li class="list-item js-list-item"><ul class="inner-list"><i class="fas fa-star js-fa-star" aria-hidden="true"></i><li class="inner-list-item"><i class="far fa-trash-alt js-trash" aria-hidden="true"></i></li><span class="js-year">${year}</span>/<span class="js-month">${month}</span>/<span class="js-date">${date}</span>:<span class="js-word">${word}</span><li class="inner-list-vocab js-inner-list-vocab"><span class="js-vocab">${vocab}</span></li></ul></li>`;

        //Display the data.
        BabyWordList.list.insertAdjacentHTML('afterbegin', item);


        //Save the data to local storage(Key:unix time, Value:html code).
        let DD = new Date();
        let unix = DD.getTime();
        BabyWordList.saveToLocalStorage(unix, item);
        BabyWordList.addForm.reset();
        return item;
    },

    getDataFromLocalStorage: function () {
        let itemArray = [];

        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                itemArray.push({ 'unix': key, 'html': localStorage[key] });
            }
        }

        itemArray.sort((a, b) => {
            return (a.unix < b.unix ? 1 : -1);
        });
        return itemArray;
    },

    //Sort the array of the items according to the value of radio button.
    sortList: function (itemArray, radio) {
        let searchTarget = document.querySelector('.searchTarget');
        let items = BabyWordList.getDataFromLocalStorage();
        let reg_yymmdd = /\d{4}\/\d{1,2}\/\d{1,2}:/;
        let regExp = new RegExp(reg_yymmdd, "i");
        let extractedWord = '';
        let unixandword = [];
        let extractedItems = [];
        let textContent = '';
        searchTarget.style.display = "none";

        switch (radio) {
            case 'ch-new-to-old':
                itemArray.sort((a, b) => {
                    return (a.unix < b.unix ? 1 : -1);
                });
                break;

            case 'ch-old-to-new':
                itemArray.sort((a, b) => {
                    return (a.unix > b.unix ? 1 : -1);
                });
                break;
            case 'ch-a-to-z':


                if (items.length > 0) {
                    for (i = 0; i < items.length; i++) {
                        searchTarget.innerHTML += items[i].html;
                        textContent = searchTarget.children[i].textContent.toLocaleLowerCase();
                        extractedWord = textContent.replace(reg_yymmdd, '');
                        unixandword.push({ 'unix': items[i].unix, 'extractedWord': extractedWord });

                    }

                    unixandword.sort((a, b) => {
                        return (a.extractedWord > b.extractedWord ? 1 : -1);
                    });
                }
                itemArray = [];
                for (i = 0; i < unixandword.length; i++) {
                    itemArray.push({ 'unix': unixandword[i].unix, 'html': localStorage.getItem(unixandword[i].unix) });
                }

                break;

            case 'ch-z-to-a':
                for (i = 0; i < items.length; i++) {
                    searchTarget.innerHTML += items[i].html;
                    textContent = searchTarget.children[i].textContent.toLocaleLowerCase();
                    extractedWord = textContent.replace(reg_yymmdd, '');
                    unixandword.push({ 'unix': items[i].unix, 'extractedWord': extractedWord });
                }

                unixandword.sort((a, b) => {
                    return (a.extractedWord < b.extractedWord ? 1 : -1);
                });

                itemArray = [];
                for (i = 0; i < unixandword.length; i++) {
                    itemArray.push({ 'unix': unixandword[i].unix, 'html': localStorage.getItem(unixandword[i].unix) });
                }

                break;

            case 'ch-favorite':
                for (let i = 0; i < itemArray.length; i++) {
                    if (/i\sclass="fas\sfa-star\sjs-fa-star\sclicked"\saria-hidden="true"/.test(itemArray[i].html)) {
                        extractedItems.push({ 'unix': itemArray[i].unix, 'html': itemArray[i].html });
                    }
                }

                itemArray = extractedItems;

                break;
        }

        return itemArray;
    },

    //Convert To HTML (not used)
    itemArraytoHTML: function (itemArray) {
        BabyWordList.debug(itemArray);
        let HTML = '';
        itemArray.forEach((itemArray) => {
            HTML += itemArray.html;
        });
        BabyWordList.debug(HTML);

        return HTML;

    },

    //Search by keyword.
    filterWords: function () {
        let searchTarget = document.querySelector('.searchTarget');
        let keyWord = document.querySelector('.js-searchArea').value.toLocaleLowerCase().trim();
        let items = BabyWordList.getDataFromLocalStorage();
        let reg_yymmdd = /\d{4}\/\d{1,2}\/\d{1,2}:/;
        let regExp = new RegExp(reg_yymmdd, "i");
        let extractedWord = '';
        let extractedItems = '';
        let textContent = '';

        searchTarget.style.display = "none";

        if (items.length > 0) {
            for (i = 0; i < items.length; i++) {
                BabyWordList.debug(items.length);
                searchTarget.innerHTML += items[i].html;
                textContent = searchTarget.children[i].textContent.toLocaleLowerCase();
                extractedWord = textContent.replace(reg_yymmdd, '');
                BabyWordList.debug(keyWord);
                BabyWordList.debug(extractedWord);
                if (extractedWord.includes(keyWord)) {
                    BabyWordList.debug(extractedWord.includes(keyWord));
                    extractedItems += searchTarget.children[i].outerHTML;
                    BabyWordList.debug(extractedItems);
                }
            }
        }
        BabyWordList.list.innerHTML = extractedItems;
        document.querySelector('.js-pagenation').style.display = "none";
        BabyWordList.debug(extractedItems);
    },

    //validation
    valid: function (val, msgArea, errMsgArr, num) {

        //If you input nothing
        if (val === '') {
            BabyWordList.errMsg[errMsgArr] = 'Input required';
            msgArea.textContent = BabyWordList.errMsg[errMsgArr];

            //If you input letters more than ${num}
        } else if (val.length > 100) {
            BabyWordList.errMsg[errMsgArr] = `Input under ${num} letters.`;
            msgArea.textContent = BabyWordList.errMsg[errMsgArr];
        } else {
            BabyWordList.errMsg[errMsgArr] = '';
            msgArea.textContent = BabyWordList.errMsg[errMsgArr];
            location.reload();

        }
    },

    //If you press "add" button to save the word and vocaburary
    saveToLocalStorage: function (unix, html) {

        if (html) {
            localStorage.setItem(unix, html);
            return;
        }
        return;
    },

    //If you press star icon
    addFavoriteToLocalStorage: function (node) {

        switch (node.classList.contains('clicked')) {
            case false:
                for (let key in localStorage) {
                    if (localStorage.hasOwnProperty(key)) {
                        let nodeClone = node.parentNode.parentNode.cloneNode(true);
                        nodeClone.firstChild.firstChild.classList.add('clicked');
                        if (localStorage.getItem(key) === nodeClone.outerHTML) {
                            localStorage.setItem(key, node.parentNode.parentNode.outerHTML);
                            return;
                        } else if (localStorage.getItem(key) === node.parentNode.parentNode.outerHTML) {
                            localStorage.setItem(key, nodeClone.outerHTML);
                            return;
                        }
                    }
                }

                break;
            case true:
                for (let key in localStorage) {
                    if (localStorage.hasOwnProperty(key)) {
                        let nodeClone = node.parentNode.parentNode.cloneNode(true);
                        BabyWordList.debug(nodeClone);
                        nodeClone.firstChild.firstChild.classList.remove('clicked');
                        BabyWordList.debug(nodeClone.outerHTML);
                        BabyWordList.debug(localStorage.getItem(key));
                        if (localStorage.getItem(key) === nodeClone.outerHTML) {
                            nodeClone.firstChild.firstChild.classList.add('clicked');
                            BabyWordList.debug(nodeClone);
                            localStorage.setItem(key, nodeClone.outerHTML);
                            return;
                        } else if (localStorage.getItem(key) === node.parentNode.parentNode.outerHTML) {
                            localStorage.setItem(key, nodeClone.outerHTML);
                            return;
                        }
                    }
                }
                break;
        }
        return;
    },

    deleteFromLocalStorage: function (deleteTarget) {
        let itemArray = BabyWordList.getDataFromLocalStorage();
        let deleteTargetKey = BabyWordList.getDataFromLocalStorage();
        let newItemArr = [];
        let deleteKey = '';
        itemArray.forEach((itemArray) => {
            if (deleteTarget.outerHTML !== itemArray.html) {
                newItemArr.push({ 'unix': itemArray.unix, 'html': itemArray.html });
            }
        });

        for (i = 0; i < deleteTargetKey.length; i++) {
            if (deleteTargetKey[i].html === deleteTarget.outerHTML) {
                deleteKey = deleteTargetKey[i].unix;
            }
        }
        localStorage.removeItem(deleteKey);
    },
    clearLocalStorage: function () {
        localStorage.clear();
    },
    //I used this function only once. Maybe not necessary...
    makeArrFromLocalStorage: function () {
        let arr = [];

        let data = BabyWordList.getDataFromLocalStorage();

        //regular expression
        let tag_year = 'span class="js-year"';
        let tag_month = 'span class="js-month"';
        let tag_date = 'span class="js-date"';
        let tag_word = 'span class="js-word"';
        let tag_vocab = 'span class="js-vocab"';

        let reg_year = new RegExp("<" + tag_year + "(?: .+?)?>.*?<\/" + "span" + ">", "g");
        let reg_month = new RegExp("<" + tag_month + "(?: .+?)?>.*?<\/" + "span" + ">", "g");
        let reg_date = new RegExp("<" + tag_date + "(?: .+?)?>.*?<\/" + "span" + ">", "g");
        let reg_word = new RegExp("<" + tag_word + "(?: .+?)?>.*?<\/" + "span" + ">", "g");
        let reg_vocab = new RegExp("<" + tag_vocab + "(?: .+?)?>.*?<\/" + "span" + ">", "g");
        let result = '';

        //make array from html(with tags).
        data.forEach((data) => {
            arr.push({
                'year': data.html.match(reg_year),
                'month': data.html.match(reg_month),
                'date': data.html.match(reg_date),
                'word': data.html.match(reg_word),
                'vocab': data.html.match(reg_vocab),
            });
        });
        BabyWordList.debug(arr);
        //get rid of the tags from HTML codes.
        let itemArray = [];
        for (i = 0; i < arr.length; i++) {
            itemArray.push({
                'year': arr[i].year[0].replace(/<(([a-z]+)\s*([^>]*))>/g, "").replace(/<\/(([a-z]+)\s*([^>]*))>/g, ""),
                'month': arr[i].month[0].replace(/<(([a-z]+)\s*([^>]*))>/g, "").replace(/<\/(([a-z]+)\s*([^>]*))>/g, ""),
                'date': arr[i].date[0].replace(/<(([a-z]+)\s*([^>]*))>/g, "").replace(/<\/(([a-z]+)\s*([^>]*))>/g, ""),
                'word': arr[i].word[0].replace(/<(([a-z]+)\s*([^>]*))>/g, "").replace(/<\/(([a-z]+)\s*([^>]*))>/g, ""),
                'vocab': arr[i].vocab[0].replace(/<(([a-z]+)\s*([^>]*))>/g, "").replace(/<\/(([a-z]+)\s*([^>]*))>/g, ""),
            }
            );
        }
        return itemArray;
    },

    //Display the vocaburaries on the right column
    displayVocab: function () {
        let itemArray = BabyWordList.makeArrFromLocalStorage();
        //extract the vocaburaries
        let vocabArr1 = [];
        itemArray.filter((x, i, self) => {
            if (self.indexOf(x) === i) {
                vocabArr1.push(self[i].vocab);
            }
        });

        //get rid of the same vocaburaries
        let vocabArr2 = [];
        vocabArr1.filter((x, i, self) => {
            if (self.indexOf(x) === i) {
                vocabArr2.push(self[i]);
            }
        });

        return vocabArr2;
    },

    //The number of the item you are selecting on the current page
    getTargetIndex: function (sortedData, index) {
        let targetIndex = '';
        switch (sortedData.length <= BabyWordList.itemsNumPerPage) {
            case true:
                targetIndex = index;
                break;
            case false:
                targetIndex = BabyWordList.itemsNumPerPage * (BabyWordList.currentPageNum - 1) + index;
                break;
        }
        BabyWordList.targetIndex = targetIndex;
        return targetIndex;
    },
    debug: function (str) {
        let debug_flg = false;
        if (debug_flg === true) {
            return BabyWordList.debug(str);
        }
    }
};

BabyWordList.init();
// window.onload = BabyWordList.footerAdjust();


//Create item
BabyWordList.submitBtn.addEventListener('click', e => {
    //        e.preventDefault();
    let word = BabyWordList.addForm.add.value;
    let vocab = BabyWordList.addForm.addVocab.value;

    DD = new Date();
    let year = `${DD.getFullYear()}`;
    let month = `${DD.getMonth() + 1}`;
    let date = `${DD.getDate()}`;

    //Validation
    BabyWordList.valid(BabyWordList.addForm.add.value.trim(), BabyWordList.addErrMsgArea, 'add', 30);
    BabyWordList.valid(BabyWordList.addForm.addVocab.value.trim(), BabyWordList.addVocabErrMsgArea, 'addVocab', 30);

    //Make HTML codes for the main column
    if (BabyWordList.errMsg['add'] === '' && BabyWordList.errMsg['addVocab'] === '') {
        BabyWordList.debug(BabyWordList.errMsg);
        BabyWordList.createItem(word, vocab, year, month, date);

        //Make HTML for the vocaburary column
        while (!BabyWordList.vocabList.innerHTML.match(vocab)) {
            BabyWordList.vocabList.innerHTML += `<li class="vocab-item"><i class="fas fa-check"></i>${vocab}</li>`;
        }
    }
});

//Delete item from the local storage
BabyWordList.list.addEventListener('click', function (e) {
    if (e.target.classList.contains('js-trash')) {
        if (confirm('Are you sure to delete?')) {
            BabyWordList.debug(e.target);
            BabyWordList.debug(e.target.parentNode.parentNode.parentNode);
            let deleteTarget = e.target.parentNode.parentNode.parentNode;
            //
            BabyWordList.deleteFromLocalStorage(deleteTarget);
            deleteTarget.classList.add('fadeout');
            setTimeout(() => { deleteTarget.remove(), window.location.reload(); }
                , 1000);
        }
    }
    //   window.location.reload();
});
//Delete all items from local storage
BabyWordList.clearBtn.addEventListener('click', () => {
    console.log('click');
    BabyWordList.clearLocalStorage();
    location.reload();
});
//Search words by keyword
BabyWordList.searchBox.addEventListener('keyup', (e) => {
    BabyWordList.filterWords();
});

//Cancel the search
BabyWordList.cancelSearch.addEventListener('click', e => {
    BabyWordList.debug('cancelsearch');
    let items = Array.from(BabyWordList.list.children);
    items.forEach(item => {
        item.classList.remove('filtered');
    });
    BabyWordList.searchBox.reset();
});

//Favorite
BabyWordList.list.addEventListener('click', (e) => {
    if (e.target.classList.contains('js-fa-star')) {
        e.target.classList.toggle('clicked');
    } else {
        e.target.classList.childElement.toggle('clicked');
    }
    BabyWordList.addFavoriteToLocalStorage(e.target);
});

//Save the value of radio button
BabyWordList.radioBtn.addEventListener('click', (e) => {
    let sortVal = BabyWordList.radioBtn.sort.value;

    if (('sessionStorage' in window) && (window.sessionStorage !== null)) {
        switch (sortVal === sessionStorage.getItem('sortVal')) {
            case false:
                sessionStorage.removeItem('sortVal');
                sessionStorage.sortVal = sortVal;
                sessionStorage.setItem('sortVal', sortVal);
                break;
            case true:
                break;

        }
    }
});

//Edit(Only vocaburary)
BabyWordList.list.addEventListener('click', (e) => {
    if (e.target.classList.contains('js-change')) {
        BabyWordList.debug('change');
    }
    //Get the unixtime("key"saved in the local storage) of the item you are selecting to edit
    let url = new URLSearchParams(location.search.slice(1));
    let sortVal = url.get('sort') ? url.get('sort') : '';
    let unix = [];
    let data = BabyWordList.getDataFromLocalStorage();
    let sortedData = BabyWordList.sortList(data, sortVal);
    let currentPageNum = BabyWordList.currentPageNum;
    let itemsNumPerPage = BabyWordList.itemsNumPerPage;

    for (i = 0; i < data.length; i++) {
        unix.push(data[i].unix);
    }

    let targetdUnix = '';

    //nth from the item on the top of the page
    let node = '';
    let index = '';
    let lists = Array.from(BabyWordList.list.childNodes);
    let targetIndex = '';
    let targetUnix = '';

    //If you click "Vocab" to edit
    if (e.target.classList.contains('js-vocab') || e.target.classList.contains('js-vocabEditArea')) {

        lists.forEach(li => {
            li.addEventListener('click', e => {
                BabyWordList.indexB = lists.findIndex(list => list === e.target.parentNode.parentNode.parentNode);
            });
        });

        targetIndex = BabyWordList.getTargetIndex(sortedData, BabyWordList.indexB);
        for (i = 0; i < sortedData.length; i++) {
            targetUnix = sortedData[targetIndex].unix;
        }

        BabyWordList.targetUnix = targetUnix;

        //If you click "year"/"month"/"date"/"word" to edit
    } else if (e.target.classList.contains('js-year') || e.target.classList.contains('js-month') ||
        e.target.classList.contains('js-date') || e.target.classList.contains('js-word')) {

        lists.forEach(li => {
            li.addEventListener('click', e => {
                BabyWordList.indexA = lists.findIndex(list => list === e.target.parentNode.parentNode);
            });
        });
        targetIndex = BabyWordList.getTargetIndex(sortedData, BabyWordList.indexA);
        for (i = 0; i < sortedData.length; i++) {
            targetUnix = sortedData[targetIndex].unix;
        }
    } else {
        node = '';
    }
    if (targetUnix !== '') {
        sessionStorage.setItem('targetUnix', targetUnix);
    }

    //EditMode
    BabyWordList.editVocabMode = true;
    let newNodeOuterHTML = '';

    if (BabyWordList.editVocabMode === true && e.target.classList.contains('js-vocab')) {

        e.target.outerHTML = `<input type="text" class="js-vocabEditArea" name="editvocab"
placeholder="" value="${e.target.textContent}"><button type="button" class="js-change">Change</button>`;

        if (BabyWordList.editVocabMode === true && e.target.classList.contains('js-vocabEditArea')) {
            BabyWordList.newVal = { 'newVocab': e.target.value };
        }
    }
});

BabyWordList.list.addEventListener('click', function (e) {

    BabyWordList.editVocabMode === false;
    let newNode = '';
    if (e.target.classList.contains('js-change')) {
        e.target.parentNode.innerHTML = `<span class="js-vocab">${BabyWordList.newVal['newVocab']}</span>`;
        newNode = BabyWordList.list.children[BabyWordList.targetIndex];
        localStorage.setItem(BabyWordList.targetUnix, newNode.outerHTML);
        BabyWordList.newVal['newVocab'] = '';
    }
});


BabyWordList.spVocabMenu.addEventListener('click', function (e) {
    BabyWordList.debug('click');
    BabyWordList.debug(e.target);
    BabyWordList.spVocabMenu.classList.toggle('active');
    BabyWordList.vocabListWrapper.classList.toggle('active');
    BabyWordList.debug(BabyWordList.vocabListWrapper);
}
);
