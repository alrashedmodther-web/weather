let serch=document.getElementById("sersh");
let but=document.getElementById("sub");
let sit=document.getElementById("sit");
let slid= document.querySelector(".slider-sitting");
let sitt=document.getElementById("def");
let bdefualt=document.querySelector(".btn");
let save=window.localStorage.getItem("city")||"omdurman";
let li=document.querySelectorAll(".nav li");

import { key } from "./config.js";

   li.forEach(item => {
       item.addEventListener("click", () => {
           li.forEach(x => x.classList.remove("active"));
           item.classList.add("active");
       });
   });
let currentlang={};

async function loadlang(lang) {
    try{

        const response= await fetch(`${lang}.json`);
        currentlang=await response.json();
        
        ready();

        let htmltag=document.documentElement;

        htmltag.setAttribute('dir',lang==='ar'?'rtl':'ltr');
        htmltag.setAttribute('lang',lang);

        localStorage.setItem("prfer",lang);
    } catch(error){
        console.log("فشل في تحميل اللغة",error);
    }
    
};
document.getElementById("language").addEventListener("change", async (e) => {
    await loadlang(e.target.value);
    getwether(localStorage.getItem("city") || "omdurman");
});

function ready(){
    let ele=document.querySelectorAll("[data-i18n]");
    ele.forEach(el =>{
        let key=el.getAttribute("data-i18n");

        if(currentlang[key]){
            el.innerText=currentlang[key];
        }
    });
}


bdefualt.onclick=function(){
    getwether(sitt.value);
}

sit.onclick=function(){
    slid.classList.toggle("slids");
};


window.onload=async function (){
    const lang = localStorage.getItem("prfer") || "en";
    document.getElementById("language").value = lang;
    await loadlang(lang);
    getwether(save);
};

but.onclick= function (){
    getwether(serch.value);
}
 async function getwether(cityname){
        window.localStorage.setItem("city",cityname);
    try{
        if(cityname){
            let langs=localStorage.getItem("prfer") ||"ar";
         
            const resp=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&lon={lon}&appid=${key}&units=metric&lang=${langs}`);
            const data =await resp.json();
                console.log(data);
                //home part
                let temp=`${Math.floor(data.main.temp)} ْC`;
                console.log(temp);
                let contry=data.sys.country;
                let timezoe=data.timezone;
                let utctime=data.dt*1000;
                let localtime=new Date(utctime+timezoe*1000);
                const hours=localtime.getUTCHours();
                const minutes=localtime.getUTCMinutes();
                const monthname=localtime.toLocaleDateString(langs==='ar'?'ar':'en',{month:'long'});
                const dayname=localtime.toLocaleDateString(langs==='ar'?'ar':'en',{weekday:'long'});
                const year=localtime.getUTCFullYear();
                const dmonth=localtime.getUTCDate();
                const Alltime=`${dayname},${dmonth} ${monthname} ${year}`;
                const timespan=`${hours}:${minutes}`;
                let clearsk=data.weather[0].description;
                document.getElementById("h3").innerText=`${cityname}`;
                document.getElementById("pragrph").innerText=`${contry}`;
                document.getElementById("tem").innerText=`${temp}`;
                document.getElementById("date").innerText=`${Alltime}`;
                document.getElementById("timezone").innerText=`${timespan}`;
                document.getElementById("sk").innerText=`${clearsk}`;
                //details
                
                if(langs==="en"){
                    let hum=data.main.humidity;
                    document.getElementById("humid").innerText=`${hum}%`;
                    let wind=`${Math.floor(data.wind.speed * 3.6)}`;
                    document.getElementById("speed").innerText=`${wind}km/h`;
                    let pressure=data.main.pressure;
                    document.getElementById("pres").innerText=`${pressure} hpa`;
                    let visibility=data.visibility;
                    document.getElementById("visi").innerText=`${visibility/1000} km`;
                    let feel=data.main.feels_like;
                    document.getElementById("feel").innerText=`${Math.floor(feel)} ْC`;
                }else{
                    let hum=data.main.humidity;
                    document.getElementById("humid").innerText=`${hum}%`;
                    let wind=`${Math.floor(data.wind.speed * 3.6)}`;
                    document.getElementById("speed").innerText=`${wind}كم/س`;
                    let pressure=data.main.pressure;
                    document.getElementById("pres").innerText=`${pressure} هكتوباسكال`;
                    let visibility=data.visibility;
                    document.getElementById("visi").innerText=`${visibility/1000} كم`;
                    let feel=data.main.feels_like;
                    document.getElementById("feel").innerText=`${Math.floor(feel)} ْم`;

                }
            

            //5day
            let dal=document.querySelector(".day .days");
            const repo=await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&units=metric&lang=${langs}&appid=${key}`);

            const days=await repo.json();
                let con=document.querySelector(".days");
                con.innerHTML="";
                let daly=days.list;
                let dalyfor= daly.filter(item => {
                    return item.dt_txt.includes("12:00:00");
                });
                dalyfor.forEach(day => {
                    const datobj=new Date(day.dt_txt);
                    const opytion={ weekday:'short',month:'short',day:'numeric'};
                    
                    const fordate=datobj.toLocaleDateString(langs==="ar"?'ar-US':'en-US',opytion);
                    const teda=Math.round(day.main.temp);
                    const decr=day.weather[0].description;
                    
                    let iconcode=day.weather[0].icon;
                    let icon=`https://openweathermap.org/img/wn/${iconcode}@2x.png`;
                    let card=document.createElement("div");
                    card.className="sta"
                    card.innerHTML=`<p>${fordate}</p>
                    <img src="${icon}" alt="weather icon" width="60px" height="60px id="ico">
                    <span class="dat" >${teda}ْC</span>
                    <span class="stat">${decr}</span>
                    `;
                    dal.appendChild(card);
                    serch.value=cityname;

            });
    
        }else{
            console.log("cat be embty");
        }
    } catch(error){
        console.log(error);
    }
};
            
