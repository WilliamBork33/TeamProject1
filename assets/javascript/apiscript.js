//--------------- GLOBAL VARIABLES------------------ //
var userName = "";
var userPassword = "";
var filterArray = ["Vegetables", "CEREAL", " Beef", "Fish", "Chicken", "Eggs", "Tofu", "Seeds", "Legumes/Beans", "Milk", "Cheese"];
var userChoices = [];
var likes =  [];


//--------------- FIREBASE------------------ //
var config = {
    apiKey: "AIzaSyBmJcFcPiRh6XXHCMcGKdYR8QjAgOUYUJQ",
    authDomain: "swappie-bf64e.firebaseapp.com",
    databaseURL: "https://swappie-bf64e.firebaseio.com",
    projectId: "swappie-bf64e",
    storageBucket: "swappie-bf64e.appspot.com",
    messagingSenderId: "695015832855"
  };
firebase.initializeApp(config);



var recipesLikedRef = firebase.database();
/*$("#like_counts").on("click", function () {
    var title = $("#recipe_title").val();
    var image = $("#recipe_imageid").val();
});*/

recipesLikedRef.ref("/recipes_likes").on("child_added", function (childSnapshot, prevChildKey) {
});

buttonsRender();
//--------------- RENDER filterArray BTNS------------------ //
function buttonsRender() {

    for (var i = 0; i < filterArray.length; i++) {
        var filterBtn = $("<button>");
        filterBtn.addClass("filter_render chip");
        // Adding a data-attribute
        filterBtn.attr("data-name", filterArray[i]);
        // Providing the initial button text
        filterBtn.text(filterArray[i]);
        // Adding the button to the buttons-view div
        $("#show_filterbtn").append(filterBtn);
    }
}
//--------------onclick event for filters and text input -----------//
$(".filter_render").on("click", function (event) {
    event.preventDefault();

    if (userChoices.indexOf(event.target.innerText) === -1) {
        userChoices.push(event.target.innerText);
    }



});
function emptygiph(){
    $("#giphy").css('visibility', 'hidden'); 
    $("#giphy").empty();
}
function addLike(tag) {
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=zGLen2Fv096H2KzvAZztfsz7XNVf3Plu&q=cooking&limit=25&offset=0&rating=Y&lang=en";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var results = response.data; 
        
        var giphyCook = $("<img>");
        giphyCook.attr("src", results[Math.floor(Math.random() * 25 )].images.fixed_height.url);
        giphyCook.attr("onclick", "emptygiph()");

        $("#giphy").append(giphyCook);
        $("#giphy").css('visibility', 'visible');

    });



    var newImage = {
        id:tag.id,
        likes: 0
    }

    //aqui se agrega el like basado en el arreglo de los likes pero es basado en la sesion, 
    //falta saber como extraer los likes guardados en firebase buscandolos por id.
    
     for(var i=0; i<likes.length; i++){

            if(likes[i].id==tag.id){
                likes[i].likes=likes[i].likes+1;
                
            }
    
        }
    recipesLikedRef.ref("/recipes_likes").push(likes);
   
  }
//--------------chips -----------//
$('.chips').chips();
//---------------- CLEARS TEXT AND  --------------->


//--------------- API CALL------------------ //  
$(document).on("click", "#searchBtn", function (event) {
    $("#recipesCont").empty();
    var filterChoices = "";
    for (var i = 0; i < userChoices.length; i++) {
        filterChoices += userChoices[i] + ",";
    }

    var chips = $("div.chip");
    for (var i = 0; i < chips.length; i++) {
        filterChoices += chips[i].firstChild.data + ",";
    }
    userChoices = [];

    console.log(filterChoices);

//------------- SPOONACULAR API----------//
    var baseURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients";
    var queryURL = baseURL + "?fillIngredients=false&ingredients=" + filterChoices + "&limitLicense=false&number=6&ranking=1";

    $.ajax({
        type: "GET",
        url: queryURL,
        headers: {
            "X-Mashape-Key": "DZZdpVKLHSmshgD67ScIQcz9BQY3p1mgljSjsnkJyKyQ2YvcV7"
        }
    }).then(function (response) {
        console.log(response);
        var results = response;
        for (var i = 0; i < results.length; i++) {
            var recipeDiv = $("<div>")
            recipeDiv.addClass("recipes col l4 m4 s4");
            var recipeImage = $("<img>");
            var recipeTitle = $("<p>");
            $(recipeTitle).attr("id", "recipe_title");
            recipeImage.addClass("recipe_image");
            recipeImage.attr("src", results[i].image);
            recipeDiv.append(recipeImage);
            recipeTitle.text(results[i].title);
            recipeDiv.append(recipeTitle);
            //like btn--------------//
            var likeBtn = $("<button>");
            likeBtn.text("Like <3");
            likeBtn.addClass("btn btn-info");
            likeBtn.attr("id", results[i].id);
            likeBtn.attr("onclick", "addLike(this)");
            recipeDiv.append(likeBtn);
            //
        
            
            
            $("#recipesCont").append(recipeDiv);

            var newImage  = {
                id:  results[i].id,
                title: results[i].title,
                likes: 0
            }

            likes.push(newImage);
           

        }
        recipesLikedRef.ref("/recipes_likes").push(likes);
       

    });
});


