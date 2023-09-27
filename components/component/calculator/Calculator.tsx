"use client";
import { Button, TextArea, Dialog, Flex } from "@radix-ui/themes";
import { useTransition, animated, config } from "@react-spring/web";

import { useState } from "react";

export default function MyComponent() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [activeOperationSet, setActiveOperationSet] = useState("Basic");
  const transitions = useTransition(open, {
    from: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 10 },
    config: config.stiff,
  });

  const operationsOptions = [
    {
      label: "Basic",
      values: [
        "7",
        "8",
        "9",
        "/",
        "4",
        "5",
        "6",
        "*",
        "1",
        "2",
        "3",
        "-",
        "0",
        ".",
        "=",
        "+",
      ],
    },
    {
      label: "Advanced",
      values: ["sin", "cos", "tan", "^", "sqrt", "log", "(", ")", "%"],
    },
    // Add more operation sets as needed...
  ];

  const handleButtonPress = (value: string) => {
    // Appends the pressed value to the current text
    setText((prevText) => prevText + value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Here you can check which key was pressed and decide if it should be allowed
    const allowedKeys = "0123456789+-*/().^"; // and any other allowed characters
    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button>Open Calculator</Button>
      </Dialog.Trigger>
      {transitions((styles, item) =>
        item ? (
          <>
            <Dialog.Content
              forceMount
              className="w-full h-full lg:w-1/2 max-w-lg transition-transform ease-out duration-300 bg-white lg:rounded-t-lg rounded-none shadow-lg"
            >
              <animated.div>
                <label>
                  <TextArea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </label>

                {/* Operation set switcher */}
                <div className="flex justify-center space-x-4 mb-4 mt-4">
                  {operationsOptions.map((option) => (
                    <Button
                      key={option.label}
                      onClick={() => setActiveOperationSet(option.label)}
                      className={
                        option.label === activeOperationSet ? "bg-gray-300" : ""
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>

                {/* Calculator buttons */}
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {(
                    operationsOptions.find(
                      (option) => option.label === activeOperationSet
                    )?.values ?? []
                  ).map((value) => (
                    <Button
                      key={value}
                      onClick={() => handleButtonPress(value)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </animated.div>
            </Dialog.Content>
          </>
        ) : null
      )}
    </Dialog.Root>
  );
}
