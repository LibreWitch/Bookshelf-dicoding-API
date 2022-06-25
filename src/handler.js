// menggunakan versi 3.0.0, yang versi terbaru tidak bisa menggunakan require
const {nanoid} = require('nanoid');
const books = require('./books');


const addBookHandler = (request, h) => {
  const {name, year, author, summary,
    publisher, pageCount, readPage, reading} = request.payload;

  const id = nanoid(16);
  const finished = (pageCount === readPage) ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // tampilkan error jika tidak memasukkan nama buku
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  // tampilkan error jika readPage lebih dari pageCount
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh ' +
               'lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push({id, name, year, author, summary, publisher, pageCount,
    readPage, finished, reading, insertedAt, updatedAt});

  const issuccess = books.filter((book) => book.id === id).length > 0;

  if (issuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};


const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;
  // untuk menyimpan data sementara
  const bookData = [];


  if (name !== undefined) {
    const bookName = books.filter((b) => b.name.includes(name));

    // data diloop untuk mendapatkan data tertentu
    bookName.forEach((book, i) => {
      bookData.push({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      });
    });

    const response = h.response({
      status: 'success',
      data: {
        books: bookData,
      },
    });
    response.code(200);
    return response;
  } else if (reading !== undefined) {
    const isReading = (reading == '0') ? false : true;
    const bookReading = books.filter((b) => b.reading === isReading);

    // data diloop untuk mendapatkan data tertentu
    bookReading.forEach((book, i) => {
      bookData.push({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      });
    });

    const response = h.response({
      status: 'success',
      data: {
        books: bookData,
      },
    });
    response.code(200);
    return response;
  } else if (finished !== undefined) {
    const isFinished = (finished == '0') ? false : true;
    const bookFinished = books.filter((b) => b.finished === isFinished);

    // data diloop untuk mendapatkan data tertentu
    bookFinished.forEach((book, i) => {
      bookData.push({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      });
    });

    const response = h.response({
      status: 'success',
      data: {
        books: bookData,
      },
    });
    response.code(200);
    return response;
  }

  // data diloop untuk mendapatkan data tertentu
  books.forEach((book, i) => {
    bookData.push({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    });
  });

  const response = h.response({
    status: 'success',
    data: {
      books: bookData,
    },
  });
  response.code(200);
  return response;
};


const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const bookData = books.filter((b) => b.id === bookId)[0];

  if (bookData !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book: bookData,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};


const editBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const {name, year, author, summary,
    publisher, pageCount, readPage, reading} = request.payload;

  const updatedAt = new Date().toISOString();

  const bIndex = books.findIndex((b) => b.id === bookId);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar ' +
               'dari pageCount',
    });
    response.code(400);
    return response;
  }


  if (bIndex !== -1) {
    books[bIndex] = {
      ...books[bIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};


const deleteBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const bIndex = books.findIndex((b) => b.id === bookId);

  if (bIndex !== -1) {
    books.splice(bIndex, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};


module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler};
