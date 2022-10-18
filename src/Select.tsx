import React, { useEffect, useRef, useState } from "react";
import styles from "./select.module.css";

export type SelectOption = {
  label: string;
  value: string | number;
};

export type MultipleSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};

export type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
};

export type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

const Select = ({ multiple, value, onChange, options }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hightlightedIndex, setHightlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const clearOptions = () => {
    if (multiple) {
      onChange([]);
    } else {
      onChange(undefined);
    }
  };

  const selectOption = (option: SelectOption) => {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((o) => o !== option));
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }
  };

  const isOptionSelected = (option: SelectOption) => {
    return multiple ? value.includes(option) : option === value;
  };

  useEffect(() => {
    if (isOpen) setHightlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) {
        return;
      }

      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prev) => !prev);
          if (isOpen) {
            selectOption(options[hightlightedIndex]);
          }
          break;
        case "ArrowUp":
        case "ArrowDown":{
          if (!isOpen) {
            setIsOpen(true);
            break;
          }
          const newValue = hightlightedIndex + (e.code === "ArrowDown" ? 1 : -1);

          if (newValue >= 0 && newValue < options.length) {
            setHightlightedIndex(newValue);
          }

          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
      }
    };

    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [isOpen, hightlightedIndex, options]);

  return (
    <div
      ref={containerRef}
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      tabIndex={0}
      className={styles.container}
    >
      <span className={styles.value}>
        {multiple
          ? value.map((v) => {
              return (
                <button
                  key={v.value}
                  onClick={(e) => {
                    e.stopPropagation;
                    selectOption(v);
                  }}
                  className={styles["option-badge"]}
                >
                  {v.label}
                  <span className={styles["remove-btn"]}>&times;</span>
                </button>
              );
            })
          : value?.label}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          clearOptions();
        }}
        className={styles["clear-btn"]}
      >
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {options.map((option, index) => (
          <li
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
              setIsOpen(false);
            }}
            onMouseEnter={() => setHightlightedIndex(index)}
            key={option.value}
            className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ""} ${
              index === hightlightedIndex ? styles.highlighted : ""
            }`}
          >
            {" "}
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Select;
