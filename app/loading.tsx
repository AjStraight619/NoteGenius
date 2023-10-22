import { SymbolIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";

const Loading = () => {
  return (
    <Flex justify={"center"} align={"center"} style={{ height: "100vh" }}>
      <SymbolIcon width={"50px"} height={"50px"} className="animate-spin" />
    </Flex>
  );
};

export default Loading;
