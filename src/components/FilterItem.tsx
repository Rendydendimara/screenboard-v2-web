import RoundedCheckboxActive from "@/assets/icons/rounded-checkbox-active";
import RoundedCheckboxNonActive from "@/assets/icons/rounded-checkbox-non-active";
import SquareCheckboxActive from "@/assets/icons/square-checkbox-active";
import SquareCheckboxNonActive from "@/assets/icons/square-checkbox-non-active";
import { TItemMenuFilter, TMenuFilter } from "@/types/filter";
import { useMemo } from "react";

interface IProps {
  menuFilter: TMenuFilter;
  iconType: "rounded" | "square";
  handleChange: (value: string) => void;
  options?: TItemMenuFilter[];
}

const FilterItem: React.FC<IProps> = ({
  menuFilter,
  iconType,
  handleChange,
  options,
}) => {
  // Check if a value is selected
  const isSelected = (value: string) => {
    if (Array.isArray(menuFilter.value)) {
      return menuFilter.value.includes(value);
    }
    return value === menuFilter.value;
  };

  const getOptions = useMemo(() => {
    if (options) return options;
    return menuFilter.items;
  }, [options, menuFilter.items]);

  return (
    <div className="w-full flex flex-col gap-3">
      <p className="text-body-4 font-semibold text-black">{menuFilter.label}</p>
      {getOptions.map((filter, i) => (
        <div
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={() => handleChange(filter.value)}
          key={i}
        >
          <div className="w-4 h-6">
            {isSelected(filter.value) ? (
              iconType === "square" ? (
                <SquareCheckboxActive />
              ) : (
                <RoundedCheckboxActive />
              )
            ) : iconType === "square" ? (
              <SquareCheckboxNonActive />
            ) : (
              <RoundedCheckboxNonActive />
            )}
          </div>

          <p className="text-body-4 font-normal text-[#565D61]">
            {filter.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FilterItem;
