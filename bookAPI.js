function Book(title, author, year, id){
    this.title = title;
    this.author = author;
    this.year = year;
    this.id = id;
}

function Library(name){
    this.name = name;
    this.books = [];
}

Library.prototype.addBook = function(book){
    this.books.push(book);
}

Library.prototype.getBooks = function(){
    return this.books; //this function is redundant since we can just do lib.books
}

Library.prototype.getBookById = function(id){
    // var book = this.books.filter(book => book.id == id);
    for (let i = 0; i < this.books.length; i++){
        if(this.books[i].id === id){
            return this.books[i];
            }
        else {
            return `Book with id: ${id} not found.`;
        }
    }
}

Library.prototype.getBookIndex = function(id){
    for (let i = 0; i < this.books.length; i++){
        if(this.books[i].id === id){
            return i;
            }
        else {
            return `Book with id: ${id} not found.`;
        }
    }
}  

Library.prototype.deleteBook = function(id){
    let bookIndex = this.getBookIndex(id);
    this.books.splice(bookIndex, 1);
}

Library.prototype.updateBook = function(id, updatedBook){
    let currentBook = this.getBookById(id);
    this.books = this.books.map(book => book.id === id ? updatedBook : book);
}

Library.prototype.getBooksByParam = function(param, value){
    var books = [];
    for (let i = 0; i < this.books.length; i++){
        if(this.books[i][param] === value){
            books.push(this.books[i]);
        }
    }
    return books;
}

var book1 = new Book('The Girl', 'Chidera', 2016, 1);
var book2 = new Book('The Boy', 'Jeni', 2018, 2);
var book3 = new Book('The Lovers', 'Olibie', 2018, 3);

var lib = new Library('Lib');

lib.addBook(book1);
lib.addBook(book2);
lib.addBook(book3);

// console.log(lib.getBooks());
// console.log(lib.books);
// console.log(lib.getBookById(4));
// console.log(lib.getBookIndex(3));
console.log(lib.getBooksByParam('year', 2018));


