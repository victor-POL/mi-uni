import type { PageUser, UserFirebase } from "@/models/user.model"

export const mapFirebaseUserToPageUser = (pageUser: UserFirebase): PageUser => {
  return {
    id: pageUser.uid,
    email: pageUser.email || "",
    displayName: pageUser.displayName || "",
    photoURL: pageUser.photoURL || "",
  }
}