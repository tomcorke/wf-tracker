import express from "express";

const app = express();

app.use(async (req, res) => {
  const urlFromPath = req.path.substring(1); // Remove leading '/'

  const blacklist = ["favicon.ico"];
  if (blacklist.includes(urlFromPath)) {
    res.status(404).send("Not found");
    return;
  }

  console.log(urlFromPath);

  const url = new URL(urlFromPath);
  for (const [key, value] of Object.entries(req.query)) {
    url.searchParams.set(key, value as string);
  }

  console.log(url.href);

  const response = await fetch(url.href, {
    method: req.method,
    headers: {
      ...(req.headers as any),
      host: url.host,
    },
  });
  console.log(response.status);
  res.status(response.status);

  // set cors header to allow all origins
  res.setHeader("Access-Control-Allow-Origin", "*");

  const text = await response.text();

  // try parsing as json and return as json if it is valid
  if (response.headers.get("content-type")?.includes("application/json")) {
    try {
      const json = JSON.parse(text);
      res.json(json);
      return;
    } catch (e) {
      // not json
    }
  }

  res.send(text);
});

app.listen(8080, () => {
  console.log("CORS proxy server running on http://localhost:8080");
});
