const inputBookForm = document.getElementById('inputBook');
const searchBookForm = document.getElementById('searchBook');
const bookSubmitButton = document.getElementById('bookSubmit');
const bookSearchButton = document.getElementById('searchSubmit');

window.addEventListener('load', () => {
  handleLocalStorage(null, 'load');

  inputBookForm.addEventListener('keypress', handleEnterInputs);
  bookSubmitButton.addEventListener('click', (event) => {
    event.preventDefault();

    handleSubmit();
  });

  searchBookForm.addEventListener('keypress', handleEnterSearch);
  bookSearchButton.addEventListener('click', (event) => {
    event.preventDefault();

    handleSearch();
  });
});

const changeSide = (id, parentId) => {
  const parent = document.getElementById(parentId);
  const book = parent.children;

  const dataObj = localStorage.getItem('bookshelf');
  const dataObjParse = JSON.parse(dataObj);

  for (var i = 0; i < book.length; i++) {
    var selectedBook = book[i];
    if (selectedBook.id == id) {
      if (parentId === 'incompleteBookshelfList') {
        const inCompleteFilterd = dataObjParse.incomplete.filter(
          (item) => item.id === id
        );

        handleAddingFinishedBook(inCompleteFilterd[0]);
        handleLocalStorage(inCompleteFilterd[0], 'switch');
      } else {
        const completeFilterd = dataObjParse.complete.filter(
          (item) => item.id === id
        );

        handleAddingIncompleteBook(completeFilterd[0]);
        handleLocalStorage(completeFilterd[0], 'switch');
      }
      parent.removeChild(selectedBook);
      return;
    }
  }
};

const handleEnterInputs = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleSubmit();
  }
};

const handleEnterSearch = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleSearch();
  }
};

const handleLocalStorage = (data = null, condition) => {
  const dataObj = localStorage.getItem('bookshelf');
  const dataObjParse = JSON.parse(dataObj)
    ? JSON.parse(dataObj)
    : {
        incomplete: [],
        complete: [],
      };

  if (condition === 'submit') {
    if (data.isComplete) {
      dataObjParse.complete.push(data);
      handleAddingFinishedBook(data);
    } else {
      dataObjParse.incomplete.push(data);
      handleAddingIncompleteBook(data);
    }

    localStorage.setItem('bookshelf', JSON.stringify(dataObjParse));
  } else if (dataObjParse && condition === 'load') {
    dataObjParse.complete.forEach((data, index) => {
      handleAddingFinishedBook(data);
    });
    dataObjParse.incomplete.forEach((data, index) => {
      handleAddingIncompleteBook(data);
    });
  } else if (condition === 'switch') {
    if (data.isComplete) {
      const replaceCompleteIndex = dataObjParse.complete.findIndex(
        (obj) => obj.id === data.id
      );

      if (replaceCompleteIndex !== -1) {
        dataObjParse.complete.splice(replaceCompleteIndex, 1);
        data.isComplete = false;
        dataObjParse.incomplete.push(data);

        localStorage.setItem('bookshelf', JSON.stringify(dataObjParse));
      }
    } else {
      const replaceInCompleteIndex = dataObjParse.incomplete.findIndex(
        (obj) => obj.id === data.id
      );

      if (replaceInCompleteIndex !== -1) {
        dataObjParse.incomplete.splice(replaceInCompleteIndex, 1);
        data.isComplete = true;
        dataObjParse.complete.push(data);

        localStorage.setItem('bookshelf', JSON.stringify(dataObjParse));
      }
    }
  } else if (dataObjParse && data && condition === 'delete') {
    const id = data;

    const completeFiltered = dataObjParse.complete.filter(
      (item) => item.id !== id
    );
    const inCompleteFiltered = dataObjParse.incomplete.filter(
      (item) => item.id !== id
    );

    const bookshelfObj = {
      incomplete: inCompleteFiltered,
      complete: completeFiltered,
    };
    localStorage.setItem('bookshelf', JSON.stringify(bookshelfObj));
  }
};

const handleSubmit = () => {
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  const bookObject = {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };

  handleLocalStorage(bookObject, 'submit');
  inputBookForm.reset();
};

const handleSearch = () => {
  const incompleteParent = document.getElementById('incompleteBookshelfList');
  const completeParent = document.getElementById('completeBookshelfList');
  const query = document.getElementById('searchBookTitle').value;

  const dataObj = localStorage.getItem('bookshelf');
  const dataObjParse = JSON.parse(dataObj);

  incompleteParent.innerHTML = '';
  completeParent.innerHTML = '';

  const propsFilter = {
    title: query,
    author: query,
  };

  const completeFiltered = dataObjParse.complete.filter(
    (book) =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase())
  );
  const incompleteFiltered = dataObjParse.incomplete.filter(
    (book) =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase())
  );

  completeFiltered.forEach((complete, index) => {
    handleAddingFinishedBook(complete);
  });
  incompleteFiltered.forEach((complete, index) => {
    handleAddingIncompleteBook(complete);
  });
};

const handleDeleteBook = (id) => {
  document.getElementById(id).remove();
  handleLocalStorage(id, 'delete');
};

const handleAddingIncompleteBook = (bookObject) => {
  const containerIncomplete = document.getElementById(
    'incompleteBookshelfList'
  );

  containerIncomplete.innerHTML += `
		<article id="${bookObject.id}" class="book_item">
			<h3>${bookObject.title}</h3>
			<p>Penulis: ${bookObject.author}</p>
			<p>Tahun: ${bookObject.year}</p>

			<div class="action">
				<button class="green" onclick="changeSide(${bookObject.id}, 'incompleteBookshelfList')">Selesai dibaca</button>
				<button class="red" onclick="handleDeleteBook(${bookObject.id})">Hapus buku</button>
			</div>
		</article>
	`;
};

const handleAddingFinishedBook = (bookObject) => {
  const containerComplete = document.getElementById('completeBookshelfList');

  containerComplete.innerHTML += `
		<article id="${bookObject.id}" class="book_item">
			<h3>${bookObject.title}</h3>
			<p>Penulis: ${bookObject.author}</p>
			<p>Tahun: ${bookObject.year}</p>

			<div class="action">
				<button class="green" onclick="changeSide(${bookObject.id}, 'completeBookshelfList')">Belum selesai di Baca</button>
				<button class="red" onclick="handleDeleteBook(${bookObject.id})">Hapus buku</button>
			</div>
		</article>
	`;
};
