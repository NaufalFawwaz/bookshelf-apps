const bShelf = [];
const RENDER_E = 'render-bShelf';

function genId() {
    return +new Date();
}

function genBookObj(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    }
}

function addBk() {
    const genIdBk = genId();
    const bTitle = document.getElementById('inputBookTitle').value;
    const bAuthor = document.getElementById('inputBookAuthor').value;
    const bYear = parseInt(document.getElementById('inputBookYear').value);
    const isChecked = document.getElementById('inputBookIsComplete').checked;
    const bObj = genBookObj(genIdBk, bTitle, bAuthor, bYear, isChecked);
    bShelf.push(bObj);

    document.dispatchEvent(new Event(RENDER_E));
    saveData();
}

function findBk(bId) {
    for (const bk of bShelf) {
        if (bk.id == bId) {
            return bk;
        }
    }
    return bk
}

function findBkIndex(bId) {
    for (const index in bShelf) {
        if (bShelf[index].id === bId) {
            return index;
        }
    }
    return -1;
}

function addBkToComplete(bId) {
    const targetBk = findBk(bId);

    if (targetBk == null) return;

    targetBk.isComplete = true;
    document.dispatchEvent(new Event(RENDER_E));
    saveData();
    Swal.fire({
        title: 'Buku ' + targetBk.title + ' berhasil dipindahkan ke tempat selesai dibaca',
        icon: "success",
        customClass: 'swal-wide',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    });
}

function returnBkToUnfinished(bId) {
    const targetBk = findBk(bId);

    if (targetBk == null) return;

    targetBk.isComplete = false;
    document.dispatchEvent(new Event(RENDER_E));
    saveData();
    Swal.fire({
        title: 'Buku ' + targetBk.title + ' berhasil dikembalikan ke tempat belum dibaca',
        icon: "success",
        customClass: 'swal-wide',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    });
}

function removeBk(bId) {
    const targetBk = findBkIndex(bId)
    const bk = findBk(bId);

    if (targetBk === -1) return;

    bShelf.splice(targetBk, 1);
    Swal.fire({
        title: "Buku " + bk.title + " berhasil dihapus",
        icon: "success",
        customClass: 'swal-wide',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    });
    document.dispatchEvent(new Event(RENDER_E));
    saveData();
}

function createBkShelf(bObj) {
    const bTitle = document.createElement('h3');
    bTitle.innerText = bObj.title;

    const bAuthor = document.createElement('p');
    bAuthor.innerText = 'Penulis: ' + bObj.author;

    const bYear = document.createElement('p');
    bYear.innerText = 'Tahun: ' + bObj.year;

    const rmBkButton = document.createElement('button');
    rmBkButton.classList.add('red');
    rmBkButton.innerText = 'Hapus buku'

    rmBkButton.addEventListener('click', function () {
        removeBk(bObj.id);
    });

    const dataCont = document.createElement('div');

    const actionB = document.createElement('div');
    actionB.classList.add('action');

    const itemCont = document.createElement('article')
    itemCont.classList.add('book_item');
    itemCont.setAttribute('id', `book-name-${bObj.title}`);
    dataCont.append(bTitle, bAuthor, bYear);
    itemCont.append(dataCont, actionB);

    if (!bObj.isComplete) {
        const finButton = document.createElement('button');
        finButton.classList.add('green');
        finButton.innerText = 'Selesai dibaca';

        finButton.addEventListener('click', function () {
            addBkToComplete(bObj.id);
        });

        actionB.append(finButton, rmBkButton);
    } else {
        const unfButton = document.createElement('button');
        unfButton.classList.add('green');
        unfButton.innerText = 'Belum selesai di Baca';

        unfButton.addEventListener('click', function () {
            returnBkToUnfinished(bObj.id);
        });

        actionB.append(unfButton, rmBkButton);
    }

    return itemCont;
}

function searchBk(bTitle) {
    const findTitle = document.querySelectorAll('.book_item > div > h3')
    for (let item of findTitle) {
        const title = item.innerText.toUpperCase();
        if (title.includes(bTitle)) {
            item.closest(".book_item").style.display = 'flex';
        } else {
            item.closest(".book_item").style.display = 'none';
        }
    }
}

const STORAGE_K = 'BS_DATA';
const SAVED_E = 'saved-bShelf';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(bShelf);
        localStorage.setItem(STORAGE_K, parsed);
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_K);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const bk of data) {
            bk.year = parseInt(bk.year);
            bShelf.push(bk);
        }
    }

    document.dispatchEvent(new Event(RENDER_E));
}

function checkDuplicateBk() {
    const allBkTitle = document.querySelectorAll('.book_item > div > h3');
    const bTitleValue = document.getElementById('inputBookTitle').value.toUpperCase();
    for (let item of allBkTitle) {
        const title = item.innerText.toUpperCase();
        if (bTitleValue == title) {
            return true;
        }
    }
}

function showAlert(textAlert) {
    alert(textAlert);
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    const searchForm = document.getElementById('searchBook')

    if (isStorageExist()) {
        loadDataFromStorage();
    }

    submitForm.addEventListener('submit', function (event) {
        if (checkDuplicateBk()) {
            Swal.fire({
                title: "Buku ini sudah ditambahkan",
                icon: "error",
                customClass: 'swal-wide',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            });
        } else {
            addBk();
            Swal.fire({
                title: "Buku berhasil ditambahkan",
                icon: "success",
                customClass: 'swal-wide',
                customClass: 'swal-wide',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            });
        }

        event.preventDefault();

        const bTitleInput = document.getElementById('inputBookTitle');
        const bAuthorInput = document.getElementById('inputBookAuthor');
        const bYearInput = document.getElementById('inputBookYear');

        bTitleInput.value = '';
        bAuthorInput.value = '';
        bYearInput.value = '';
    });

    searchForm.addEventListener('submit', function (event) {
        const searchValue = document.getElementById('searchBookTitle').value.toUpperCase();
        event.preventDefault();
        searchBk(searchValue);
    });
});

const submitButtonText = document.querySelector('#bookSubmit > span');
const checkbox = document.getElementById('inputBookIsComplete');

checkbox.addEventListener('change', function () {
    if (this.checked) {
        submitButtonText.innerText = 'Selesai dibaca'
    } else {
        submitButtonText.innerText = 'Belum selesai dibaca'
    }
});

document.addEventListener(RENDER_E, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const item of bShelf) {
        const todoElement = createBkShelf(item);
        if (!item.isComplete) {
            incompleteBookshelfList.append(todoElement);
        } else {
            completeBookshelfList.append(todoElement);
        }
    }
});
