const inputBookForm = document.getElementById('inputBook');
const bookSubmitButton = document.getElementById('bookSubmit');

const handleDeleteBook = (id) => {
  document.getElementById(id).remove();
};

const handleEnterInputs = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleAddingBook();
  }
};

const handleAddingBook = () => {
  var title = document.getElementById('inputBookTitle').value;
  var author = document.getElementById('inputBookAuthor').value;
  var year = document.getElementById('inputBookYear').value;
  var isComplete = document.getElementById('inputBookIsComplete').checked;

  var containerIncomplete = document.getElementById('incompleteBookshelfList');

  const bookObject = {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };

  containerIncomplete.innerHTML += `
		<article id="${bookObject.id}" class="book_item">
			<h3>${title}</h3>
			<p>Penulis: ${author}</p>
			<p>Tahun: ${year}</p>

			<div class="action">
				<button class="green">Selesai dibaca</button>
				<button class="red" onclick="handleDeleteBook(${bookObject.id})">Hapus buku</button>
			</div>
		</article>
	`;

  inputBookForm.reset();
};

inputBookForm.addEventListener('keypress', handleEnterInputs);
bookSubmitButton.addEventListener('click', (event) => {
  event.preventDefault();

  handleAddingBook();
});
