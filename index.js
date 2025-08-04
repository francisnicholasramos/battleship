import ui from "./ui.js";
import controller from "./controller.js";

document.addEventListener('DOMContentLoaded', () => {
  ui.chooseMode((mode) => {
    if (mode) {
      controller.renderSinglePlayer();
    } else {
      controller.renderTwoPlayer();
    }
  });
});
