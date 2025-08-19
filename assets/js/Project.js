function loadProject() {
    return {
        project: null,
        notFound: false,
        init() {
            const params = new URLSearchParams(window.location.search);
            const id = params.get("id");
            fetch("Projects.json")
                .then(res => res.json())
                .then(data => {
                    if (id) {
                        this.project = data.find(p => p.id == id);
                        if (this.project) {
                            document.title = `Marzanur Zarif | ${this.project.title}`;
                            document.querySelector('meta[name="title"]').setAttribute("content", `Marzanur Zarif | ${this.project.title}`);
                            document.querySelector('meta[name="description"]').setAttribute("content", this.project.description);
                            document.querySelector('meta[property="og:title"]').setAttribute("content", `Marzanur Zarif | ${this.project.title}`);
                            document.querySelector('meta[property="twitter:title"]').setAttribute("content", `Marzanur Zarif | ${this.project.title}`);
                            document.querySelector('meta[property="og:description"]').setAttribute("content", this.project.description);
                            document.querySelector('meta[property="twitter:description"]').setAttribute("content", `Marzanur Zarif | ${this.project.title}`);
                            if (this.project.thumbnail) {
                                document.querySelector('meta[property="og:image"]').setAttribute("content", this.project.thumbnail);
                                document.querySelector('meta[property="twitter:image"]').setAttribute("content", this.project.thumbnail);
                            } else if (this.project.images?.length) {
                                document.querySelector('meta[property="og:image"]').setAttribute("content", this.project.images[0]);
                                document.querySelector('meta[property="twitter:image"]').setAttribute("content", this.project.images[0]);
                            }

                            let UIFix = setInterval(() => {
                                const DisplayCont = document.querySelector(".Display-Cont");
                                const ProjectCard = document.querySelector(".project-card");
                                if (DisplayCont && ProjectCard && DisplayCont.offsetWidth > 0) {
                                    ProjectCard.style.width = DisplayCont.offsetWidth + "px";
                                }
                                const GalleryCont = document.querySelector(".Gallery-Cont");
                                if (DisplayCont && GalleryCont && DisplayCont.offsetWidth > 0) {
                                    GalleryCont.style.width = DisplayCont.offsetWidth + "px";
                                }
                                if (ProjectCard.style.width == GalleryCont.style.width) {
                                    clearInterval(UIFix);
                                }
                            }, 100);

                            const imageSwiperWrapper = document.getElementById("imageSwiperWrapper");
                            const gallerySwiperWrapper = document.getElementById("gallerySwiperWrapper");
                            let displays = 0;

                            if (imageSwiperWrapper && gallerySwiperWrapper) {
                                imageSwiperWrapper.innerHTML = "";
                                gallerySwiperWrapper.innerHTML = "";
                                if (this.project.thumbnail) {
                                    imageSwiperWrapper.innerHTML += `
                                        <div data-hash="img0" class="swiper-slide">
                                            <img src="${this.project.thumbnail}" id="Iimg0">
                                            <i class="fa-solid fa-spinner fa-spin dis-load" data-Loader="Iimg0"></i>
                                        </div>
                                    `
                                    gallerySwiperWrapper.innerHTML += `
                                        <div class="swiper-slide">
                                            <img src="${this.project.thumbnail}">
                                            <div class="dis-over">
                                                <i class="fa-solid fa-spinner fa-spin dis-load" data-Loader="Iimg0"></i>
                                            </div>
                                        </div>
                                    `
                                    displays++;
                                }
                                if (this.project.videos?.length) {
                                    this.project.videos.forEach((vid, index) => {
                                        imageSwiperWrapper.innerHTML += `
                                            <div data-hash="video${index + 1}" class="swiper-slide">
                                                <video controls controlsList="nodownload" muted id="Ivid${index + 1}">
                                                    <source src="${vid}" type="video/mp4">
                                                </video>
                                                <i class="fa-solid fa-spinner fa-spin dis-load" data-Loader="Ivid${index + 1}"></i>
                                            </div>
                                        `
                                        gallerySwiperWrapper.innerHTML += `
                                            <div class="swiper-slide">
                                                <video muted>
                                                    <source src="${vid}" type="video/mp4">
                                                </video>
                                                <div class="dis-over">
                                                    <i class="fa-solid fa-circle-play dis-play"></i>
                                                    <i class="fa-solid fa-spinner fa-spin dis-load" data-Loader="Ivid${index + 1}"></i>
                                                </div>
                                            </div>
                                        `
                                        displays++;
                                    });
                                }
                                if (this.project.images?.length) {
                                    this.project.images.forEach((img, index) => {
                                        imageSwiperWrapper.innerHTML += `
                                            <div data-hash="img${index + 1}" class="swiper-slide">
                                                <img src="${img}" id="Iimg${index + 1}">
                                                <i class="fa-solid fa-spinner fa-spin dis-load" data-Loader="Iimg${index + 1}"></i>
                                            </div>
                                        `
                                        gallerySwiperWrapper.innerHTML += `
                                            <div class="swiper-slide">
                                                <img src="${img}">
                                                <div class="dis-over">
                                                    <i class="fa-solid fa-spinner fa-spin dis-load" data-Loader="Iimg${index + 1}"></i>
                                                </div>
                                            </div>
                                        `
                                        displays++;
                                    });
                                }
                                if (displays > 0) {
                                    var Galleryswiper = new Swiper(".gallerySwiper", {
                                        slidesPerView: "auto",
                                        watchSlidesProgress: true,
                                    });
                                    var imageSwiper = new Swiper(".imageSwiper", {
                                        loop: true,
                                        hashNavigation: {
                                            watchState: true,
                                            replaceState: true
                                        },
                                        navigation: {
                                            nextEl: ".swiper-button-next",
                                            prevEl: ".swiper-button-prev",
                                        },
                                        thumbs: {
                                            swiper: Galleryswiper,
                                        },
                                        on: {
                                            init: function () {
                                                const activeVideo = this.slides[this.activeIndex].querySelector('video');
                                                if (activeVideo) activeVideo.play().catch(() => { });
                                            },
                                            slideChange() {
                                                const slide = this.slides[this.activeIndex];
                                                const hash = slide?.dataset?.hash;
                                                if (!hash) return;
                                                history.replaceState(null, '', location.pathname + location.search + '#' + hash);
                                                window.dispatchEvent(new HashChangeEvent('hashchange'));

                                                this.slides.forEach((slide, idx) => {
                                                    const video = slide.querySelector('video');
                                                    if (!video) return;
                                                    if (idx === this.activeIndex) {
                                                        video.muted = true;
                                                        video.play().catch(() => { });
                                                    } else {
                                                        video.pause();
                                                        video.currentTime = 0;
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }

                            if (displays <= 0) {
                                imageSwiperWrapper.innerHTML += `
                                    <div data-hash="img0" class="swiper-slide">
                                        <img src="./assets/images/No.png">
                                    </div>
                                `
                            } else {
                                const fullscreenImageSwiperWrapper = document.getElementById("fullscreenImageSwiperWrapper");
                                const fullscreenGallerySwiperWrapper = document.getElementById("fullscreenGallerySwiperWrapper");

                                if (fullscreenImageSwiperWrapper && fullscreenGallerySwiperWrapper) {
                                    fullscreenImageSwiperWrapper.innerHTML = "";
                                    fullscreenGallerySwiperWrapper.innerHTML = "";
                                    if (this.project.thumbnail) {
                                        fullscreenImageSwiperWrapper.innerHTML += `
                                        <div data-hash="img0" class="swiper-slide">
                                            <div class="swiper-zoom-container">
                                                <img src="${this.project.thumbnail}" id="fimg0">
                                                <i class="fa-solid fa-spinner fa-spin dis-load" data-Loader="fimg0"></i>
                                            </div>
                                        </div>
                                    `
                                        fullscreenGallerySwiperWrapper.innerHTML += `
                                        <div class="swiper-slide">
                                            <img src="${this.project.thumbnail}">
                                            <div class="dis-over">
                                                <i class="fa-solid fa-spinner fa-spin dis-load" data-Loader="fimg0"></i>
                                            </div>
                                        </div>
                                    `
                                    }
                                    if (this.project.videos?.length) {
                                        this.project.videos.forEach((vid, index) => {
                                            fullscreenImageSwiperWrapper.innerHTML += `
                                            <div data-hash="video${index + 1}" class="swiper-slide">
                                                <video controls controlsList="nodownload" muted id="fvid${index + 1}">
                                                    <source src="${vid}" type="video/mp4">
                                                </video>
                                                <i class="fa-solid fa-spinner fa-spin dis-load" data-Loader="fvid${index + 1}"></i>
                                            </div>
                                        `
                                            fullscreenGallerySwiperWrapper.innerHTML += `
                                            <div class="swiper-slide">
                                                <video muted>
                                                    <source src="${vid}" type="video/mp4">
                                                </video>
                                                <div class="dis-over">
                                                    <i class="fa-solid fa-circle-play dis-play"></i>
                                                    <i class="fa-solid fa-spinner fa-spin dis-load" data-Loader="fvid${index + 1}"></i>
                                                </div>
                                            </div>
                                        `
                                        });
                                    }
                                    if (this.project.images?.length) {
                                        this.project.images.forEach((img, index) => {
                                            fullscreenImageSwiperWrapper.innerHTML += `
                                            <div data-hash="img${index + 1}" class="swiper-slide">
                                                <div class="swiper-zoom-container">
                                                    <img src="${img}" id="fimg${index + 1}">
                                                    <i class="fa-solid fa-spinner fa-spin dis-load" data-Loader="fimg${index + 1}"></i>
                                                </div>
                                            </div>
                                        `
                                            fullscreenGallerySwiperWrapper.innerHTML += `
                                            <div class="swiper-slide">
                                                <img src="${img}">
                                                <div class="dis-over">
                                                    <i class="fa-solid fa-spinner fa-spin dis-load" data-Loader="fimg${index + 1}"></i>
                                                </div>
                                            </div>
                                        `
                                        });
                                    }
                                    const fullscreenSwiper = new Swiper('.fullscreenImageSwiper', {
                                        zoom: true,
                                        loop: true,
                                        hashNavigation: {
                                            watchState: true,
                                            replaceState: true
                                        },
                                        navigation: {
                                            nextEl: '.fullscreen-swiper .swiper-button-next',
                                            prevEl: '.fullscreen-swiper .swiper-button-prev',
                                        },
                                        thumbs: {
                                            swiper: new Swiper('.fullscreenGallerySwiper', {
                                                slidesPerView: "auto",
                                                spaceBetween: 5,
                                                watchSlidesProgress: true,
                                            })
                                        },
                                        on: {
                                            slideChange() {
                                                const slide = this.slides[this.activeIndex];
                                                const hash = slide?.dataset?.hash;
                                                if (!hash) return;
                                                history.replaceState(null, '', location.pathname + location.search + '#' + hash);
                                                window.dispatchEvent(new HashChangeEvent('hashchange'));

                                                this.slides.forEach((slide, idx) => {
                                                    const video = slide.querySelector('video');
                                                    if (!video) return;
                                                    if (idx === this.activeIndex) {
                                                        video.muted = true;
                                                        video.play().catch(() => { });
                                                    } else {
                                                        video.pause();
                                                        video.currentTime = 0;
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    const openBtn = document.querySelectorAll('.Display-Cont img');
                                    const fullscreenContainer = document.querySelector('.fullscreen-swiper');
                                    const closeBtn = document.querySelector('.fullscreen-close');
                                    const smolimg = document.querySelector('.fullscreen-swiper .fullscreenGallerySwiper .swiper-slide');
                                    const img = document.querySelector('.fullscreen-swiper .fullscreenImageSwiper img');
                                    const content = document.querySelector('.fullscreen-swiper-content');

                                    openBtn.forEach(sd => {
                                        sd.addEventListener('click', () => {
                                            var docElm = document.documentElement;
                                            if (docElm.requestFullscreen) {
                                                docElm.requestFullscreen();
                                            } else if (docElm.mozRequestFullScreen) {
                                                docElm.mozRequestFullScreen();
                                            } else if (docElm.webkitRequestFullScreen) {
                                                docElm.webkitRequestFullScreen();
                                            } else if (docElm.msRequestFullscreen) {
                                                docElm.msRequestFullscreen();
                                            }
                                            fullscreenContainer.classList.remove('hidden');
                                            fullscreenSwiper.update();
                                            content.style.maxWidth = img.offsetWidth + "px";
                                            content.style.maxHeight = (img.offsetHeight + (smolimg.offsetHeight) + 15) + "px";
                                        });
                                    });

                                    closeBtn.addEventListener('click', () => {
                                        // imageSwiper.slideTo(fullscreenSwiper.activeIndex);
                                        fullscreenContainer.classList.add('hidden');
                                        if (document.exitFullscreen) {
                                            document.exitFullscreen();
                                        } else if (document.webkitExitFullscreen) {
                                            document.webkitExitFullscreen();
                                        } else if (document.mozCancelFullScreen) {
                                            document.mozCancelFullScreen();
                                        } else if (document.msExitFullscreen) {
                                            document.msExitFullscreen();
                                        }
                                    });
                                }
                                const displays = document.querySelectorAll(".swiper video, .swiper img");
                                displays.forEach((display) => {
                                    if (display) {
                                        let VidLoad;
                                        if (display.tagName === "VIDEO") {
                                            VidLoad = setInterval(() => {
                                                if (display.readyState >= 2) {
                                                    const loading = document.querySelectorAll(`[data-Loader="${display.id}"]`);
                                                    if (loading?.length) {
                                                        loading.forEach((el) => {
                                                            el.style.display = "none";
                                                        })
                                                    }
                                                    clearInterval(VidLoad);
                                                }
                                            }, 500);
                                        } else {
                                            display.onload = function () {
                                                if (!display.src.includes("No")) {
                                                    const loading = document.querySelectorAll(`[data-Loader="${display.id}"]`);
                                                    if (loading?.length) {
                                                        loading.forEach((el) => {
                                                            el.style.display = "none";
                                                        })
                                                    }
                                                }
                                            };
                                        }
                                        display.addEventListener('error', function (event) {
                                            if (VidLoad && typeof VidLoad !== undefined) {
                                                clearInterval(VidLoad);
                                            } else {
                                                display.src = "./assets/images/No.png";
                                            }
                                            const loading = document.querySelectorAll(`[data-Loader="${display.id}"]`);
                                            if (loading?.length) {
                                                loading.forEach((el) => {
                                                    el.classList.replace("fa-spinner", "fa-triangle-exclamation");
                                                    el.classList.remove("fa-spin")
                                                })
                                            }
                                        }, true);
                                    }
                                });
                            }
                        } else {
                            this.notFound = true;
                            document.title = "Marzanur Zarif | Project Not Found";
                        }
                    } else {
                        this.notFound = true;
                    }
                });
        }
    }
}