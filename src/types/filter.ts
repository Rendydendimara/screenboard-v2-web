export type TMenuFilter = {
  label: string;
  items: TItemMenuFilter[];
  value: string | string[]; // Support both single and multiple selections
  multiSelect?: boolean; // Flag to indicate if multiple selection is allowed
};

export type TItemMenuFilter = {
  label: string;
  value: string;
  countApp?: number;
};
