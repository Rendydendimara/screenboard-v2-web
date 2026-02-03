import FilterItem from "@/components/FilterItem";
import { TItemMenuFilter, TMenuFilter } from "@/types/filter";

interface IProps {
  filterSortBy: TMenuFilter;
  filterCategories: TMenuFilter;
  filterSubCategories: TMenuFilter;
  filterMarket: TMenuFilter;
  handleChangeFilterSortBy: (value: string) => void;
  handleChangeFilterCategories: (value: string) => void;
  handleChangeFilterSubCategories: (value: string) => void;
  handleChangeFilterMarket: (value: string) => void;
  getOptionsCategoryItemFiltered: TItemMenuFilter[];
  getOptionsSubCategoryItemFiltered: TItemMenuFilter[];
  getOptionsMarketItemFiltered: TItemMenuFilter[];
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
  getOptionsCategoryItemFiltered,
  getOptionsSubCategoryItemFiltered,
  getOptionsMarketItemFiltered,
}) => {
  return (
    <div className="w-full flex flex-col items-start gap-8 bg-[#FAFAFA] p-5 rounded-[20px]">
      <FilterItem
        handleChange={handleChangeFilterSortBy}
        menuFilter={filterSortBy}
        iconType="rounded"
      />
      <FilterItem
        handleChange={handleChangeFilterCategories}
        menuFilter={filterCategories}
        iconType="square"
        options={getOptionsCategoryItemFiltered}
      />
      {!filterCategories.value.includes("All") &&
      filterCategories.value.length > 0 &&
      getOptionsSubCategoryItemFiltered.length > 0 ? (
        <FilterItem
          menuFilter={filterSubCategories}
          handleChange={handleChangeFilterSubCategories}
          iconType="square"
          options={getOptionsSubCategoryItemFiltered}
        />
      ) : null}
      {getOptionsMarketItemFiltered.length > 0 && (
        <FilterItem
          handleChange={handleChangeFilterMarket}
          menuFilter={filterMarket}
          iconType="square"
          options={getOptionsMarketItemFiltered}
        />
      )}
    </div>
  );
};

export default Filters;
