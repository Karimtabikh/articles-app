import type { Article } from "@/types";
import { useEffect, useRef, useState } from "react";

import CloseIcon from "../Icons/CloseIcon";
import DownArrow from "../Icons/DownArrow";
import { Button } from "./button";
import { Input } from "./input";

type Props = {
  options: Article[];
  values: Article[];
  onSelectedChange: (newValues: Article[]) => void;
};

const CustomSelect = ({ options, values, onSelectedChange }: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [selectOptions, setSelectOptions] = useState<Article[]>(options);
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Function from geeksforgeeks

  useEffect(() => {
    const timer = setTimeout(() => {
      const filteredOptions = options.filter((f) =>
        f.title.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()),
      );
      setSelectOptions(filteredOptions);
    }, 500); // Delay for 500 milliseconds

    return () => clearTimeout(timer);
  }, [inputValue, options]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleMenu = () => {
    setShowMenu(!showMenu);
  };

  const clearInput = () => {
    setInputValue("");
    setSelectOptions(options);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleOptionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    option: Article,
  ) => {
    event.preventDefault(); 

    if (!values.includes(option)) {
      onSelectedChange([...values, option]);
    } else {
      onSelectedChange(values.filter((f) => f.title !== option.title));
    }
  };

  const handleSelectedItem = (
    event: React.MouseEvent<HTMLButtonElement> | undefined,
    value: Article,
  ) => {
    event?.stopPropagation();
    onSelectedChange(values.filter((f) => f !== value));
  };

  return (
    <div>
      <div
        onClick={() => handleMenu()}
        className="mb-2 flex h-auto w-full cursor-pointer flex-row items-start justify-between rounded-md bg-white p-2 text-sm text-black hover:bg-white"
      >
        <div className="flex flex-row flex-wrap gap-2">
          {values && values.length > 0 ? (
            values.map((value) => {
              return (
                <Button
                  className="flex h-6 flex-row items-center gap-2 rounded-md bg-secondary-200 py-2 text-black hover:bg-secondary-200 hover:text-white"
                  key={value.title}
                  onClick={(event) => handleSelectedItem(event, value)}
                >
                  {value.title} <CloseIcon />
                </Button>
              );
            })
          ) : (
            <div className="py-1">Select Articles</div>
          )}
        </div>

        <div className={showMenu ? "rotate-180 py-1" : "py-1"}>
          <DownArrow />
        </div>
      </div>

      {showMenu && (
        <div className="rounded-md bg-white">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for related articles"
              onChange={(event) => handleChange(event)}
              ref={inputRef}
            />

            {inputRef.current && (
              <Button
                className="absolute right-2 top-3 h-4 bg-transparent p-0 hover:bg-transparent"
                onClick={() => clearInput()}
              >
                <CloseIcon />
              </Button>
            )}
          </div>
          <div className="select_scroll my-1 flex h-32 flex-col overflow-hidden overflow-y-scroll">
            {selectOptions?.map((option) => {
              const active = values.includes(option);
              return (
                <Button
                  className={
                    active
                      ? "m-1 rounded-md bg-secondary-200 hover:bg-secondary-200"
                      : "m-1 bg-primary-100 text-black hover:bg-secondary-200"
                  }
                  key={option.title}
                  onClick={(event) => handleOptionClick(event, option)}
                >
                  {option.title}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
