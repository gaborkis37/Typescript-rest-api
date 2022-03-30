import { omit } from "lodash";
import { DocumentDefinition } from "mongoose";
import UserModel, { UserDocument } from "../models/user.model";
import { FilterQuery } from "mongoose";

export async function createUser(
  input: DocumentDefinition<
    Omit<UserDocument, "createdAt" | "updatedAt" | "comparePassword">
  >
) {
  try {
    const user = await UserModel.create(input);

    return omit(user.toObject(), "password");
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return null;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return null;

  return omit(user.toObject(), "password");
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}
