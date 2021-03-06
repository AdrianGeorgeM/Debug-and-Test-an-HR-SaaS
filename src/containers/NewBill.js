import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export default class NewBill {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.firestore = firestore;
    const formNewBill = this.document.querySelector(
      `form[data-testid="form-new-bill"]`
    );
    formNewBill.addEventListener("submit", this.handleSubmit);
    const file = this.document.querySelector(`input[data-testid="file"]`);
    file.addEventListener("change", this.handleChangeFile);
    this.fileUrl = null;
    this.fileName = null;
    new Logout({ document, localStorage, onNavigate });
  }

  // FIX  documents with an extension no other than jpg, jpeg, or pgn can be sent via the form
  handleChangeFile = (e) => {
    const file = this.document.querySelector(`input[data-testid="file"]`)
      .files[0];
    const filePath = e.target.value.split(/\\/g);
    const fileName = filePath[filePath.length - 1];
    const extensionType = /(png|jpg|jpeg)/g;
    // const testMatch = /\.(|png|jpg|jpeg)$/i.test(fileName);

    const extension = fileName.split(".").pop(); //check what type of files and remove the last element after . and returns the element(pdf,jpeg,png etc..)
    // convert null(other types) or png|jpg|jpeg in to lower letters
    const matchExtension = extension.toLowerCase().match(extensionType);

    if (matchExtension) {
      $("#btn-send-bill").prop("disabled", false); //show the button if accepted input

      this.firestore.storage
        .ref(`justificatifs/${fileName}`)
        .put(file)
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((url) => {
          this.fileUrl = url;
          this.fileName = fileName;
        });
    } else {
      // disable the button if type is not valid,and show alert
      $("#btn-send-bill").prop("disabled", true);

      alert("Only Format in .JPEG .PNG .JPG");
    }

    // solution 2
    // if (
    //   file.type === "image/png" ||
    //   file.type === "image/jpg" ||
    //   file.type === "image/jpeg"
    // ) {
    //   const filePath = e.target.value.split(/\\/g);
    //   const fileName = filePath[filePath.length - 1];
    //   this.firestore.storage
    //     .ref(`justificatifs/${fileName}`)
    //     .put(file)
    //     .then((snapshot) => snapshot.ref.getDownloadURL())
    //     .then((url) => {
    //       this.fileUrl = url;
    //       this.fileName = fileName;
    //     });
    // } else {
    //   e.target.value = "";
    //
    // }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const email = JSON.parse(localStorage.getItem("user")).email;
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(
        e.target.querySelector(`input[data-testid="amount"]`).value
      ),
      date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct:
        parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) ||
        20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`)
        .value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: "pending",
    };
    this.createBill(bill);
    this.onNavigate(ROUTES_PATH["Bills"]);
  };

  // no need to cover this function by tests
  createBill = (bill) => {
    if (this.firestore) {
      this.firestore
        .bills()
        .add(bill)
        .then(() => {
          this.onNavigate(ROUTES_PATH["Bills"]);
        })
        .catch((error) => error);
    }
  };
}
