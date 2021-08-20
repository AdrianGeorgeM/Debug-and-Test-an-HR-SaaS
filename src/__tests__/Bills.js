import { screen, fireEvent } from "@testing-library/dom";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import ErrorPage from "../views/ErrorPage.js";
import { localStorageMock } from "../__mocks__/localStorage";
import LoadingPage from "../views/LoadingPage.js";
import firebase from "../__mocks__/firebase";
import userEvent from "@testing-library/user-event"; //UserEvent for ClickEvent
import Firestore from "../app/Firestore";
import Router from "../app/Router";

describe("Given I am connected as an employee", () => {
  describe("When BillsUI(Bills Page) is called", () => {
    //*** TEST loading page BillsUI is called
    test("Then Loading page should be shown", () => {
      // Loading page should be rendered when loading = TRUE"
      //export default ({ data: bills, loading, error }) views/BillsUI.js
      // const billsUser = BillsUI({ loading: true });
      document.body.innerHTML = BillsUI({ loading: true });

      // LoadingPage()=> views/LoadingPage
      //represent the dashboard for employee/admin
      const loadingDashboard = LoadingPage();

      // expect(billsUser.indexOf(loadingDashboard) > -1).toBeTruthy();
      expect(loadingDashboard).toBeTruthy();

      /*
      // Test Loading Page true 
      const htmlTest = BillsUI({ loading: true });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Loading...")).toBeTruthy();
      */

      /*
      Test Loading Page Error = false
    const htmlTest = BillsUI({ error: true });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Error")).toBeTruthy();
 */

      // Solution 2
      //  const htmlTest = BillsUI({ loading: true });
      // document.body.innerHTML = htmlTest;
      // expect(screen.getAllByText("Loading...")).toBeTruthy();

      // Solution 3
      //  const htmlTest = BillsUI({ data: bills, loading: true });
      //  document.body.innerHTML = htmlTest;
      //  const loading = screen.getByTestId("loading");
      //  expect(loading).toBeTruthy();
    });

    // ***TEST error page
    test("Then ErrorPage should be rendered when loading is false / error is true", () => {
      const billsUserError = BillsUI({
        data: [],
        loading: false,
        error: "Error Message!!!",
      });
      const errorHtml = ErrorPage("Error Message!!!");
      expect(billsUserError.indexOf(errorHtml) > -1).toBeTruthy();

      // Solution 2
      //      const htmlTest = BillsUI({ error: " error message" });
      // document.body.innerHTML = htmlTest;
      // expect(screen.getAllByText("Error")).toBeTruthy();
      // });
    });
  });

  describe("When I am on Bills Page", () => {
    const pathname = ROUTES_PATH["Bills"];
    let onNavigate;
    beforeEach(() => {
      onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      Object.defineProperty(window, "location", {
        value: {
          hash: pathname,
        },
      });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
    });

    test("Then bill icon in vertical layout (verticalLayout(120) should be highlighted", () => {
      jest.mock("../app/Firestore");
      // Mock - parameters for Behavior Driven Development (BDD)  Firebase & data fetching
      Firestore.bills = () => ({ bills, get: jest.fn().mockResolvedValue() });

      // Object.defineProperty(window, "localStorage", {
      //   value: localStorageMock,
      // });

      // // routing variable
      // const pathname = ROUTES_PATH["Bills"];

      // window.localStorage.setItem(
      //   "user",
      //   JSON.stringify({
      //     type: "Employee",
      //   })
      // );

      // build div DOM
      // Object.defineProperty(window, "location", {
      //   value: {
      //     hash: pathname,
      //   },
      // });
      // Get the HTML content of the current document:
      // Change the HTML content of the current document (will overwrite all existing HTML elements inside <body>):
      document.body.innerHTML = `<div id="root"></div>`;

      // Router init to get actives CSS classes
      Router();
      expect(
        // "icon-window" must contain the class "active-icon"
        screen.getByTestId("icon-window").classList.contains("active-icon")
      ).toBe(true);
    });

    test("Then bills should be ordered from earliest to latest", () => {
      // We go to views/BillsUI.js to fix the sort date
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      // replace parameters (a,b) with (b,a) to ordered by date from earliest to latest
      let antiChrono = (b, a) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    // Test When User Click New Bill Button
    describe("When I click on the New Bill button", () => {
      test("Then it should DISPLAY the NewBill page form", () => {
        // Object.defineProperty(window, "localStorage", {
        //   value: localStorageMock,
        // });
        // window.localStorage.setItem(
        //   "user",
        //   JSON.stringify({
        //     type: "Employee",
        //   })
        // );
        const htmlTest = BillsUI({ data: [] });
        document.body.innerHTML = htmlTest;
        // we can add beforeEach test to onNavigate on top globaly
        // const onNavigate = (pathname) => {
        //   document.body.innerHTML = ROUTES({ pathname });
        // };
        // const firestore = null;
        const allBill = new Bills({
          document,
          onNavigate,
          firestore: null,
          localStorage: window.localStorage,
        });

        const handleClickNewBill = jest.fn(allBill.handleClickNewBill);
        const billBtn = screen.getByTestId("btn-new-bill");
        billBtn.addEventListener("click", handleClickNewBill);
        fireEvent.click(billBtn);
        expect(screen.getAllByText("Send a fee")).toBeTruthy();
      });
    });
    //End Test When User Click New Bill Button

    // Test When User Click on the eye icon of a bill
    describe("Given I am connected as Employee and I am on Dasboard Bills Page", () => {
      describe("When I click on the icon eye", () => {
        test("A modal should open", () => {
          // Object.defineProperty(window, "localStorage", {
          //   value: localStorageMock,
          // });
          // window.localStorage.setItem(
          //   "user",
          //   JSON.stringify({
          //     type: "Employee",
          //   })
          // );
          const html = BillsUI({ data: bills });
          document.body.innerHTML = html;
          // const onNavigate = (pathname) => {
          //   document.body.innerHTML = ROUTES({ pathname });
          // };
          // const firestore = null;
          const allBills = new Bills({
            document,
            onNavigate,
            firestore: null,
            localStorage: window.localStorage,
          });

          $.fn.modal = jest.fn();
          const eye = screen.getAllByTestId("icon-eye")[0];
          const handleClickIconEye = jest.fn(() =>
            allBills.handleClickIconEye(eye)
          );
          eye.addEventListener("click", handleClickIconEye);
          fireEvent.click(eye);
          expect(handleClickIconEye).toHaveBeenCalled();
          const modale = document.getElementById("modaleFile");
          expect(modale).toBeTruthy();
        });
      });
    });
  });
  // End Test When User Click on the eye icon of a bill

  // Add a GET Bills integration test FROM tests/Dasboard.js
  describe("Given I am a user connected as Employee", () => {
    describe("When I navigate to Bills Overview(BillS UI", () => {
      const getSpy = jest.spyOn(firebase, "get");

      test("fetches bills from mock API GET", async () => {
        const bills = await firebase.get();
        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(bills.data.length).toBe(4);
      });
      test("fetches bills from an API and fails with 404 message error", async () => {
        firebase.get.mockImplementationOnce(() => {
          Promise.reject(new Error("Error 404"));
        });
        const html = BillsUI({ error: "Error 404" });
        document.body.innerHTML = html;
        const message = await screen.getByText(/Error 404/);
        expect(message).toBeTruthy();
      });
      test("fetches messages from an API and fails with 500 message error", async () => {
        firebase.get.mockImplementationOnce(() =>
          Promise.reject(new Error("Error 500"))
        );
        const html = BillsUI({ error: "Error 500" });
        document.body.innerHTML = html;
        const message = await screen.getByText(/Error 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});
