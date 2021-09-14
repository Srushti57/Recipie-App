const mealsEL = document.getElementById("meals");
const favouriteContainer = document.getElementById("fav-meals");
const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");
const mealPopup = document.getElementById("meal-popup");
const popupBtn =document.getElementById("close-popup");
const mealInfoEL = document.getElementById("meal-info-container");


getRandomMeal();
fetchFavMeals();


async function getRandomMeal(){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    const respData = await resp.json();
    console.log(respData);
    const randomMeal= respData.meals[0];

    addMeal(randomMeal, true);
    console.log(randomMeal);
}

async function getMealById(id){
    const resp =await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id);

    const respData = await resp.json();
    const meal = respData.meals[0];

    return meal;

}

async function getMealBySearch(term){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+term);

    const respData = await resp.json();
     const meals = respData.meals;

     return meals;
}

function addMeal(mealData, random = false){
    const meal = document.createElement("div");
    meal.classList.add("meal");

    meal.innerHTML = `
                        <div class="meal-header">
                            ${random ? ` <span class="random">Random Recipie</span> `:''} 
                           <img src="${mealData.strMealThumb}" alt="">
                        </div>
                        <div class="meal-body">
                            <h4>${mealData.strMeal}</h4>
                             <button class="fav-btn"><i class="fas fa-heart"></i></button>
                        </div>`;
    mealsEL.appendChild(meal);

    const btn = meal.querySelector(".meal-body .fav-btn");
    btn.addEventListener("click",()=>{
        if(btn.classList.contains("active")){
            removeMealLS(mealData.idMeal);
            btn.classList.remove("active");
        }
        else{
            addMealLS(mealData.idMeal);
            btn.classList.add("active");
        }

        fetchFavMeals();
    });
    meal.addEventListener("click",()=>{
        showMealInfo(mealData);
    })
    
}

 function addMealLS(mealId){
     const mealIds = getMealLS();
     
     localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
 }

 function removeMealLS(mealId){
    const mealIds = getMealLS();
     
    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id)=> id!==mealId)));
 }
 function getMealLS(){
     const mealIds = JSON.parse(localStorage.getItem('mealIds'));

     return mealIds === null ? []: mealIds;
 }

 async function fetchFavMeals(){
     //clean the container
        favouriteContainer.innerHTML = "";

     const mealIds = getMealLS();

     const meals = [];
     for(let i=0; i<mealIds.length; i++ ){
         const mealId = mealIds[i];
         const meal = await getMealById(mealId);
         meals.push(meal);

     addFavMeal(meal);

     }

 }

 function addFavMeal(mealData){
    const favmeal = document.createElement("li");

    favmeal.innerHTML = `<li>
                        <img src="${mealData.strMealThumb}" alt="">
                        <span>${mealData.strMeal}</span>
                        <button class='clear'><i class="fas fa-window-close"></i><button>
                    </li>`;
    
    const btn1 = favmeal.querySelector(".clear");
    btn1.addEventListener("click",()=>{
        removeMealLS(mealData.idMeal);

        fetchFavMeals();
    });
    favmeal.addEventListener("click",()=>{
        showMealInfo(mealData);
    })
    favouriteContainer.appendChild(favmeal);   
    
}

function showMealInfo(mealData){
    mealInfoEL.innerHTML = "";
    const mealEL = document.createElement("div");

    mealEL.innerHTML = `
                            <h1>${mealData.strMeal}</h1>
                            <img src="${mealData.strMealThumb}" alt="">
                            <p>${mealData.strInstructions}
                            </p>`


    mealInfoEL.appendChild(mealEL);
    mealPopup.classList.remove("hidden");

}


searchBtn.addEventListener("click",async ()=>{
    mealsEL.innerHTML = "";
    const search = searchTerm.value;

    const meals = await getMealBySearch(search);

    if(meals){
    meals.forEach((meal) => {

        addMeal(meal);
    });
    }
});

popupBtn.addEventListener("click",()=>{
    mealPopup.classList.add("hidden");
});