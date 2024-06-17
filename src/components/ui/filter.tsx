import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Button } from "./button";

const Filter = ({ setFilter, categoriesProp, setCategories }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:3000/articles/categories");
    return res.json();
  };

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const handleSelectCategory = (newCat: string) => {
    if (newCat === "all") return setCategories([]);
    setCategories((prevCategories) => {
      if (!prevCategories.includes(newCat)) {
        return [...prevCategories, newCat];
      }
      return prevCategories.filter((f) => f !== newCat);
    });
  };

  const handleChange = (value: string, field: string) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value,
    }));
  };

  const handleDateChange = (range: [Date | null, Date | null]) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);
    setFilter((prevFilter) => ({
      ...prevFilter,
      startDate: startDate ? startDate : null,
      endDate: endDate ? endDate : null,
    }));
  };

  const handleSearchInput = (value: string, field: string) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value,
    }));

    // if (value === "") {
    //   return;
    // }

    // searchHighlight(value);
  };

  //   const searchHighlight = (searchedTerm) => {
  //     const searchText = searchedTerm.toLowerCase().trim();
  //     const regExp = new RegExp(searchText, "ig");

  //     const filteredData = data?.posts?.map((post) => {
  //       let highlightedText = post.title;
  //       if (post.title.toLowerCase().includes(searchText)) {
  //         highlightedText = post.title.replace(
  //           regExp,
  //           "<mark class='bg-yellow-200'>$&</mark>",
  //         );
  //       }
  //       return { ...post, customTitle: highlightedText };
  //     });
  //     setToggle((prev) => !prev)
  //   };

  return (
    <div className="mb-2">
      <h2 className="my-4 text-lg font-bold">Filter By:</h2>
      <div className="mb-8">
        <label className="mr-4 font-bold">Categories</label>
        <Button
          onClick={() => {
            handleSelectCategory("all");
          }}
          className="mr-2"
        >
          All
        </Button>
        {categoriesQuery.data?.map((category: string) => {
          const active = categoriesProp.includes(category);
          return (
            <Button
              onClick={() => {
                handleSelectCategory(category);
              }}
              type="button"
              className={
                active
                  ? "mr-2 bg-white capitalize text-black"
                  : "mr-2 bg-primary capitalize"
              }
              key={category}
            >
              {category}
            </Button>
          );
        })}
      </div>

      <div className="mb-8">
        <label className="mr-4 font-bold">Search</label>
        <input
          name="search"
          onChange={(event) => handleSearchInput(event.target.value, "search")}
          type="search"
        />
      </div>

      <label>Order:</label>
      <select
        name="sortOrder"
        onChange={(event) => handleChange(event.target.value, "sortOrder")}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      <label>Sort By Date:</label>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
      />
    </div>
  );
};

export default Filter;
