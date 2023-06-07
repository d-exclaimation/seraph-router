import { component, html } from "@d-exclaimation/seraph";
import { router } from "./playground/_context";
import Counter from "./playground/counter";
import Dashboard from "./playground/dashboard";
import Index from "./playground/index";
import Profile from "./playground/profile";
import { route } from "./router/core";
import "./style.css";

const NotFound = html.div({
  classes: "flex items-center justify-center flex-col gap-3 animate-fades-in",
  c: [
    html.span({
      classes: "text-zinc-700 text-4xl font-bold",
      c: "404",
    }),

    html.span({
      classes: "bg-zinc-700/50 h-[1px] w-[10rem]",
    }),

    html.span({
      classes: "text-zinc-700 text-xl font-medium",
      c: "Page not found",
    }),
  ],
});

const { $outlet } = router.provider([
  route("/", Index.view),
  route("/dashboard", Dashboard.view),
  route("/counter", Counter.view),
  route("/profile/:username", Profile.view),
  route("*", () => NotFound),
]);

const App = component(() =>
  html.div({
    classes: "flex flex-col items-center justify-start w-screen h-screen",
    c: [
      html.div({
        classes:
          "flex flex-row items-center justify-center text-sm w-full h-fit rounded bg-white shadow gap-2 px-4 py-2",
        c: [
          router.link({
            classes:
              "flex-shrink-0 px-3 py-2 text-zinc-800 hover:underline transition-all",
            c: "Home",
            href: "/",
          }),
          router.link({
            classes:
              "flex-shrink-0 px-3 py-2 text-zinc-800 hover:underline transition-all",
            c: "Dashboard",
            href: "/dashboard",
          }),
          router.link({
            classes:
              "flex-shrink-0 px-3 py-2 text-zinc-800 hover:underline transition-all",
            c: "Counter",
            href: "/counter",
          }),
        ],
      }),
      html.div({
        classes: "flex flex-col items-center justify-center w-full h-full",
        c: $outlet,
      }),
    ],
  })
);

App.mount({}, document.getElementById("app")!);
