<br/>
<p align="center">
  <img height="150" src="./public/seraph-router.png"/>
</p>

<h1 align="center">
  <span>Seraph Router</span>
</h1>

Hassle-free routing, in an instant. 

- Easy to setup, with a simple API
- Type-safe routes and parameters
- Uses familiar syntax and conventions, with a focus on developer experience
- Small bundle size, less than 5kb gzipped

## Getting started

### Install

```sh
npm install @d-exclaimation/seraph-router
# or
pnpm add @d-exclaimation/seraph-router
# or
yarn add @d-exclaimation/seraph-router
```

### Use a CDN

```html
<script type="module">
  import { html, component } from "https://cdn.skypack.dev/@d-exclaimation/seraph";
  import { routing, route } from "https://cdn.skypack.dev/@d-exclaimation/seraph-router";

  const router = routing.browser();

  const { $outlet } = router.provider([
    route("/", () => html.div({ c: "Hello World!" }))),
    route("/hello/:name", ({ params }) => html.div({ c: `Hello ${params.name}` }))),
  ])

  const App = component(() => 
    html.div({
      c: [
        html.nav({
          c: [
            router.link({
              href: "/",
              c: "Home"
            }),
            router.link({
              href: "/hello/World",
              c: "Hello World"
            })
          ]
        }),
        html.div({
          c: $outlet
        })
      ]
    })
  );

  App.render({}, document.getElementById("app"));
</script>
```

## Resources

- [Docs](https://seraph.dexclaimation.com)

## Feedback
If you have any feedback, feel free open an issue.