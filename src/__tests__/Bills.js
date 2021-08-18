import { screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import ErrorPage from "../views/ErrorPage.js";
import { localStorageMock } from "../__mocks__/localStorage";
import LoadingPage from "../views/LoadingPage.js";
import firebase from "../__mocks__/firebase";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: [] });
      document.body.innerHTML = html;
      //to-do write expect expression
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
  });

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
