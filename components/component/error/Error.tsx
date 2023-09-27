import { Text } from "@radix-ui/themes";
import React from "react";

type ErrorComponentProps = {
  message?: string;
};

const ErrorComponent = ({ message = "An unexpected error occurred." }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Text align={"center"} size={"5"} color="red">
        {message}
      </Text>
    </div>
  );
};

export default ErrorComponent;
