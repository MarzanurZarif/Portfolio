if (typeof LoadPage == 'undefined') {
    document.body.innerHTML = "";
}

window.addEventListener('DOMContentLoaded', () => {

    document.querySelector('meta[property="og:url"]').setAttribute("content", window.location.href);
    document.querySelector('meta[property="twitter:url"]').setAttribute("content", window.location.href);

    let AllProjects = []
    let LangProjects = []
    let Languages = []

    fetch("Projects.json")
        .then(res => res.json())
        .then(data => {
            AllProjects = data;

            AllProjects.forEach((p) => {
                p.languages?.forEach((lang) => {
                    if (!Languages.includes(lang)) {
                        Languages.push(lang);
                    }
                });
            });

            Languages.forEach((lang) => {
                let NewArray = { "Lang": lang, Projects: [] }
                AllProjects.forEach((p) => {
                    if (p.languages.includes(lang) && !NewArray.Projects.includes(p)) {
                        NewArray.Projects.push(p)
                    }
                });
                LangProjects.push(NewArray);
            });
            LangProjects.sort((a, b) => b.Projects.length - a.Projects.length);

            let newDP = "";
            LangProjects.forEach((el) => {
                if (el) {
                    let DPitems = "";
                    el.Projects.forEach((p) => {
                        DPitems += `<a class="dropdown-item" href="./Project.html?id=${p.id}">${p.title}</a>`
                    });
                    newDP += `
                        <div class="dropdown dropend">
                            <a class="dropdown-item dropdown-toggle sub-dropdown-toggle" href="./Projects.html?search=${el.Lang}"
                                id="dropdown-layouts-${el.Lang}" data-bs-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">${el.Lang}</a>
                            <div class="dropdown-menu" aria-labelledby="dropdown-layouts-${el.Lang}">` + DPitems + `</div>
                        </div>
                    `
                    // `
                    // <div class="dropdown dropend">
                    //     <a class="dropdown-item dropdown-toggle sub-dropdown-toggle" href="./Projects.html"
                    //         id="dropdown-layouts" data-bs-toggle="dropdown" aria-haspopup="true"
                    //         aria-expanded="false">Frontend</a>
                    //     <div class="dropdown-menu" aria-labelledby="dropdown-layouts">
                    //         <a class="dropdown-item" href="./Projects.html">Markedup Chat UI</a>
                    //         <a class="dropdown-item" href="./Projects.html">Ecommerce Web UI</a>
                    //         <a class="dropdown-item" href="./Projects.html">Customized Product Display</a>
                    //     </div>
                    // </div>
                    // `
                }
            })

            document.querySelector('[aria-labelledby="ProjectsDropDownMenu"]').innerHTML += newDP;

            (function ($bs) {
                const CLASS_NAME = 'has-child-dropdown-show';
                const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

                $bs.Dropdown.prototype.toggle = function (_orginal) {
                    return function () {
                        document.querySelectorAll('.' + CLASS_NAME).forEach(function (e) {
                            e.classList.remove(CLASS_NAME);
                        });
                        let dd = this._element.closest('.dropdown').parentNode.closest('.dropdown');
                        for (; dd && dd !== document; dd = dd.parentNode.closest('.dropdown')) {
                            dd.classList.add(CLASS_NAME);
                        }
                        return _orginal.call(this);
                    }
                }($bs.Dropdown.prototype.toggle);

                document.querySelectorAll('.dropdown').forEach(function (dd) {
                    dd.addEventListener('hide.bs.dropdown', function (e) {
                        if (this.classList.contains(CLASS_NAME)) {
                            this.classList.remove(CLASS_NAME);
                            e.preventDefault();
                        }
                        e.stopPropagation();
                    });
                });

                document.querySelectorAll('.dropdown-toggle').forEach(function (dd) {
                    dd.addEventListener('click', function (e) {
                        if (dd.getAttribute('href') === '#' || e.target.getAttribute('href') === '#' || dd.classList.contains("show")) {
                            e.preventDefault();
                        } else {
                            const menu = dd.nextElementSibling;
                            if (menu && dd.classList.contains("show")) {
                                menu.style.pointerEvents = 'none';
                                setTimeout(() => { menu.style.pointerEvents = ''; }, 350);
                            } else {
                                window.location.href = e.target.href;
                            }
                        }
                    });
                });

                if (!isTouch) {
                    document.querySelectorAll('.dropdown-hover, .dropdown-hover-all .dropdown').forEach(function (dd) {
                        dd.addEventListener('mouseenter', function (e) {
                            let toggle = e.target.querySelector(':scope>[data-bs-toggle="dropdown"]');
                            if (!toggle.classList.contains('show')) {
                                $bs.Dropdown.getOrCreateInstance(toggle).toggle();
                                dd.classList.add(CLASS_NAME);
                                $bs.Dropdown.clearMenus();
                            }
                        });
                        dd.addEventListener('mouseleave', function (e) {
                            let toggle = e.target.querySelector(':scope>[data-bs-toggle="dropdown"]');
                            if (toggle.classList.contains('show')) {
                                $bs.Dropdown.getOrCreateInstance(toggle).toggle();
                            }
                        });
                    });
                }

            })(bootstrap);
        });

    const menu_btn = document.getElementById("menu-btn");
    const nav_bar = document.getElementById("nav-bar");
    const nav_Intro_Items = document.getElementById("intro-items");
    const nav_Shop_Items = document.getElementById("shop-items");
    const nav_tbtns = document.getElementsByClassName("nav-item-tbtn");

    const search_sec = document.getElementById("search-section");
    const search_btn = document.getElementById("search-btn");

    const overlay_bg = document.getElementById("overlay-bg");

    const dropdown_divs = document.getElementsByClassName("dropdown-main");

    function nav_items_align() {
        var TotalHeight = nav_bar.offsetHeight;
        var NewWidth = 0;
        if (window.innerWidth <= 790) {
            if (nav_Intro_Items.offsetWidth > nav_Shop_Items.offsetWidth) {
                NewWidth = (nav_Intro_Items.offsetWidth).toString() + "px";
            } else {
                NewWidth = (nav_Shop_Items.offsetWidth).toString() + "px";
            }
            nav_Intro_Items.style.width = NewWidth;
            TotalHeight += nav_Intro_Items.offsetHeight;

            nav_Shop_Items.style.width = NewWidth;
            nav_Shop_Items.style.top = TotalHeight.toString() + "px";
            TotalHeight += nav_Shop_Items.offsetHeight;
            nav_Shop_Items.style.height = "100vh"

            Array.prototype.forEach.call(dropdown_divs, function (btn) {
                if (!btn.classList.contains("dropend")) {
                    btn.classList.add("dropend")
                }
            });
        } else if (window.innerWidth > 790) {
            var loopthrough = [nav_Intro_Items, nav_Shop_Items];
            loopthrough.forEach(function (item) {
                if (item.style.width) {
                    item.style.removeProperty('width');
                }
                if (item.style.top) {
                    item.style.removeProperty('top');
                }
                if (item.style.height) {
                    item.style.removeProperty('height');
                }
            });
            Array.prototype.forEach.call(dropdown_divs, function (btn) {
                if (btn.classList.contains("dropend")) {
                    btn.classList.remove("dropend")
                }
            });
        }
        if (window.innerWidth <= 490) {
            if (nav_tbtns) {
                // if (nav_Shop_Items.style.height) {
                //     nav_Shop_Items.style.removeProperty('height');
                // }
                Array.prototype.forEach.call(nav_tbtns, function (tbtn) {
                    tbtn.style.width = NewWidth;
                    tbtn.style.top = TotalHeight.toString() + "px";
                    TotalHeight += tbtn.offsetHeight;
                    if (tbtn == nav_tbtns[nav_tbtns.length - 1]) {
                        tbtn.style.height = "100vh"
                    }
                });
            }
        } else if (window.innerWidth > 490) {
            if (nav_tbtns) {
                Array.prototype.forEach.call(nav_tbtns, function (tbtn) {
                    if (tbtn.style.width) {
                        tbtn.style.removeProperty('width');
                    }
                    if (tbtn.style.top) {
                        tbtn.style.removeProperty('top');
                    }
                    if (tbtn.style.height) {
                        item.style.removeProperty('height');
                    }
                });
            }
        }
    }

    function debounce(func) {
        var timer;
        return function (event) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(func, 100, event);
        };
    }

    function overlay_Toggle(Tog) {
        if (Tog) {
            if (!overlay_bg.classList.contains("active")) {
                overlay_bg.classList.add('active');
            }
        } else {
            if (overlay_bg.classList.contains("active")) {
                overlay_bg.classList.remove('active');
            }
        }
    }

    var menu_State = false;
    var search_State = false;

    function menu_Toggle(Tog) {
        if (Tog) {
            if (!nav_Intro_Items.classList.contains("active")) {
                nav_Intro_Items.classList.add('active');
            }
            if (!nav_Shop_Items.classList.contains("active")) {
                nav_Shop_Items.classList.add('active');
            }
            Array.prototype.forEach.call(nav_tbtns, function (tbtn) {
                if (!tbtn.classList.contains("active")) {
                    tbtn.classList.add('active');
                }
            });
            menu_State = true;
        } else {
            if (nav_Intro_Items.classList.contains("active")) {
                nav_Intro_Items.classList.remove('active');
            }
            if (nav_Shop_Items.classList.contains("active")) {
                nav_Shop_Items.classList.remove('active');
            }
            Array.prototype.forEach.call(nav_tbtns, function (tbtn) {
                if (tbtn.classList.contains("active")) {
                    tbtn.classList.remove('active');
                }
            });
            menu_State = false;
        }
        nav_items_align();
    }

    function search_Toggle(Tog) {
        if (Tog) {
            if (!search_sec.classList.contains("active")) {
                search_sec.classList.add('active');
            }
            search_State = true;
        } else {
            if (search_sec.classList.contains("active")) {
                search_sec.classList.remove('active');
            }
            search_State = false;
        }
        nav_items_align();
    }

    if (nav_Intro_Items && nav_Shop_Items && nav_bar) {
        nav_items_align();
    }

    let reload = true;
    let lwidth = window.innerWidth;

    document.addEventListener("fullscreenchange", function () {
        reload = false;
    });

    window.addEventListener("resize", debounce(function (e) {
        e.preventDefault();
        if (lwidth !== window.innerWidth) {
            if (nav_Intro_Items && nav_Shop_Items && nav_bar) {
                search_Toggle(false);
                menu_Toggle(false);
                overlay_Toggle(false);
                nav_items_align();
            }
            if (document.fullscreenElement === null && reload) {
                location.reload();
            } else if (document.fullscreenElement === null) {
                reload = true;
            }
            lwidth = window.innerWidth;
        }
    }));

    if (search_btn && search_sec) {
        search_btn.addEventListener("click", function (event) {
            if (search_State) {
                search_Toggle(false);
                overlay_Toggle(false);
                menu_Toggle(false);
            } else {
                search_Toggle(true);
                overlay_Toggle(true);
                menu_Toggle(false);
            }
        });
    }

    if (menu_btn && nav_Intro_Items && nav_Shop_Items) {
        menu_btn.addEventListener("click", function (event) {
            if (menu_State) {
                menu_Toggle(false);
                overlay_Toggle(false);
                search_Toggle(false);
            } else {
                menu_Toggle(true);
                overlay_Toggle(true);
                search_Toggle(false);
            }
        });
    }

    if (overlay_bg) {
        overlay_bg.addEventListener("click", function (event) {
            search_Toggle(false);
            menu_Toggle(false);
            overlay_Toggle(false);
        });
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput && !window.location.href.toLowerCase().includes("projects.html")) {
        const params = new URLSearchParams(window.location.search);
        if (params.has('search')) {
            searchInput.value = params.get('search').replace(/"/g, '');
        }
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                searchInput.blur();
                document.getElementById("overlay-bg").click();
                const params = new URLSearchParams();
                if (searchInput.value != "") params.set('search', searchInput.value);
                const newUrl = `./Projects.html?${params.toString()}`;
                window.location.href = newUrl;
            }
        });
        const searchButton = document.getElementById("form-search-btn")
        if (searchButton) {
            searchButton.onclick = function (event) {
                event.preventDefault();
                searchInput.blur();
                document.getElementById("overlay-bg").click();
                const params = new URLSearchParams();
                if (searchInput.value != "") params.set('search', searchInput.value);
                const newUrl = `./Projects.html?${params.toString()}`;
                window.location.href = newUrl;
            }
        }
    }

    document.getElementById('year').textContent = new Date().getFullYear();

});