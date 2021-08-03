import { useQuery } from "react-query";

import useDbUser from "./useDbUser";

import instance from "../axios/instance";

const checkUser = async (email: string) => {
  const { data } = await instance.get(`/users/check/?email=${email}`);

  return data;
};

function useUserCheck() {
  const { user, isLoading: currentUserLoading } = useDbUser();

  const { data, isLoading } = useQuery(
    "check-user",
    () => checkUser(user?.email),
    {
      enabled: !currentUserLoading && !!user?.email,
    }
  );

  return {
    isAlreadyUser: data?.success,
    isLoading,
  };
}

export default useUserCheck;
