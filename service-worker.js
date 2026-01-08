self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("codegenie").then(cache =>
      cache.addAll(["index.html", "style.css", "app.js"])
    )
  );
});
