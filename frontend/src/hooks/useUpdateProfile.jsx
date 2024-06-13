import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useUpdateProfile() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateProfileMutation, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: async (formData) => {
        try {
          const res = await fetch("/api/users/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (!res.ok)
            throw new Error(
              data.message || "Something went wrong! please try again later."
            );
          return data;
        } catch (error) {
          throw new Error(error);
        }
      },
      onSuccess: () => {
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
          queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        ]);
        toast.success("Updated Succeffully.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  return { updateProfileMutation, isUpdatingProfile };
}
