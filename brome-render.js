
// When document has loaded, initialise
document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        initBottomTabMenu()
        initWindowControls();

        // Variables
        var colorButton = $(".tab");

        colorButton.on("click", function () {

            // Remove class from currently active button
            $(".tab").removeClass("active-tab");

            // Add class active to clicked button
            $(this).addClass("active-tab");

            // Get background color of clicked
            //var newColor = $(this).attr("data-color");

            // Change background of everything with class .bg-color
            //$(".bg-color").css("background-color", newColor);

            // Change color of everything with class .text-color
            //$(".text-color").css("color", newColor);
        });
    }
};

function initBottomTabMenu() {
    const body = document.body;
    const tabs = body.querySelector("tabs")
    const tabSelectors = menu.querySelectorAll("tab-select");
    let activeItem = menu.querySelector(".active");

    function clickItem(item, index) {

        if (activeItem == item) return;
        if (activeItem) {
            activeItem.classList.remove("active");
        }

        item.classList.add("active");
        // Make content element visible
        for (let i = 0; i < tabs.childElementCount; i++) {
            const element = tabs.childNodes[i];
            if(i == index) element.style.visibility = "visible"
            else element.style.visibility = "hidden"
        }
        activeItem = item;
    }

    tabSelectors.forEach((item, index) => {
        item.addEventListener("click", () => clickItem(item, index));
    })
}


function initWindowControls() {
    // Make minimise/maximise/restore/close buttons work when they are clicked
    document.getElementById('min-button').addEventListener("click", event => {
        window.electron.winMinimize()
    });

    document.getElementById('max-button').addEventListener("click", event => {
        window.electron.winMaximize()
        document.body.classList.add('maximized');
    });

    document.getElementById('restore-button').addEventListener("click", event => {
        window.electron.winUnMaximize()
        document.body.classList.remove('maximized');
    });

    document.getElementById('close-button').addEventListener("click", event => {
        window.electron.winClose()
    });


    // CHILD-WIN
    var searchSpan = $(".form-group>span")
    searchSpan.on("click", () => {
        let winIndex = 0;
        if (searchUrl != null) {
            winIndex = window.electron.childWinOpen(searchUrl) // Requires url
            searchUrl = null
        }
        else {
            winIndex = window.electron.childWinOpen(window.electron.searchEngineURL) // Requires url
        }
        let tabs = document.getElementsByClassName("tabs")[0]
        let div = document.createElement("div")
        let icon = document.createElement("img")
        div.className = "tab"
        div.id = winIndex
        icon.height = "10px"
        if (searchUrl.endsWith("/"))
            icon.src = searchUrl + "favicon.ico"
        else
            icon.src = searchUrl + "/favicon.ico"
        div.appendChild(icon)
        tabs.appendChild(div)
        $(".tab").removeClass("active-tab");
        $(div).addClass("active-tab");
        $(div).on("click", () => {
            window.electron.childWinClose(winIndex) // Requires index of child window in list
        })
    })
}

function showSearchHintOverlay(searchInputText) {
    let overlay = document.getElementsByClassName("leaderboard__profiles")[0]
    overlay.style.visibility = "visible"
    overlay.replaceChildren()
    // TODO: for each 
    // get favicon, name/url
    overlay.insertAdjacentHTML('beforeend', `<article class="leaderboard__profile">
      <img src="https://randomuser.me/api/portraits/men/37.jpg" alt="Evan Spiegel" class="leaderboard__picture">
      <span class="leaderboard__name">Evan Spiegel</span>
      <span class="leaderboard__value">2.1<span>B</span></span>
    </article>`);
}