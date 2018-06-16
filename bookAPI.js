/** BUILDING A BOOK API WITH EXPRESSJS */

//importing the express, body-parser and file-systems(fs) files and assigning it a variable
var app = require('express')();
var bodyParser = require('body-parser');
var fs = require('fs');

//starting the server on port 3000
app.listen(3000, function(){
    console.log('server is listening on port 3000');
});

var lib = new Library('Lib');

//calling bodyParser and making it a middleware(saying it must be used)
app.use(bodyParser.json());

//using my various express methods and callback functions
app.get('/', function(request, response){
    response.send(lib.getBooks());
})

app.post('/api/addBook', function(request, response){
    let body = request.body;
    let book = new Book(body.title, body.author, body.year, Math.random());
    lib.addBook(book);
    response.send(lib.getBooks());
})

app.put('/api/updateBook', function(request, response){
    let id = request.query.id;
    let body = request.body;
    lib.updateBook(id, new Book(body.title, body.author, body.year, id));
    response.send(lib.getBooks());
})

app.get('/api/getBookById', function(request, response){
    let id = request.query.id;
    response.send(lib.getBookById(id));
})

app.delete('/api/deleteBook', function(request, response){
    let id = request.query.id;
    response.send(lib.deleteBook(id));
})

app.get('/api/getBookByParam', function(request, response){
    let param = request.query.value;
    response.send(lib.getBooksByParam(param));
})

app.get('/api/borrowBook', function(request, response){
    let id = request.query.id;
    response.send(lib.borrowBook(id));
})

app.get('/api/returnBook', function(request, response){
    let id = request.query.id;
    response.send(lib.returnBook(id));
})

//creating the Library architecture
function Book(title, author, year, id){
    this.title = title;
    this.author = author;
    this.year = year;
    this.id = id;
}

function Library(name){
    this.name = name;
    this.books = [];
    this.borrowedBooks = [];
}

//creating the library methods using JSON
Library.prototype.getLibrary = function(){
    return JSON.parse(fs.readFileSync('./books.json'));
}

Library.prototype.updateLibrary = function(){
    return fs.writeFileSync('./books.json', JSON.stringify(this.books));
}

//this adds book to the library
Library.prototype.addBook = function(book){
    this.books = this.getBooks();
    this.books.push(book);
    this.updateLibrary();
}

//this gets all the books
Library.prototype.getBooks = function(){
    this.books = this.getLibrary();
    return this.books;
}

//allows user to fetch book using id
Library.prototype.getBookById = function(id){
    this.books = this.getLibrary();
    for (let i = 0; i < this.books.length; i++){
        if(this.books[i].id == id){
            return this.books[i];
            }
    }
    return `Book with id: ${id} not found.`;
}

//gets the index of the book in the books array
Library.prototype.getBookIndex = function(id){
    this.books = this.getLibrary();
    for (let i = 0; i < this.books.length; i++){
        if(this.books[i].id == id){
            return i;
        }
    }
    return `Book with id: ${id} not found.`;
}

//allows user to delete book using id
Library.prototype.deleteBook = function(id){
    let bookIndex = this.getBookIndex(id);
    var message = "You just deleted the book, '" + this.books[bookIndex].title +
                  " by " + this.books[bookIndex].author +"("+this.books[bookIndex].year + ")'."; 
    this.books.splice(bookIndex, 1);
    this.updateLibrary(this.books);
    return message;
}

//allows user to update book using the id
Library.prototype.updateBook = function(id, updatedBook){
    let bookIndex = this.getBookIndex(id);
    this.books[bookIndex] = updatedBook;
    this.updateLibrary(this.books);
}

//allows user to sear by any value and checks if it matches any of the book parameters in the library
Library.prototype.getBooksByParam = function(value){
    this.books = this.getLibrary();
    var books = [];
    for (let i = 0; i < this.books.length; i++){
        if(this.books[i].title == value || this.books[i].author == value ||
            this.books[i].year == value || this.books[i].id == value ){
            books.push(this.books[i]);
        }
    }
    return books;
}

//allows user to borrow book by id
Library.prototype.borrowBook = function(id){
    //to put the book in a borrowedBooks database
    var book =  this.getBookById(id);
    this.borrowedBooks.push(book);
    fs.writeFileSync('./borrowedBooks.json', JSON.stringify(this.borrowedBooks));

    var output = `You just borrowed ${book.title} by ${book.author} (${book.year}).
    Please return on/before the specified date.`
    //to remove the book from the books library
    this.deleteBook(id);
    return output;
}

//allows user to return book borrowed
Library.prototype.returnBook = function(id){
    this.borrowedBooks = JSON.parse(fs.readFileSync('./borrowedBooks.json'));
    for (let i = 0; i < this.borrowedBooks.length; i++){
        if(this.borrowedBooks[i].id == id){
            var book = this.borrowedBooks[i];
            var bookIndex = i;
        }
    }

    //adds book back to the library
    this.addBook(book);

    //removes book from the borrowed books array
    this.borrowedBooks.splice(bookIndex, 1);
    fs.writeFileSync('./borrowedBooks.json', JSON.stringify(this.borrowedBooks));

    var message = `You just returned ${book.title} by ${book.author} (${book.year}).`;
    return message;
}