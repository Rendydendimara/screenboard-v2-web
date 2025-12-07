import FilterItem from "@/components/FilterItem";
import { TMenuFilter } from "@/types/filter";

interface IProps {
  filterSortBy: TMenuFilter;
  filterCategories: TMenuFilter;
  filterSubCategories: TMenuFilter;
  filterMarket: TMenuFilter;
  handleChangeFilterSortBy: (value: string) => void;
  handleChangeFilterCategories: (value: string) => void;
  handleChangeFilterSubCategories: (value: string) => void;
  handleChangeFilterMarket: (value: string) => void;
}

const Filters: React.FC<IProps> = ({
  filterCategories,
  filterMarket,
  filterSortBy,
  filterSubCategories,
  handleChangeFilterCategories,
  handleChangeFilterSortBy,
  handleChangeFilterSubCategories,
  handleChangeFilterMarket,
}) => {
  return (
    <div className="w-full flex flex-col items-start gap-8">
      <FilterItem
        handleChange={handleChangeFilterSortBy}
        menuFilter={filterSortBy}
        iconType="rounded"
      />
      <FilterItem
        handleChange={handleChangeFilterCategories}
        menuFilter={filterCategories}
        iconType="square"
      />
      <FilterItem
        menuFilter={filterSubCategories}
        handleChange={handleChangeFilterSubCategories}
        iconType="square"
      />
      <FilterItem
        handleChange={handleChangeFilterMarket}
        menuFilter={filterMarket}
        iconType="square"
      />
    </div>
  );
};

export default Filters;
