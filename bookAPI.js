var app = require('express')();
var bodyParser = require('body-parser');
app.listen(3000, function(){
    console.log('server is listening on port 3000');
});

var lib = new Library('Lib');
app.use(bodyParser.json());
app.post('/api/addBook', function(request, response){
    let params = request.body;
    let book = new Book(params.name, params.author, params.year, Math.random());
    lib.addBook(book);
    response.send(lib.getBooks());
})


app.get('/', function(request, response){
    response.send(lib.getBooks());
})

var fs = require('fs');

function Book(title, author, year, id){
    this.title = title;
    this.author = author;
    this.year = year;
    this.id = id;
}

function Library(name){
    this.name = name;
    this.books = [];
    // this.books = fs.readFileSync('./books.json', 'utf-8');
    // Object.defineProperty(this, 'books', {
    //     value: [],
    //     enumerable: false,
    //     configurable: true,
    //     writable: true
    // })
}
Library.prototype.getLibrary = function(){
    return JSON.parse(fs.readFileSync('./books.json'));
}

Library.prototype.updateLibrary = function(){
    return fs.writeFileSync('./books.json', JSON.stringify(this.books));
}

Library.prototype.addBook = function(book){
    this.books.push(book);
    this.updateLibrary();
}

Library.prototype.getBooks = function(){
    this.books = this.getLibrary();
    return this.books; 

Library.prototype.getBookById = function(id){
    // var book = this.books.filter(book => book.id == id);
    this.books = this.getLibrary();
    for (let i = 0; i < this.books.length; i++){
        if(this.books[i].id === id){
            return this.books[i];
            }
    }
            return `Book with id: ${id} not found.`;
        }
    }

Library.prototype.getBookIndex = function(id){
    this.books = this.getLibrary();
    for (let i = 0; i < this.books.length; i++){
        if(this.books[i].id === id){
            return i;
            }
    }
            return `Book with id: ${id} not found.`;
        }

Library.prototype.deleteBook = function(id){
    let bookIndex = this.getBookIndex(id);
    var message = "You just deleted the book, '" + this.books[bookIndex].title +
                  " by " + this.books[bookIndex].author +"("+this.books[bookIndex].year + ")'."; 
    this.books.splice(bookIndex, 1);
    this.updateLibrary(this.books);
    return message;
}

Library.prototype.updateBook = function(id, updatedBook){
    let bookIndex = this.getBookIndex(id);
    this.books[bookIndex] = updatedBook;
    this.updateLibrary(this.books);
}

Library.prototype.getBooksByParam = function(param, value){
    this.books = this.getLibrary();
    var books = [];
    for (let i = 0; i < this.books.length; i++){
        if(this.books[i][param] === value){
            books.push(this.books[i]);
        }
    }
    return books;
}

// var book1 = new Book('The Girl', 'Chidera', 2016, 1);
// var book2 = new Book('The Boy', 'Jeni', 2018, 2);
// var book3 = new Book('The Lovers', 'Olibie', 2018, 3);


// console.log(lib.getBooks());
// console.log(lib);
// console.log(lib.getBookById(2));
// console.log(lib.getBookIndex(2));
// console.log(lib.getBooksByParam('year', 2018));
// console.log(lib.deleteBook(1));
// console.log(lib.books);


