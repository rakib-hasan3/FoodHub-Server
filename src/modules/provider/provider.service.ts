import { profile } from "node:console";
import { Provider_Profile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createProviderProfile = async (data: Provider_Profile, userId: string) => {
    const result = await prisma.provider_Profile.create({
        data: {
            ...data,
            user_id: userId
        }
    })
    return result;
}

const getProviderProfile = async () => {
    const Profile = await prisma.provider_Profile.findFirst();
    return Profile;
}
export const providerService = {
    createProviderProfile,
    getProviderProfile
}