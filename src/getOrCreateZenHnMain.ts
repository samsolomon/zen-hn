export function getOrCreateZenHnMain(): HTMLElement {
  let main = document.getElementById("zen-hn-main");
  if (main) return main;

  main = document.createElement("main");
  main.id = "zen-hn-main";
  main.setAttribute("role", "main");
  main.setAttribute("aria-label", "Content");

  const hnmain = document.getElementById("hnmain");
  const centerWrapper = hnmain?.closest("center");
  if (centerWrapper) {
    centerWrapper.insertAdjacentElement("beforebegin", main);
  } else if (hnmain) {
    hnmain.insertAdjacentElement("beforebegin", main);
  } else {
    document.body.appendChild(main);
  }
  return main;
}
