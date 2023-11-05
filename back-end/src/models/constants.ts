export enum CollectionName {
  Users = "users",
  Books = "books",
  Borrows = "borrows",
  BookCopies = "bookCopies"
}

export enum Roles {
  Admin = "ADMIN",
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

export enum BorrowingStatus {
  Approved = "APPROVED",
  ToReturn = "TO RETURN",
  OnHold = "ON HOLD",
  Returned = "RETURNED"
}

export enum BookState {
  New = "BRAND NEW",
  Correct = "CORRECT",
  Worn = "DAMAGED",
}
