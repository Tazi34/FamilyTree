import { FullUserInformation } from "./../../../model/UserInformation";
import { UserRegistrationData } from "../../registration/RegistrationForm";

export type CreateUserRequestData = UserRegistrationData;

export type CreateUserSuccessResponse = FullUserInformation;
