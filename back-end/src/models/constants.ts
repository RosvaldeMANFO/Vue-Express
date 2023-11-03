export enum CollectionName {
  Users = "users",
  Books = "books",
  Borrows = "borrows"
}

export enum Roles {
  Admin = "ADMIN",
  Employee = "EMPLOYEE",
  Reader = "READER",
}

export enum BookStatus {
  Available = "AVAILABLE",
  Unavailable = "UN AVAILABLE"
}

export enum LiteralGender {
  Narrative = "NARRATIVE",
  Theatrical = "THEATRICAL",
  Poetic = "POETIC",
  Argumentative = "ARGUMENTATIVE",
  Epistolary = "EPISTOLARY",
  Neutral = "NEUTRAL"
}

export enum BorrowStatus {
  Approved = "APPROVED",
  ToReturn = "TO RETURN",
  Waiting = "WAITING FOR"
}

export enum BookState {
  New = "BRAND NEW",
  Correct = "CORRECT",
  Worn = "WORN OUT",
}
