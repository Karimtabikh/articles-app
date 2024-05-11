import type { Article } from "@/types";
import { useRef, useState } from "react";

import { Input } from "./input";

type Props = {
  options: Article[];
};

const CloseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="15"
      height="15"
      viewBox="0 0 24 24"
    >
      <path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"></path>
    </svg>
  );
};

const CustomSelect = ({ options }: Props) => {
  const [selectedValues, setSelectedValues] = useState<Article[]>([]);
  const [selectOptions, setSelectOptions] = useState<Article[]>(options);
  const [showMenu, setShowMenu] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filteredOptions = options.filter((f) =>
      f.title
        .toLocaleLowerCase()
        .includes(event.target.value.toLocaleLowerCase()),
    );

    setSelectOptions(filteredOptions);

    const cursorPosition = event.target.value.length;

    if (cursorPosition < 3) return;

    if (!inputRef.current) return;
    const selectionStart = inputRef.current.selectionStart;

    inputRef.current.value = filteredOptions[0].title;

    inputRef.current.setSelectionRange(
      selectionStart,
      inputRef.current.value.length,
    );

    //   inputRef.current.selectionStart = filteredOptions[0].title;

    console.log(inputRef.current.value.length);
  };

  const handleMenu = () => {
    setShowMenu(true);
  };

  const handleOptionClick = (option: Article) => {
    if (!selectedValues.includes(option)) {
      setSelectedValues((prevValues) => [...prevValues, option]);
    }
  };

  const handleSelectedItem = (value: Article) => {
    setSelectedValues((prevValues) => {
      return prevValues.filter((f) => f !== value);
    });
  };

  return (
    <div>
      <div
        onClick={() => handleMenu()}
        className="mb-2 flex w-full flex-row gap-2 rounded-md bg-white p-2 text-sm"
      >
        {selectedValues && selectedValues.length > 0 ? (
          selectedValues.map((value) => {
            return (
              // biome-ignore lint/a11y/useKeyWithClickEvents: <No Key events >
              <div
                className="flex cursor-pointer flex-row items-center gap-2 rounded-md bg-secondary-50 px-2 py-1"
                key={value.title}
                onClick={() => handleSelectedItem(value)}
              >
                {value.title} <CloseIcon />
              </div>
            );
          })
        ) : (
          <div>Select Articles</div>
        )}
      </div>

      {showMenu && (
        <div className="rounded-md bg-white">
          <div>
            <Input
              type="text"
              placeholder="Search for related articles"
              onChange={(event) => handleChange(event)}
              ref={inputRef}
            />
          </div>
          <div className="mt-1">
            {selectOptions?.map((option) => {
              return (
                <div
                  className="cursor-pointer px-2 py-1 "
                  key={option.title}
                  // QUESTION REGARDING BIOME LINT: is it sufufcient to put only key up or key down instead of onclick ?
                  onClick={() => handleOptionClick(option)}
                  onKeyUp={() => handleOptionClick(option)}
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
