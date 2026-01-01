import { Autocomplete, TextField, createFilterOptions } from "@mui/material";

type CreateOption = {
  inputValue: string;
  isCreate: true;
};

type AutocompleteOption<T extends object> = T | CreateOption;

type GenericAutocompleteProps<T extends object> = {
  label: string;
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;

  getOptionLabel: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;

  allowCreate?: boolean;
  onCreateClick?: (inputValue: string) => void;

  size?: "small" | "medium";
  sx?: any;

  error?: string;
};

const filter = createFilterOptions<AutocompleteOption<any>>();

export function GenericAutocomplete<T extends object>({
  label,
  options,
  value,
  onChange,
  getOptionLabel,
  isOptionEqualToValue,
  allowCreate = false,
  onCreateClick,
  size,
  sx,
  error,
}: GenericAutocompleteProps<T>) {
  return (
    <Autocomplete<AutocompleteOption<T>, false, false, false>
      id={label}
      sx={sx}
      autoHighlight
      options={options as AutocompleteOption<T>[]}
      value={value as AutocompleteOption<T> | null}
      filterOptions={(opts, params) => {
        const filtered = filter(opts, params);

        if (
          allowCreate &&
          params.inputValue !== "" &&
          !opts.some(
            (opt) =>
              !("isCreate" in opt) &&
              getOptionLabel(opt).toLowerCase() ===
                params.inputValue.toLowerCase()
          )
        ) {
          filtered.push({
            inputValue: params.inputValue,
            isCreate: true,
          });
        }

        return filtered;
      }}
      getOptionLabel={(option) => {
        if ("isCreate" in option) {
          return `Add "${option.inputValue}"`;
        }
        return getOptionLabel(option);
      }}
      isOptionEqualToValue={(opt, val) =>
        "isCreate" in opt || "isCreate" in val
          ? false
          : isOptionEqualToValue?.(opt, val) ?? false
      }
      onChange={(_, newValue) => {
        if (newValue && "isCreate" in newValue) {
          onCreateClick?.(newValue.inputValue);
          return;
        }
        onChange(newValue as T | null);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size={size ? size : "medium"}
          error={Boolean(error)}
          helperText={error}
        />
      )}
      
    />
  );
}
