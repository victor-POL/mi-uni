import type { PageUser, UserFirebase } from "@/models/user.model"

export const mapFirebaseUserToPageUser = (user: UserFirebase): PageUser => {
  return {
    id: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
  }
}