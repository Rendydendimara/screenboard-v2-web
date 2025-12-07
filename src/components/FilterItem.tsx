import RoundedCheckboxActive from "@/assets/icons/rounded-checkbox-active";
import RoundedCheckboxNonActive from "@/assets/icons/rounded-checkbox-non-active";
import SquareCheckboxActive from "@/assets/icons/square-checkbox-active";
import SquareCheckboxNonActive from "@/assets/icons/square-checkbox-non-active";
import { TMenuFilter } from "@/types/filter";

interface IProps {
  menuFilter: TMenuFilter;
  iconType: "rounded" | "square";
  handleChange: (value: string) => void;
}

const FilterItem: React.FC<IProps> = ({
  menuFilter,
  iconType,
  handleChange,
}) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <p className="text-body-4 font-semibold text-black">{menuFilter.label}</p>
      {menuFilter.items.map((filter, i) => (
        <div
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={() => handleChange(filter.value)}
          key={i}
        >
          {filter.value === menuFilter.value ? (
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
          <p className="text-body-4 font-normal text-[#565D61]">
            {filter.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FilterItem;
