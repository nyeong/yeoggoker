import tags from "./data/tags.json";
import reviews from "./data/reviews.json";

type ReviewData = {
  tags: string[];
  name: string;
  desc: string;
  x: number;
  y: number;
};

type CategoryData = { name: string; tags: string[] };

const catholicUnivLatLng = new daum.maps.LatLng(37.485936, 126.804632);

function slugalizer(text: string): string {
  return text
    .trim()
    .split(" ")
    .join("_");
}

class Review {
  tags: string[];
  name: string;
  desc: string;
  latLng: daum.maps.LatLng;
  marker: daum.maps.Marker;
  private infoWindow: daum.maps.InfoWindow;
  DOM: HTMLElement;
  app: App;

  constructor(reviewData: ReviewData, app: App) {
    this.tags = reviewData.tags;
    this.name = reviewData.name;
    this.desc = reviewData.desc;
    this.latLng = new daum.maps.LatLng(reviewData.x, reviewData.y);
    this.marker = new daum.maps.Marker({
      map: app.map,
      position: this.latLng,
      clickable: true
    });
    daum.maps.event.addListener(
      this.marker,
      "click",
      this.handleMarkerClick.bind(this)
    );
    this.infoWindow = new daum.maps.InfoWindow({
      map: app.map,
      position: this.latLng,
      removable: true,
      content: this.name
    });
    // infoWindow는 생성시 open되므로 close 해주어야 함.
    this.infoWindow.close();
    this.DOM = this.createDOM();
    this.app = app;
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.DOM);
  }

  openInfoWindow(): void {
    this.infoWindow.open(this.app.map, this.marker);
  }

  closeInfoWindow(): void {
    this.infoWindow.close();
  }

  private handleDOMClick() {
    app.closeAllInfoWindow();
    this.openInfoWindow();
    app.map.panTo(this.latLng);
  }

  private handleMarkerClick() {
    app.closeAllInfoWindow();
    this.openInfoWindow();
    app.map.panTo(this.latLng);
    window.location.hash = slugalizer(this.name);
  }

  private createDOM(): HTMLElement {
    const elem = document.createElement("section");
    elem.classList.add("review");
    elem.innerHTML = `
      <h2 class="review--name" id="${slugalizer(this.name)}">${this.name}</h2>
      <p class="review--desc">
        ${this.desc}
      </p>
      <aside class="review--tags">
        ${this.tags.join(", ")}
      </aisde>
    `;
    elem
      .getElementsByClassName("review--name")[0]
      .addEventListener("click", this.handleDOMClick.bind(this));

    return elem;
  }
}

class App {
  mapContainer: HTMLElement = document.getElementById("map-container")!;
  sidebarContainer: HTMLElement = document.getElementById("sidebar-container")!;
  reviewsContainer: HTMLElement = document.getElementById("reviews-container")!;
  tagsContainer: HTMLElement = document.getElementById("tags-container")!;
  sidebarButton: HTMLElement = document.getElementById(
    "sidebar-toggle-button"
  )!;
  map: daum.maps.Map;
  reviews: Review[] = [];
  tags: CategoryData[] = [];
  selectedTag: string[] = [];

  constructor() {
    this.map = new daum.maps.Map(this.mapContainer, {
      center: catholicUnivLatLng,
      level: 3
    });

    this.sidebarButton.addEventListener(
      "click",
      this.handleSidebarToggle.bind(this)
    );
  }

  handleSidebarToggle() {
    if (document.body.classList.contains("active")) {
      document.body.classList.remove("active");
    } else {
      document.body.classList.add("active");
    }
  }

  setReviewData(reviews: ReviewData[]) {
    reviews.forEach(reviewData => {
      const review = new Review(reviewData, this);
      review.appendTo(this.reviewsContainer);
      this.reviews.push(review);
    });
  }
  setTagData(tags: CategoryData[]) {
    this.tags = tags;

    this.tags.forEach(category => {
      // 카테고리부터 추가합니다.
      const categoryElem = this.createCategoryDOM(category.name);

      category.tags.forEach(tag => {
        categoryElem.appendChild(this.createTagDOM(tag));
      });

      this.tagsContainer.appendChild(categoryElem);
    });
  }

  closeAllInfoWindow() {
    this.reviews.forEach(review => review.closeInfoWindow());
  }

  selectTag(tag: string) {
    this.selectedTag.push(tag);
    this.selectedTagChanged();
  }

  unselectTag(tag: string) {
    this.selectedTag.splice(this.selectedTag.indexOf(tag), 1);
    this.selectedTagChanged();
  }

  private createCategoryDOM(category: string): HTMLElement {
    const categoryElem = document.createElement("section");
    const categoryName = document.createElement("h3");
    categoryName.innerText = category;
    categoryElem.appendChild(categoryName);
    return categoryElem;
  }

  private createTagDOM(tag: string): HTMLElement {
    const tagElem = document.createElement("span");
    tagElem.classList.add("tag");
    tagElem.innerText = tag;
    tagElem.addEventListener("click", this.handleTagClick);
    return tagElem;
  }

  private handleTagClick = function(this: HTMLElement) {
    if (this.classList.contains("active")) {
      this.classList.remove("active");
      app.unselectTag(this.innerText);
    } else {
      this.classList.add("active");
      app.selectTag(this.innerText);
    }
  };

  private selectedTagChanged() {
    this.reviews.forEach(review => {
      if (this.selectedTag.every(t => review.tags.includes(t))) {
        review.DOM.classList.remove("disable");
      } else {
        review.DOM.classList.add("disable");
      }
    });
  }
}

const app = new App();
app.setReviewData(reviews.reviews);
app.setTagData(tags.categories);
