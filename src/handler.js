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
  }

  books.push({id, name, year, author, summary, publisher, pageCount,
    readPage, finished, reading, insertedAt, updatedAt});

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'Success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh ' +
               'lebih besar dari pageCount',
    });
    response.code(400);
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

  if (name !== undefined) {
    const bookName = books.filter((b) => b.name.includes(name));
    const response = h.response({
      status: 'success',
      data: {
        bookName,
      },
    });
    response.code(200);
    return response;
  } else if (reading === 0 || reading === 1) {
    const isReading = (reading === 0) ? false : true;
    const bookData = books.filter((b) => b.reading.includes(isReading));
    const response = h.response({
      status: 'success',
      data: {
        bookData,
      },
    });
    response.code(200);
    return response;
  } else if (finished === 0 ||finished === 1) {
    const isFinished = (finished === 0) ? false : true;
    const bookData = books.filter((b) => b.finished.includes(isFinished));
    const response = h.response({
      status: 'success finished',
      data: {
        bookData,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      books,
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
      status: 'Success',
      message: 'Buku berhasil diperbaharui',
    });
    response.code(200);
    return response;
  } else if (name === undefined) {
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
