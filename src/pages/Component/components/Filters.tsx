import FilterItem from "@/components/FilterItem";
import { TMenuFilter } from "@/types/filter";

interface IProps {
  filterCategories: TMenuFilter;
  handleChangeFilterCategories: (value: string) => void;
}
const Filters: React.FC<IProps> = ({
  filterCategories,

  handleChangeFilterCategories,
}) => {
  return (
    <div className="w-full flex flex-col items-start gap-8">
      <FilterItem
        handleChange={handleChangeFilterCategories}
        menuFilter={filterCategories}
        iconType="square"
      />
    </div>
  );
};

export default Filters;
