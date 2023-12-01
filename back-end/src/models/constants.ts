export enum CollectionName {
  Users = "users",
  Books = "books",
  Borrows = "requests",
  BookCollection = "collections"
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

export enum RequestStatus {
  Approved = "APPROVED",
  ToReturn = "TO RETURN",
  OnHold = "ON HOLD",
  Returned = "RETURNED",
  Canceled = "CANCELED"
}

export enum BookState {
  New = "BRAND NEW",
  Correct = "CORRECT",
  Worn = "DAMAGED",
}
