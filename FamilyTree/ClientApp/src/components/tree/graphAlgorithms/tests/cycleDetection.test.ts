import { PersonInformation } from "../../model/PersonNode";
import { PersonNode } from "../../model/PersonNode";
import { isGraphCyclic } from "../cycleDetection";

const mockInformation: PersonInformation = {
  birthday: "",
  name: "",
  surname: "",
};
const tree: PersonNode[] = [
  new PersonNode(1, mockInformation, 0, 0, [2, 3]),
  new PersonNode(2, mockInformation, 1, 0, [4, 5]),
  new PersonNode(3, mockInformation, 1, 0, [6, 7]),
  new PersonNode(4, mockInformation, 2, 0, []),
  new PersonNode(5, mockInformation, 2, 0, []),
  new PersonNode(6, mockInformation, 3, 0, []),
  new PersonNode(7, mockInformation, 3, 0, []),
];

const cyclicSquare: PersonNode[] = [
  new PersonNode(1, mockInformation, 4, 0, [2]),
  new PersonNode(2, mockInformation, 1, 0, [3]),
  new PersonNode(3, mockInformation, 2, 0, [4]),
  new PersonNode(4, mockInformation, 3, 0, [1]),
];

test("Given not acyclic graph return false", () => {
  //given
  expect(isGraphCyclic(tree)).toBe(false);
});

test("Given cyclic square return true", () => {
  //given
  expect(isGraphCyclic(cyclicSquare)).toBe(true);
});
