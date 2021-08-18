import VerticalLayout from "./VerticalLayout.js";

// if Loading is True Render the Dasboard page
export default () => {
  return `
    <div class='layout'>
      ${VerticalLayout()}
      <div class='content' id='loading'>
        Loading...
      </div>
    </div>`;
};
