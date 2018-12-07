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

class Review {
  tags: string[];
  name: string;
  desc: string;
  latLng: daum.maps.LatLng;
  marker: daum.maps.Marker;
  infoWindow: daum.maps.InfoWindow;
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
    this.infoWindow = new daum.maps.InfoWindow({
      map: app.map,
      position: this.latLng,
      removable: true,
      content: this.name
    });
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

  private createDOM(): HTMLElement {
    const elem = document.createElement("section");
    elem.classList.add("review");
    elem.innerHTML = `
      <h2 class="review--name">
        ${this.name}
      </h3>
      <p class="review--desc">
        ${this.desc}
      </p>
      <aside class="review--tags">
        ${this.tags.join(", ")}
      </aisde>
    `;
    elem
      .getElementsByClassName("review--name")[0]
      .addEventListener("click", this.handleReviewDOMClick.bind(this));

    return elem;
  }

  private handleReviewDOMClick(): void {}
}

class App {
  mapContainer: HTMLElement = document.getElementById("map-container")!;
  reviewsContainer: HTMLElement = document.getElementById("reviews-container")!;
  tagsContainer: HTMLElement = document.getElementById("tags-container")!;
  map: daum.maps.Map;
  reviews: Review[] = [];
  tags: CategoryData[] = [];

  constructor() {
    this.map = new daum.maps.Map(this.mapContainer, {
      center: catholicUnivLatLng,
      level: 3
    });
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
    return tagElem;
  }
}

const app = new App();
app.setReviewData(reviews.reviews);
app.setTagData(tags.categories);
