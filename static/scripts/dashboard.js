// pole vsech dostupnych coinu
let available_coins = ["BTC", "DOGE", "ETH"]

// aktivni mena
var active_currency = "CZK";

// pole vsech investicnich divu
var all_investitions = document.getElementsByClassName('investition');

// pole vsech option butonu
var option_btns = document.getElementsByClassName("options");

// barvy
let green = "#3DD572";
let red = "#D53D3D";
let gray = "#fefefe";

// -- EVENTS --

// po nacteni okna (zajistujeme nacteni vsech elementu), 
window.addEventListener("load", () => {
    update_all();
});

// kazdemu elementu z pole elementu investitions pridame event listener
// nahrazeni praveho kliku vlastnim menu
for (var i = 0; i < all_investitions.length; i++) {
    all_investitions[i].addEventListener('contextmenu', function (e) {
        e.preventDefault();
        show_menu(e.clientX, e.clientY);
    });
}

// kazdemu elementu z pole elementu investitions pridame event listener 
for (var i = 0; i < option_btns.length; i++) {
    option_btns[i].addEventListener('click', function (e) {
        show_menu(e.target.x - 210, e.target.y);
    });
}

// pokud klikneme mimo option btn, right-click menu se zavre
document.addEventListener('click', function (e) {
    // pokud nema tridu options
    if (!e.target.closest('.options')) {
        hide_menu();
    }
});

// funkce, ktera veme kazdy coin z pole a udela pronej get_coin_value()
function update_all() {
    available_coins.forEach(coin => {
        get_coin_value(coin, active_currency)
    });
};

function get_coin_value(coin, currency) {
    // pokud neni mena definovana, nastavime CZK
    if (currency === undefined) {
        currency = "CZK";
    };

    // odkaz na verejnou api
    let api_url = `https://api.coinbase.com/v2/exchange-rates?currency=${coin}`;

    // inicializace reqeustu pomoci knihovny XMLHttpRequest
    var request = new XMLHttpRequest();

    // event handler
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            // parsujeme JSON odpoved
            var result = JSON.parse(this.responseText);
            var value = result["data"]["rates"][`${currency}`];
            
            // pomoci funkce update_interface
            update_interface(coin, value);
            
        };
    };

    // otevreni requestu a poslani
    request.open("GET", api_url, true);
    request.send();
};

function update_interface(coin_type, coin_value) {
    // ziskani elementu, ktery zobrazuje celkovou hodnotu coinu
    /*var coin_el = document.getElementById(`${currency_type.toLowerCase()}_value`);
    
    coin_el.textContent = currency_value;*/
    // ziskani vsech elementu tridy investition

    update_time();

    var investitions = document.querySelectorAll(`.investition[data-currency="${coin_type}"]`);

    // premena elementu do pole, abychom ho mohli prochazet
    var investitionsArray = Array.from(investitions);

    investitionsArray.forEach(investition => {
        // ziskame vlastnene mnozstvi z datasetu
        const amountOwned = parseFloat(investition.dataset.amount);

        // ziskame velikost investice z datasetu
        const amountInvested = parseFloat(investition.dataset.investition);

        // vypocitame momentalni hodnotu z hodnoty coinu a vlastnenym mnozstvim
        const current_value = coin_value * amountOwned;

        // vypocitame ztratu/zisk odectenim investovanou castkou od momentalni hodnoty investice
        const profit_loss = current_value - amountInvested;
        
        // vybereme current_value element z investition, jelikoz je tam jen jeden, vybereme 0. node
        var current_val_el = investition.getElementsByClassName("current_value")[0];
        var profit_loss_el = investition.getElementsByClassName("profit_loss")[0];

        // deklarace promenne, ktera bude mit emoji
        var profit_emoji = "";

        // pokud jsme v profitu, nastavime zelenou
        if (profit_loss > 0) {
            profit_loss_el.style.color = green;
            profit_emoji = "📈";
        }
        // pokud jsme v deficitu, nastavime cervenou
        else if (profit_loss < 0) {
            profit_loss_el.style.color = red;
            profit_emoji = "📉";
        }
        // pokud 0, nastavime na sedou
        else {
            profit_loss_el.style.color = gray;
        }

        // zmenime elementy jak celkove hodnoty tak zisku/ztraty
        current_val_el.textContent = `${format_number(current_value)} ${active_currency}`;
        profit_loss_el.textContent =  `${format_number(profit_loss)} ${active_currency} ${profit_emoji}`;
    });
}

function update_time() {
    // ziskame momentalni cas a ulozime ho do stringu    
    var current_date = new Date();

    // ziskame aktualni hodiny, minuty a sekundy
    var hours = current_date.getHours();
    var minutes = current_date.getMinutes();
    var seconds = current_date.getSeconds();

    // přidáme nulu před minutám, pokud jsou méně než 10
    var formattedHours = hours < 10 ? '0' + hours : hours;
    var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    var formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    // vytvoříme string s aktuálním časem
    var last_update_time = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    // získáme element buttonu, který má uvnitř text a čas poslední aktualizace
    var update_btn = document.getElementById("update");
    update_btn.textContent = `Aktualizovat data (${last_update_time})`;
}

function format_number(number) {
    // zkontrolujeme, zda je ciselo integer
    if (Number.isInteger(number)) {
        return number // pokud ano, vracime jako takove
    } else {
        return number.toFixed(2); // pokud ne, zaokrouhlime na dve desetinna cisla
    }
}

// funkce pro zobrazeni alternativniho prave kliku
function show_menu(x, y) {
    var right_click_menu = document.getElementById('right-click-menu');
    right_click_menu.style.left = x + 'px';
    right_click_menu.style.top = y + 'px';
    right_click_menu.style.display = 'block';
}

// funkce pro skrytí custom menu
function hide_menu() {
    var right_click_menu = document.getElementById('right-click-menu');
    right_click_menu.style.display = 'none';
}