const modalWrap = document.querySelector(".modal-wrap");
const modal = document.querySelector(".modal");
const modalImg = document.querySelector(".modal img");
const modalTitle = document.querySelector(".modal .title");
const modalAuthor = document.querySelector(".modal .author");
const modalDate = document.querySelector(".modal .date");
const modalDiscount = document.querySelector(".modal .discount");
const modalPrice = document.querySelector(".modal .price");
const modalReview = document.querySelector(".modal .review");
const modalDescription = document.querySelector(".modal .description");
const modalLink = document.querySelector(".modal .link a");
const modalCloseBtn = document.querySelector(".modal-close-btn");
const modalFavBtn = document.querySelector(".modal .fav-btn");
const favBtn = document.querySelector(".fav-btn");
const currentFile = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

const paginationDiv = document.querySelector(".pagination");
const searchFilter = document.querySelector(".search-filter");
const listFilter = document.querySelector(".list-filter");

const params = new URLSearchParams(window.location.search);

const searchInput = document.querySelector("#search-input");
const resultTitleHighlight = document.querySelector(".result-title .highlight-text");
const resultTitleNormal = document.querySelector(".result-title .normal-text");
let pageSize = 10;
let groupSize = 10;
let page = 1;
let totalResults;

searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        if (e.target.value === "") {
            alert("검색어를 입력해주세요");
        } else {
            const queryType = document.querySelector("#search-type").value;
            location.href = `./result.html?query=${e.target.value}&queryType=${queryType}`;
        }
    }
});
let queryParams = params.get("query");
let queryTypeParams = params.get("queryType");

if (queryParams) searchInput.value = queryParams;
const filter = document.querySelector(`[data-type="${queryTypeParams}"]`);

filter ? filter?.classList.add("selected") : document.querySelector('[data-sort="Accuracy"]')?.classList.add("selected");

let favList = JSON.parse(localStorage.getItem("favList")) || [];

const fetchSearch = async (query, queryType = "Title", sort = "Accuracy") => {
    try {
        const params = {
            query: query,
            queryType: queryType,
            sort: sort,
            start: page,
        };
        const baseUrl = `http://localhost:3000/api/search`;
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${baseUrl}?${queryString}`);
        const data = await response.json();
        totalResults = data.totalResults;
        return data.item;
    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
};
const fetchList = async (queryType = "ItemNewAll", maxResults = 10) => {
    try {
        const params = {
            queryType: queryType,
            start: page,
            maxResults: maxResults,
        };
        const baseUrl = `http://localhost:3000/api/list`;
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${baseUrl}?${queryString}`);
        const data = await response.json();
        totalResults = 200;
        return data.item;
    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
};

const openModal = (data) => {
    modalImg.src = data.cover;
    modalTitle.textContent = data.title;
    modalAuthor.textContent = data.author;
    modalDate.textContent = data.publisher + " " + data.pubDate;
    modalPrice.textContent = data.priceSales + "원";
    const discount = data.priceSales === data.priceStandard ? null : Math.floor((1 - data.priceSales / data.priceStandard) * 100) + "%";
    modalDiscount.textContent = discount;

    modalReview.textContent = data.customerReviewRank;
    modalDescription.textContent = data.description;
    modalLink.href = data.link;
    modalWrap.classList.add("active");
    if (favList.some((v) => v.itemId === data.itemId)) {
        modalFavBtn.classList.remove("fav-black");
        modalFavBtn.classList.add("on");
    } else {
        modalFavBtn.classList.remove("on");
        modalFavBtn.classList.add("fav-black");
    }
    modalFavBtn.addEventListener("click", (e) => {
        if (favList.some((v) => v.itemId === data.itemId)) {
            e.target.classList.remove("on");
            localStorage.setItem("favList", JSON.stringify(favList.filter((v) => v.itemId !== data.itemId)));
            favList = JSON.parse(localStorage.getItem("favList"));
        } else {
            e.target.classList.add("on");
            favList.push(data);
            localStorage.setItem("favList", JSON.stringify(favList));
        }
    });
};
const closeModal = () => {
    modalWrap.classList.remove("active");
};

modalCloseBtn.addEventListener("click", closeModal);

modalWrap.addEventListener("click", (e) => {
    console.log(e.target);
    if (!modal.contains(e.target)) closeModal();
});
const createImgDiv = (data) => {
    const div = document.createElement("div");
    const imgWrap = document.createElement("div");
    const img = document.createElement("img");
    const title = document.createElement("span");
    const author = document.createElement("span");

    const overlay = document.createElement("div");
    const overlayBtns = document.createElement("div");
    const overlayFavBtn = document.createElement("button");
    const overlayInfoBtn = document.createElement("button");
    overlay.appendChild(overlayBtns);
    overlayBtns.appendChild(overlayFavBtn);
    overlayBtns.appendChild(overlayInfoBtn);
    overlayBtns.classList.add("overlay-btns");
    overlayFavBtn.classList.add("fav-btn");
    overlayFavBtn.classList.add("fav-white");
    overlayInfoBtn.classList.add("info-btn");
    overlay.classList.add("overlay");
    if (favList.some((v) => v.itemId === data.itemId)) overlayFavBtn.classList.add("on");
    overlay.addEventListener("click", (e) => {
        e.stopPropagation();
    });
    overlayFavBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (favList.some((v) => v.itemId === data.itemId)) {
            e.target.classList.remove("on");
            localStorage.setItem("favList", JSON.stringify(favList.filter((v) => v.itemId !== data.itemId)));
            favList = JSON.parse(localStorage.getItem("favList"));
        } else {
            e.target.classList.add("on");
            favList.push(data);
            localStorage.setItem("favList", JSON.stringify(favList));
        }
    });
    overlayInfoBtn.addEventListener("click", (e) => {
        openModal(data);
    });
    div.addEventListener("click", () => {
        openModal(data);
    });
    div.appendChild(imgWrap);
    div.appendChild(title);
    div.appendChild(author);
    imgWrap.appendChild(img);
    imgWrap.classList.add("img-wrap");
    title.classList.add("title");
    author.classList.add("author");
    img.src = data.cover;
    title.textContent = data.title;
    author.textContent = data.author;
    imgWrap.appendChild(overlay);
    return div;
};

const createSlideLeftBanner = (data) => {
    const swiperSlide = document.createElement("div");
    const imgWrap = document.createElement("div");
    const img = document.createElement("img");
    const textWrap = document.createElement("div");

    imgWrap.classList.add("img-wrap");
    swiperSlide.classList.add("swiper-slide");
    textWrap.classList.add("text-wrap");
    swiperSlide.appendChild(imgWrap);
    imgWrap.appendChild(img);
    swiperSlide.appendChild(textWrap);

    const title = document.createElement("h3");
    const author = document.createElement("span");
    const priceWrap = document.createElement("div");
    const discount = document.createElement("span");
    const price = document.createElement("span");
    const description = document.createElement("span");
    title.classList.add("title");
    author.classList.add("author");
    discount.classList.add("discount");
    price.classList.add("price");
    description.classList.add("description");

    priceWrap.classList.add("price-wrap");
    textWrap.appendChild(title);
    textWrap.appendChild(author);
    textWrap.appendChild(priceWrap);
    textWrap.appendChild(description);
    priceWrap.appendChild(discount);
    priceWrap.appendChild(price);
    img.src = data.cover;
    title.textContent = data.title;
    author.textContent = data.author;
    price.textContent = data.priceSales + "원";
    discount.textContent = data.priceSales === data.priceStandard ? "" : Math.floor((1 - data.priceSales / data.priceStandard) * 100) + "%";
    description.textContent = data.description;

    return swiperSlide;
};
const createSlideRightBanner = (data) => {
    const div = createImgDiv(data);
    div.classList.add("swiper-slide");
    return div;
};
const initIndex = async () => {
    const bestsellerData = await fetchList("Bestseller", 10);
    const itemNewAllData = await fetchList("ItemNewAll", 5);
    const itemNewSpecialData = await fetchList("ItemNewSpecial", 4);
    const blogBestData = await fetchList("BlogBest", 5);
    const leftSwiper = document.querySelector(".slide-left .swiper-wrapper");
    const rightSwiper = document.querySelector(".slide-right .swiper-wrapper");
    const bannerSec2 = document.querySelector(".sec2 .banner");
    const bannerSec3 = document.querySelector(".sec3 .banner");
    const bannerSec4 = document.querySelector(".sec4 .banner");
    const LeftFragment = document.createDocumentFragment();
    const RightFragment = document.createDocumentFragment();
    const bannerSec2Fragment = document.createDocumentFragment();
    const bannerSec3Fragment = document.createDocumentFragment();
    const bannerSec4Fragment = document.createDocumentFragment();

    bestsellerData.forEach((v, i) => {
        LeftFragment.appendChild(createSlideLeftBanner(v));
        RightFragment.appendChild(createSlideRightBanner(v));
    });

    itemNewAllData.forEach((v, i) => {
        if (i < 5) bannerSec2Fragment.appendChild(createImgDiv(v));
    });

    itemNewSpecialData.forEach((v, i) => {
        if (i < 5) bannerSec4Fragment.appendChild(createImgDiv(v));
    });

    blogBestData.forEach((v, i) => {
        if (i < 4) bannerSec3Fragment.appendChild(createImgDiv(v));
    });

    leftSwiper.appendChild(LeftFragment);
    rightSwiper.appendChild(RightFragment);
    bannerSec2.appendChild(bannerSec2Fragment);
    bannerSec3.appendChild(bannerSec3Fragment);
    bannerSec4.appendChild(bannerSec4Fragment);

    var swiperLeft = new Swiper(".swiper-left", {
        spaceBetween: 30,
        effect: "fade",
        loop: true,
        simulateTouch: false,
        navigation: {
            nextEl: ".swiper-button-next ",
            prevEl: ".swiper-button-prev",
        },
    });
    var swiperRight = new Swiper(".swiper-right", {
        slidesPerView: 3,
        initialSlide: 2,
        spaceBetween: 20,
        loop: true,
        centeredSlides: true,
        simulateTouch: false,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
};
const pagination = () => {
    let pageGroup = Math.ceil(page / groupSize);
    let lastPage = Math.min(Math.ceil(totalResults / pageSize), pageGroup * groupSize);
    let firstPage = (pageGroup - 1) * groupSize + 1;
    let totalPage = Math.ceil(totalResults / pageSize);
    let prevGroup = (pageGroup - 2) * groupSize + 1;
    let nextGroup = pageGroup * groupSize + 1;
    createPaginationHTML(firstPage, lastPage, prevGroup, nextGroup, totalPage);
};
const createPaginationHTML = (firstPage, lastPage, prevGroup, nextGroup, totalPage) => {
    const paginationFragment = document.createDocumentFragment();
    const prevBtn = document.createElement("button");
    const nextBtn = document.createElement("button");
    prevBtn.classList.add("prev");
    nextBtn.classList.add("next");
    if (firstPage === 1) {
        prevBtn.disabled = true;
    }
    if (firstPage + groupSize >= totalPage) {
        nextBtn.disabled = true;
    }
    paginationFragment.appendChild(prevBtn);
    for (let i = firstPage; i <= lastPage; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.classList.add("page");
        pageBtn.textContent = i;
        if (i === page) {
            pageBtn.classList.add("current");
        }
        paginationFragment.appendChild(pageBtn);
    }
    if (lastPage !== totalPage) {
        const ellipsisDiv = document.createElement("div");
        ellipsisDiv.classList.add("ellipsis");
        paginationFragment.appendChild(ellipsisDiv);
        const pageBtn = document.createElement("button");
        pageBtn.classList.add("page");
        pageBtn.textContent = totalPage;
        paginationFragment.appendChild(pageBtn);
    }
    paginationFragment.appendChild(nextBtn);
    paginationDiv.textContent = "";
    paginationDiv.appendChild(paginationFragment);
    prevBtn.addEventListener("click", () => {
        page = prevGroup;
        pagination();
        updateResult(queryTypeParams);
    });
    nextBtn.addEventListener("click", () => {
        page = nextGroup;
        pagination();
        updateResult(queryTypeParams);
    });
    paginationDiv.addEventListener("click", (e) => {
        if (e.target.classList.contains("page") && !e.target.classList.contains("current")) {
            page = parseInt(e.target.textContent);
            document.querySelector(".current").classList.remove("current");
            e.target.classList.add("current");
            updateResult(queryTypeParams);
        }
    });
};

const getResultData = async (queryType) => {
    let data;
    if (queryType === "fav") {
        searchFilter.classList.add("active");
        listFilter.classList.remove("active");
        const sort = document.querySelector(".search-filter .selected").dataset.sort;
        if (sort === "Accuracy") {
            data = [...favList];
        } else if (sort === "SalesPoint") {
            data = [...favList].sort((a, b) => b.salesPoint - a.salesPoint);
        } else if (sort === "PublishTime") {
            data = [...favList].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        } else if (sort === "Title") {
            data = [...favList].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sort === "CustomerRating") {
            data = [...favList].sort((a, b) => b.customerReviewRank - a.customerReviewRank);
        }
        totalResults = favList.length;
        resultTitleHighlight.textContent = "좋아요";
        resultTitleNormal.textContent = `${totalResults}개 도서`;
    } else if (["ItemNewAll", "ItemNewSpecial", "Bestseller", "BlogBest"].indexOf(queryType) === -1) {
        searchFilter.classList.add("active");
        listFilter.classList.remove("active");
        const sort = document.querySelector(".search-filter .selected").dataset.sort;
        data = await fetchSearch(queryParams, queryType, sort);
        resultTitleHighlight.textContent = `'${queryParams}'`;
        resultTitleNormal.textContent = `에 대한 ${totalResults}개의 검색 결과`;
    } else {
        searchFilter.classList.remove("active");
        listFilter.classList.add("active");
        data = await fetchList(queryType);
        resultTitleHighlight.textContent = { ItemNewAll: "신간 전체", ItemNewSpecial: "주목할 만한 신간", Bestseller: "베스트셀러", BlogBest: "블로거 베스트셀러" }[queryType];
        resultTitleNormal.textContent = `${totalResults}개 도서`;
    }
    return data;
};
const updateResult = async (queryType) => {
    const data = await getResultData(queryType);

    const resultContent = document.querySelector(".result .content");
    const resultFragment = document.createDocumentFragment();

    data.forEach((v, i) => {
        if (i < 10) resultFragment.appendChild(createImgDiv(v));
    });
    resultContent.textContent = "";
    resultContent.appendChild(resultFragment);
};

const handleFilter = (e) => {
    if (e.target.dataset.sort !== undefined || e.target.dataset.type !== undefined) {
        document.querySelector(".selected").classList.remove("selected");
        e.target.classList.add("selected");
        queryTypeParams = e.target.dataset.type ? e.target.dataset.type : queryTypeParams || null;
        updateResult(queryTypeParams);
        console.log(queryTypeParams);
        queryTypeParams ? history.pushState(null, "", `${location.pathname}?queryType=${queryTypeParams}`) : history.pushState(null, "", `${location.pathname}${location.search}`);
    }
};
const initResult = async () => {
    searchFilter.addEventListener("click", handleFilter);
    listFilter.addEventListener("click", handleFilter);

    await updateResult(queryTypeParams);

    pagination();
};

if (currentFile === "result.html") {
    initResult();
} else if (currentFile === "index.html") {
    initIndex();
}
