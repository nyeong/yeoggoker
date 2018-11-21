let sidebar, map, contents;
let mapContainer = document.getElementById("map");
let contentsContainer = document.getElementById("contents");

//
// Sidebar
//
function Sidebar(tagList) {
  this.container = document.getElementById("sidebar");
  this.tagsContainer = document.getElementById("tags");

  for (tag in tagList) {
    let tagHeader = document.createElement("h3");
    tagHeader.innerText = tag;
    this.tagsContainer.appendChild(tagHeader);
    tags[tag]
      .map(t => {
        let e = document.createElement("span");
        e.classList.add("tag-item");
        e.innerText = t;
        e.addEventListener("click", function() {
          sidebar.select(this);
        });
        return e;
      })
      .forEach(t => this.tagsContainer.appendChild(t));
  }
}

Sidebar.prototype.open = () => document.body.classList.add("active");
Sidebar.prototype.close = () => document.body.classList.remove("active");
Sidebar.prototype.toggle = () =>
  document.body.classList.contains("active") ? sidebar.close() : sidebar.open();
Sidebar.prototype.selected = [];
Sidebar.prototype.resetSelected = function() {
  this.selected.forEach(node => node.classList.remove("selected"));
  this.selected = [];
};
Sidebar.prototype.select = function(node) {
  let tag = node.innerText;
  if (node.classList.contains("selected")) {
    this.selected.splice(this.selected.findIndex(x => x === tag), 1);
    node.classList.remove("selected");
  } else {
    this.selected.push(node);
    node.classList.add("selected");
  }
  updateResults({ tags: this.selected.map(node => node.innerText) });
};

sidebar = new Sidebar(tags);

document
  .getElementById("menu-button")
  .addEventListener("click", () => sidebar.toggle());

//
// Map
//
map = new daum.maps.Map(mapContainer, {
  center: new daum.maps.LatLng(37.485936, 126.804632),
  level: 3
});

function Content(data, index) {
  this.index = index;
  this.name = data.name;
  this.desc = data.desc;
  this.tags = data.tags;
  this.latLng = new daum.maps.LatLng(data.x, data.y);
  this.marker = new daum.maps.Marker({
    position: this.latLng,
    clickable: true
  });
  daum.maps.event.addListener(
    this.marker,
    "click",
    this.handleNameClick.bind(this)
  );
  this.infoWindow = new daum.maps.InfoWindow({
    content: this.name,
    removable: true
  });
  this.marker.setMap(map);
}

Content.prototype.handleNameClick = function(e) {
  mapContainer.scrollIntoView({
    behavior: "smooth"
  });
  sidebar.close();
  contents.forEach(c => c.infoWindow.close());
  this.infoWindow.open(map, this.marker);
  map.panTo(this.latLng);
};

Content.prototype.createElement = function() {
  let content = document.createElement("li");
  let contentName = document.createElement("h2");
  let contentDesc = document.createElement("p");
  let contentTags = document.createElement("p");
  content.classList.add("content");
  contentName.classList.add("content-name");
  contentName.innerText = this.name;
  contentName.addEventListener("click", this.handleNameClick.bind(this));
  contentDesc.classList.add("content-desc");
  contentDesc.innerText = this.desc;
  contentTags.classList.add("content-tags");
  contentTags.innerText = this.tags.map(t => "#" + t).join(" ");
  content.appendChild(contentName);
  content.appendChild(contentDesc);
  content.appendChild(contentTags);
  return content;
};

//
// App
//
function clearResults() {
  if (contents)
    contents.forEach(c => {
      c.marker.setMap(null);
      c.infoWindow.close();
    });
  contentsContainer.innerHTML = "";
}

function updateResults(options = { tags: [] }) {
  clearResults();

  if (options.tags.length !== 0)
    contents = data.contents.filter(c =>
      options.tags.every(t => c.tags.includes(t))
    );
  else contents = data.contents;
  console.log(contents);

  contents = contents.map(d => new Content(d));

  contents.forEach(c => contentsContainer.appendChild(c.createElement()));
}

//
// Main
//
updateResults();
