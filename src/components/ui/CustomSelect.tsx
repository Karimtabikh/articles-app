import type { Article } from "@/types";
import { useEffect, useRef, useState } from "react";

import { Input } from "./input";

type Props = {
  options: Article[];
};

const CloseIcon = () => {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="15"
      height="15"
      viewBox="0 0 24 24"
    >
      <path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z" />
    </svg>
  );
};

const DownArrow = () => {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      fill="#000000"
      height="15px"
      width="15px"
      version="1.1"
      id="Layer_1"
      viewBox="0 0 330 330"
    >
      <path
        id="XMLID_225_"
        d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
	c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
	s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
      />
    </svg>
  );
};

const CustomSelect = ({ options }: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [selectOptions, setSelectOptions] = useState<Article[]>(options);
  const [selectedValues, setSelectedValues] = useState<Article[]>([]);
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

  const handleOptionClick = (option: Article) => {
    if (!selectedValues.includes(option)) {
      setSelectedValues((prevValues) => [...prevValues, option]);
    } else {
      setSelectedValues((prevValues) =>
        prevValues.filter((f) => f.title !== option.title),
      );
    }
  };

  const handleSelectedItem = (
    event: React.MouseEvent<HTMLDivElement>,
    value: Article,
  ) => {
    event.stopPropagation();
    setSelectedValues((prevValues) => {
      return prevValues.filter((f) => f !== value);
    });
  };

  return (
    <div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        onClick={() => handleMenu()}
        className="mb-2 flex w-full cursor-pointer flex-row items-start justify-between rounded-md bg-white p-2 text-sm"
      >
        <div className="flex flex-row flex-wrap gap-2">
          {selectedValues && selectedValues.length > 0 ? (
            selectedValues.map((value) => {
              return (
                // biome-ignore lint/a11y/useKeyWithClickEvents: <No Key events >
                <div
                  className="flex cursor-pointer flex-row items-center gap-2 rounded-md bg-secondary-50 px-2 py-1"
                  key={value.title}
                  onClick={(event) => handleSelectedItem(event, value)}
                >
                  {value.title} <CloseIcon />
                </div>
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

            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            {inputRef.current && (
              <div
                className="absolute right-2 top-3 cursor-pointer"
                onClick={() => clearInput()}
              >
                <CloseIcon />
              </div>
            )}
          </div>
          <div className="select_scroll my-1 h-32 overflow-hidden overflow-y-scroll">
            {selectOptions?.map((option) => {
              const active = selectedValues.includes(option);
              return (
                // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                <div
                  className={
                    active
                      ? "m-1 cursor-pointer rounded-md bg-secondary-50 px-2 py-1"
                      : "m-1 cursor-pointer p-1"
                  }
                  // className="cursor-pointer px-2 py-1"
                  key={option.title}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.title}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
