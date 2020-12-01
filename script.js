/**
 * static Variables
 */
var firstSearch = "sorcerer's stone";

var bookResults=[];
var movieResults=[];

/**
 * static functions
 */

function displayBooksList(){
    var bookResultsDiv =$("#book-results");

    if(bookResults.length ===0){
        console.log("No books found in search");
    }else{
        bookResultsDiv.empty();

        var bookheader = $("<h2 class=`result-title` >Book Results</h2>");

        bookResultsDiv.append(bookheader);

        for(var i=0;i<bookResults.length;i++){

            var bookButton = $(`<button>`);
            bookButton.attr("class","results");
            bookButton.attr("id", `book-${i}`);
            bookButton.text(bookResults[i].title);

            bookResultsDiv.append(bookButton);

        }
       
    }
}

function displayBookData(bookIndex){

     //book title
     var bookTitle = bookResults[bookIndex].title;
     $("#book-title").text(bookTitle);

     // book cover
     var bookIsbn = bookResults[bookIndex].isbn[0];

     var bookCoverURL = "http://covers.openlibrary.org/b/isbn/" + bookIsbn + "-M.jpg";

     $("#book-cover").attr("src", bookCoverURL);

     //book description
     var worksUrl = `https://openlibrary.org${bookResults[bookIndex].key}.json`;

     $.ajax({
         method: "GET",
         url: worksUrl,
     }).then(function (res) {
   
         if(res.description.value===undefined){
            $("#book-plot").text("No Description Available");
         }
         $("#book-plot").text(res.description.value);
     });

     //books rating
     var googleBooksUrl=`https://www.googleapis.com/books/v1/volumes?q=isbn:${bookIsbn}&key=AIzaSyBtYq9z6CgPa4rmGWVSkwwSORdFIuFLc_4`;

     $.ajax({
         method: "GET",
         url: googleBooksUrl
     }).then(function (res) {

        if(res.items[0].volumeInfo.averageRating===undefined){
            $("#google-books-score").text("-");
        }else{
            $("#google-books-score").text(res.items[0].volumeInfo.averageRating*2);
        } 

     });
}

function searchMovie(name) {

    var omdbUrl = "http://www.omdbapi.com/?t=" + name + "&apikey=8e4b0c73";

    $.ajax({
        method: "GET",
        url: omdbUrl

    }).then(function (res) {

        // movie title
        var movieTitle = res.Title;
        $("#movie-title").text(movieTitle);

        // movie poster
        var imgURL = res.Poster;
        var moviePoster = $("#movie-poster").attr("src", imgURL);

        //movie plot
        var moviePlot = res.Plot;
        $("#movie-plot").text(moviePlot);

        //movie rating
        $("#imdb-score").text(res.imdbRating);

    });

}

function searchBook(name, authorName) {

    var openLibraryUrl = "http://openlibrary.org/search.json?";
    var titleMod = name ? "title=" + name : "";
    // ternary operator -     condition ? true branch : false branch
    var authorMod = authorName ? "author=" + authorName : "";
    openLibraryUrl += titleMod;
    openLibraryUrl += authorMod;


    //Directions for search api https://openlibrary.org/dev/docs/api/search

    if (openLibraryUrl === "http://openlibrary.org/search.json?") {
        console.log("error - no parameters");

    } else {
        
           $.ajax({
            method: "GET",
            url: openLibraryUrl

        }).then(function (res) {
            //TEMPorary
            searchMovie(name);
            
            bookResults=[];

            //Temporary location for search results
             for(var i=0; i<5&&i<res.docs.length;i++){
                bookResults.push(res.docs[i]); 
            }
            
            displayBooksList();
            displayBookData(0);
        });

    }

}

/**
 * Event Listeners
 */
$(document).ready(function () {
    $("#book-search-button").on("click", function (event) {
        event.preventDefault();

        var bookTitle = $("#title-input").val();
        var bookAuthor = $("#author-input").val();
        
        searchBook(bookTitle, bookAuthor);
        

        

        localStorage.setItem("search",bookTitle);
    });

    $("#book-results").on("click",function(event){
        event.preventDefault();
    
        var type = event.target.id.split("-")[0];
        var index = event.target.id.split("-")[1];
    
        if(type === "book"){

            displayBookData(index);

        }
    
    });

});


/**
 * main
 */
var firstSearchTemp = localStorage.getItem("search");

if (firstSearchTemp != null) {
    firstSearch = firstSearchTemp;
}

searchBook(firstSearch,"");
searchMovie(firstSearch);

